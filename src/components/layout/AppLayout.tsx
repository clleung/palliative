import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  Heart,
  Shield,
  Menu,
  X,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WellnessCheckIn } from "@/components/wellness/WellnessCheckIn";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Route Planning", href: "/routes", icon: MapPin },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Staff Hours", href: "/hours", icon: Clock },
  { name: "Deliveries", href: "/deliveries", icon: Truck },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wellnessOpen, setWellnessOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-serif text-lg font-semibold text-foreground">
            CareCompass
          </h1>
          <Button variant="ghost" size="icon" onClick={() => setWellnessOpen(true)}>
            <Heart className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold text-sidebar-foreground">
                  CareCompass
                </h1>
                <p className="text-xs text-muted-foreground">Palliative Care</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Wellness check-in button */}
          <div className="px-4 py-4 border-t border-sidebar-border">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-accent/50 border-accent hover:bg-accent"
              onClick={() => setWellnessOpen(true)}
            >
              <Heart className="h-5 w-5 text-accent-foreground" />
              <span className="text-accent-foreground">Wellness Check-in</span>
            </Button>
          </div>

          {/* Privacy indicator */}
          <div className="px-6 py-4 border-t border-sidebar-border">
            <div className="privacy-indicator">
              <Shield className="h-3.5 w-3.5" />
              <span>HIPAA & GDPR Compliant</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setWellnessOpen(true)}
            >
              <Heart className="h-4 w-4 text-primary" />
              Check-in
            </Button>
          </div>
        </div>
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      <WellnessCheckIn open={wellnessOpen} onOpenChange={setWellnessOpen} />
    </div>
  );
}
