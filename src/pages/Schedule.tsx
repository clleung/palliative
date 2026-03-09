import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Schedule() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
            Schedule
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your weekly appointments
          </p>
        </div>
        <Button className="gap-2">
          <Calendar className="h-4 w-4" />
          Add Visit
        </Button>
      </div>

      {/* Week navigation */}
      <div className="card-elevated p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold">March 9 - 15, 2026</h2>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar placeholder */}
      <div className="card-elevated p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">Weekly Calendar View</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Full calendar integration with drag-and-drop scheduling, recurring visits, and team coordination
          </p>
        </div>
      </div>
    </div>
  );
}
