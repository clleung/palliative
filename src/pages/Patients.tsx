import { useState } from "react";
import { Search, Plus, ChevronRight, Shield, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PatientDetailPanel } from "@/components/patients/PatientDetailPanel";
import { PatientConditionIcons, getMockConditions } from "@/components/patients/PatientConditionIcons";
import { PatientVitals, getMockVitals } from "@/components/patients/PatientVitals";
import { abbreviateName, getInitials, getAvatarColor } from "@/lib/privacy";
import { patients, Patient } from "@/data/patients";

const statusConfig = {
  stable: { label: "Stable", className: "status-stable" },
  attention: { label: "Needs Attention", className: "status-attention" },
  critical: { label: "Critical", className: "status-urgent" },
};

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter((patient) => {
    const abbr = abbreviateName(patient.name).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(q) ||
      abbr.includes(q) ||
      patient.condition.toLowerCase().includes(q);
    const matchesStatus = !selectedStatus || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedPatients = [...filteredPatients].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Patient list */}
      <div className={cn(
        "flex-1 space-y-4 min-w-0",
        selectedPatient && "hidden lg:block lg:max-w-md xl:max-w-lg"
      )}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
              Patients
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {patients.length} active · sorted by priority
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add Patient</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
          <Shield className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">
            Names abbreviated for privacy · tap to view full profile
          </p>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search patients"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { key: null, label: "All" },
              { key: "critical", label: "Critical" },
              { key: "attention", label: "Attention" },
              { key: "stable", label: "Stable" },
            ].map((filter) => (
              <Button
                key={filter.label}
                variant={selectedStatus === filter.key ? "default" : "outline"}
                size="sm"
                className="text-xs flex-shrink-0"
                onClick={() => setSelectedStatus(filter.key)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Patient cards */}
        <div className="space-y-2" role="list" aria-label="Patient list">
          {sortedPatients.map((patient) => {
            const status = statusConfig[patient.status];
            const isSelected = selectedPatient?.id === patient.id;
            const conditions = getMockConditions(patient.name);
            const vitals = getMockVitals(patient.name);

            return (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient({ ...patient, conditions, vitals })}
                className={cn(
                  "w-full text-left card-elevated p-4 hover:shadow-soft-lg transition-all touch-target",
                  isSelected && "ring-2 ring-primary"
                )}
                role="listitem"
                aria-label={`${abbreviateName(patient.name)}, ${patient.condition}, ${status.label}`}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white flex-shrink-0",
                    getAvatarColor(patient.name)
                  )}>
                    {getInitials(patient.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn("priority-dot", `priority-${patient.priority}`)} aria-hidden="true" />
                      <h3 className="font-semibold text-foreground text-sm">
                        {abbreviateName(patient.name)}
                      </h3>
                      <PatientConditionIcons conditions={conditions} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {patient.condition}
                    </p>
                    {vitals.length > 0 && (
                      <div className="mt-1">
                        <PatientVitals vitals={vitals} compact />
                      </div>
                    )}
                    {patient.pendingActions && patient.pendingActions.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-priority-high" aria-hidden="true" />
                        <span className="text-[11px] text-priority-high font-medium truncate">
                          {patient.pendingActions[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={cn("status-badge text-[10px]", status.className)}>
                      {status.label}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel — shows full name */}
      {selectedPatient && (
        <div className="flex-1 lg:sticky lg:top-0 lg:h-[calc(100vh-8rem)]">
          <PatientDetailPanel
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        </div>
      )}
    </div>
  );
}
