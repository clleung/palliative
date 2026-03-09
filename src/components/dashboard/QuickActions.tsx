import { 
  Plus, 
  Navigation, 
  FileText, 
  Phone, 
  Truck,
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    label: "Start Navigation",
    icon: Navigation,
    variant: "default" as const,
    description: "Open route to next patient",
  },
  {
    label: "New Visit Note",
    icon: FileText,
    variant: "outline" as const,
    description: "Document a visit",
  },
  {
    label: "Request Delivery",
    icon: Truck,
    variant: "outline" as const,
    description: "Oxygen, equipment, meds",
  },
  {
    label: "Report Concern",
    icon: AlertCircle,
    variant: "outline" as const,
    description: "Flag for review",
  },
];

export function QuickActions() {
  return (
    <div className="card-elevated p-5">
      <h2 className="font-serif text-lg font-semibold mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto py-4 flex-col gap-2"
          >
            <action.icon className="h-5 w-5" />
            <div className="text-center">
              <div className="font-medium text-sm">{action.label}</div>
              <div className="text-xs opacity-70 font-normal mt-0.5">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
