import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DeliveryStatus } from "@/components/dashboard/DeliveryStatus";
import { PriorityAlerts } from "@/components/dashboard/PriorityAlerts";

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
          {greeting}, Sarah
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your care schedule for today
        </p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Priority alerts — mobile shows first */}
      <div className="lg:hidden">
        <PriorityAlerts />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule - takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <TodaySchedule />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Priority alerts — desktop in sidebar */}
          <div className="hidden lg:block">
            <PriorityAlerts />
          </div>
          <QuickActions />
          <DeliveryStatus />
        </div>
      </div>
    </div>
  );
}
