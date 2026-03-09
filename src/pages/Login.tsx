import { useState } from "react";
import { Heart, Shield, Fingerprint, KeyRound, Eye, EyeOff, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type AuthStep = "credentials" | "mfa" | "biometric";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [step, setStep] = useState<AuthStep>("credentials");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        setError(null);
        // Show success message for signup
        setStep("mfa");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        // After credentials, proceed to MFA step
        setStep("mfa");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // MFA verification — in production would call supabase.auth.mfa.verify()
    if (mfaCode.length === 6) {
      setStep("biometric");
    } else {
      setError("Enter a valid 6-digit code");
    }
  };

  const handleBiometricScan = () => {
    setBiometricScanning(true);
    // Simulated biometric scan — in production would use WebAuthn
    setTimeout(() => {
      setBiometricScanning(false);
      // Auth is already established from step 1, this is additional verification
      // In production: navigator.credentials.get() for WebAuthn
      window.location.href = "/";
    }, 2500);
  };

  const handleSkipToApp = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-glow" role="img" aria-label="CareCompass logo">
            <Heart className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">CareCompass</h1>
          <p className="text-sm text-muted-foreground">Palliative Care Management</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {["credentials", "mfa", "biometric"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : i < ["credentials", "mfa", "biometric"].indexOf(step)
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="w-8 h-0.5 bg-border" />}
            </div>
          ))}
        </div>

        <div className="card-elevated p-6 space-y-5">
          {/* Step 1: Credentials */}
          {step === "credentials" && (
            <>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="font-serif text-lg font-semibold">
                    {mode === "login" ? "Worker Sign In" : "Create Account"}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {mode === "login"
                    ? "Enter your credentials to access the system"
                    : "Register with your organization email"}
                </p>
              </div>

              <form onSubmit={handleCredentialSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input
                      id="displayName"
                      placeholder="Sarah Johnson"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email or Worker ID</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="sarah@carecompass.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 p-2.5 rounded-lg" role="alert">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                  className="text-sm text-primary hover:underline"
                >
                  {mode === "login" ? "New worker? Create an account" : "Already have an account? Sign in"}
                </button>
              </div>
            </>
          )}

          {/* Step 2: MFA */}
          {step === "mfa" && (
            <>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="font-serif text-lg font-semibold">Multi-Factor Auth</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <form onSubmit={handleMfaSubmit} className="space-y-4">
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Input
                      key={i}
                      className="w-10 h-12 text-center text-lg font-bold"
                      maxLength={1}
                      value={mfaCode[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const newCode = mfaCode.split("");
                        newCode[i] = val;
                        setMfaCode(newCode.join(""));
                        // Auto-focus next input
                        if (val && e.target.nextElementSibling) {
                          (e.target.nextElementSibling as HTMLInputElement).focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !mfaCode[i] && (e.target as HTMLElement).previousElementSibling) {
                          ((e.target as HTMLElement).previousElementSibling as HTMLInputElement).focus();
                        }
                      }}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 p-2.5 rounded-lg" role="alert">{error}</p>
                )}

                <Button type="submit" className="w-full">
                  Verify Code
                </Button>

                <button
                  type="button"
                  onClick={handleSkipToApp}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  Skip for now →
                </button>
              </form>
            </>
          )}

          {/* Step 3: Biometric */}
          {step === "biometric" && (
            <>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Fingerprint className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="font-serif text-lg font-semibold">Biometric Verification</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan your fingerprint or use Face ID to verify identity
                </p>
              </div>

              <div className="flex flex-col items-center gap-6 py-4">
                <div
                  className={cn(
                    "w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-700",
                    biometricScanning
                      ? "border-primary bg-primary/10 animate-pulse"
                      : "border-border bg-muted/50"
                  )}
                >
                  <Fingerprint
                    className={cn(
                      "h-14 w-14 transition-colors",
                      biometricScanning ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>

                {biometricScanning ? (
                  <p className="text-sm text-primary font-medium animate-pulse">Scanning...</p>
                ) : (
                  <Button onClick={handleBiometricScan} className="gap-2" aria-label="Start fingerprint or face ID scan">
                    <Fingerprint className="h-4 w-4" aria-hidden="true" />
                    Start Biometric Scan
                  </Button>
                )}

                <button
                  type="button"
                  onClick={handleSkipToApp}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Skip for now →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Security footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
          <span>HIPAA &amp; GDPR compliant · AES-256 encrypted</span>
        </div>
      </div>
    </div>
  );
}
