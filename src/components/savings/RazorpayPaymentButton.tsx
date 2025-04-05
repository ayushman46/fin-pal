
import { useEffect, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

// Declare the Razorpay global variable
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentButtonProps extends ButtonProps {
  amount: number;
  onSuccess?: (paymentId: string) => void;
  goalId?: string;
  goalName?: string;
}

export function RazorpayPaymentButton({
  amount,
  onSuccess,
  goalId,
  goalName,
  children,
  ...props
}: RazorpayPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load Razorpay script when component mounts
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  const handlePayment = () => {
    setIsLoading(true);
    
    // In a real app with Supabase, we would make a call to our backend to create an order
    // For the demo using Razorpay test mode, we'll create the order directly
    const orderInfo = {
      key: 'rzp_test_6Tzogn9YWLqzj9', // Razorpay test key
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "Fin Pal",
      description: goalName 
        ? `Contribution to ${goalName}`
        : "Contribution to savings",
      order_id: "order_" + Date.now(), // In production, this would come from your backend
      prefill: {
        name: localStorage.getItem('userName') || "Demo User",
        email: localStorage.getItem('userEmail') || "demo@example.com",
        contact: "9876543210"
      },
      theme: {
        color: "#0f172a" // Dark theme color
      },
      handler: function (response: any) {
        // Handle successful payment
        console.log("Payment successful:", response);
        toast.success("Payment successful!");
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(response.razorpay_payment_id);
        }
        
        setIsLoading(false);
      }
    };
    
    try {
      const razorpayInstance = new window.Razorpay(orderInfo);
      razorpayInstance.open();
      
      // Razorpay will call the handler function on completion
      razorpayInstance.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      toast.error("Unable to initialize payment. Please try again later.");
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Processing..." : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || "Pay Now"}
        </>
      )}
    </Button>
  );
}
