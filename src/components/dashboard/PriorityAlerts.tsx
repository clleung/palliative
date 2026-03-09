import { AlertTriangle, Clock, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PriorityItem {
  id: string;
  type: "patient" | "task";
  title: string;
  subtitle: string;
  priority: "critical" | "high" | "medium";
  action?: string;
}

const priorityItems: PriorityItem[] = [
  {
    id: "1",
    type: "patient",
    title: "Dorothy Lewis — ALS",
    subtitle: "Awaiting family decision on ventilator support",
    priority: "critical",
    action: "Call family",
  },
  {
    id: "2",
    type: "task",
    title: "Robert Kimball — Lab Results",
    subtitle: "Waiting on bloodwork from this morning's draw",
    priority: "high",
  },
  {
    id: "3",
    type: "patient",
    title: "Eleanor Wright — Pain Management",
    subtitle: "Pain levels elevated since Wednesday — re-evaluation needed",
    priority: "high",
    action: "Review plan",
  },
  {
    id: "4",
    type: "task",
    title: "Oxygen delivery — Dorothy L.",
    subtitle: "Scheduled for 2:30 PM today",
    priority: "medium",
  },
];

export function PriorityAlerts() {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-priority-high" />
          <h2 className="font-serif text-lg font-semibold">Priority Queue</h2>
        </div>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {priorityItems.length} items
        </span>
      </div>

      <div className="divide-y divide-border">
        {priorityItems.map((item) => (
          <div key={item.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <span className={cn("priority-dot mt-1.5", `priority-${item.priority}`)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
              </div>
              {item.action && (
                <Button variant="ghost" size="sm" className="text-xs text-primary flex-shrink-0 gap-1">
                  {item.action}
                  <ChevronRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
