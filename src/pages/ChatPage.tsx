
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockChatHistory, ChatMessage, mockUser, mockTransactions, Transaction } from "@/lib/data";
import { SendHorizontal, Bot, Sparkles, Check, CheckCheck, DollarSign, ShoppingCart, Banknote, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/auth/UserContext";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : mockChatHistory;
  });
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const { user } = useUser();
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpenses = transactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
  const balance = totalIncome - totalExpenses;
    
  const needsSpending = transactions
    .filter(tx => tx.type === 'need' && tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
  const wantsSpending = transactions
    .filter(tx => tx.type === 'want' && tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const handleSendMessage = (messageText: string = input) => {
    if (!messageText.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);
    
    // Update the message to "delivered" after a short delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? {...msg, status: "delivered"} : msg
        )
      );
    }, 500);
    
    // Update to "read" after another delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? {...msg, status: "read"} : msg
        )
      );
    }, 1000);
    
    // Generate AI response
    setTimeout(() => {
      const lowerInput = messageText.toLowerCase();
      let aiResponse = "";
      
      // Enhanced responses with financial data
      if (lowerInput.includes("balance") || lowerInput.includes("how much") || lowerInput.includes("money")) {
        aiResponse = `Your current balance is ₹${balance.toFixed(0)}. You've earned ₹${totalIncome.toFixed(0)} and spent ₹${totalExpenses.toFixed(0)} in total.`;
      } else if (lowerInput.includes("needs") || lowerInput.includes("necessities")) {
        aiResponse = `You've spent ₹${needsSpending.toFixed(0)} on essential needs (${(needsSpending/totalExpenses*100).toFixed(0)}% of your expenses). This includes groceries, rent, utilities, and other necessities.`;
      } else if (lowerInput.includes("wants") || lowerInput.includes("discretionary")) {
        aiResponse = `You've spent ₹${wantsSpending.toFixed(0)} on wants (${(wantsSpending/totalExpenses*100).toFixed(0)}% of your expenses). This includes dining out, entertainment, shopping, and other non-essential items.`;
      } else if (lowerInput.includes("budget") || lowerInput.includes("spending")) {
        aiResponse = `Based on your recent transactions, you've spent ₹${totalExpenses.toFixed(0)} this month. That's split between ₹${needsSpending.toFixed(0)} for needs and ₹${wantsSpending.toFixed(0)} for wants. I recommend keeping wants under 30% of your total spending.`;
      } else if (lowerInput.includes("saving") || lowerInput.includes("goals")) {
        aiResponse = `You're making good progress on your savings goals! Just ₹800 more to reach your vacation fund target. Your emergency fund is currently at 50% of your target.`;
      } else if (lowerInput.includes("invest") || lowerInput.includes("investment")) {
        aiResponse = `Based on your risk profile, I recommend allocating 60% to index funds, 30% to bonds, and 10% to high-growth stocks. Would you like me to suggest some specific options?`;
      } else if (lowerInput.includes("expense") || lowerInput.includes("cost")) {
        const categories = transactions
          .filter(tx => tx.amount < 0)
          .reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
            return acc;
          }, {} as Record<string, number>);
        
        const topCategory = Object.entries(categories)
          .sort((a, b) => b[1] - a[1])[0];
          
        aiResponse = `Your biggest expense category is ${topCategory[0]}, with ₹${topCategory[1].toFixed(0)} spent so far. Would you like to see a breakdown of all your expenses?`;
      } else if (lowerInput.includes("income") || lowerInput.includes("salary")) {
        aiResponse = `Your total income is ₹${totalIncome.toFixed(0)}. This is consistent with your average monthly income over the past 6 months.`;
      } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
        aiResponse = `Hello ${user.name}! How can I help with your finances today? You can ask about your balance, spending on needs vs wants, budget tracking, or savings goals.`;
      } else if (lowerInput.includes("thank")) {
        aiResponse = `You're welcome, ${user.name}! Is there anything else I can help you with?`;
      } else {
        aiResponse = `Thanks for your message, ${user.name}! Is there a specific aspect of your finances you'd like to discuss today? I can help with budgeting, savings goals, investments, or expense analysis.`;
      }
      
      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setTimeout(() => setShowSuggestions(true), 1000);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (content: string) => {
    // Simple detector for currency amounts
    return content.replace(
      /(₹\d+(?:,\d+)?(?:\.\d+)?)/g,
      '<span class="font-semibold text-primary">$1</span>'
    );
  };

  const getStatusIcon = (status?: string) => {
    switch(status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const getFormattedTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const quickSuggestions = [
    { text: "What's my current balance?", icon: <DollarSign className="h-4 w-4" /> },
    { text: "How much am I spending on wants?", icon: <ShoppingCart className="h-4 w-4" /> },
    { text: "How are my savings goals doing?", icon: <PiggyBank className="h-4 w-4" /> },
    { text: "What's my income this month?", icon: <Banknote className="h-4 w-4" /> }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Financial Assistant</h1>
        <p className="text-muted-foreground">
          Chat with Fin Pal about your finances, spending habits, or savings goals
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 rounded-lg border bg-muted/30 space-y-4 mb-4 bg-[#0f1921]">
        <div className="sticky top-0 bg-gradient-to-b from-[#0f1921] to-transparent py-2 mb-2 text-center text-sm text-muted-foreground">
          Today
        </div>
        
        {/* Financial Summary Card */}
        <Card className="mb-4 bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">₹{balance.toFixed(0)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Needs</span>
                  <span>₹{needsSpending.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Wants</span>
                  <span>₹{wantsSpending.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className="flex gap-1 max-w-[80%]">
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "p-3 rounded-lg",
                  message.sender === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-none" 
                    : "bg-muted text-muted-foreground rounded-bl-none"
                )}
              >
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: renderMessageContent(message.content) 
                  }} 
                />
                <div className={cn(
                  "text-xs flex items-center gap-1 mt-1",
                  message.sender === "user" ? "justify-end" : "justify-start",
                  message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground/70"
                )}>
                  {getFormattedTime(message.timestamp)}
                  {message.sender === "user" && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1 max-w-[80%]">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="px-4 py-2 bg-muted rounded-lg rounded-bl-none flex gap-1 items-center h-8">
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestion chips */}
      {showSuggestions && !isTyping && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center gap-2 text-sm py-1 px-3 h-auto"
              onClick={() => handleSendMessage(suggestion.text)}
            >
              {suggestion.icon}
              {suggestion.text}
            </Button>
          ))}
        </div>
      )}

      <div className="relative bg-muted p-2 rounded-lg">
        <Textarea
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none pr-12 bg-background border-none focus-visible:ring-0"
        />
        <Button
          size="icon"
          className="absolute bottom-4 right-4"
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isTyping}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
