import { useNavigate } from 'react-router-dom';
import { useChild } from '@/contexts/ChildContext';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function ChildSelectorPage() {
  const { children, setActiveChildId } = useChild();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setActiveChildId(id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-heading font-bold text-foreground">Select a Child</h1>
          <p className="text-muted-foreground text-sm">Choose which child's progress to view</p>
        </div>
        <div className="space-y-3">
          {children.map(child => (
            <Card
              key={child.id}
              className="p-4 cursor-pointer hover:shadow-card-hover transition-shadow flex items-center gap-4"
              onClick={() => handleSelect(child.id)}
            >
              <div className="w-12 h-12 rounded-full bg-energy-bg flex items-center justify-center">
                <User className="w-6 h-6 text-energy" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground">{child.display_name}</p>
                <p className="text-sm text-muted-foreground">{child.level} - Age {child.age}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
