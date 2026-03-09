import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, FileText, Clock, Trash2, Download, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: React.ElementType;
  category: "display" | "data" | "compliance";
}

const defaultSettings: PrivacySetting[] = [
  {
    id: "name-abbreviation",
    label: "Abbreviated Names",
    description: "Display patient names as initials (e.g., E.WRI) in list views for privacy",
    enabled: true,
    icon: EyeOff,
    category: "display",
  },
  {
    id: "auto-lock",
    label: "Auto-Lock Screen",
    description: "Lock app after 2 minutes of inactivity",
    enabled: true,
    icon: Lock,
    category: "data",
  },
  {
    id: "audit-logging",
    label: "Access Audit Logging",
    description: "Log every patient record access with timestamp and user",
    enabled: true,
    icon: FileText,
    category: "compliance",
  },
  {
    id: "session-timeout",
    label: "Session Timeout",
    description: "End session after 30 minutes without interaction",
    enabled: true,
    icon: Clock,
    category: "data",
  },
  {
    id: "location-masking",
    label: "Location Masking",
    description: "Show city/ZIP only — hide full street addresses in overviews",
    enabled: true,
    icon: Eye,
    category: "display",
  },
  {
    id: "data-retention",
    label: "Auto-Archive Closed Records",
    description: "Move completed patient records to encrypted archive after 90 days",
    enabled: false,
    icon: Trash2,
    category: "compliance",
  },
];

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);

  const toggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const categories = [
    { key: "display" as const, label: "Display & Privacy", description: "How information appears on screen" },
    { key: "data" as const, label: "Data Security", description: "Device and session protection" },
    { key: "compliance" as const, label: "Compliance & Retention", description: "HIPAA and GDPR requirements" },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
          Privacy & Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage data privacy, display preferences, and compliance
        </p>
      </div>

      {/* Compliance banner */}
      <div className="card-elevated p-4 flex items-center gap-3 border-primary/20">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">HIPAA & GDPR Compliant</p>
          <p className="text-xs text-muted-foreground">
            All data is encrypted at rest and in transit. Access is logged and auditable.
          </p>
        </div>
        <Badge className="status-badge bg-emerald-100 text-emerald-700">Active</Badge>
      </div>

      {/* Settings by category */}
      {categories.map((cat) => (
        <div key={cat.key} className="space-y-3">
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">{cat.label}</h2>
            <p className="text-xs text-muted-foreground">{cat.description}</p>
          </div>
          <div className="space-y-2">
            {settings
              .filter((s) => s.category === cat.key)
              .map((setting) => {
                const Icon = setting.icon;
                return (
                  <div
                    key={setting.id}
                    className="card-elevated p-4 flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() => toggle(setting.id)}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Data export */}
      <div className="card-elevated p-5 space-y-3">
        <h2 className="font-serif text-lg font-semibold text-foreground">Data Management</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="gap-2 flex-1">
            <Download className="h-4 w-4" />
            Export Audit Log
          </Button>
          <Button variant="outline" className="gap-2 flex-1">
            <FileText className="h-4 w-4" />
            Compliance Report
          </Button>
        </div>
      </div>
    </div>
  );
}
