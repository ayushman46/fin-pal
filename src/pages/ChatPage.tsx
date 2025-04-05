
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockChatHistory, ChatMessage, mockUser } from "@/lib/data";
import { SendHorizontal, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
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
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your recent transactions, you've spent ₹3,250 on non-essential items this month. That's about 25% of your total spending.",
        "Your biggest expense category this month is food, with ₹4,500 spent so far.",
        "You're making good progress on your savings goals! Just ₹800 more to reach your vacation fund target.",
        "I notice you've been spending a lot on food delivery lately. Would you like some tips to reduce these expenses?",
        "Great question! Your monthly spending on transportation is approximately ₹1,200, which is 15% lower than last month."
      ];
      
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, aiResponse]);
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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Financial Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything about your finances, spending habits, or savings goals
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 rounded-lg border bg-muted/30 space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className="flex gap-3 max-w-[80%]">
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  message.sender === "user" 
                    ? "chat-bubble-user" 
                    : "chat-bubble-ai"
                )}
              >
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: renderMessageContent(message.content) 
                  }} 
                />
                <div className="text-xs opacity-70 text-right mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUser.avatar} />
                  <AvatarFallback>
                    {mockUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="chat-bubble-ai flex gap-1 items-center h-8">
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="relative">
        <Textarea
          placeholder="Ask about your finances, spending habits, or get savings advice..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[80px] resize-none pr-12"
        />
        <Button
          size="icon"
          className="absolute bottom-2 right-2"
          onClick={handleSendMessage}
          disabled={!input.trim() || isTyping}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-2 flex justify-center">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> 
          Powered by AI financial analysis
        </div>
      </div>
    </div>
  );
}
