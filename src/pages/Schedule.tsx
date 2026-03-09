import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, AlertTriangle, Car, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";
import { weeklyVisits, type Visit } from "@/data/visits";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Monday
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const weekLabel = `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  const dayVisits = weeklyVisits
    .filter((v) => v.dayOfWeek === selectedDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  const visitsByDay = DAYS.map((_, i) => weeklyVisits.filter((v) => v.dayOfWeek === i).length);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">Schedule</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {weeklyVisits.length} visits this week
          </p>
        </div>
        <Button className="gap-2" size="sm">
          <Calendar className="h-4 w-4" />
          Add Visit
        </Button>
      </div>

      {/* Week navigation */}
      <div className="card-elevated p-3">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold text-sm">{weekLabel}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {DAYS_SHORT.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className={cn(
                "flex-1 min-w-[60px] py-2 px-2 rounded-lg text-center transition-colors",
                selectedDay === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <div className="text-[11px] font-medium">{day}</div>
              <div className="text-lg font-bold">{weekDates[i].getDate()}</div>
              {visitsByDay[i] > 0 && (
                <div className={cn(
                  "text-[10px] font-medium",
                  selectedDay === i ? "text-primary-foreground/80" : "text-primary"
                )}>
                  {visitsByDay[i]} visit{visitsByDay[i] > 1 ? "s" : ""}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Day detail */}
      <div className="space-y-2">
        <h3 className="font-serif text-base font-semibold text-foreground pl-1">
          {DAYS[selectedDay]}, {weekDates[selectedDay].toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </h3>

        {dayVisits.length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No visits scheduled</p>
          </div>
        ) : (
          <div className="card-elevated divide-y divide-border overflow-hidden">
            {dayVisits.map((visit) => (
              <div
                key={visit.id}
                className={cn(
                  "px-4 py-3",
                  visit.status === "current" && "bg-primary/5",
                  visit.status === "completed" && "opacity-50"
                )}
              >
                {visit.travelMinFromPrior !== null && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-muted-foreground">
                    <Car className="h-3 w-3" />
                    <span>{visit.travelMinFromPrior} min drive from prior</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-sm font-medium">{visit.time}</p>
                    <p className="text-[11px] text-muted-foreground">{visit.endTime}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{abbreviateName(visit.patientFullName)}</h4>
                      {visit.priority === "urgent" && (
                        <Badge className="status-badge status-urgent text-[10px] px-1.5 py-0.5">
                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />Urgent
                        </Badge>
                      )}
                      {visit.priority === "attention" && (
                        <Badge className="status-badge status-attention text-[10px] px-1.5 py-0.5">Attn</Badge>
                      )}
                      {visit.status === "current" && (
                        <Badge className="status-badge bg-primary/20 text-primary text-[10px] px-1.5 py-0.5">Now</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{visit.visitType}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {visit.city}, {visit.zip}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        ~{visit.estimatedMinAtLocation} min
                      </span>
                    </div>
                    {visit.notes && (
                      <p className="mt-1.5 text-xs text-accent-foreground bg-accent/50 px-2.5 py-1.5 rounded-md">
                        {visit.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
