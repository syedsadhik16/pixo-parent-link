import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

async function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${orderId}|${paymentId}`);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(RAZORPAY_KEY_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expected === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, child_id, plan_name, billing_cycle_months } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !child_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isValid = await verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid payment signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Update payment transaction
    await adminClient
      .from("payment_transactions")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        payment_status: "paid",
        payment_method: "razorpay",
        paid_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id);

    // Get payment amount
    const { data: txn } = await adminClient
      .from("payment_transactions")
      .select("amount, currency")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    // Calculate dates
    const months = billing_cycle_months || 6;
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);

    // Upsert subscription
    const levelAccess = months >= 18 ? ["Level 1", "Level 2", "Level 3"] :
      months >= 12 ? ["Level 1", "Level 2"] : ["Level 1"];

    const { data: existingSub } = await adminClient
      .from("subscriptions")
      .select("id")
      .eq("child_id", child_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSub) {
      await adminClient
        .from("subscriptions")
        .update({
          plan_name: plan_name || "Premium",
          billing_cycle_months: months,
          status: "active",
          start_date: startDate.toISOString().split("T")[0],
          expiry_date: expiryDate.toISOString().split("T")[0],
          is_premium: true,
          payment_status: "paid",
          level_access: levelAccess,
        })
        .eq("id", existingSub.id);
    } else {
      await adminClient.from("subscriptions").insert({
        child_id,
        plan_name: plan_name || "Premium",
        billing_cycle_months: months,
        status: "active",
        start_date: startDate.toISOString().split("T")[0],
        expiry_date: expiryDate.toISOString().split("T")[0],
        is_premium: true,
        payment_status: "paid",
        level_access: levelAccess,
      });
    }

    // Create billing history
    const invoiceNumber = `PIXO-${Date.now().toString(36).toUpperCase()}`;
    await adminClient.from("billing_history").insert({
      child_id,
      amount: txn?.amount ?? 0,
      currency: txn?.currency ?? "INR",
      payment_date: new Date().toISOString(),
      payment_status: "paid",
      payment_provider: "razorpay",
      invoice_number: invoiceNumber,
    });

    return new Response(
      JSON.stringify({ success: true, invoice_number: invoiceNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
