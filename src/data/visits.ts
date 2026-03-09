import { abbreviateName } from "@/lib/privacy";

/**
 * Shared visit data used by Dashboard, Schedule, and Routes pages.
 * Single source of truth so all views stay in sync.
 */

export interface Visit {
  id: string;
  time: string;
  endTime: string;
  patientFullName: string;
  city: string;
  zip: string;
  lat: number;
  lng: number;
  visitType: string;
  status: "completed" | "current" | "upcoming";
  priority?: "urgent" | "attention";
  notes?: string;
  travelMinFromPrior: number | null;
  estimatedMinAtLocation: number;
  dayOfWeek: number; // 0=Mon ... 6=Sun
}

export const todayVisits: Visit[] = [
  {
    id: "1",
    time: "8:00 AM",
    endTime: "8:45 AM",
    patientFullName: "Margaret Henderson",
    city: "Portland",
    zip: "97201",
    lat: 45.5152,
    lng: -122.6784,
    visitType: "Pain Management Review",
    status: "completed",
    travelMinFromPrior: null,
    estimatedMinAtLocation: 45,
    dayOfWeek: 0,
  },
  {
    id: "2",
    time: "9:30 AM",
    endTime: "10:10 AM",
    patientFullName: "Robert Kimball",
    city: "Portland",
    zip: "97205",
    lat: 45.5215,
    lng: -122.6995,
    visitType: "Medication Adjustment",
    status: "completed",
    travelMinFromPrior: 12,
    estimatedMinAtLocation: 40,
    dayOfWeek: 0,
  },
  {
    id: "3",
    time: "11:00 AM",
    endTime: "12:00 PM",
    patientFullName: "Eleanor Wright",
    city: "Beaverton",
    zip: "97006",
    lat: 45.4871,
    lng: -122.8037,
    visitType: "Comfort Care Assessment",
    status: "current",
    priority: "attention",
    notes: "Family requested extra time today",
    travelMinFromPrior: 22,
    estimatedMinAtLocation: 60,
    dayOfWeek: 0,
  },
  {
    id: "4",
    time: "1:30 PM",
    endTime: "2:00 PM",
    patientFullName: "James Mitchell",
    city: "Tigard",
    zip: "97223",
    lat: 45.4312,
    lng: -122.7715,
    visitType: "Symptom Check",
    status: "upcoming",
    travelMinFromPrior: 15,
    estimatedMinAtLocation: 30,
    dayOfWeek: 0,
  },
  {
    id: "5",
    time: "3:00 PM",
    endTime: "4:00 PM",
    patientFullName: "Dorothy Lewis",
    city: "Lake Oswego",
    zip: "97034",
    lat: 45.4207,
    lng: -122.6706,
    visitType: "Equipment Check",
    status: "upcoming",
    priority: "urgent",
    notes: "Oxygen delivery scheduled",
    travelMinFromPrior: 18,
    estimatedMinAtLocation: 60,
    dayOfWeek: 0,
  },
];

/** Weekly schedule — today's visits plus other days */
export const weeklyVisits: Visit[] = [
  ...todayVisits, // Monday (dayOfWeek 0)
  {
    id: "6", time: "9:00 AM", endTime: "10:00 AM", patientFullName: "Margaret Henderson",
    city: "Portland", zip: "97201", lat: 45.5152, lng: -122.6784,
    visitType: "Follow-up Assessment", status: "upcoming",
    travelMinFromPrior: null, estimatedMinAtLocation: 60, dayOfWeek: 1,
  },
  {
    id: "7", time: "11:00 AM", endTime: "11:45 AM", patientFullName: "Robert Kimball",
    city: "Portland", zip: "97205", lat: 45.5215, lng: -122.6995,
    visitType: "Cardiology Check", status: "upcoming",
    travelMinFromPrior: 15, estimatedMinAtLocation: 45, dayOfWeek: 1,
  },
  {
    id: "8", time: "2:00 PM", endTime: "3:00 PM", patientFullName: "Dorothy Lewis",
    city: "Lake Oswego", zip: "97034", lat: 45.4207, lng: -122.6706,
    visitType: "Respiratory Therapy", status: "upcoming", priority: "urgent",
    travelMinFromPrior: 25, estimatedMinAtLocation: 60, dayOfWeek: 1,
  },
  {
    id: "9", time: "10:00 AM", endTime: "11:00 AM", patientFullName: "Eleanor Wright",
    city: "Beaverton", zip: "97006", lat: 45.4871, lng: -122.8037,
    visitType: "Comfort Care", status: "upcoming",
    travelMinFromPrior: null, estimatedMinAtLocation: 60, dayOfWeek: 2,
  },
  {
    id: "10", time: "1:00 PM", endTime: "1:30 PM", patientFullName: "James Mitchell",
    city: "Tigard", zip: "97223", lat: 45.4312, lng: -122.7715,
    visitType: "Dialysis Support", status: "upcoming",
    travelMinFromPrior: 20, estimatedMinAtLocation: 30, dayOfWeek: 2,
  },
  {
    id: "11", time: "9:00 AM", endTime: "10:00 AM", patientFullName: "Margaret Henderson",
    city: "Portland", zip: "97201", lat: 45.5152, lng: -122.6784,
    visitType: "Pain Management Review", status: "upcoming",
    travelMinFromPrior: null, estimatedMinAtLocation: 60, dayOfWeek: 3,
  },
  {
    id: "12", time: "11:30 AM", endTime: "12:30 PM", patientFullName: "Dorothy Lewis",
    city: "Lake Oswego", zip: "97034", lat: 45.4207, lng: -122.6706,
    visitType: "Family Conference", status: "upcoming", priority: "attention",
    travelMinFromPrior: 22, estimatedMinAtLocation: 60, dayOfWeek: 3,
  },
  {
    id: "13", time: "10:00 AM", endTime: "11:00 AM", patientFullName: "Eleanor Wright",
    city: "Beaverton", zip: "97006", lat: 45.4871, lng: -122.8037,
    visitType: "Garden Visit", status: "upcoming",
    travelMinFromPrior: null, estimatedMinAtLocation: 60, dayOfWeek: 4,
  },
  {
    id: "14", time: "1:00 PM", endTime: "1:30 PM", patientFullName: "Robert Kimball",
    city: "Portland", zip: "97205", lat: 45.5215, lng: -122.6995,
    visitType: "Weekly Assessment", status: "upcoming",
    travelMinFromPrior: 18, estimatedMinAtLocation: 30, dayOfWeek: 4,
  },
];
