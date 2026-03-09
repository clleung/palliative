import { useState } from "react";
import { ChevronDown, ChevronUp, Truck, Clock, ListChecks, Bot, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DeliveryStatus } from "@/components/dashboard/DeliveryStatus";
import { PriorityAlerts } from "@/components/dashboard/PriorityAlerts";
import { RobotFleetWidget } from "@/components/robots/RobotDispatch";
import { PatientDetailPanel } from "@/components/patients/PatientDetailPanel";
import { WeeklyTrends } from "@/components/dashboard/WeeklyTrends";
import { cn } from "@/lib/utils";
import { findPatientByName, type Patient } from "@/data/patients";
import { getMockConditions } from "@/components/patients/PatientConditionIcons";
import { getMockVitals } from "@/components/patients/PatientVitals";

function CollapsibleSection({
  title,
  icon: Icon,
  badge,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = title.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="card-elevated overflow-hidden" role="region" aria-labelledby={`heading-${sectionId}`}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`content-${sectionId}`}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors touch-target"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          <h2 id={`heading-${sectionId}`} className="font-serif text-base font-semibold text-foreground">{title}</h2>
          {badge && (
            <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full" aria-label={badge}>
              {badge}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </button>
      <div
        id={`content-${sectionId}`}
        role="region"
        aria-labelledby={`heading-${sectionId}`}
        className={cn(
          "transition-all duration-200 overflow-hidden",
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
        hidden={!open}
      >
        <div className="border-t border-border">{children}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  const handlePatientClick = (patientFullName: string) => {
    const patient = findPatientByName(patientFullName);
    if (patient) {
      setSelectedPatient({
        ...patient,
        conditions: getMockConditions(patient.name),
        vitals: getMockVitals(patient.name),
      });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in" role="main">
      {/* Header */}
      <div>
        <h1 className="font-serif text-xl lg:text-2xl font-semibold text-foreground">
          {greeting}, Sarah
        </h1>
        <p className="text-sm text-muted-foreground">
          5 visits · 2 deliveries · 4 pending tasks
        </p>
      </div>

      <QuickActions />
      <DashboardStats />
      <PriorityAlerts />
      
      {/* Robot Fleet Widget */}
      <RobotFleetWidget />
      
      <TodaySchedule onPatientClick={handlePatientClick} />

      <CollapsibleSection title="Deliveries" icon={Truck} badge="2 active">
        <DeliveryStatus />
      </CollapsibleSection>

      <CollapsibleSection title="Hours This Week" icon={Clock} badge="32/40h">
        <HoursCompact />
      </CollapsibleSection>

      <CollapsibleSection title="All Tasks" icon={ListChecks} badge="4 pending">
        <TaskSummary />
      </CollapsibleSection>

      {/* Patient detail panel overlay */}
      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

function HoursCompact() {
  const days = [
    { day: "Mon", hours: 8 },
    { day: "Tue", hours: 7.5 },
    { day: "Wed", hours: 8.5 },
    { day: "Thu", hours: 8 },
    { day: "Fri", hours: 0 },
  ];
  return (
    <div className="px-5 py-4 space-y-2" role="list" aria-label="Hours worked by day">
      {days.map((d) => (
        <div key={d.day} className="flex items-center gap-3 text-sm" role="listitem">
          <span className="w-10 font-medium text-muted-foreground">{d.day}</span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={d.hours} aria-valuemin={0} aria-valuemax={8} aria-label={`${d.day}: ${d.hours} hours`}>
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(d.hours / 8) * 100}%` }}
            />
          </div>
          <span className="w-10 text-right text-muted-foreground">
            {d.hours > 0 ? `${d.hours}h` : "—"}
          </span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground pt-1">32h worked · 8h remaining of 40h target</p>
    </div>
  );
}

const priorityLabels: Record<string, string> = {
  critical: "Critical priority",
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

function TaskSummary() {
  const tasks = [
    { label: "Awaiting family decision — D.LEW", priority: "critical" as const, type: "Pending response" },
    { label: "Lab results — R.KIM", priority: "high" as const, type: "Waiting on results" },
    { label: "Pain mgmt re-eval — E.WRI", priority: "high" as const, type: "Assessment" },
    { label: "O₂ delivery — D.LEW", priority: "medium" as const, type: "Delivery @ 2:30 PM" },
    { label: "Follow-up note — M.HEN", priority: "low" as const, type: "Documentation" },
  ];

  return (
    <div className="divide-y divide-border" role="list" aria-label="Task summary">
      {tasks.map((task, i) => (
        <div key={i} className="px-5 py-3 flex items-center gap-3" role="listitem">
          <span
            className={cn("priority-dot", `priority-${task.priority}`)}
            role="img"
            aria-label={priorityLabels[task.priority]}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{task.label}</p>
            <p className="text-xs text-muted-foreground">{task.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
