
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  mockNudges, 
  mockTransactions, 
  getCategorySpending, 
  getTotalSpendingByType,
  formatCurrency
} from "@/lib/data";
import { NudgeItem } from "@/components/nudges/NudgeItem";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function InsightsPage() {
  // Calculate category-wise spending for charts
  const categories = ['food', 'shopping', 'transport', 'entertainment', 'utilities', 'groceries', 'rent', 'other'];
  const categoryData = categories.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: getCategorySpending(mockTransactions, cat as any)
  })).filter(item => item.value > 0);

  // Calculate spending breakdown by type
  const needsAmount = getTotalSpendingByType(mockTransactions, 'need');
  const wantsAmount = getTotalSpendingByType(mockTransactions, 'want');
  const spendingTypeData = [
    { name: "Needs", value: needsAmount },
    { name: "Wants", value: wantsAmount }
  ];

  // Colors for charts
  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">Understand your spending patterns and receive personalized advice</p>
      </div>

      <Tabs defaultValue="spending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="nudges">Smart Nudges</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>How your expenses are distributed across categories</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Needs vs. Wants</CardTitle>
                <CardDescription>Breakdown of essential vs. non-essential spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={spendingTypeData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar 
                        dataKey="value" 
                        fill="#6366F1" 
                        barSize={40}
                        radius={[4, 4, 4, 4]}
                        label={{
                          position: 'right',
                          formatter: (value: number) => formatCurrency(value)
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mr-2" /> Needs
                    </span>
                    <span>{formatCurrency(needsAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-primary/60 mr-2" /> Wants
                    </span>
                    <span>{formatCurrency(wantsAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Spending Insights</CardTitle>
              <CardDescription>Key observations about your financial behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Food Spending</h3>
                  <p className="text-muted-foreground mt-1">
                    Your food spending is 15% higher than last month, with most spent on takeout and restaurants.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Shopping Habits</h3>
                  <p className="text-muted-foreground mt-1">
                    You've made 8 online shopping purchases this month, totaling ₹{getCategorySpending(mockTransactions, 'shopping')}.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Essential Spending</h3>
                  <p className="text-muted-foreground mt-1">
                    {Math.round((needsAmount / (needsAmount + wantsAmount)) * 100)}% of your spending is on essential needs.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Savings Potential</h3>
                  <p className="text-muted-foreground mt-1">
                    You could save up to ₹{Math.round(wantsAmount * 0.3)} by reducing non-essential spending by 30%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nudges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Nudges</CardTitle>
              <CardDescription>Smart recommendations to improve your financial health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNudges.map(nudge => (
                  <NudgeItem key={nudge.id} nudge={nudge} />
                ))}
              </div>
            </CardContent>
          </Card>
            
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Personalized advice based on your spending patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Reduce Food Delivery</h3>
                <p className="text-muted-foreground mt-1">
                  You spent ₹38.49 on food delivery this week. Try meal prepping on weekends to save up to ₹150 per week.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Automate Savings</h3>
                <p className="text-muted-foreground mt-1">
                  Consider setting up an automatic transfer of ₹200 per week to your vacation savings goal.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Entertainment Budget</h3>
                <p className="text-muted-foreground mt-1">
                  You're currently spending about ₹500 monthly on entertainment. Consider setting a budget of ₹400.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
