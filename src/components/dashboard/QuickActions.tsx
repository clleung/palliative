import { useState } from "react";
import { 
  Navigation, 
  FileText, 
  Truck,
  AlertCircle,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RobotDispatch } from "@/components/robots/RobotDispatch";

const actions = [
  {
    label: "Start Navigation",
    icon: Navigation,
    variant: "default" as const,
    description: "Open route to next patient",
    action: "navigate",
  },
  {
    label: "New Visit Note",
    icon: FileText,
    variant: "outline" as const,
    description: "Document a visit",
    action: "note",
  },
  {
    label: "Send Robot",
    icon: Bot,
    variant: "outline" as const,
    description: "Dispatch robot to patient",
    action: "robot",
  },
  {
    label: "Report Concern",
    icon: AlertCircle,
    variant: "outline" as const,
    description: "Flag for review",
    action: "concern",
  },
];

export function QuickActions() {
  return (
    <div className="card-elevated p-5" role="region" aria-labelledby="quick-actions-heading">
      <h2 id="quick-actions-heading" className="font-serif text-lg font-semibold mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Quick action buttons">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto py-4 flex-col gap-2"
            aria-label={`${action.label}: ${action.description}`}
          >
            <action.icon className="h-5 w-5" aria-hidden="true" />
            <div className="text-center">
              <div className="font-medium text-sm">{action.label}</div>
              <div className="text-xs opacity-70 font-normal mt-0.5" aria-hidden="true">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
