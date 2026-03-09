import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Lock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Anchorage", label: "Alaska (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii (HT)" },
  { value: "Europe/London", label: "GMT / London" },
  { value: "Europe/Berlin", label: "CET / Berlin" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return { label: `${h}:00 ${ampm}`, hour: i };
});

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface TimeEntry {
  hour: number;
  dayIndex: number;
  value: string; // e.g. "Visit: M.HEN" or "Documentation" or ""
}

// Pre-fill some mock data
const defaultEntries: Record<string, string> = {
  "0-8": "Visit: M.HEN",
  "0-9": "Travel",
  "0-10": "Visit: R.KIM",
  "0-11": "Visit: E.WRI",
  "0-12": "Lunch",
  "0-13": "Visit: J.MIT",
  "0-14": "Travel",
  "0-15": "Visit: D.LEW",
  "0-16": "Documentation",
  "1-9": "Visit: M.HEN",
  "1-10": "Travel",
  "1-11": "Visit: R.KIM",
  "1-12": "Lunch",
  "1-14": "Visit: D.LEW",
  "1-15": "Documentation",
  "2-10": "Visit: E.WRI",
  "2-11": "Travel",
  "2-13": "Visit: J.MIT",
  "2-14": "Documentation",
  "3-9": "Visit: M.HEN",
  "3-10": "Travel",
  "3-11": "Visit: D.LEW",
  "3-12": "Lunch",
  "3-13": "Documentation",
};

type ViewMode = "week" | "month";

export default function Hours() {
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [entries, setEntries] = useState<Record<string, string>>(defaultEntries);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const isCurrentWeek = weekOffset === 0;

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const weekLabel = `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  const selectedTzLabel = TIMEZONES.find((tz) => tz.value === timezone)?.label ?? timezone;

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    return DAYS_SHORT.map((_, dayIdx) => {
      let count = 0;
      HOURS.forEach((h) => {
        const key = `${dayIdx}-${h.hour}`;
        if (entries[key]) count++;
      });
      return count;
    });
  }, [entries]);

  const weeklyTotal = dailyTotals.reduce((s, t) => s + t, 0);

  const handleCellEdit = (key: string, value: string) => {
    setEntries((prev) => ({ ...prev, [key]: value }));
    setEditingCell(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">
            Time Tracking
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {weeklyTotal}h logged this week · {selectedTzLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-[160px] h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value} className="text-xs">
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Week/Month toggle + navigation */}
      <div className="card-elevated p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[200px] text-center">{weekLabel}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex rounded-lg bg-muted p-0.5">
          <button
            onClick={() => setViewMode("week")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "week" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "month" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            Month
          </button>
        </div>
      </div>

      {!isCurrentWeek && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          <Lock className="h-3.5 w-3.5" />
          <span>Past weeks are read-only. Edits are only allowed for the current week.</span>
        </div>
      )}

      {/* Time grid */}
      <div className="card-elevated overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 bg-card z-10 px-3 py-2 text-left font-semibold text-muted-foreground w-20">
                <Clock className="h-3.5 w-3.5 inline mr-1" />
                Time
              </th>
              {DAYS_SHORT.map((day, i) => (
                <th key={day} className="px-2 py-2 text-center font-semibold">
                  <div>{day}</div>
                  <div className="text-muted-foreground font-normal">{weekDates[i].getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour.hour} className="border-b border-border/50 hover:bg-muted/20">
                <td className="sticky left-0 bg-card z-10 px-3 py-1.5 text-muted-foreground font-medium whitespace-nowrap">
                  {hour.label}
                </td>
                {DAYS_SHORT.map((_, dayIdx) => {
                  const key = `${dayIdx}-${hour.hour}`;
                  const value = entries[key] || "";
                  const isEditing = editingCell === key;
                  const canEdit = isCurrentWeek;

                  return (
                    <td
                      key={key}
                      className={cn(
                        "px-1 py-1 text-center relative",
                        value && "bg-primary/5"
                      )}
                      onClick={() => {
                        if (canEdit && !isEditing) setEditingCell(key);
                      }}
                    >
                      {isEditing ? (
                        <Input
                          className="h-6 text-[11px] px-1 text-center"
                          defaultValue={value}
                          autoFocus
                          onBlur={(e) => handleCellEdit(key, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCellEdit(key, (e.target as HTMLInputElement).value);
                            if (e.key === "Escape") setEditingCell(null);
                          }}
                        />
                      ) : value ? (
                        <span className={cn(
                          "inline-block px-1.5 py-0.5 rounded text-[10px] font-medium truncate max-w-full",
                          value.startsWith("Visit") ? "bg-primary/15 text-primary" :
                          value === "Travel" ? "bg-muted text-muted-foreground" :
                          value === "Lunch" ? "bg-accent/50 text-accent-foreground" :
                          "bg-secondary text-secondary-foreground"
                        )}>
                          {value}
                        </span>
                      ) : canEdit ? (
                        <span className="text-muted-foreground/30 cursor-pointer">·</span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Totals row */}
            <tr className="border-t-2 border-border font-semibold bg-muted/30">
              <td className="sticky left-0 bg-muted/30 z-10 px-3 py-2">Total</td>
              {dailyTotals.map((total, i) => (
                <td key={i} className="px-2 py-2 text-center">
                  {total > 0 ? `${total}h` : "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Weekly summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-elevated p-4 text-center">
          <p className="text-xs text-muted-foreground">This Week</p>
          <p className="font-serif text-2xl font-bold">{weeklyTotal}h</p>
          <p className="text-xs text-muted-foreground">of 40h target</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-xs text-muted-foreground">Visit Hours</p>
          <p className="font-serif text-2xl font-bold">
            {Object.values(entries).filter((v) => v.startsWith("Visit")).length}h
          </p>
          <p className="text-xs text-muted-foreground">patient care</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-xs text-muted-foreground">Travel</p>
          <p className="font-serif text-2xl font-bold">
            {Object.values(entries).filter((v) => v === "Travel").length}h
          </p>
          <p className="text-xs text-muted-foreground">in transit</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-xs text-muted-foreground">Admin</p>
          <p className="font-serif text-2xl font-bold">
            {Object.values(entries).filter((v) => v === "Documentation").length}h
          </p>
          <p className="text-xs text-muted-foreground">documentation</p>
        </div>
      </div>
    </div>
  );
}
