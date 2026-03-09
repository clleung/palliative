import { 
  Eye, 
  EyeOff, 
  Ear, 
  EarOff, 
  Accessibility, 
  Brain, 
  MessageCircleOff,
  Heart,
  Pill,
  AlertTriangle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type DisabilityType = "visual" | "hearing" | "mobility" | "cognitive" | "speech";
export type MedicationCategory = "cardiac" | "narcotic" | "anticoagulant" | "insulin" | "immunosuppressant";

export interface PatientCondition {
  conditionType: string;
  disabilityType?: DisabilityType;
  isHighRiskMedication?: boolean;
  medicationCategory?: MedicationCategory;
  notes?: string;
}

interface PatientConditionIconsProps {
  conditions: PatientCondition[];
  size?: "sm" | "md";
  showLabels?: boolean;
}

const disabilityConfig: Record<DisabilityType, { icon: typeof Eye; label: string; className: string }> = {
  visual: { 
    icon: EyeOff, 
    label: "Visual impairment", 
    className: "text-purple-700 bg-purple-100" 
  },
  hearing: { 
    icon: EarOff, 
    label: "Hearing impairment", 
    className: "text-blue-700 bg-blue-100" 
  },
  mobility: { 
    icon: Accessibility, 
    label: "Mobility impairment", 
    className: "text-orange-700 bg-orange-100" 
  },
  cognitive: { 
    icon: Brain, 
    label: "Cognitive impairment", 
    className: "text-teal-700 bg-teal-100" 
  },
  speech: { 
    icon: MessageCircleOff, 
    label: "Speech impairment", 
    className: "text-indigo-700 bg-indigo-100" 
  },
};

const medicationConfig: Record<MedicationCategory, { icon: typeof Pill; label: string; className: string }> = {
  cardiac: { 
    icon: Heart, 
    label: "Cardiac medications (high-risk)", 
    className: "text-red-700 bg-red-100" 
  },
  narcotic: { 
    icon: AlertTriangle, 
    label: "Controlled substances", 
    className: "text-amber-700 bg-amber-100" 
  },
  anticoagulant: { 
    icon: Pill, 
    label: "Blood thinners (high-risk)", 
    className: "text-rose-700 bg-rose-100" 
  },
  insulin: { 
    icon: Pill, 
    label: "Insulin therapy", 
    className: "text-cyan-700 bg-cyan-100" 
  },
  immunosuppressant: { 
    icon: Pill, 
    label: "Immunosuppressants", 
    className: "text-violet-700 bg-violet-100" 
  },
};

export function PatientConditionIcons({ 
  conditions, 
  size = "sm",
  showLabels = false 
}: PatientConditionIconsProps) {
  if (!conditions || conditions.length === 0) return null;

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const containerSize = size === "sm" ? "p-1" : "p-1.5";

  const disabilities = conditions.filter(c => c.disabilityType);
  const medications = conditions.filter(c => c.isHighRiskMedication && c.medicationCategory);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1" role="list" aria-label="Patient conditions and alerts">
        {disabilities.map((condition, idx) => {
          const config = disabilityConfig[condition.disabilityType!];
          const Icon = config.icon;
          
          return (
            <Tooltip key={`disability-${idx}`}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "rounded-md flex items-center justify-center",
                    containerSize,
                    config.className
                  )}
                  role="listitem"
                  aria-label={config.label}
                >
                  <Icon className={iconSize} aria-hidden="true" />
                  {showLabels && (
                    <span className="ml-1 text-[10px] font-medium">{config.label.split(' ')[0]}</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{config.label}</p>
                {condition.notes && <p className="text-xs text-muted-foreground">{condition.notes}</p>}
              </TooltipContent>
            </Tooltip>
          );
        })}

        {medications.map((condition, idx) => {
          const config = medicationConfig[condition.medicationCategory!];
          const Icon = config.icon;
          
          return (
            <Tooltip key={`med-${idx}`}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "rounded-md flex items-center justify-center",
                    containerSize,
                    config.className
                  )}
                  role="listitem"
                  aria-label={config.label}
                >
                  <Icon className={iconSize} aria-hidden="true" />
                  {showLabels && (
                    <span className="ml-1 text-[10px] font-medium">{condition.medicationCategory}</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{config.label}</p>
                {condition.notes && <p className="text-xs text-muted-foreground">{condition.notes}</p>}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

// Helper to get mock conditions for demo purposes
export function getMockConditions(patientName: string): PatientCondition[] {
  const conditionsMap: Record<string, PatientCondition[]> = {
    "Dorothy Lewis": [
      { conditionType: "disability", disabilityType: "mobility", notes: "Uses wheelchair" },
      { conditionType: "medication", isHighRiskMedication: true, medicationCategory: "narcotic", notes: "Morphine for pain management" },
    ],
    "Robert Kimball": [
      { conditionType: "disability", disabilityType: "hearing", notes: "Hard of hearing - speak clearly" },
      { conditionType: "medication", isHighRiskMedication: true, medicationCategory: "cardiac", notes: "Multiple cardiac medications" },
    ],
    "Eleanor Wright": [
      { conditionType: "medication", isHighRiskMedication: true, medicationCategory: "narcotic", notes: "Oxycodone for cancer pain" },
    ],
    "Margaret Henderson": [
      { conditionType: "disability", disabilityType: "visual", notes: "Low vision - large print materials" },
    ],
    "James Mitchell": [
      { conditionType: "disability", disabilityType: "cognitive", notes: "Early-stage dementia" },
      { conditionType: "medication", isHighRiskMedication: true, medicationCategory: "anticoagulant", notes: "On blood thinners" },
    ],
  };
  
  return conditionsMap[patientName] || [];
}
