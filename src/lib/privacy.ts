/**
 * Privacy utilities for HIPAA-compliant name display.
 * Abbreviates names: "Eleanor Wright" → "E.WRI"
 * First initial + dot + first 3 letters of last name (uppercase).
 */
export function abbreviateName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName.charAt(0).toUpperCase() + ".***";
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastName = parts[parts.length - 1].toUpperCase().slice(0, 3);
  return `${firstInitial}.${lastName}`;
}

/**
 * Get initials for avatar display (2 chars).
 */
export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

/**
 * Generate a deterministic avatar gradient from a name.
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "from-purple-400 to-pink-400",
    "from-blue-400 to-purple-400",
    "from-rose-400 to-orange-300",
    "from-teal-400 to-blue-400",
    "from-amber-400 to-rose-400",
  ];
  return colors[name.charCodeAt(0) % colors.length];
}
