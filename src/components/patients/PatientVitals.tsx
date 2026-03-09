import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplet,
  Footprints,
  TrendingUp,
  TrendingDown,
  Minus,
  Watch
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export type DeviceType = "smartwatch" | "blood_pressure" | "pulse_oximeter" | "glucose_monitor" | "weight_scale" | "thermometer" | "ecg_monitor";

export interface VitalReading {
  deviceType: DeviceType;
  readingType: string;
  value: number;
  unit: string;
  isAbnormal?: boolean;
  recordedAt: string;
  trend?: "up" | "down" | "stable";
}

interface PatientVitalsProps {
  vitals: VitalReading[];
  compact?: boolean;
}

const vitalConfig: Record<string, { icon: typeof Heart; label: string; normalRange?: string }> = {
  heart_rate: { icon: Heart, label: "Heart Rate", normalRange: "60-100 bpm" },
  blood_pressure_systolic: { icon: Activity, label: "BP Systolic", normalRange: "90-120 mmHg" },
  blood_pressure_diastolic: { icon: Activity, label: "BP Diastolic", normalRange: "60-80 mmHg" },
  spo2: { icon: Droplet, label: "SpO₂", normalRange: "95-100%" },
  temperature: { icon: Thermometer, label: "Temp", normalRange: "97.8-99.1°F" },
  steps: { icon: Footprints, label: "Steps", normalRange: undefined },
  glucose: { icon: Activity, label: "Glucose", normalRange: "70-140 mg/dL" },
};

function TrendIcon({ trend }: { trend?: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-amber-600" aria-label="Trending up" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-blue-600" aria-label="Trending down" />;
  return <Minus className="h-3 w-3 text-muted-foreground" aria-label="Stable" />;
}

export function PatientVitals({ vitals, compact = false }: PatientVitalsProps) {
  if (!vitals || vitals.length === 0) return null;

  if (compact) {
    // Compact inline view for cards
    const primaryVitals = vitals.slice(0, 3);
    return (
      <TooltipProvider>
        <div className="flex items-center gap-2 flex-wrap" role="list" aria-label="Patient vitals">
          <Watch className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          {primaryVitals.map((vital, idx) => {
            const config = vitalConfig[vital.readingType] || { icon: Activity, label: vital.readingType };
            const Icon = config.icon;
            
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded",
                      vital.isAbnormal 
                        ? "bg-destructive/10 text-destructive font-medium" 
                        : "bg-muted/50 text-muted-foreground"
                    )}
                    role="listitem"
                    aria-label={`${config.label}: ${vital.value} ${vital.unit}${vital.isAbnormal ? ', abnormal' : ''}`}
                  >
                    <Icon className="h-3 w-3" aria-hidden="true" />
                    <span>{vital.value}</span>
                    <span className="text-[10px] opacity-70">{vital.unit}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{config.label}: {vital.value} {vital.unit}</p>
                  {config.normalRange && <p className="text-xs text-muted-foreground">Normal: {config.normalRange}</p>}
                  <p className="text-xs text-muted-foreground">{vital.recordedAt}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    );
  }

  // Full view for detail panels
  return (
    <div className="space-y-2" role="list" aria-label="Patient vitals">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Watch className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Latest readings from connected devices</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {vitals.map((vital, idx) => {
          const config = vitalConfig[vital.readingType] || { icon: Activity, label: vital.readingType };
          const Icon = config.icon;
          
          return (
            <div 
              key={idx}
              className={cn(
                "p-2.5 rounded-lg border",
                vital.isAbnormal 
                  ? "border-destructive/30 bg-destructive/5" 
                  : "border-border bg-muted/30"
              )}
              role="listitem"
              aria-label={`${config.label}: ${vital.value} ${vital.unit}${vital.isAbnormal ? ', abnormal reading' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={cn(
                    "h-3.5 w-3.5",
                    vital.isAbnormal ? "text-destructive" : "text-muted-foreground"
                  )} aria-hidden="true" />
                  <span className="text-[11px] text-muted-foreground">{config.label}</span>
                </div>
                <TrendIcon trend={vital.trend} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-lg font-semibold",
                  vital.isAbnormal && "text-destructive"
                )}>
                  {vital.value}
                </span>
                <span className="text-xs text-muted-foreground">{vital.unit}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{vital.recordedAt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper to get mock vitals for demo purposes
export function getMockVitals(patientName: string): VitalReading[] {
  const vitalsMap: Record<string, VitalReading[]> = {
    "Dorothy Lewis": [
      { deviceType: "pulse_oximeter", readingType: "spo2", value: 91, unit: "%", isAbnormal: true, recordedAt: "10 min ago", trend: "down" },
      { deviceType: "smartwatch", readingType: "heart_rate", value: 88, unit: "bpm", isAbnormal: false, recordedAt: "10 min ago", trend: "stable" },
      { deviceType: "thermometer", readingType: "temperature", value: 99.2, unit: "°F", isAbnormal: true, recordedAt: "1 hour ago", trend: "up" },
    ],
    "Robert Kimball": [
      { deviceType: "blood_pressure", readingType: "blood_pressure_systolic", value: 145, unit: "mmHg", isAbnormal: true, recordedAt: "30 min ago", trend: "up" },
      { deviceType: "blood_pressure", readingType: "blood_pressure_diastolic", value: 92, unit: "mmHg", isAbnormal: true, recordedAt: "30 min ago", trend: "up" },
      { deviceType: "smartwatch", readingType: "heart_rate", value: 72, unit: "bpm", isAbnormal: false, recordedAt: "5 min ago", trend: "stable" },
      { deviceType: "smartwatch", readingType: "steps", value: 1243, unit: "steps", isAbnormal: false, recordedAt: "Today", trend: "stable" },
    ],
    "Eleanor Wright": [
      { deviceType: "smartwatch", readingType: "heart_rate", value: 78, unit: "bpm", isAbnormal: false, recordedAt: "15 min ago", trend: "stable" },
      { deviceType: "pulse_oximeter", readingType: "spo2", value: 97, unit: "%", isAbnormal: false, recordedAt: "15 min ago", trend: "stable" },
    ],
    "Margaret Henderson": [
      { deviceType: "pulse_oximeter", readingType: "spo2", value: 94, unit: "%", isAbnormal: false, recordedAt: "2 hours ago", trend: "stable" },
      { deviceType: "smartwatch", readingType: "heart_rate", value: 68, unit: "bpm", isAbnormal: false, recordedAt: "1 hour ago", trend: "stable" },
      { deviceType: "smartwatch", readingType: "steps", value: 856, unit: "steps", isAbnormal: false, recordedAt: "Today", trend: "up" },
    ],
    "James Mitchell": [
      { deviceType: "glucose_monitor", readingType: "glucose", value: 156, unit: "mg/dL", isAbnormal: true, recordedAt: "45 min ago", trend: "up" },
      { deviceType: "smartwatch", readingType: "heart_rate", value: 65, unit: "bpm", isAbnormal: false, recordedAt: "20 min ago", trend: "stable" },
    ],
  };
  
  return vitalsMap[patientName] || [];
}
