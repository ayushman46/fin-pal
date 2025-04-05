
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { TransactionCategory, TransactionType } from "@/lib/data";
import { useNavigate } from "react-router-dom";

type AddTransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
  }) => void;
};

export function AddTransactionDialog({ open, onOpenChange, onAddTransaction }: AddTransactionDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("other");
  const [type, setType] = useState<TransactionType>("want");
  const [isExpense, setIsExpense] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }
    
    onAddTransaction({
      description,
      amount: isExpense ? -parsedAmount : parsedAmount,
      category,
      type,
    });
    
    // Reset form
    setDescription("");
    setAmount("");
    setCategory("other");
    setType("want");
    setIsExpense(true);
    
    onOpenChange(false);
    toast.success("Transaction added successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="transaction-type">Transaction Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isExpense ? "default" : "outline"}
                className="flex-1"
                onClick={() => setIsExpense(true)}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={!isExpense ? "default" : "outline"}
                className="flex-1"
                onClick={() => setIsExpense(false)}
              >
                Income
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Grocery shopping" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount" 
              type="number"
              min="0.01"
              step="0.01"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category}
              onValueChange={(value) => setCategory(value as TransactionCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="need-want">Need/Want</Label>
            <Select 
              value={type}
              onValueChange={(value) => setType(value as TransactionType)}
            >
              <SelectTrigger id="need-want">
                <SelectValue placeholder="Need or want?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="need">Need</SelectItem>
                <SelectItem value="want">Want</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
