import { useState } from "react";
import {
  X,
  Heart,
  Phone,
  MapPin,
  Clock,
  FileText,
  Users,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Pill,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface PatientDetail {
  id: string;
  name: string;
  age: number;
  address: string;
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
}

interface PatientDetailPanelProps {
  patient: PatientDetail | null;
  onClose: () => void;
}

const priorityConfig = {
  critical: { label: "Critical Priority", dotClass: "priority-critical", bgClass: "bg-red-50 border-red-200" },
  high: { label: "High Priority", dotClass: "priority-high", bgClass: "bg-orange-50 border-orange-200" },
  medium: { label: "Medium Priority", dotClass: "priority-medium", bgClass: "bg-yellow-50 border-yellow-200" },
  low: { label: "Low Priority", dotClass: "priority-low", bgClass: "bg-blue-50 border-blue-200" },
};

const statusConfig = {
  stable: { label: "Stable", className: "status-stable" },
  attention: { label: "Needs Attention", className: "status-attention" },
  critical: { label: "Critical", className: "status-urgent" },
};

// Generate initials for the avatar
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

// Generate a warm color from name for avatar
function getAvatarColor(name: string) {
  const colors = [
    "from-purple-400 to-pink-400",
    "from-blue-400 to-purple-400",
    "from-rose-400 to-orange-300",
    "from-teal-400 to-blue-400",
    "from-amber-400 to-rose-400",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function PatientDetailPanel({ patient, onClose }: PatientDetailPanelProps) {
  if (!patient) return null;

  const priority = priorityConfig[patient.priority];
  const status = statusConfig[patient.status];

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto animate-slide-up lg:animate-fade-in">
      {/* Mobile: full screen. Desktop: side panel */}
      <div className="h-full bg-card lg:rounded-2xl lg:border lg:border-border lg:shadow-soft-lg overflow-hidden flex flex-col">
        {/* Hero header — humanized */}
        <div className="patient-hero px-6 pt-6 pb-8 text-primary-foreground">
          <div className="flex items-start justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className={cn(
              "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl font-bold text-white shadow-lg",
              getAvatarColor(patient.name)
            )}>
              {getInitials(patient.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-2xl font-bold leading-tight">{patient.name}</h2>
              <p className="text-primary-foreground/80 mt-1">
                {patient.age} years old
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("status-badge", status.className)}>
                  {status.label}
                </Badge>
                <Badge className="status-badge bg-primary-foreground/20 text-primary-foreground">
                  <span className={cn("priority-dot mr-1.5 inline-block", priority.dotClass)} />
                  {priority.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Story / human context */}
        {patient.story && (
          <div className="px-6 py-4 bg-accent/30 border-b border-border">
            <p className="text-sm text-foreground/80 italic leading-relaxed">
              "{patient.story}"
            </p>
          </div>
        )}

        {/* Pending actions */}
        {patient.pendingActions && patient.pendingActions.length > 0 && (
          <div className="px-6 py-3 bg-accent/20 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-priority-high" />
              <span className="text-sm font-semibold text-foreground">Pending Actions</span>
            </div>
            <ul className="space-y-1">
              {patient.pendingActions.map((action, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tabbed content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="h-full">
            <TabsList className="w-full justify-start px-6 pt-4 bg-transparent border-b border-border rounded-none h-auto gap-0">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="care" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3">
                Care Plan
              </TabsTrigger>
              <TabsTrigger value="family" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3">
                Family
              </TabsTrigger>
              <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3">
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="px-6 py-4 space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={Activity} label="Condition" value={patient.condition} />
                <InfoCard icon={MapPin} label="Address" value={patient.address} />
                <InfoCard icon={Clock} label="Last Visit" value={patient.lastVisit} />
                <InfoCard icon={Calendar} label="Next Visit" value={patient.nextVisit} />
              </div>

              {patient.prognosis && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-1">Prognosis</h4>
                  <p className="text-sm text-muted-foreground">{patient.prognosis}</p>
                </div>
              )}

              {patient.preferences && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Preferences & Comfort</h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.preferences.map((pref, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 bg-secondary rounded-full text-secondary-foreground">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Care Team</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.careTeam.map((member) => (
                    <span key={member} className="text-xs px-3 py-1.5 bg-primary/10 rounded-full text-primary font-medium">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="care" className="px-6 py-4 space-y-4 mt-0">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                Medications
              </h4>
              {patient.medications?.map((med, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-sm">{med.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{med.dose} — {med.schedule}</p>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No medications recorded</p>
              )}
            </TabsContent>

            <TabsContent value="family" className="px-6 py-4 space-y-3 mt-0">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Family Contacts
              </h4>
              {patient.familyContacts?.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.relation}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2 text-primary">
                    <Phone className="h-3.5 w-3.5" />
                    {contact.phone}
                  </Button>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No family contacts on file</p>
              )}
            </TabsContent>

            <TabsContent value="notes" className="px-6 py-4 space-y-3 mt-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Recent Notes
                </h4>
                <Button variant="outline" size="sm">Add Note</Button>
              </div>
              {patient.recentNotes?.map((note, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-primary">{note.author}</span>
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                  </div>
                  <p className="text-sm text-foreground">{note.note}</p>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No notes recorded</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
