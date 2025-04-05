
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Award, TrendingUp } from "lucide-react";
import { SavingsGoal } from "./AddGoalDialog";

type AddFundsDialogProps = {
  goal: SavingsGoal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFunds: (id: string, amount: number) => void;
};

export function AddFundsDialog({ goal, open, onOpenChange, onAddFunds }: AddFundsDialogProps) {
  const [amount, setAmount] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal) return;
    
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    onAddFunds(goal.id, parsedAmount);
    setAmount("");
    onOpenChange(false);
    
    toast.success(`Added ${parsedAmount.toFixed(2)} to your goal!`);
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Add Funds to {goal.title}
          </DialogTitle>
        </DialogHeader>
        
        {goal.achievementLevel && goal.achievementLevel > 1 && (
          <div className="bg-accent/10 rounded-lg p-3 mb-4 flex items-center gap-3">
            <div className="achievement-badge achievement-unlocked">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{goal.achievement}</p>
              <p className="text-xs text-muted-foreground">
                {goal.streakDays} day streak! Keep it up!
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Add</Label>
            <Input 
              id="amount" 
              type="number"
              min="0.01"
              step="0.01"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount" 
              required
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Current Progress</span>
              <span>{((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Funds</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
