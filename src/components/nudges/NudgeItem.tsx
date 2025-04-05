
import { Badge } from "@/components/ui/badge";
import { Nudge } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Award, Lightbulb } from "lucide-react";

interface NudgeItemProps {
  nudge: Nudge;
}

export function NudgeItem({ nudge }: NudgeItemProps) {
  const getIcon = () => {
    switch (nudge.type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-secondary" />;
      case 'info':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-accent" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (nudge.type) {
      case 'warning':
        return "bg-amber-500";
      case 'achievement':
        return "bg-secondary";
      case 'info':
        return "bg-primary";
      case 'tip':
        return "bg-accent";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className={cn(
      "p-3 border rounded-lg relative",
      nudge.read ? "bg-transparent" : "bg-muted/30"
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div>
          <p className="text-sm">{nudge.message}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">{new Date(nudge.date).toLocaleDateString()}</p>
            {nudge.actionable && (
              <Badge variant="outline" className="text-xs">
                Actionable
              </Badge>
            )}
          </div>
        </div>
      </div>
      {!nudge.read && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></div>
      )}
    </div>
  );
}
