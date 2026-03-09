import { useState } from "react";
import { Search, Filter, Plus, ChevronRight, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  age: number;
  address: string;
  condition: string;
  status: "stable" | "attention" | "critical";
  lastVisit: string;
  nextVisit: string;
  careTeam: string[];
}

const patients: Patient[] = [
  {
    id: "1",
    name: "Margaret Henderson",
    age: 78,
    address: "123 Oak Street, Apt 4B",
    condition: "Advanced COPD",
    status: "stable",
    lastVisit: "Today, 8:00 AM",
    nextVisit: "Thursday, 9:00 AM",
    careTeam: ["Dr. Williams", "Sarah (RN)"],
  },
  {
    id: "2",
    name: "Robert Kimball",
    age: 82,
    address: "456 Elm Avenue",
    condition: "Heart Failure - Stage IV",
    status: "attention",
    lastVisit: "Today, 9:30 AM",
    nextVisit: "Tomorrow, 10:00 AM",
    careTeam: ["Dr. Chen", "Sarah (RN)", "Mike (CNA)"],
  },
  {
    id: "3",
    name: "Eleanor Wright",
    age: 71,
    address: "789 Pine Road",
    condition: "Metastatic Cancer",
    status: "attention",
    lastVisit: "In progress",
    nextVisit: "Friday, 11:00 AM",
    careTeam: ["Dr. Patel", "Sarah (RN)"],
  },
  {
    id: "4",
    name: "James Mitchell",
    age: 85,
    address: "321 Maple Drive",
    condition: "End-stage Renal Disease",
    status: "stable",
    lastVisit: "Yesterday",
    nextVisit: "Today, 1:30 PM",
    careTeam: ["Dr. Williams", "Lisa (RN)"],
  },
  {
    id: "5",
    name: "Dorothy Lewis",
    age: 69,
    address: "654 Cedar Lane",
    condition: "ALS",
    status: "critical",
    lastVisit: "2 days ago",
    nextVisit: "Today, 3:00 PM",
    careTeam: ["Dr. Thompson", "Sarah (RN)", "RT Team"],
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

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
            Patients
          </h1>
          <p className="text-muted-foreground mt-1">
            {patients.length} active patients in your care
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Privacy notice */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-lg">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Patient data is encrypted and access is logged for HIPAA compliance
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedStatus === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus(null)}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("critical")}
          >
            Critical
          </Button>
          <Button
            variant={selectedStatus === "attention" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("attention")}
          >
            Attention
          </Button>
        </div>
      </div>

      {/* Patient list */}
      <div className="space-y-3">
        {filteredPatients.map((patient, index) => {
          const status = statusConfig[patient.status];
          
          return (
            <div
              key={patient.id}
              className="card-elevated p-5 hover:shadow-soft-lg transition-shadow cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {patient.name}
                    </h3>
                    <Badge className={cn("status-badge", status.className)}>
                      {status.label}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {patient.age} years • {patient.condition}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Address:</span>
                      <p className="font-medium">{patient.address}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Visit:</span>
                      <p className="font-medium">{patient.lastVisit}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next Visit:</span>
                      <p className="font-medium">{patient.nextVisit}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Care Team:</span>
                    <div className="flex gap-1.5">
                      {patient.careTeam.map((member) => (
                        <span
                          key={member}
                          className="text-xs px-2 py-1 bg-secondary rounded-full"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
