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
import { Heart, Sun, Cloud, CloudRain, Sparkles } from "lucide-react";
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
    // In production, this would save to the backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedMood(null);
      setNotes("");
      onOpenChange(false);
    }, 2000);
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
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">
              Thank you for checking in
            </h3>
            <p className="text-muted-foreground">
              Your wellbeing matters. We're here for you.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Heart className="h-5 w-5 text-accent-foreground" />
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
                  >
                    <mood.icon className={cn("h-8 w-8", mood.color)} />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>

              {/* Optional notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Anything you'd like to share? (optional)
                </label>
                <Textarea
                  placeholder="Your thoughts are confidential..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Support resources */}
              {selectedMood === "struggling" && (
                <div className="p-4 rounded-xl bg-accent/50 border border-accent animate-fade-in">
                  <p className="text-sm text-accent-foreground">
                    <strong>Remember:</strong> It's okay to need support. Consider reaching out 
                    to your supervisor or the employee assistance program.
                  </p>
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
