
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  mockNudges, 
  mockSavingsGoals, 
  mockTransactions, 
  getTotalSpendingByType, 
  getRecentTransactions, 
  formatCurrency,
  getSavingsProgress
} from "@/lib/data";
import { MessageSquare, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { NudgeItem } from "@/components/nudges/NudgeItem";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const recentTransactions = getRecentTransactions(mockTransactions, 5);
  const totalNeeds = getTotalSpendingByType(mockTransactions, 'need');
  const totalWants = getTotalSpendingByType(mockTransactions, 'want');
  const totalBalance = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your financial dashboard!</p>
        </div>
        <Button onClick={() => navigate('/chat')}>
          <MessageSquare className="mr-2 h-4 w-4" /> Chat with AI
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'money-positive' : 'money-negative'}`}>
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Needs Spending</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold money-negative">
              {formatCurrency(totalNeeds)}
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-destructive transition-all" 
                style={{ width: `${(totalNeeds / (totalNeeds + totalWants)) * 100}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Essential expenses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Wants Spending</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold money-negative">
              {formatCurrency(totalWants)}
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all" 
                style={{ width: `${(totalWants / (totalNeeds + totalWants)) * 100}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Non-essential expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2">
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

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Smart Nudges</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/insights')}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNudges.slice(0, 3).map(nudge => (
                <NudgeItem key={nudge.id} nudge={nudge} />
              ))}
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
          {mockSavingsGoals.map(goal => (
            <Card key={goal.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md">{goal.title}</CardTitle>
                  <span className="text-sm font-medium">
                    {getSavingsProgress(goal)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={getSavingsProgress(goal)} className="h-2" />
                <div className="flex justify-between mt-2 text-sm">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span className="text-muted-foreground">{formatCurrency(goal.targetAmount)}</span>
                </div>
                {goal.dueDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Due by {new Date(goal.dueDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
