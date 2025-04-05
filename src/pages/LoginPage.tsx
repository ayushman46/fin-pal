
import { AuthForm } from "@/components/auth/AuthForm";
import { PiggyBank } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-2">
          <PiggyBank className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold gradient-heading">Nudge Wallet</h1>
        <p className="text-muted-foreground mt-2">
          Your AI financial assistant
        </p>
      </div>

      <AuthForm />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Demo login: demo@example.com / password</p>
      </div>
    </div>
  );
}
