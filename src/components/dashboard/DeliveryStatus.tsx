import { Truck, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { abbreviateName } from "@/lib/privacy";

interface Delivery {
  id: string;
  patientFullName: string;
  item: string;
  status: "pending" | "in-transit" | "delivered";
  eta?: string;
}

const deliveries: Delivery[] = [
  { id: "1", patientFullName: "Dorothy Lewis", item: "Oxygen Concentrator", status: "in-transit", eta: "2:30 PM" },
  { id: "2", patientFullName: "James Mitchell", item: "Hospital Bed Rails", status: "pending", eta: "Tomorrow" },
  { id: "3", patientFullName: "Margaret Henderson", item: "Medication Refill", status: "delivered" },
];

const statusConfig = {
  pending: { icon: Clock, label: "Pending", className: "text-amber-600 bg-amber-100" },
  "in-transit": { icon: Truck, label: "In Transit", className: "text-blue-600 bg-blue-100" },
  delivered: { icon: CheckCircle, label: "Delivered", className: "text-emerald-600 bg-emerald-100" },
};

export function DeliveryStatus() {
  return (
    <div className="divide-y divide-border">
      {deliveries.map((delivery) => {
        const status = statusConfig[delivery.status];
        const StatusIcon = status.icon;
        return (
          <div key={delivery.id} className="flex items-center gap-3 px-5 py-3">
            <div className={cn("p-1.5 rounded-lg", status.className)}>
              <StatusIcon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{delivery.item}</p>
              <p className="text-xs text-muted-foreground">
                {abbreviateName(delivery.patientFullName)}
                {delivery.eta && ` · ETA: ${delivery.eta}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
