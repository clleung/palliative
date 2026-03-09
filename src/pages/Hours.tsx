import { Clock, TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const weeklyData = [
  { day: "Mon", hours: 8, target: 8 },
  { day: "Tue", hours: 7.5, target: 8 },
  { day: "Wed", hours: 8.5, target: 8 },
  { day: "Thu", hours: 8, target: 8 },
  { day: "Fri", hours: 0, target: 8 },
];

export default function Hours() {
  const totalWorked = weeklyData.reduce((sum, d) => sum + d.hours, 0);
  const totalTarget = 40;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
          Staff Hours
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your working hours and overtime
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="font-serif text-2xl font-semibold">{totalWorked}h</p>
            </div>
          </div>
          <Progress value={(totalWorked / totalTarget) * 100} className="mt-4" />
          <p className="text-xs text-muted-foreground mt-2">
            {totalTarget - totalWorked}h remaining of {totalTarget}h target
          </p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="font-serif text-2xl font-semibold">142h</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            On track for 160h monthly target
          </p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">PTO Balance</p>
              <p className="font-serif text-2xl font-semibold">12 days</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            3 days scheduled this quarter
          </p>
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="card-elevated p-5">
        <h2 className="font-serif text-lg font-semibold mb-4">This Week</h2>
        <div className="space-y-4">
          {weeklyData.map((day) => (
            <div key={day.day} className="flex items-center gap-4">
              <span className="w-12 text-sm font-medium">{day.day}</span>
              <div className="flex-1">
                <Progress 
                  value={(day.hours / day.target) * 100} 
                  className="h-3"
                />
              </div>
              <span className="w-16 text-sm text-right">
                {day.hours > 0 ? `${day.hours}h` : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
