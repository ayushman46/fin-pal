
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/data";
import { MessageSquare, Plus, TrendingDown, TrendingUp, Bell, Award } from "lucide-react";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { NudgeItem } from "@/components/nudges/NudgeItem";
import { useNavigate } from "react-router-dom";
import { useSavings } from "@/components/savings/SavingsContext";
import { useTransactions } from "@/components/transactions/TransactionsContext";
import { useState, useEffect } from "react";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { goals } = useSavings();
  const { transactions, addTransaction, getTotalSpendingByType, getTotalBalance, generateNudges } = useTransactions();
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false);
  const [nudges, setNudges] = useState<any[]>([]);
  
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  const totalNeeds = getTotalSpendingByType('need');
  const totalWants = getTotalSpendingByType('want');
  const totalBalance = getTotalBalance();
  
  // Get top 3 goals for display on dashboard
  const topGoals = goals.slice(0, 3);
  
  // Load nudges from localStorage
  useEffect(() => {
    const storedNudges = localStorage.getItem('nudges');
    if (storedNudges) {
      setNudges(JSON.parse(storedNudges));
    } else {
      // Generate nudges if none exist
      generateNudges();
      setTimeout(() => {
        const freshNudges = localStorage.getItem('nudges');
        if (freshNudges) {
          setNudges(JSON.parse(freshNudges));
        }
      }, 1000);
    }
  }, [generateNudges]);
  
  const refreshNudges = () => {
    generateNudges();
    setTimeout(() => {
      const freshNudges = localStorage.getItem('nudges');
      if (freshNudges) {
        setNudges(JSON.parse(freshNudges));
      }
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your financial dashboard!</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddTransactionDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
          <Button onClick={() => navigate('/chat')}>
            <MessageSquare className="mr-2 h-4 w-4" /> Chat with AI
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated today
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-destructive/5 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Needs Spending</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(totalNeeds)}
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-destructive transition-all" 
                style={{ width: `${(totalNeeds / (totalNeeds + totalWants || 1)) * 100}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Essential expenses ({Math.round((totalNeeds / (totalNeeds + totalWants || 1)) * 100)}%)
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-500/5 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Wants Spending</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {formatCurrency(totalWants)}
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all" 
                style={{ width: `${(totalWants / (totalNeeds + totalWants || 1)) * 100}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Non-essential expenses ({Math.round((totalWants / (totalNeeds + totalWants || 1)) * 100)}%)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentTransactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
            {recentTransactions.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No transactions yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Smart Nudges</CardTitle>
              <p className="text-xs text-muted-foreground">AI-powered financial insights</p>
            </div>
            <Button variant="outline" size="sm" onClick={refreshNudges}>
              <Bell className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nudges.slice(0, 3).map((nudge: any) => (
                <NudgeItem key={nudge.id} nudge={nudge} />
              ))}
              {nudges.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No nudges yet. Add some transactions to get personalized insights!</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => navigate('/insights')}
              >
                View All Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Savings Goals</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/savings')}>
            <Plus className="h-4 w-4 mr-1" /> New Goal
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topGoals.map(goal => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            
            return (
              <Card key={goal.id} className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md">{goal.title}</CardTitle>
                    <span className="text-sm font-medium">
                      {progress}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  {goal.dueDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Due by {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {goal.streakDays && goal.streakDays > 0 && (
                    <div className="flex items-center mt-2 gap-1 text-xs text-accent">
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>{goal.streakDays} day streak</span>
                      </div>
                      {goal.achievement && (
                        <div className="ml-auto achievement-badge">
                          <Award className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )})}
          {goals.length === 0 && (
            <Card className="col-span-full p-6 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any savings goals yet</p>
              <Button onClick={() => navigate('/savings')}>
                <Plus className="h-4 w-4 mr-2" /> Create Your First Goal
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      <AddTransactionDialog
        open={isAddTransactionDialogOpen}
        onOpenChange={setIsAddTransactionDialogOpen}
        onAddTransaction={addTransaction}
      />
    </div>
  );
}
