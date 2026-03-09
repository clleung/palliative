import { Clock, MapPin, Phone, ChevronRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Visit {
  id: string;
  time: string;
  patientName: string;
  address: string;
  visitType: string;
  status: "completed" | "current" | "upcoming";
  priority?: "urgent" | "attention";
  notes?: string;
}

const todayVisits: Visit[] = [
  {
    id: "1",
    time: "8:00 AM",
    patientName: "Margaret H.",
    address: "123 Oak Street",
    visitType: "Pain Management Review",
    status: "completed",
  },
  {
    id: "2",
    time: "9:30 AM",
    patientName: "Robert K.",
    address: "456 Elm Avenue",
    visitType: "Medication Adjustment",
    status: "completed",
  },
  {
    id: "3",
    time: "11:00 AM",
    patientName: "Eleanor W.",
    address: "789 Pine Road",
    visitType: "Comfort Care Assessment",
    status: "current",
    priority: "attention",
    notes: "Family requested extra time today",
  },
  {
    id: "4",
    time: "1:30 PM",
    patientName: "James M.",
    address: "321 Maple Drive",
    visitType: "Symptom Check",
    status: "upcoming",
  },
  {
    id: "5",
    time: "3:00 PM",
    patientName: "Dorothy L.",
    address: "654 Cedar Lane",
    visitType: "Equipment Check",
    status: "upcoming",
    priority: "urgent",
    notes: "Oxygen delivery scheduled",
  },
];

export function TodaySchedule() {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Today's Schedule</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {todayVisits.map((visit, index) => (
          <div
            key={visit.id}
            className={cn(
              "px-5 py-4 transition-colors",
              visit.status === "current" && "bg-primary/5",
              visit.status === "completed" && "opacity-60"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Time column */}
              <div className="w-20 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {visit.time}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {visit.patientName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {visit.visitType}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {visit.priority === "urgent" && (
                      <Badge className="status-badge status-urgent">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                    {visit.priority === "attention" && (
                      <Badge className="status-badge status-attention">
                        Attention
                      </Badge>
                    )}
                    {visit.status === "completed" && (
                      <Badge className="status-badge status-stable">
                        Completed
                      </Badge>
                    )}
                    {visit.status === "current" && (
                      <Badge className="status-badge bg-primary/20 text-primary">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {visit.address}
                  </div>
                </div>

                {visit.notes && (
                  <p className="mt-2 text-sm text-accent-foreground bg-accent/50 px-3 py-2 rounded-lg">
                    {visit.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
