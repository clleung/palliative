import { MapPin, Navigation, Clock, Car, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { abbreviateName } from "@/lib/privacy";

const routeStops = [
  {
    id: "1",
    time: "11:00 AM",
    patientFullName: "Eleanor Wright",
    city: "Beaverton",
    zip: "97006",
    duration: "45 min",
    status: "current",
    travelMinFromPrior: 22,
  },
  {
    id: "2",
    time: "1:30 PM",
    patientFullName: "James Mitchell",
    city: "Tigard",
    zip: "97223",
    duration: "30 min",
    status: "upcoming",
    travelMinFromPrior: 15,
  },
  {
    id: "3",
    time: "3:00 PM",
    patientFullName: "Dorothy Lewis",
    city: "Lake Oswego",
    zip: "97034",
    duration: "60 min",
    status: "upcoming",
    travelMinFromPrior: 18,
  },
];

export default function Routes() {
  const totalDrive = routeStops.reduce((s, r) => s + r.travelMinFromPrior, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
          Route Planning
        </h1>
        <p className="text-muted-foreground mt-1">
          Optimize your visits for today
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map placeholder */}
        <div className="card-elevated aspect-square lg:aspect-auto lg:h-[500px] flex items-center justify-center bg-muted/30">
          <div className="text-center p-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">Interactive Map</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Map integration would display optimized route between patient locations
            </p>
          </div>
        </div>

        {/* Route details */}
        <div className="space-y-4">
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-lg font-semibold">Today's Route</h2>
                <p className="text-sm text-muted-foreground">{routeStops.length} stops remaining</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-4 w-4" />
                <span>~{totalDrive} min total drive</span>
              </div>
            </div>

            <Button className="w-full gap-2 mb-6">
              <Navigation className="h-4 w-4" />
              Start Navigation
            </Button>

            <div className="space-y-4">
              {routeStops.map((stop, index) => (
                <div key={stop.id}>
                  {/* Travel segment */}
                  {index > 0 && (
                    <div className="flex items-center gap-2 ml-3 pl-5 py-1 text-[11px] text-muted-foreground border-l-2 border-border">
                      <Car className="h-3 w-3" />
                      {stop.travelMinFromPrior} min drive
                    </div>
                  )}
                  <div
                    className={`relative pl-8 pb-4 ${
                      index < routeStops.length - 1 ? "border-l-2 border-border ml-3" : "ml-3"
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -translate-x-1/2 ${
                        stop.status === "current"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm">{abbreviateName(stop.patientFullName)}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {stop.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {stop.city}, {stop.zip}
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          ~{stop.duration} visit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
