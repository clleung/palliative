import { useState } from "react";
import { 
  Bot, 
  Battery, 
  MapPin, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Wrench,
  Navigation,
  Package,
  Heart,
  Bell,
  Zap,
  ChevronRight,
  Filter,
  Map
} from "lucide-react";
import { RobotLocationMap } from "@/components/robots/RobotLocationMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";

type RobotStatus = "idle" | "charging" | "in_transit" | "on_task" | "maintenance" | "offline";
type TaskType = "delivery" | "check_in" | "vitals_collection" | "medication_reminder" | "emergency_response";
type TaskStatus = "pending" | "assigned" | "in_progress" | "completed" | "failed" | "cancelled";

interface Robot {
  id: string;
  robotId: string;
  name: string;
  model: string;
  status: RobotStatus;
  batteryLevel: number;
  currentLocation: string;
  assignedPatient?: string;
  lastSeenAt: string;
}

interface RobotTask {
  id: string;
  robotId?: string;
  robotName?: string;
  patientName: string;
  taskType: TaskType;
  status: TaskStatus;
  priority: number;
  description: string;
  scheduledAt: string;
}

// Mock data
const robots: Robot[] = [
  { id: "1", robotId: "HB-001", name: "Atlas", model: "HomeBot X1", status: "on_task", batteryLevel: 78, currentLocation: "123 Oak St, Portland", assignedPatient: "Margaret Henderson", lastSeenAt: "2 min ago" },
  { id: "2", robotId: "HB-002", name: "Nova", model: "HomeBot X1", status: "in_transit", batteryLevel: 45, currentLocation: "En route to 456 Elm Ave", assignedPatient: "Robert Kimball", lastSeenAt: "1 min ago" },
  { id: "3", robotId: "HB-003", name: "Echo", model: "HomeBot X2", status: "charging", batteryLevel: 23, currentLocation: "Base Station A", lastSeenAt: "5 min ago" },
  { id: "4", robotId: "HB-004", name: "Pixel", model: "HomeBot X1", status: "idle", batteryLevel: 100, currentLocation: "Base Station B", lastSeenAt: "Just now" },
  { id: "5", robotId: "HB-005", name: "Spark", model: "HomeBot X2", status: "maintenance", batteryLevel: 65, currentLocation: "Service Center", lastSeenAt: "1 hour ago" },
  { id: "6", robotId: "HB-006", name: "Bolt", model: "HomeBot X1", status: "offline", batteryLevel: 0, currentLocation: "Unknown", lastSeenAt: "3 hours ago" },
];

const tasks: RobotTask[] = [
  { id: "1", robotId: "1", robotName: "Atlas", patientName: "Margaret Henderson", taskType: "vitals_collection", status: "in_progress", priority: 2, description: "Collect morning vitals - BP, SpO2, temperature", scheduledAt: "9:00 AM" },
  { id: "2", robotId: "2", robotName: "Nova", patientName: "Robert Kimball", taskType: "delivery", status: "in_progress", priority: 1, description: "Deliver medication refill - urgent heart meds", scheduledAt: "9:30 AM" },
  { id: "3", patientName: "Dorothy Lewis", taskType: "check_in", status: "pending", priority: 1, description: "Welfare check - family requested", scheduledAt: "10:00 AM" },
  { id: "4", patientName: "Eleanor Wright", taskType: "medication_reminder", status: "pending", priority: 2, description: "Pain medication reminder", scheduledAt: "10:30 AM" },
  { id: "5", robotId: "1", robotName: "Atlas", patientName: "James Mitchell", taskType: "delivery", status: "assigned", priority: 3, description: "Deliver hospital bed rails", scheduledAt: "11:00 AM" },
  { id: "6", robotId: "4", robotName: "Pixel", patientName: "Margaret Henderson", taskType: "check_in", status: "completed", priority: 2, description: "Evening check-in completed", scheduledAt: "Yesterday" },
];

const statusConfig: Record<RobotStatus, { label: string; icon: typeof Bot; className: string }> = {
  idle: { label: "Idle", icon: Bot, className: "bg-muted text-muted-foreground" },
  charging: { label: "Charging", icon: Zap, className: "bg-amber-100 text-amber-800" },
  in_transit: { label: "In Transit", icon: Navigation, className: "bg-blue-100 text-blue-800" },
  on_task: { label: "On Task", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-800" },
  maintenance: { label: "Maintenance", icon: Wrench, className: "bg-orange-100 text-orange-800" },
  offline: { label: "Offline", icon: AlertTriangle, className: "bg-destructive/10 text-destructive" },
};

const taskTypeConfig: Record<TaskType, { label: string; icon: typeof Package }> = {
  delivery: { label: "Delivery", icon: Package },
  check_in: { label: "Check-in", icon: Heart },
  vitals_collection: { label: "Vitals", icon: Heart },
  medication_reminder: { label: "Med Reminder", icon: Bell },
  emergency_response: { label: "Emergency", icon: AlertTriangle },
};

const taskStatusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  assigned: { label: "Assigned", className: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress", className: "bg-primary/20 text-primary" },
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-800" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
};

function getBatteryColor(level: number): string {
  if (level > 60) return "bg-emerald-500";
  if (level > 30) return "bg-amber-500";
  return "bg-destructive";
}

export default function RobotFleet() {
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "all">("all");

  const activeRobots = robots.filter(r => r.status !== "offline" && r.status !== "maintenance").length;
  const totalTasks = tasks.filter(t => t.status === "pending" || t.status === "in_progress").length;

  const filteredTasks = tasks.filter(t => taskFilter === "all" || t.status === taskFilter);

  return (
    <div className="space-y-6 animate-fade-in" role="main">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
            Robot Fleet
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {activeRobots} of {robots.length} robots active · {totalTasks} tasks in queue
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="list" aria-label="Fleet statistics">
        <Card role="listitem">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Bot className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeRobots}</p>
                <p className="text-xs text-muted-foreground">Active Robots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card role="listitem">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Navigation className="h-5 w-5 text-blue-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{robots.filter(r => r.status === "in_transit").length}</p>
                <p className="text-xs text-muted-foreground">In Transit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card role="listitem">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === "pending").length}</p>
                <p className="text-xs text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card role="listitem">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{robots.filter(r => r.status === "offline" || r.status === "maintenance").length}</p>
                <p className="text-xs text-muted-foreground">Need Attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="robots" className="space-y-4">
        <TabsList>
          <TabsTrigger value="robots">Robots ({robots.length})</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="robots" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" role="list" aria-label="Robot list">
            {robots.map((robot) => {
              const status = statusConfig[robot.status];
              const StatusIcon = status.icon;

              return (
                <Card 
                  key={robot.id} 
                  className={cn(
                    "cursor-pointer hover:shadow-soft-lg transition-all",
                    selectedRobot?.id === robot.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedRobot(robot)}
                  role="listitem"
                  aria-label={`Robot ${robot.name}, ${status.label}, battery ${robot.batteryLevel}%`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", status.className)}>
                          <StatusIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{robot.name}</h3>
                          <p className="text-xs text-muted-foreground">{robot.robotId} · {robot.model}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-[10px]", status.className)}>{status.label}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Battery className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                        <Progress 
                          value={robot.batteryLevel} 
                          className="h-2 flex-1" 
                          aria-label={`Battery level ${robot.batteryLevel}%`}
                        />
                        <span className="text-xs font-medium w-10 text-right">{robot.batteryLevel}%</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{robot.currentLocation}</span>
                      </div>

                      {robot.assignedPatient && (
                        <div className="flex items-center gap-2 text-xs">
                          <Heart className="h-3.5 w-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                          <span className="font-medium">{abbreviateName(robot.assignedPatient)}</span>
                        </div>
                      )}

                      <p className="text-[11px] text-muted-foreground">
                        Last seen: {robot.lastSeenAt}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-3">
          {/* Task filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            {[
              { key: "all" as const, label: "All" },
              { key: "pending" as const, label: "Pending" },
              { key: "in_progress" as const, label: "In Progress" },
              { key: "completed" as const, label: "Completed" },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={taskFilter === filter.key ? "default" : "outline"}
                size="sm"
                className="text-xs flex-shrink-0"
                onClick={() => setTaskFilter(filter.key)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2" role="list" aria-label="Robot tasks">
            {filteredTasks.map((task) => {
              const typeConfig = taskTypeConfig[task.taskType];
              const statusCfg = taskStatusConfig[task.status];
              const TaskIcon = typeConfig.icon;

              return (
                <Card 
                  key={task.id} 
                  className="hover:shadow-soft transition-all"
                  role="listitem"
                  aria-label={`${typeConfig.label} for ${abbreviateName(task.patientName)}, ${statusCfg.label}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        task.priority === 1 ? "bg-destructive/10 text-destructive" : "bg-muted"
                      )}>
                        <TaskIcon className="h-4 w-4" aria-hidden="true" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{typeConfig.label}</h3>
                          <Badge className={cn("text-[10px]", statusCfg.className)}>
                            {statusCfg.label}
                          </Badge>
                          {task.priority === 1 && (
                            <Badge className="text-[10px] bg-destructive/10 text-destructive">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{task.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" aria-hidden="true" />
                            {abbreviateName(task.patientName)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {task.scheduledAt}
                          </span>
                          {task.robotName && (
                            <span className="flex items-center gap-1">
                              <Bot className="h-3 w-3" aria-hidden="true" />
                              {task.robotName}
                            </span>
                          )}
                        </div>
                      </div>

                      {!task.robotId && task.status === "pending" && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Assign Robot
                        </Button>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
