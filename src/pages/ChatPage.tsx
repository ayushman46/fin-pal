
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockChatHistory, ChatMessage, mockUser } from "@/lib/data";
import { SendHorizontal, Bot, Sparkles, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : mockChatHistory;
  });
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : mockUser;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
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
    
    // Simulate AI response based on financial keywords in the message
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let aiResponse = "";
      
      // Handle different types of financial queries
      if (lowerInput.includes("budget") || lowerInput.includes("spending")) {
        aiResponse = `Based on your recent transactions, you've spent ₹3,250 on non-essential items this month. That's about 25% of your total spending.`;
      } else if (lowerInput.includes("saving") || lowerInput.includes("goals")) {
        aiResponse = `You're making good progress on your savings goals! Just ₹800 more to reach your vacation fund target.`;
      } else if (lowerInput.includes("invest") || lowerInput.includes("investment")) {
        aiResponse = `Based on your risk profile, I recommend allocating 60% to index funds, 30% to bonds, and 10% to high-growth stocks. Would you like me to suggest some specific options?`;
      } else if (lowerInput.includes("expense") || lowerInput.includes("cost")) {
        aiResponse = `Your biggest expense category this month is food, with ₹4,500 spent so far.`;
      } else if (lowerInput.includes("income") || lowerInput.includes("salary")) {
        aiResponse = `Your income this month is ₹25,000, which is consistent with your average monthly income over the past 6 months.`;
      } else if (lowerInput.includes("debt") || lowerInput.includes("loan")) {
        aiResponse = `You currently have ₹75,000 in outstanding loans with an average interest rate of 10.5%. Focusing on paying off your credit card debt first would save you the most money.`;
      } else {
        aiResponse = `Thanks for your message! Is there a specific aspect of your finances you'd like to discuss today? I can help with budgeting, savings goals, investments, or expense analysis.`;
      }
      
      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
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
      '<span class="font-semibold">$1</span>'
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
          onClick={handleSendMessage}
          disabled={!input.trim() || isTyping}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
