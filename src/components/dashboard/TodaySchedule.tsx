import { Clock, MapPin, Phone, ChevronRight, AlertTriangle, Car, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";

interface Visit {
  id: string;
  time: string;
  patientFullName: string;
  city: string;
  zip: string;
  visitType: string;
  status: "completed" | "current" | "upcoming";
  priority?: "urgent" | "attention";
  notes?: string;
  travelMinFromPrior: number | null;
  estimatedMinAtLocation: number;
}

const todayVisits: Visit[] = [
  {
    id: "1",
    time: "8:00 AM",
    patientFullName: "Margaret Henderson",
    city: "Portland",
    zip: "97201",
    visitType: "Pain Management Review",
    status: "completed",
    travelMinFromPrior: null,
    estimatedMinAtLocation: 45,
  },
  {
    id: "2",
    time: "9:30 AM",
    patientFullName: "Robert Kimball",
    city: "Portland",
    zip: "97205",
    visitType: "Medication Adjustment",
    status: "completed",
    travelMinFromPrior: 12,
    estimatedMinAtLocation: 40,
  },
  {
    id: "3",
    time: "11:00 AM",
    patientFullName: "Eleanor Wright",
    city: "Beaverton",
    zip: "97006",
    visitType: "Comfort Care Assessment",
    status: "current",
    priority: "attention",
    notes: "Family requested extra time today",
    travelMinFromPrior: 22,
    estimatedMinAtLocation: 60,
  },
  {
    id: "4",
    time: "1:30 PM",
    patientFullName: "James Mitchell",
    city: "Tigard",
    zip: "97223",
    visitType: "Symptom Check",
    status: "upcoming",
    travelMinFromPrior: 15,
    estimatedMinAtLocation: 30,
  },
  {
    id: "5",
    time: "3:00 PM",
    patientFullName: "Dorothy Lewis",
    city: "Lake Oswego",
    zip: "97034",
    visitType: "Equipment Check",
    status: "upcoming",
    priority: "urgent",
    notes: "Oxygen delivery scheduled",
    travelMinFromPrior: 18,
    estimatedMinAtLocation: 60,
  },
];

export function TodaySchedule() {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold">Today's Schedule</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View all
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {todayVisits.map((visit) => (
          <div
            key={visit.id}
            className={cn(
              "px-4 py-3 transition-colors",
              visit.status === "current" && "bg-primary/5",
              visit.status === "completed" && "opacity-50"
            )}
          >
            {/* Travel time from prior stop */}
            {visit.travelMinFromPrior !== null && (
              <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-muted-foreground">
                <Car className="h-3 w-3" />
                <span>{visit.travelMinFromPrior} min drive from prior</span>
              </div>
            )}

            <div className="flex items-start gap-3">
              {/* Time */}
              <div className="w-16 flex-shrink-0 text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {visit.time}
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">
                      {abbreviateName(visit.patientFullName)}
                    </h3>
                    {visit.priority === "urgent" && (
                      <Badge className="status-badge status-urgent text-[10px] px-1.5 py-0.5">
                        <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
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
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
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
    </div>
  );
}
