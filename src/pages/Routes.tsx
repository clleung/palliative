import { MapPin, Navigation, Clock, Car, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { abbreviateName } from "@/lib/privacy";
import { RouteMap } from "@/components/map/RouteMap";
import { todayVisits } from "@/data/visits";

export default function Routes() {
  // Only remaining stops for the route
  const remainingStops = todayVisits.filter((v) => v.status !== "completed");
  const totalDrive = remainingStops.reduce((s, r) => s + (r.travelMinFromPrior ?? 0), 0);

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
        {/* Interactive map */}
        <div className="card-elevated overflow-hidden h-[350px] lg:h-[520px]">
          <RouteMap stops={todayVisits} />
        </div>

        {/* Route details */}
        <div className="space-y-4">
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-lg font-semibold">Today's Route</h2>
                <p className="text-sm text-muted-foreground">{remainingStops.length} stops remaining</p>
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
              {todayVisits.map((stop, index) => (
                <div key={stop.id}>
                  {index > 0 && stop.travelMinFromPrior && (
                    <div className="flex items-center gap-2 ml-3 pl-5 py-1 text-[11px] text-muted-foreground border-l-2 border-border">
                      <Car className="h-3 w-3" />
                      {stop.travelMinFromPrior} min drive
                    </div>
                  )}
                  <div
                    className={`relative pl-8 pb-4 ${
                      index < todayVisits.length - 1 ? "border-l-2 border-border ml-3" : "ml-3"
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -translate-x-1/2 ${
                        stop.status === "current"
                          ? "bg-primary text-primary-foreground"
                          : stop.status === "completed"
                          ? "bg-muted text-muted-foreground opacity-50"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className={`bg-muted/50 rounded-lg p-4 ${stop.status === "completed" ? "opacity-50" : ""}`}>
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
                          ~{stop.estimatedMinAtLocation} min visit
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
