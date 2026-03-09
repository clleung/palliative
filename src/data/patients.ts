import { PatientCondition } from "@/components/patients/PatientConditionIcons";
import { VitalReading } from "@/components/patients/PatientVitals";

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  type: "Medicare" | "Medicaid" | "Private" | "VA" | "Dual";
  coverageNotes?: string;
  authorizationExpiry?: string;
}

export interface AllocatedResource {
  type: "hospital_bed" | "wheelchair" | "oxygen_concentrator" | "robot" | "commode" | "walker" | "infusion_pump" | "suction_machine";
  label: string;
  serialNumber?: string;
  assignedDate: string;
  status: "active" | "pending_delivery" | "maintenance";
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  address: string;
  city: string;
  zip: string;
  condition: string;
  status: "stable" | "attention" | "critical";
  lastVisit: string;
  nextVisit: string;
  careTeam: string[];
  priority: "critical" | "high" | "medium" | "low";
  prognosis?: string;
  pendingActions?: string[];
  story?: string;
  preferences?: string[];
  familyContacts?: { name: string; relation: string; phone: string }[];
  medications?: { name: string; dose: string; schedule: string }[];
  recentNotes?: { date: string; note: string; author: string }[];
  conditions?: PatientCondition[];
  vitals?: VitalReading[];
  insurance?: InsuranceInfo;
  allocatedResources?: AllocatedResource[];
}

export const patients: Patient[] = [
  {
    id: "5",
    name: "Dorothy Lewis",
    age: 69,
    address: "654 Cedar Lane",
    city: "Lake Oswego",
    zip: "97034",
    condition: "ALS",
    status: "critical",
    lastVisit: "2 days ago",
    nextVisit: "Today, 3:00 PM",
    careTeam: ["Dr. Thompson", "Sarah (RN)", "RT Team"],
    priority: "critical",
    prognosis: "Rapid progression — estimated weeks. Family aware and involved in care decisions.",
    pendingActions: ["Awaiting family decision on ventilator support", "Oxygen delivery today at 2:30 PM"],
    story: "Dorothy is a retired music teacher who loves classical piano. Her cat Maestro keeps her company. She prefers to have music playing during visits.",
    preferences: ["Classical music during visits", "Prefers left arm for BP", "Enjoys tea — Earl Grey"],
    familyContacts: [
      { name: "Michael Lewis", relation: "Son", phone: "(555) 234-5678" },
      { name: "Anna Lewis", relation: "Daughter-in-law", phone: "(555) 345-6789" },
    ],
    medications: [
      { name: "Riluzole", dose: "50mg", schedule: "Twice daily" },
      { name: "Morphine", dose: "5mg PRN", schedule: "Every 4 hours as needed" },
    ],
    recentNotes: [
      { date: "Mar 7", note: "Respiratory function declining. Family meeting scheduled for Monday. Dorothy expressed wishes for comfort-focused care.", author: "Dr. Thompson" },
      { date: "Mar 5", note: "Swallowing difficulty increasing. Modified diet discussed with family.", author: "Sarah (RN)" },
    ],
    insurance: {
      provider: "Medicare",
      policyNumber: "1EG4-TE5-MK72",
      type: "Medicare",
      coverageNotes: "Hospice benefit elected. All comfort care covered.",
      authorizationExpiry: "Apr 15, 2026",
    },
    allocatedResources: [
      { type: "hospital_bed", label: "Hospital Bed (Full Electric)", serialNumber: "HB-2847", assignedDate: "Feb 20, 2026", status: "active" },
      { type: "oxygen_concentrator", label: "Oxygen Concentrator 5L", serialNumber: "OX-1193", assignedDate: "Mar 1, 2026", status: "active" },
      { type: "suction_machine", label: "Portable Suction Machine", serialNumber: "SM-0472", assignedDate: "Mar 3, 2026", status: "active" },
      { type: "robot", label: "HomeBot Atlas (HB-001)", serialNumber: "HB-001", assignedDate: "Mar 7, 2026", status: "active", notes: "Daily vitals check at 9 AM" },
    ],
  },
  {
    id: "2",
    name: "Robert Kimball",
    age: 82,
    address: "456 Elm Avenue",
    city: "Portland",
    zip: "97205",
    condition: "Heart Failure - Stage IV",
    status: "attention",
    lastVisit: "Today, 9:30 AM",
    nextVisit: "Tomorrow, 10:00 AM",
    careTeam: ["Dr. Chen", "Sarah (RN)", "Mike (CNA)"],
    priority: "high",
    prognosis: "Gradual decline. Medication adjustments ongoing — monitoring closely.",
    pendingActions: ["Waiting on lab results from today's draw", "Cardiologist follow-up Wednesday"],
    story: "Robert is a Korean War veteran who tells incredible stories. He has a dry sense of humor and always asks about your day first. His wife passed last year.",
    preferences: ["Calls him 'Bob'", "Morning visits preferred", "Hard of hearing — speak clearly"],
    familyContacts: [
      { name: "Susan Kimball", relation: "Daughter", phone: "(555) 456-7890" },
    ],
    medications: [
      { name: "Furosemide", dose: "40mg", schedule: "Morning" },
      { name: "Lisinopril", dose: "10mg", schedule: "Daily" },
      { name: "Metoprolol", dose: "25mg", schedule: "Twice daily" },
    ],
    recentNotes: [
      { date: "Mar 9", note: "Increased edema in lower extremities. Adjusted diuretic dose. Bob in good spirits, shared photos of his grandchildren.", author: "Sarah (RN)" },
    ],
    insurance: {
      provider: "VA Healthcare",
      policyNumber: "VA-889321",
      type: "VA",
      coverageNotes: "Full VA benefits. Service-connected disability rating.",
    },
    allocatedResources: [
      { type: "robot", label: "HomeBot Nova (HB-002)", serialNumber: "HB-002", assignedDate: "Mar 5, 2026", status: "active", notes: "Medication delivery route" },
      { type: "walker", label: "Rollator Walker", serialNumber: "WK-3321", assignedDate: "Jan 15, 2026", status: "active" },
    ],
  },
  {
    id: "3",
    name: "Eleanor Wright",
    age: 71,
    address: "789 Pine Road",
    city: "Beaverton",
    zip: "97006",
    condition: "Metastatic Cancer",
    status: "attention",
    lastVisit: "In progress",
    nextVisit: "Friday, 11:00 AM",
    careTeam: ["Dr. Patel", "Sarah (RN)"],
    priority: "high",
    pendingActions: ["Pain management re-evaluation needed"],
    story: "Eleanor is an avid gardener who brightens every room. She keeps a gratitude journal and has asked to continue visits in her garden when weather permits.",
    preferences: ["Garden visits when possible", "Loves lilac flowers", "Spiritual care welcomed"],
    familyContacts: [
      { name: "Thomas Wright", relation: "Husband", phone: "(555) 567-8901" },
      { name: "Emma Wright", relation: "Daughter", phone: "(555) 678-9012" },
    ],
    medications: [
      { name: "Oxycodone", dose: "10mg", schedule: "Every 6 hours" },
      { name: "Ondansetron", dose: "4mg", schedule: "As needed for nausea" },
    ],
    recentNotes: [
      { date: "Mar 9", note: "Currently visiting. Pain levels elevated since Wednesday. Eleanor requesting we speak with Thomas about increased support at home.", author: "Sarah (RN)" },
    ],
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "XWB-443921-07",
      groupNumber: "GRP-8817",
      type: "Private",
      coverageNotes: "Palliative consult pre-authorized. Infusion therapy pending auth.",
      authorizationExpiry: "Mar 31, 2026",
    },
    allocatedResources: [
      { type: "infusion_pump", label: "Infusion Pump (Pain Mgmt)", serialNumber: "IP-0891", assignedDate: "Mar 2, 2026", status: "active" },
    ],
  },
  {
    id: "1",
    name: "Margaret Henderson",
    age: 78,
    address: "123 Oak Street, Apt 4B",
    city: "Portland",
    zip: "97201",
    condition: "Advanced COPD",
    status: "stable",
    lastVisit: "Today, 8:00 AM",
    nextVisit: "Thursday, 9:00 AM",
    careTeam: ["Dr. Williams", "Sarah (RN)"],
    priority: "medium",
    story: "Margaret is a grandmother of six who loves knitting blankets for her grandchildren. She's been stable and upbeat, finding comfort in her daily routines.",
    preferences: ["Enjoys showing photos of grandkids", "Prefers afternoon naps uninterrupted", "Tea over coffee"],
    familyContacts: [
      { name: "David Henderson", relation: "Son", phone: "(555) 123-4567" },
    ],
    medications: [
      { name: "Albuterol", dose: "2 puffs", schedule: "Every 4 hours as needed" },
      { name: "Prednisone", dose: "10mg", schedule: "Morning" },
    ],
    recentNotes: [
      { date: "Mar 9", note: "Stable visit. Margaret in good spirits. O2 sat 94% on 2L. Finished another blanket — this one for her newest grandchild.", author: "Sarah (RN)" },
    ],
    insurance: {
      provider: "Medicare + Medigap",
      policyNumber: "1EG9-AB3-QR18",
      type: "Medicare",
      coverageNotes: "Standard Medicare Part A/B with supplemental Medigap Plan F.",
    },
    allocatedResources: [
      { type: "oxygen_concentrator", label: "Portable O₂ Concentrator", serialNumber: "OX-2210", assignedDate: "Dec 10, 2025", status: "active" },
      { type: "robot", label: "HomeBot Pixel (HB-004)", serialNumber: "HB-004", assignedDate: "Mar 8, 2026", status: "active", notes: "Evening check-in at 7 PM" },
    ],
  },
  {
    id: "4",
    name: "James Mitchell",
    age: 85,
    address: "321 Maple Drive",
    city: "Tigard",
    zip: "97223",
    condition: "End-stage Renal Disease",
    status: "stable",
    lastVisit: "Yesterday",
    nextVisit: "Today, 1:30 PM",
    careTeam: ["Dr. Williams", "Lisa (RN)"],
    priority: "low",
    story: "James is a retired professor of English literature. He loves discussing books and always has a recommendation ready. His faith community visits frequently.",
    preferences: ["Loves book discussions", "Prefers quiet visits", "Enjoys classical radio"],
    familyContacts: [
      { name: "Patricia Mitchell", relation: "Wife", phone: "(555) 789-0123" },
    ],
    medications: [
      { name: "Epoetin alfa", dose: "4000 units", schedule: "3x weekly" },
      { name: "Calcium acetate", dose: "667mg", schedule: "With meals" },
    ],
    recentNotes: [
      { date: "Mar 8", note: "Dialysis session tolerated well. James shared a new poem he wrote. Spirits high, wife Patricia managing well.", author: "Lisa (RN)" },
    ],
    insurance: {
      provider: "Medicare + Medicaid",
      policyNumber: "1EG2-ZZ7-LM55",
      type: "Dual",
      coverageNotes: "Dual-eligible. Dialysis services covered under Medicare ESRD benefit.",
    },
    allocatedResources: [
      { type: "commode", label: "Bedside Commode", serialNumber: "CM-1104", assignedDate: "Feb 1, 2026", status: "active" },
      { type: "hospital_bed", label: "Hospital Bed Rails", serialNumber: "HB-3001", assignedDate: "N/A", status: "pending_delivery", notes: "Expected delivery tomorrow" },
    ],
  },
];

// Helper to find patient by name (for dashboard lookups)
export function findPatientByName(fullName: string): Patient | undefined {
  return patients.find(p => p.name === fullName);
}
