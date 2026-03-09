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
import { TrendingUp, Users, Clock, Bot, Heart } from "lucide-react";

const weeklyVisitData = [
  { week: "Feb 3", visits: 28, completed: 26, cancelled: 2 },
  { week: "Feb 10", visits: 32, completed: 30, cancelled: 2 },
  { week: "Feb 17", visits: 30, completed: 28, cancelled: 2 },
  { week: "Feb 24", visits: 35, completed: 33, cancelled: 2 },
  { week: "Mar 3", visits: 38, completed: 36, cancelled: 2 },
  { week: "Mar 9", visits: 34, completed: 31, cancelled: 3 },
];

const patientLoadData = [
  { week: "Feb 3", active: 20, newAdmissions: 2, discharged: 1 },
  { week: "Feb 10", active: 21, newAdmissions: 3, discharged: 2 },
  { week: "Feb 17", active: 22, newAdmissions: 1, discharged: 0 },
  { week: "Feb 24", active: 23, newAdmissions: 2, discharged: 1 },
  { week: "Mar 3", active: 24, newAdmissions: 3, discharged: 2 },
  { week: "Mar 9", active: 24, newAdmissions: 1, discharged: 1 },
];

const hoursData = [
  { week: "Feb 3", worked: 38, target: 40, overtime: 0 },
  { week: "Feb 10", worked: 42, target: 40, overtime: 2 },
  { week: "Feb 17", worked: 39, target: 40, overtime: 0 },
  { week: "Feb 24", worked: 44, target: 40, overtime: 4 },
  { week: "Mar 3", worked: 41, target: 40, overtime: 1 },
  { week: "Mar 9", worked: 32, target: 40, overtime: 0 },
];

const robotTaskData = [
  { week: "Feb 3", deliveries: 8, checkIns: 12, vitals: 15, medReminders: 20 },
  { week: "Feb 10", deliveries: 10, checkIns: 14, vitals: 18, medReminders: 22 },
  { week: "Feb 17", deliveries: 9, checkIns: 16, vitals: 20, medReminders: 24 },
  { week: "Feb 24", deliveries: 12, checkIns: 18, vitals: 22, medReminders: 26 },
  { week: "Mar 3", deliveries: 14, checkIns: 20, vitals: 25, medReminders: 28 },
  { week: "Mar 9", deliveries: 11, checkIns: 17, vitals: 21, medReminders: 25 },
];

const patientOutcomesData = [
  { week: "Feb 3", painControlled: 85, satisfactionScore: 92, emergencyCalls: 1 },
  { week: "Feb 10", painControlled: 87, satisfactionScore: 90, emergencyCalls: 2 },
  { week: "Feb 17", painControlled: 82, satisfactionScore: 88, emergencyCalls: 3 },
  { week: "Feb 24", painControlled: 90, satisfactionScore: 94, emergencyCalls: 0 },
  { week: "Mar 3", painControlled: 88, satisfactionScore: 91, emergencyCalls: 1 },
  { week: "Mar 9", painControlled: 91, satisfactionScore: 93, emergencyCalls: 1 },
];

const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(30, 25%, 99%)",
    border: "1px solid hsl(270, 12%, 90%)",
    borderRadius: "0.75rem",
    fontSize: "12px",
  },
};

export function WeeklyTrends() {
  return (
    <div className="space-y-4">
      {/* Top row: Visits & Patient Load */}
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
              <BarChart data={weeklyVisitData}>
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
              <AreaChart data={patientLoadData}>
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

      {/* Middle row: Hours & Robot Tasks */}
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
              <LineChart data={hoursData}>
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
              <BarChart data={robotTaskData}>
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

      {/* Bottom row: Patient Outcomes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
            Patient Outcomes & Satisfaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={patientOutcomesData}>
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
