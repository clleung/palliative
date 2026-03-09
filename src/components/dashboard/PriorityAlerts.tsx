import { AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";

interface PriorityItem {
  id: string;
  type: "patient" | "task";
  patientFullName: string;
  context: string;
  subtitle: string;
  priority: "critical" | "high" | "medium";
  action?: string;
}

const priorityItems: PriorityItem[] = [
  {
    id: "1",
    type: "patient",
    patientFullName: "Dorothy Lewis",
    context: "ALS",
    subtitle: "Awaiting family decision on ventilator support",
    priority: "critical",
    action: "Call family",
  },
  {
    id: "2",
    type: "task",
    patientFullName: "Robert Kimball",
    context: "Lab Results",
    subtitle: "Waiting on bloodwork from this morning's draw",
    priority: "high",
  },
  {
    id: "3",
    type: "patient",
    patientFullName: "Eleanor Wright",
    context: "Pain Management",
    subtitle: "Pain levels elevated since Wednesday — re-evaluation needed",
    priority: "high",
    action: "Review plan",
  },
  {
    id: "4",
    type: "task",
    patientFullName: "Dorothy Lewis",
    context: "Oxygen delivery",
    subtitle: "Scheduled for 2:30 PM today",
    priority: "medium",
  },
];

export function PriorityAlerts() {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-priority-high" />
          <h2 className="font-serif text-base font-semibold">Priority Queue</h2>
        </div>
        <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {priorityItems.length} items
        </span>
      </div>

      <div className="divide-y divide-border">
        {priorityItems.map((item) => (
          <div key={item.id} className="px-5 py-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <span className={cn("priority-dot mt-1", `priority-${item.priority}`)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {abbreviateName(item.patientFullName)} — {item.context}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
              </div>
              {item.action && (
                <Button variant="ghost" size="sm" className="text-xs text-primary flex-shrink-0 gap-1 h-7">
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
