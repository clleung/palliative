import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  Bell,
  Monitor,
  Smartphone,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WellnessCheckIn } from "@/components/wellness/WellnessCheckIn";
import { useIsMobile } from "@/hooks/use-mobile";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Route Planning", href: "/routes", icon: MapPin },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Staff Hours", href: "/hours", icon: Clock },
  { name: "Deliveries", href: "/deliveries", icon: Truck },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wellnessOpen, setWellnessOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"field" | "admin">("field");
  const location = useLocation();
  const { signOut, workerProfile } = useAuth();
  const isMobile = useIsMobile();

  const isAdmin = viewMode === "admin";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile bottom navigation — field worker mode */}
      {!isAdmin && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 pb-safe">
          <div className="flex items-center justify-around">
            {navigation.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2 px-3 touch-target",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.name.split(" ")[0]}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Mobile top header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          {isAdmin ? (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="touch-target">
              <Menu className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-serif font-semibold text-foreground">CareCompass</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={() => setViewMode(isAdmin ? "field" : "admin")}
            >
              {isAdmin ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="touch-target" onClick={() => setWellnessOpen(true)}>
              <Heart className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay (admin mode) */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar — always visible on lg+ */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
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

          {/* View mode toggle */}
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="flex rounded-lg bg-muted p-1">
              <button
                onClick={() => setViewMode("field")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors",
                  viewMode === "field" ? "bg-card text-foreground shadow-soft-sm" : "text-muted-foreground"
                )}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Specialist
              </button>
              <button
                onClick={() => setViewMode("admin")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors",
                  viewMode === "admin" ? "bg-card text-foreground shadow-soft-sm" : "text-muted-foreground"
                )}
              >
                <Monitor className="h-3.5 w-3.5" />
                Admin
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
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

          {/* Wellness check-in */}
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

          {/* Sign out + Privacy */}
          <div className="px-4 py-3 border-t border-sidebar-border space-y-2">
            {workerProfile && (
              <p className="text-xs text-muted-foreground px-2 truncate">
                {workerProfile.display_name} · {workerProfile.worker_id}
              </p>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <div className="privacy-indicator px-2">
              <Shield className="h-3.5 w-3.5" />
              <span>HIPAA & GDPR Compliant</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "min-h-screen transition-all",
        "lg:pl-72",
        "pt-14 lg:pt-0",
        !isAdmin && "pb-20 lg:pb-0"
      )}>
        {/* Desktop top bar */}
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
