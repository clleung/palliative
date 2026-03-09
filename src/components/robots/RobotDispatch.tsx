import { useState } from "react";
import { 
  Bot, 
  Battery, 
  Send, 
  MapPin, 
  CheckCircle2,
  Clock,
  Navigation,
  Zap,
  ChevronRight,
  Package,
  Heart,
  Bell,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";
import { toast } from "sonner";

type RobotStatus = "idle" | "charging" | "in_transit" | "on_task" | "maintenance" | "offline";
type TaskType = "delivery" | "check_in" | "vitals_collection" | "medication_reminder";

interface Robot {
  id: string;
  robotId: string;
  name: string;
  status: RobotStatus;
  batteryLevel: number;
  currentLocation: string;
  eta?: string;
}

// Mock available robots
const availableRobots: Robot[] = [
  { id: "4", robotId: "HB-004", name: "Pixel", status: "idle", batteryLevel: 100, currentLocation: "Base Station B" },
  { id: "3", robotId: "HB-003", name: "Echo", status: "charging", batteryLevel: 67, currentLocation: "Base Station A" },
  { id: "1", robotId: "HB-001", name: "Atlas", status: "on_task", batteryLevel: 78, currentLocation: "123 Oak St", eta: "15 min" },
  { id: "2", robotId: "HB-002", name: "Nova", status: "in_transit", batteryLevel: 45, currentLocation: "En route", eta: "8 min" },
];

const statusConfig: Record<RobotStatus, { label: string; icon: typeof Bot; className: string; available: boolean }> = {
  idle: { label: "Available", icon: Bot, className: "bg-emerald-100 text-emerald-800", available: true },
  charging: { label: "Charging", icon: Zap, className: "bg-amber-100 text-amber-800", available: true },
  in_transit: { label: "In Transit", icon: Navigation, className: "bg-blue-100 text-blue-800", available: false },
  on_task: { label: "On Task", icon: CheckCircle2, className: "bg-primary/20 text-primary", available: false },
  maintenance: { label: "Maintenance", icon: Bot, className: "bg-muted text-muted-foreground", available: false },
  offline: { label: "Offline", icon: Bot, className: "bg-destructive/10 text-destructive", available: false },
};

const taskTypes: { value: TaskType; label: string; icon: typeof Package; description: string }[] = [
  { value: "check_in", label: "Welfare Check", icon: Heart, description: "Check on patient wellbeing" },
  { value: "vitals_collection", label: "Collect Vitals", icon: Heart, description: "Collect BP, SpO2, temperature" },
  { value: "delivery", label: "Delivery", icon: Package, description: "Deliver supplies or medication" },
  { value: "medication_reminder", label: "Med Reminder", icon: Bell, description: "Remind patient to take medication" },
];

interface RobotDispatchProps {
  patientName?: string;
  patientId?: string;
  compact?: boolean;
}

export function RobotDispatch({ patientName, patientId, compact = false }: RobotDispatchProps) {
  const [open, setOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<TaskType | "">("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatchableRobots = availableRobots.filter(r => statusConfig[r.status].available && r.batteryLevel > 20);

  const handleDispatch = async () => {
    if (!selectedRobot || !selectedTask) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const robot = availableRobots.find(r => r.id === selectedRobot);
    toast.success(`${robot?.name} dispatched`, {
      description: patientName 
        ? `Robot en route to ${abbreviateName(patientName)} for ${taskTypes.find(t => t.value === selectedTask)?.label.toLowerCase()}`
        : `Task created successfully`,
    });
    
    setIsSubmitting(false);
    setOpen(false);
    setSelectedRobot("");
    setSelectedTask("");
    setNotes("");
  };

  if (compact) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Bot className="h-4 w-4" aria-hidden="true" />
            Send Robot
          </Button>
        </DialogTrigger>
        <DispatchDialogContent
          patientName={patientName}
          dispatchableRobots={dispatchableRobots}
          selectedRobot={selectedRobot}
          setSelectedRobot={setSelectedRobot}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          notes={notes}
          setNotes={setNotes}
          isSubmitting={isSubmitting}
          handleDispatch={handleDispatch}
        />
      </Dialog>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quick robot status overview */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
          Robot Fleet
        </h3>
        <Badge variant="outline" className="text-xs">
          {dispatchableRobots.length} available
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2" role="list" aria-label="Available robots">
        {availableRobots.slice(0, 4).map((robot) => {
          const status = statusConfig[robot.status];
          const StatusIcon = status.icon;
          const isAvailable = status.available && robot.batteryLevel > 20;

          return (
            <div
              key={robot.id}
              className={cn(
                "p-2.5 rounded-lg border transition-colors",
                isAvailable ? "bg-card border-border" : "bg-muted/30 border-transparent opacity-60"
              )}
              role="listitem"
              aria-label={`${robot.name}, ${status.label}, battery ${robot.batteryLevel}%`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn("p-1 rounded", status.className)}>
                  <StatusIcon className="h-3 w-3" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium truncate">{robot.name}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Battery className="h-3 w-3" aria-hidden="true" />
                <span>{robot.batteryLevel}%</span>
                {robot.eta && (
                  <>
                    <span className="mx-1">·</span>
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span>{robot.eta}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full gap-2" disabled={dispatchableRobots.length === 0}>
            <Send className="h-4 w-4" aria-hidden="true" />
            Dispatch Robot {patientName && `to ${abbreviateName(patientName)}`}
          </Button>
        </DialogTrigger>
        <DispatchDialogContent
          patientName={patientName}
          dispatchableRobots={dispatchableRobots}
          selectedRobot={selectedRobot}
          setSelectedRobot={setSelectedRobot}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          notes={notes}
          setNotes={setNotes}
          isSubmitting={isSubmitting}
          handleDispatch={handleDispatch}
        />
      </Dialog>
    </div>
  );
}

function DispatchDialogContent({
  patientName,
  dispatchableRobots,
  selectedRobot,
  setSelectedRobot,
  selectedTask,
  setSelectedTask,
  notes,
  setNotes,
  isSubmitting,
  handleDispatch,
}: {
  patientName?: string;
  dispatchableRobots: Robot[];
  selectedRobot: string;
  setSelectedRobot: (value: string) => void;
  selectedTask: TaskType | "";
  setSelectedTask: (value: TaskType | "") => void;
  notes: string;
  setNotes: (value: string) => void;
  isSubmitting: boolean;
  handleDispatch: () => void;
}) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" aria-hidden="true" />
          Dispatch Robot
        </DialogTitle>
        <DialogDescription>
          {patientName 
            ? `Send a robot to ${patientName} for care assistance.`
            : "Select a patient and task for the robot."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        {/* Robot selection */}
        <div className="space-y-2">
          <Label>Select Robot</Label>
          <div className="grid grid-cols-2 gap-2">
            {dispatchableRobots.map((robot) => {
              const status = statusConfig[robot.status];
              const isSelected = selectedRobot === robot.id;

              return (
                <button
                  key={robot.id}
                  onClick={() => setSelectedRobot(robot.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{robot.name}</span>
                    <Badge className={cn("text-[10px]", status.className)}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Battery className="h-3 w-3" aria-hidden="true" />
                    <span>{robot.batteryLevel}%</span>
                    <span>·</span>
                    <span className="truncate">{robot.currentLocation}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Task type selection */}
        <div className="space-y-2">
          <Label>Task Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {taskTypes.map((task) => {
              const isSelected = selectedTask === task.value;
              const TaskIcon = task.icon;

              return (
                <button
                  key={task.value}
                  onClick={() => setSelectedTask(task.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TaskIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-medium text-sm">{task.label}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{task.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="dispatch-notes">Notes (optional)</Label>
          <Textarea
            id="dispatch-notes"
            placeholder="Add any special instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-20 resize-none"
          />
        </div>

        {/* Submit */}
        <Button 
          className="w-full gap-2" 
          onClick={handleDispatch}
          disabled={!selectedRobot || !selectedTask || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Dispatching...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Dispatch Robot
            </>
          )}
        </Button>
      </div>
    </DialogContent>
  );
}

// Compact widget for dashboard
export function RobotFleetWidget() {
  const activeRobots = availableRobots.filter(r => r.status === "on_task" || r.status === "in_transit");
  const availableCount = availableRobots.filter(r => statusConfig[r.status].available && r.batteryLevel > 20).length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
            Robot Fleet
          </h3>
          <Badge variant="outline" className="text-xs">
            {availableCount} ready
          </Badge>
        </div>

        {activeRobots.length > 0 ? (
          <div className="space-y-2 mb-3" role="list" aria-label="Active robots">
            {activeRobots.map((robot) => {
              const status = statusConfig[robot.status];
              const StatusIcon = status.icon;

              return (
                <div 
                  key={robot.id} 
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  role="listitem"
                >
                  <div className={cn("p-1.5 rounded", status.className)}>
                    <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{robot.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {robot.currentLocation}
                    </p>
                  </div>
                  {robot.eta && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {robot.eta}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mb-3">No robots currently active</p>
        )}

        <RobotDispatch compact />
      </CardContent>
    </Card>
  );
}
