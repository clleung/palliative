import { useState } from "react";
import { Truck, Package, Plus, Phone, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";

interface Delivery {
  id: string;
  patientFullName: string;
  items: string[];
  status: "pending" | "confirmed" | "in-transit" | "delivered";
  scheduledDate: string;
  vendor: string;
  notes?: string;
}

const deliveries: Delivery[] = [
  {
    id: "1",
    patientFullName: "Dorothy Lewis",
    items: ["Oxygen Concentrator (5L)", "Backup Portable Tank"],
    status: "in-transit",
    scheduledDate: "Today, 2:30 PM",
    vendor: "MedEquip Solutions",
  },
  {
    id: "2",
    patientFullName: "James Mitchell",
    items: ["Hospital Bed Rails", "Pressure Relief Mattress"],
    status: "confirmed",
    scheduledDate: "Tomorrow, 10:00 AM",
    vendor: "HomeCare Medical",
  },
  {
    id: "3",
    patientFullName: "Robert Kimball",
    items: ["Medication Refill - Pain Management"],
    status: "pending",
    scheduledDate: "March 11, 2026",
    vendor: "PharmaCare",
    notes: "Requires signature from family member",
  },
  {
    id: "4",
    patientFullName: "Margaret Henderson",
    items: ["Nebulizer Supplies"],
    status: "delivered",
    scheduledDate: "Today, 9:00 AM",
    vendor: "MedEquip Solutions",
  },
];

const statusConfig = {
  pending: { icon: Clock, label: "Pending", className: "bg-amber-100 text-amber-700" },
  confirmed: { icon: CheckCircle, label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  "in-transit": { icon: Truck, label: "In Transit", className: "bg-purple-100 text-purple-700" },
  delivered: { icon: CheckCircle, label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
};

export default function Deliveries() {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredDeliveries = filter
    ? deliveries.filter((d) => d.status === filter)
    : deliveries;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
            Deliveries
          </h1>
          <p className="text-muted-foreground mt-1">
            Coordinate equipment and medication deliveries
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Request Delivery
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => setFilter(null)}>
          All ({deliveries.length})
        </Button>
        {Object.entries(statusConfig).map(([key, config]) => (
          <Button key={key} variant={filter === key ? "default" : "outline"} size="sm" onClick={() => setFilter(key)}>
            {config.label} ({deliveries.filter((d) => d.status === key).length})
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredDeliveries.map((delivery, index) => {
          const status = statusConfig[delivery.status];
          const StatusIcon = status.icon;

          return (
            <div key={delivery.id} className="card-elevated p-5" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{abbreviateName(delivery.patientFullName)}</h3>
                    <Badge className={cn("status-badge", status.className)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        {delivery.items.map((item, i) => (
                          <p key={i} className="text-sm">{item}</p>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {delivery.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5" />
                        {delivery.vendor}
                      </span>
                    </div>

                    {delivery.notes && (
                      <div className="flex items-start gap-2 mt-2 p-3 bg-accent/50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-accent-foreground mt-0.5" />
                        <p className="text-sm text-accent-foreground">{delivery.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
