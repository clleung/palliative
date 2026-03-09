import { useState } from "react";
import { Search, Plus, ChevronRight, Shield, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PatientDetailPanel } from "@/components/patients/PatientDetailPanel";
import { PatientConditionIcons, getMockConditions, PatientCondition } from "@/components/patients/PatientConditionIcons";
import { PatientVitals, getMockVitals, VitalReading } from "@/components/patients/PatientVitals";
import { abbreviateName, getInitials, getAvatarColor } from "@/lib/privacy";

interface Patient {
  id: string;
  name: string;
  age: number;
  address: string;
  city: string;
  zip: string;
  condition: string;
  status: "stable" | "attention" | "critical";
  lastVisit: string;
  nextVisit: string;
  careTeam: string[];
  priority: "critical" | "high" | "medium" | "low";
  prognosis?: string;
  pendingActions?: string[];
  story?: string;
  preferences?: string[];
  familyContacts?: { name: string; relation: string; phone: string }[];
  medications?: { name: string; dose: string; schedule: string }[];
  recentNotes?: { date: string; note: string; author: string }[];
  conditions?: PatientCondition[];
  vitals?: VitalReading[];
}

const patients: Patient[] = [
  {
    id: "5",
    name: "Dorothy Lewis",
    age: 69,
    address: "654 Cedar Lane",
    city: "Lake Oswego",
    zip: "97034",
    condition: "ALS",
    status: "critical",
    lastVisit: "2 days ago",
    nextVisit: "Today, 3:00 PM",
    careTeam: ["Dr. Thompson", "Sarah (RN)", "RT Team"],
    priority: "critical",
    prognosis: "Rapid progression — estimated weeks. Family aware and involved in care decisions.",
    pendingActions: ["Awaiting family decision on ventilator support", "Oxygen delivery today at 2:30 PM"],
    story: "Dorothy is a retired music teacher who loves classical piano. Her cat Maestro keeps her company. She prefers to have music playing during visits.",
    preferences: ["Classical music during visits", "Prefers left arm for BP", "Enjoys tea — Earl Grey"],
    familyContacts: [
      { name: "Michael Lewis", relation: "Son", phone: "(555) 234-5678" },
      { name: "Anna Lewis", relation: "Daughter-in-law", phone: "(555) 345-6789" },
    ],
    medications: [
      { name: "Riluzole", dose: "50mg", schedule: "Twice daily" },
      { name: "Morphine", dose: "5mg PRN", schedule: "Every 4 hours as needed" },
    ],
    recentNotes: [
      { date: "Mar 7", note: "Respiratory function declining. Family meeting scheduled for Monday. Dorothy expressed wishes for comfort-focused care.", author: "Dr. Thompson" },
      { date: "Mar 5", note: "Swallowing difficulty increasing. Modified diet discussed with family.", author: "Sarah (RN)" },
    ],
  },
  {
    id: "2",
    name: "Robert Kimball",
    age: 82,
    address: "456 Elm Avenue",
    city: "Portland",
    zip: "97205",
    condition: "Heart Failure - Stage IV",
    status: "attention",
    lastVisit: "Today, 9:30 AM",
    nextVisit: "Tomorrow, 10:00 AM",
    careTeam: ["Dr. Chen", "Sarah (RN)", "Mike (CNA)"],
    priority: "high",
    prognosis: "Gradual decline. Medication adjustments ongoing — monitoring closely.",
    pendingActions: ["Waiting on lab results from today's draw", "Cardiologist follow-up Wednesday"],
    story: "Robert is a Korean War veteran who tells incredible stories. He has a dry sense of humor and always asks about your day first. His wife passed last year.",
    preferences: ["Calls him 'Bob'", "Morning visits preferred", "Hard of hearing — speak clearly"],
    familyContacts: [
      { name: "Susan Kimball", relation: "Daughter", phone: "(555) 456-7890" },
    ],
    medications: [
      { name: "Furosemide", dose: "40mg", schedule: "Morning" },
      { name: "Lisinopril", dose: "10mg", schedule: "Daily" },
      { name: "Metoprolol", dose: "25mg", schedule: "Twice daily" },
    ],
    recentNotes: [
      { date: "Mar 9", note: "Increased edema in lower extremities. Adjusted diuretic dose. Bob in good spirits, shared photos of his grandchildren.", author: "Sarah (RN)" },
    ],
  },
  {
    id: "3",
    name: "Eleanor Wright",
    age: 71,
    address: "789 Pine Road",
    city: "Beaverton",
    zip: "97006",
    condition: "Metastatic Cancer",
    status: "attention",
    lastVisit: "In progress",
    nextVisit: "Friday, 11:00 AM",
    careTeam: ["Dr. Patel", "Sarah (RN)"],
    priority: "high",
    pendingActions: ["Pain management re-evaluation needed"],
    story: "Eleanor is an avid gardener who brightens every room. She keeps a gratitude journal and has asked to continue visits in her garden when weather permits.",
    preferences: ["Garden visits when possible", "Loves lilac flowers", "Spiritual care welcomed"],
    familyContacts: [
      { name: "Thomas Wright", relation: "Husband", phone: "(555) 567-8901" },
      { name: "Emma Wright", relation: "Daughter", phone: "(555) 678-9012" },
    ],
    medications: [
      { name: "Oxycodone", dose: "10mg", schedule: "Every 6 hours" },
      { name: "Ondansetron", dose: "4mg", schedule: "As needed for nausea" },
    ],
    recentNotes: [
      { date: "Mar 9", note: "Currently visiting. Pain levels elevated since Wednesday. Eleanor requesting we speak with Thomas about increased support at home.", author: "Sarah (RN)" },
    ],
  },
  {
    id: "1",
    name: "Margaret Henderson",
    age: 78,
    address: "123 Oak Street, Apt 4B",
    city: "Portland",
    zip: "97201",
    condition: "Advanced COPD",
    status: "stable",
    lastVisit: "Today, 8:00 AM",
    nextVisit: "Thursday, 9:00 AM",
    careTeam: ["Dr. Williams", "Sarah (RN)"],
    priority: "medium",
    story: "Margaret is a grandmother of six who loves knitting blankets for her grandchildren. She's been stable and upbeat, finding comfort in her daily routines.",
    preferences: ["Enjoys showing photos of grandkids", "Prefers afternoon naps uninterrupted", "Tea over coffee"],
    familyContacts: [
      { name: "David Henderson", relation: "Son", phone: "(555) 123-4567" },
    ],
    medications: [
      { name: "Albuterol", dose: "2 puffs", schedule: "Every 4 hours as needed" },
      { name: "Prednisone", dose: "10mg", schedule: "Morning" },
    ],
    recentNotes: [
      { date: "Mar 9", note: "Stable visit. Margaret in good spirits. O2 sat 94% on 2L. Finished another blanket — this one for her newest grandchild.", author: "Sarah (RN)" },
    ],
  },
  {
    id: "4",
    name: "James Mitchell",
    age: 85,
    address: "321 Maple Drive",
    city: "Tigard",
    zip: "97223",
    condition: "End-stage Renal Disease",
    status: "stable",
    lastVisit: "Yesterday",
    nextVisit: "Today, 1:30 PM",
    careTeam: ["Dr. Williams", "Lisa (RN)"],
    priority: "low",
    story: "James is a retired professor of English literature. He loves discussing books and always has a recommendation ready. His faith community visits frequently.",
    preferences: ["Loves book discussions", "Prefers quiet visits", "Enjoys classical radio"],
    familyContacts: [
      { name: "Patricia Mitchell", relation: "Wife", phone: "(555) 789-0123" },
    ],
    medications: [
      { name: "Epoetin alfa", dose: "4000 units", schedule: "3x weekly" },
      { name: "Calcium acetate", dose: "667mg", schedule: "With meals" },
    ],
    recentNotes: [
      { date: "Mar 8", note: "Dialysis session tolerated well. James shared a new poem he wrote. Spirits high, wife Patricia managing well.", author: "Lisa (RN)" },
    ],
  },
];

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
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Patient</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
          <Shield className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Names abbreviated for privacy · tap to view full profile
          </p>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
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
        <div className="space-y-2">
          {sortedPatients.map((patient) => {
            const status = statusConfig[patient.status];
            const isSelected = selectedPatient?.id === patient.id;

            return (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={cn(
                  "w-full text-left card-elevated p-4 hover:shadow-soft-lg transition-all touch-target",
                  isSelected && "ring-2 ring-primary"
                )}
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
                      <span className={cn("priority-dot", `priority-${patient.priority}`)} />
                      <h3 className="font-semibold text-foreground text-sm">
                        {abbreviateName(patient.name)}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {patient.city}, {patient.zip}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {patient.condition}
                    </p>
                    {patient.pendingActions && patient.pendingActions.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-priority-high" />
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
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
