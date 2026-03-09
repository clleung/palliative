import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Sun, Cloud, CloudRain, Sparkles, Calendar, Phone, TreePalm, Coffee, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface WellnessCheckInProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const moodOptions = [
  { value: "great", label: "Doing well", icon: Sun, color: "text-emerald-500" },
  { value: "okay", label: "Managing", icon: Cloud, color: "text-amber-500" },
  { value: "struggling", label: "Need support", icon: CloudRain, color: "text-blue-500" },
];

export function WellnessCheckIn({ open, onOpenChange }: WellnessCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedMood(null);
      setNotes("");
      onOpenChange(false);
    }, 3000);
  };

  const handleClose = () => {
    setSelectedMood(null);
    setNotes("");
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="py-8 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">
              Thank you for checking in
            </h3>
            <p className="text-muted-foreground mb-4">
              Your wellbeing matters. We're here for you.
            </p>
            {selectedMood !== "great" && (
              <div className="p-4 rounded-xl bg-accent/50 border border-accent text-left animate-fade-in">
                <p className="text-sm text-accent-foreground">
                  <strong>Reminder:</strong> You have <span className="font-semibold text-primary">12 PTO days</span> available.
                  Taking time to recharge isn't a luxury — it's essential to the care you give.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Heart className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                </div>
                <div>
                  <DialogTitle className="font-serif">How are you feeling?</DialogTitle>
                  <DialogDescription>
                    This work can be emotionally demanding. Check in with yourself.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Mood selection */}
              <div className="grid grid-cols-3 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      selectedMood === mood.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    )}
                    aria-label={`Mood: ${mood.label}`}
                  >
                    <mood.icon className={cn("h-8 w-8", mood.color)} aria-hidden="true" />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>

              {/* Optional notes */}
              <div className="space-y-2">
                <label htmlFor="wellness-notes" className="text-sm font-medium text-muted-foreground">
                  Anything you'd like to share? (optional)
                </label>
                <Textarea
                  id="wellness-notes"
                  placeholder="Your thoughts are confidential..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Personal leave encouragement — always visible */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">Your Time Off</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-card border border-border">
                    <p className="text-lg font-bold text-primary">12</p>
                    <p className="text-[11px] text-muted-foreground">PTO days available</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card border border-border">
                    <p className="text-lg font-bold text-foreground">3</p>
                    <p className="text-[11px] text-muted-foreground">Mental health days</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <TreePalm className="h-3 w-3 inline-block mr-1 text-emerald-600" aria-hidden="true" />
                  Taking personal time helps you provide better care. Your patients benefit when you're at your best.
                </p>
              </div>

              {/* Support resources — shown for struggling or managing */}
              {(selectedMood === "struggling" || selectedMood === "okay") && (
                <div className="p-4 rounded-xl bg-accent/50 border border-accent animate-fade-in space-y-3">
                  {selectedMood === "struggling" && (
                    <p className="text-sm text-accent-foreground">
                      <strong>You're not alone.</strong> It's okay to need support — this work takes a toll, and asking for help is a sign of strength.
                    </p>
                  )}
                  {selectedMood === "okay" && (
                    <p className="text-sm text-accent-foreground">
                      Even when you're managing, a break can make a big difference. Consider scheduling a personal day soon.
                    </p>
                  )}
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors text-left">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium">Employee Assistance Program</p>
                        <p className="text-xs text-muted-foreground">Free, confidential 24/7 support</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors text-left">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium">Request Time Off</p>
                        <p className="text-xs text-muted-foreground">12 PTO days · 3 mental health days available</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors text-left">
                      <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium">Talk to Your Supervisor</p>
                        <p className="text-xs text-muted-foreground">Workload adjustments available</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Skip for now
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={!selectedMood}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
