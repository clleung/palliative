import { Clock, MapPin, Phone, ChevronRight, AlertTriangle, Car, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";
import { todayVisits } from "@/data/visits";

export function TodaySchedule() {
  return (
    <div className="card-elevated overflow-hidden" role="region" aria-labelledby="schedule-heading">
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 id="schedule-heading" className="font-serif text-base font-semibold">Today's Schedule</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" aria-label="View all scheduled visits">
            View all
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border" role="list" aria-label="Today's patient visits">
        {todayVisits.map((visit) => (
          <div
            key={visit.id}
            className={cn(
              "px-4 py-3 transition-colors",
              visit.status === "current" && "bg-primary/5",
              visit.status === "completed" && "opacity-60"
            )}
            role="listitem"
            aria-label={`${visit.time} visit with ${abbreviateName(visit.patientFullName)}, ${visit.visitType}${visit.priority === "urgent" ? ", urgent" : ""}`}
          >
            {visit.travelMinFromPrior !== null && (
              <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-muted-foreground">
                <Car className="h-3 w-3" aria-hidden="true" />
                <span>{visit.travelMinFromPrior} min drive from prior</span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-16 flex-shrink-0 text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <time>{visit.time}</time>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">
                      {abbreviateName(visit.patientFullName)}
                    </h3>
                    {visit.priority === "urgent" && (
                      <Badge className="status-badge status-urgent text-[10px] px-1.5 py-0.5">
                        <AlertTriangle className="h-2.5 w-2.5 mr-0.5" aria-hidden="true" />
                        Urgent
                      </Badge>
                    )}
                    {visit.priority === "attention" && (
                      <Badge className="status-badge status-attention text-[10px] px-1.5 py-0.5">
                        Attn
                      </Badge>
                    )}
                    {visit.status === "current" && (
                      <Badge className="status-badge bg-primary/20 text-primary text-[10px] px-1.5 py-0.5">
                        Now
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label={`Call ${abbreviateName(visit.patientFullName)}`}
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">{visit.visitType}</p>

                <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    <span>{visit.city}, {visit.zip}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-3 w-3" aria-hidden="true" />
                    <span>~{visit.estimatedMinAtLocation} min</span>
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
    </div>
  );
}
