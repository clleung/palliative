import { useState, useMemo } from "react";
import { format, parse, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendingUp, Users, Clock, Bot, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// --- Raw data with parseable dates ---
interface WeekDataBase { week: string; date: string; } // date = "YYYY-MM-DD"

const weeklyVisitData = [
  { week: "Jan 20", date: "2026-01-20", visits: 25, completed: 23, cancelled: 2 },
  { week: "Jan 27", date: "2026-01-27", visits: 27, completed: 25, cancelled: 2 },
  { week: "Feb 3", date: "2026-02-03", visits: 28, completed: 26, cancelled: 2 },
  { week: "Feb 10", date: "2026-02-10", visits: 32, completed: 30, cancelled: 2 },
  { week: "Feb 17", date: "2026-02-17", visits: 30, completed: 28, cancelled: 2 },
  { week: "Feb 24", date: "2026-02-24", visits: 35, completed: 33, cancelled: 2 },
  { week: "Mar 3", date: "2026-03-03", visits: 38, completed: 36, cancelled: 2 },
  { week: "Mar 9", date: "2026-03-09", visits: 34, completed: 31, cancelled: 3 },
];

const patientLoadData = [
  { week: "Jan 20", date: "2026-01-20", active: 18, newAdmissions: 1, discharged: 0 },
  { week: "Jan 27", date: "2026-01-27", active: 19, newAdmissions: 2, discharged: 1 },
  { week: "Feb 3", date: "2026-02-03", active: 20, newAdmissions: 2, discharged: 1 },
  { week: "Feb 10", date: "2026-02-10", active: 21, newAdmissions: 3, discharged: 2 },
  { week: "Feb 17", date: "2026-02-17", active: 22, newAdmissions: 1, discharged: 0 },
  { week: "Feb 24", date: "2026-02-24", active: 23, newAdmissions: 2, discharged: 1 },
  { week: "Mar 3", date: "2026-03-03", active: 24, newAdmissions: 3, discharged: 2 },
  { week: "Mar 9", date: "2026-03-09", active: 24, newAdmissions: 1, discharged: 1 },
];

const hoursData = [
  { week: "Jan 20", date: "2026-01-20", worked: 36, target: 40, overtime: 0 },
  { week: "Jan 27", date: "2026-01-27", worked: 40, target: 40, overtime: 0 },
  { week: "Feb 3", date: "2026-02-03", worked: 38, target: 40, overtime: 0 },
  { week: "Feb 10", date: "2026-02-10", worked: 42, target: 40, overtime: 2 },
  { week: "Feb 17", date: "2026-02-17", worked: 39, target: 40, overtime: 0 },
  { week: "Feb 24", date: "2026-02-24", worked: 44, target: 40, overtime: 4 },
  { week: "Mar 3", date: "2026-03-03", worked: 41, target: 40, overtime: 1 },
  { week: "Mar 9", date: "2026-03-09", worked: 32, target: 40, overtime: 0 },
];

const robotTaskData = [
  { week: "Jan 20", date: "2026-01-20", deliveries: 6, checkIns: 10, vitals: 12, medReminders: 18 },
  { week: "Jan 27", date: "2026-01-27", deliveries: 7, checkIns: 11, vitals: 14, medReminders: 19 },
  { week: "Feb 3", date: "2026-02-03", deliveries: 8, checkIns: 12, vitals: 15, medReminders: 20 },
  { week: "Feb 10", date: "2026-02-10", deliveries: 10, checkIns: 14, vitals: 18, medReminders: 22 },
  { week: "Feb 17", date: "2026-02-17", deliveries: 9, checkIns: 16, vitals: 20, medReminders: 24 },
  { week: "Feb 24", date: "2026-02-24", deliveries: 12, checkIns: 18, vitals: 22, medReminders: 26 },
  { week: "Mar 3", date: "2026-03-03", deliveries: 14, checkIns: 20, vitals: 25, medReminders: 28 },
  { week: "Mar 9", date: "2026-03-09", deliveries: 11, checkIns: 17, vitals: 21, medReminders: 25 },
];

const patientOutcomesData = [
  { week: "Jan 20", date: "2026-01-20", painControlled: 83, satisfactionScore: 91, emergencyCalls: 2 },
  { week: "Jan 27", date: "2026-01-27", painControlled: 84, satisfactionScore: 91, emergencyCalls: 1 },
  { week: "Feb 3", date: "2026-02-03", painControlled: 85, satisfactionScore: 92, emergencyCalls: 1 },
  { week: "Feb 10", date: "2026-02-10", painControlled: 87, satisfactionScore: 90, emergencyCalls: 2 },
  { week: "Feb 17", date: "2026-02-17", painControlled: 82, satisfactionScore: 88, emergencyCalls: 3 },
  { week: "Feb 24", date: "2026-02-24", painControlled: 90, satisfactionScore: 94, emergencyCalls: 0 },
  { week: "Mar 3", date: "2026-03-03", painControlled: 88, satisfactionScore: 91, emergencyCalls: 1 },
  { week: "Mar 9", date: "2026-03-09", painControlled: 91, satisfactionScore: 93, emergencyCalls: 1 },
];

// --- Helpers ---
function filterByDateRange<T extends { date: string }>(
  data: T[],
  from: Date | undefined,
  to: Date | undefined
): T[] {
  if (!from && !to) return data;
  return data.filter((d) => {
    const itemDate = new Date(d.date);
    if (from && to) return isWithinInterval(itemDate, { start: startOfDay(from), end: endOfDay(to) });
    if (from) return itemDate >= startOfDay(from);
    if (to) return itemDate <= endOfDay(to);
    return true;
  });
}

function exportCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast({ title: "Export complete", description: `${filename}.csv downloaded.` });
}

const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(30, 25%, 99%)",
    border: "1px solid hsl(270, 12%, 90%)",
    borderRadius: "0.75rem",
    fontSize: "12px",
  },
};

export function WeeklyTrends() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const filteredVisits = useMemo(() => filterByDateRange(weeklyVisitData, fromDate, toDate), [fromDate, toDate]);
  const filteredPatients = useMemo(() => filterByDateRange(patientLoadData, fromDate, toDate), [fromDate, toDate]);
  const filteredHours = useMemo(() => filterByDateRange(hoursData, fromDate, toDate), [fromDate, toDate]);
  const filteredRobotTasks = useMemo(() => filterByDateRange(robotTaskData, fromDate, toDate), [fromDate, toDate]);
  const filteredOutcomes = useMemo(() => filterByDateRange(patientOutcomesData, fromDate, toDate), [fromDate, toDate]);

  const clearFilters = () => { setFromDate(undefined); setToDate(undefined); };
  const hasFilter = fromDate || toDate;

  return (
    <div className="space-y-4">
      {/* Controls: Date Range + Export */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* From date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("gap-2 text-xs", !fromDate && "text-muted-foreground")}>
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {fromDate ? format(fromDate, "MMM d, yyyy") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <span className="text-xs text-muted-foreground">to</span>

            {/* To date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("gap-2 text-xs", !toDate && "text-muted-foreground")}>
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {toDate ? format(toDate, "MMM d, yyyy") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {hasFilter && (
              <Button variant="ghost" size="sm" className="text-xs" onClick={clearFilters}>
                Clear
              </Button>
            )}

            <div className="flex-1" />

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportCSV(filteredVisits, "visit-volume")}>
                  Visit Volume
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportCSV(filteredPatients, "patient-census")}>
                  Patient Census
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportCSV(filteredHours, "hours-tracking")}>
                  Hours Tracking
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportCSV(filteredRobotTasks, "robot-tasks")}>
                  Robot Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportCSV(filteredOutcomes, "patient-outcomes")}>
                  Patient Outcomes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  exportCSV(filteredVisits, "visit-volume");
                  exportCSV(filteredPatients, "patient-census");
                  exportCSV(filteredHours, "hours-tracking");
                  exportCSV(filteredRobotTasks, "robot-tasks");
                  exportCSV(filteredOutcomes, "patient-outcomes");
                }}>
                  Export All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {hasFilter && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing {filteredVisits.length} of {weeklyVisitData.length} weeks
              {fromDate && ` from ${format(fromDate, "MMM d")}`}
              {toDate && ` to ${format(toDate, "MMM d")}`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
              Visit Volume (Week over Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={filteredVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270,12%,90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="completed" name="Completed" fill="hsl(270,40%,45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" name="Cancelled" fill="hsl(0,55%,55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
              Patient Census
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={filteredPatients}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270,12%,90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="active" name="Active" stroke="hsl(270,40%,45%)" fill="hsl(270,40%,45%)" fillOpacity={0.15} />
                <Area type="monotone" dataKey="newAdmissions" name="New" stroke="hsl(150,50%,40%)" fill="hsl(150,50%,40%)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Hours Worked vs Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={filteredHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270,12%,90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="worked" name="Worked" stroke="hsl(270,40%,45%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="hsl(260,10%,55%)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="overtime" name="Overtime" stroke="hsl(40,80%,50%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
              Robot Task Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={filteredRobotTasks}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270,12%,90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="deliveries" name="Deliveries" fill="hsl(210,70%,50%)" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="checkIns" name="Check-ins" fill="hsl(150,50%,40%)" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="vitals" name="Vitals" fill="hsl(270,40%,45%)" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="medReminders" name="Med Reminders" fill="hsl(40,80%,50%)" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
            Patient Outcomes & Satisfaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={filteredOutcomes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270,12%,90%)" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip {...chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="painControlled" name="Pain Controlled %" stroke="hsl(150,50%,40%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="satisfactionScore" name="Satisfaction %" stroke="hsl(270,40%,45%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="emergencyCalls" name="Emergency Calls" stroke="hsl(0,55%,55%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
