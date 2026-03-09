import { Users, MapPin, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    name: "Today's Visits",
    value: "8",
    subtext: "2 remaining",
    icon: Users,
    trend: "On track",
    trendType: "positive" as const,
  },
  {
    name: "Active Patients",
    value: "24",
    subtext: "3 new this week",
    icon: MapPin,
    trend: "+2 from last week",
    trendType: "neutral" as const,
  },
  {
    name: "Urgent Attention",
    value: "2",
    subtext: "Needs review",
    icon: AlertCircle,
    trend: "Action needed",
    trendType: "attention" as const,
  },
  {
    name: "Hours This Week",
    value: "32",
    subtext: "of 40 scheduled",
    icon: Clock,
    trend: "8 remaining",
    trendType: "neutral" as const,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="card-elevated p-5 animate-fade-in"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <span className="text-sm text-muted-foreground">
                  {stat.subtext}
                </span>
              </div>
            </div>
            <div className={cn(
              "p-2.5 rounded-xl",
              stat.trendType === "attention" ? "bg-red-100" : "bg-primary/10"
            )}>
              <stat.icon className={cn(
                "h-5 w-5",
                stat.trendType === "attention" ? "text-red-600" : "text-primary"
              )} />
            </div>
          </div>
          <p className={cn(
            "mt-3 text-xs font-medium",
            stat.trendType === "positive" && "text-emerald-600",
            stat.trendType === "attention" && "text-red-600",
            stat.trendType === "neutral" && "text-muted-foreground"
          )}>
            {stat.trend}
          </p>
        </div>
      ))}
    </div>
  );
}
