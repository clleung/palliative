import { Truck, Package, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Delivery {
  id: string;
  patient: string;
  item: string;
  status: "pending" | "in-transit" | "delivered";
  eta?: string;
}

const deliveries: Delivery[] = [
  {
    id: "1",
    patient: "Dorothy L.",
    item: "Oxygen Concentrator",
    status: "in-transit",
    eta: "2:30 PM",
  },
  {
    id: "2",
    patient: "James M.",
    item: "Hospital Bed Rails",
    status: "pending",
    eta: "Tomorrow",
  },
  {
    id: "3",
    patient: "Margaret H.",
    item: "Medication Refill",
    status: "delivered",
  },
];

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "text-amber-600 bg-amber-100",
  },
  "in-transit": {
    icon: Truck,
    label: "In Transit",
    className: "text-blue-600 bg-blue-100",
  },
  delivered: {
    icon: CheckCircle,
    label: "Delivered",
    className: "text-emerald-600 bg-emerald-100",
  },
};

export function DeliveryStatus() {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg font-semibold">Deliveries Today</h2>
        <Package className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {deliveries.map((delivery) => {
          const status = statusConfig[delivery.status];
          const StatusIcon = status.icon;
          
          return (
            <div
              key={delivery.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className={cn(
                "p-2 rounded-lg",
                status.className
              )}>
                <StatusIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{delivery.item}</p>
                <p className="text-xs text-muted-foreground">
                  For {delivery.patient}
                  {delivery.eta && ` • ETA: ${delivery.eta}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
