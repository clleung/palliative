import { useState } from "react";
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  MapPin,
  Phone,
  ChevronRight,
  Filter,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";

interface Specialist {
  id: string;
  name: string;
  workerId: string;
  role: string;
  department: string;
  phone: string;
  certifications: string[];
  avatarInitials: string;
  status: "on_shift" | "off_shift" | "on_leave" | "on_call";
  // Time tracking
  hoursThisWeek: number;
  hoursTarget: number;
  overtimeHours: number;
  ptoRemaining: number;
  patientsAssigned: number;
  visitsToday: number;
  visitsCompleted: number;
  avgVisitDuration: number; // minutes
  lastActive: string;
}

const specialists: Specialist[] = [
  {
    id: "1", name: "Sarah Chen", workerId: "CW-10421", role: "Registered Nurse",
    department: "Palliative Care", phone: "(503) 555-0142", certifications: ["RN", "CHPN", "BLS"],
    avatarInitials: "SC", status: "on_shift",
    hoursThisWeek: 32.5, hoursTarget: 40, overtimeHours: 0, ptoRemaining: 14,
    patientsAssigned: 8, visitsToday: 6, visitsCompleted: 4, avgVisitDuration: 45, lastActive: "2 min ago",
  },
  {
    id: "2", name: "Marcus Johnson", workerId: "CW-10389", role: "Certified Nursing Assistant",
    department: "Palliative Care", phone: "(503) 555-0198", certifications: ["CNA", "BLS", "CPR"],
    avatarInitials: "MJ", status: "on_shift",
    hoursThisWeek: 38, hoursTarget: 40, overtimeHours: 2, ptoRemaining: 8,
    patientsAssigned: 12, visitsToday: 8, visitsCompleted: 7, avgVisitDuration: 30, lastActive: "5 min ago",
  },
  {
    id: "3", name: "Emily Rodriguez", workerId: "CW-10455", role: "Care Coordinator",
    department: "Palliative Care", phone: "(503) 555-0167", certifications: ["BSN", "CCM"],
    avatarInitials: "ER", status: "on_call",
    hoursThisWeek: 28, hoursTarget: 40, overtimeHours: 0, ptoRemaining: 18,
    patientsAssigned: 15, visitsToday: 3, visitsCompleted: 3, avgVisitDuration: 60, lastActive: "1 hour ago",
  },
  {
    id: "4", name: "David Park", workerId: "CW-10502", role: "Registered Nurse",
    department: "Hospice", phone: "(503) 555-0211", certifications: ["RN", "CHPN"],
    avatarInitials: "DP", status: "off_shift",
    hoursThisWeek: 40, hoursTarget: 40, overtimeHours: 4.5, ptoRemaining: 6,
    patientsAssigned: 10, visitsToday: 0, visitsCompleted: 0, avgVisitDuration: 50, lastActive: "Yesterday",
  },
  {
    id: "5", name: "Angela Thompson", workerId: "CW-10478", role: "Licensed Practical Nurse",
    department: "Palliative Care", phone: "(503) 555-0233", certifications: ["LPN", "IV Cert", "BLS"],
    avatarInitials: "AT", status: "on_leave",
    hoursThisWeek: 0, hoursTarget: 40, overtimeHours: 0, ptoRemaining: 3,
    patientsAssigned: 0, visitsToday: 0, visitsCompleted: 0, avgVisitDuration: 35, lastActive: "3 days ago",
  },
  {
    id: "6", name: "James Wilson", workerId: "CW-10510", role: "Certified Nursing Assistant",
    department: "Hospice", phone: "(503) 555-0188", certifications: ["CNA", "HHA", "BLS"],
    avatarInitials: "JW", status: "on_shift",
    hoursThisWeek: 35, hoursTarget: 40, overtimeHours: 0, ptoRemaining: 11,
    patientsAssigned: 9, visitsToday: 7, visitsCompleted: 5, avgVisitDuration: 25, lastActive: "Just now",
  },
];

const statusConfig: Record<Specialist["status"], { label: string; className: string }> = {
  on_shift: { label: "On Shift", className: "bg-emerald-100 text-emerald-800" },
  off_shift: { label: "Off Shift", className: "bg-muted text-muted-foreground" },
  on_leave: { label: "On Leave", className: "bg-amber-100 text-amber-800" },
  on_call: { label: "On Call", className: "bg-blue-100 text-blue-800" },
};

export default function AdminSpecialists() {
  const [statusFilter, setStatusFilter] = useState<Specialist["status"] | "all">("all");

  const filtered = specialists.filter(s => statusFilter === "all" || s.status === statusFilter);

  const totalHours = specialists.reduce((sum, s) => sum + s.hoursThisWeek, 0);
  const totalOvertime = specialists.reduce((sum, s) => sum + s.overtimeHours, 0);
  const onShiftCount = specialists.filter(s => s.status === "on_shift").length;
  const totalVisitsToday = specialists.reduce((sum, s) => sum + s.visitsToday, 0);
  const completedVisitsToday = specialists.reduce((sum, s) => sum + s.visitsCompleted, 0);

  return (
    <div className="space-y-6 animate-fade-in" role="main">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
          Specialists Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {specialists.length} specialists · {onShiftCount} currently on shift
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="list" aria-label="Team statistics">
        <Card role="listitem">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onShiftCount}</p>
                <p className="text-xs text-muted-foreground">On Shift</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card role="listitem">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Team Hours (Wk)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card role="listitem">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <TrendingUp className="h-5 w-5 text-amber-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalOvertime.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Overtime Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card role="listitem">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <BarChart3 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedVisitsToday}/{totalVisitsToday}</p>
                <p className="text-xs text-muted-foreground">Visits Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
        {[
          { key: "all" as const, label: "All" },
          { key: "on_shift" as const, label: "On Shift" },
          { key: "on_call" as const, label: "On Call" },
          { key: "off_shift" as const, label: "Off Shift" },
          { key: "on_leave" as const, label: "On Leave" },
        ].map((f) => (
          <Button
            key={f.key}
            variant={statusFilter === f.key ? "default" : "outline"}
            size="sm"
            className="text-xs flex-shrink-0"
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Specialist Cards */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" role="list" aria-label="Specialist list">
        {filtered.map((spec) => {
          const status = statusConfig[spec.status];
          const hoursPercent = Math.min((spec.hoursThisWeek / spec.hoursTarget) * 100, 100);

          return (
            <Card
              key={spec.id}
              className="hover:shadow-soft-lg transition-all"
              role="listitem"
              aria-label={`${abbreviateName(spec.name)}, ${spec.role}`}
            >
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {spec.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{abbreviateName(spec.name)}</h3>
                      <p className="text-xs text-muted-foreground">{spec.workerId} · {spec.role}</p>
                    </div>
                  </div>
                  <Badge className={cn("text-[10px]", status.className)}>{status.label}</Badge>
                </div>

                {/* Time Tracking */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" /> Weekly Hours
                    </span>
                    <span className="font-medium">
                      {spec.hoursThisWeek}h / {spec.hoursTarget}h
                      {spec.overtimeHours > 0 && (
                        <span className="text-amber-600 ml-1">(+{spec.overtimeHours}h OT)</span>
                      )}
                    </span>
                  </div>
                  <Progress value={hoursPercent} className="h-1.5" aria-label={`${hoursPercent.toFixed(0)}% of target hours`} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{spec.patientsAssigned}</p>
                    <p className="text-[10px] text-muted-foreground">Patients</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{spec.visitsCompleted}/{spec.visitsToday}</p>
                    <p className="text-[10px] text-muted-foreground">Visits</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{spec.avgVisitDuration}m</p>
                    <p className="text-[10px] text-muted-foreground">Avg Visit</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Award className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">{spec.certifications.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                    <span>{spec.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      PTO remaining: {spec.ptoRemaining} days
                    </span>
                    <span className="text-[11px]">Active: {spec.lastActive}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
