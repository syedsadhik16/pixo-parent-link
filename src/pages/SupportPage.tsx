import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChild } from '@/contexts/ChildContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Phone, Mail, Send } from 'lucide-react';
import pixelWelcome from '@/assets/pixel-welcome.png';

const faqs = [
  { q: 'How do I link my child?', a: 'Use the child code provided by your school or from your child\'s PIXO Learn app profile. Go to Profile and tap "Add Child".' },
  { q: 'What does Freemium include?', a: 'Freemium gives you access to basic dashboard, attendance tracking, today\'s class summary, and limited reports. Upgrade to Premium for deep insights and full report history.' },
  { q: 'How are reports generated?', a: 'Reports are generated automatically based on your child\'s daily learning activity, attendance, and performance scores from the PIXO Learn student app.' },
  { q: 'Can I link multiple children?', a: 'Yes! You can link multiple children and switch between them from the top header dropdown.' },
  { q: 'What if my child misses a class?', a: 'You\'ll receive a notification when attendance is marked as missed. Check the Activity page for details.' },
  { q: 'How do I upgrade to Premium?', a: 'Go to Billing & Subscription, choose a plan (6, 12, or 18 months), and complete payment through our secure Razorpay gateway.' },
];

export default function SupportPage() {
  const { user } = useAuth();
  const { activeChild } = useChild();
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [issueType, setIssueType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('support_requests').insert({
      parent_profile_id: user.id,
      child_id: activeChild?.id ?? null,
      issue_type: issueType,
      subject,
      message,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Request submitted', description: 'We\'ll get back to you soon.' });
      setSubject('');
      setMessage('');
      setIssueType('');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <img src={pixelWelcome} alt="Support" className="w-12 h-12" loading="lazy" />
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Help & Support</h1>
          <p className="text-sm text-muted-foreground">We're here to help</p>
        </div>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center cursor-pointer hover:shadow-card-hover transition-shadow">
          <MessageCircle className="w-6 h-6 mx-auto text-growth mb-1" />
          <p className="text-xs font-medium text-foreground">WhatsApp</p>
        </Card>
        <Card className="p-3 text-center cursor-pointer hover:shadow-card-hover transition-shadow">
          <Phone className="w-6 h-6 mx-auto text-info mb-1" />
          <p className="text-xs font-medium text-foreground">Call Us</p>
        </Card>
        <Card className="p-3 text-center cursor-pointer hover:shadow-card-hover transition-shadow">
          <Mail className="w-6 h-6 mx-auto text-energy mb-1" />
          <p className="text-xs font-medium text-foreground">Email</p>
        </Card>
      </div>

      {/* FAQ */}
      <section>
        <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3">Frequently Asked Questions</h2>
        <Card className="shadow-card">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left px-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground px-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </section>

      {/* Submit Issue */}
      <section>
        <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3">Submit an Issue</h2>
        <Card className="p-4 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger><SelectValue placeholder="Issue type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="curriculum">Curriculum Question</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" required maxLength={200} />
            <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue..." required maxLength={1000} rows={4} />
            <Button type="submit" className="w-full gradient-hero text-primary-foreground" disabled={loading}>
              <Send className="w-4 h-4 mr-1" /> {loading ? 'Sending...' : 'Submit'}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
