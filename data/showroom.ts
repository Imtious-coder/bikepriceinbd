import { Showroom } from "@/types/showroom";

// The 8 official administrative divisions of Bangladesh — used as the fixed
// list of cards even for divisions with zero showrooms in the sample data.
export const DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;

// Small sample dataset — replace with real showroom records. Counts shown
// in the UI are computed live from this array, so they'll scale naturally
// as you add more.
export const showrooms: Showroom[] = [
  { id: "s1", name: "Rancon Motorbikes", division: "Dhaka", city: "Gulshan", address: "Gulshan Avenue, Dhaka", brands: ["Suzuki"] },
  { id: "s2", name: "Uttara Motors", division: "Dhaka", city: "Uttara", address: "Sector 7, Uttara, Dhaka", brands: ["Yamaha", "Honda"] },
  { id: "s3", name: "Mirpur Bike House", division: "Dhaka", city: "Mirpur", address: "Mirpur 10, Dhaka", brands: ["Bajaj", "TVS"] },
  { id: "s4", name: "Agrabad Motorcycles", division: "Chittagong", city: "Agrabad", address: "Agrabad C/A, Chattogram", brands: ["Honda"] },
  { id: "s5", name: "Chattogram Bike Hub", division: "Chittagong", city: "GEC Circle", address: "GEC Circle, Chattogram", brands: ["Yamaha"] },
  { id: "s6", name: "Rajshahi Auto House", division: "Rajshahi", city: "Shaheb Bazar", address: "Shaheb Bazar, Rajshahi", brands: ["Bajaj"] },
  { id: "s7", name: "Rajshahi Riders Point", division: "Rajshahi", city: "New Market", address: "New Market, Rajshahi", brands: ["Suzuki", "TVS"] },
  { id: "s8", name: "Khulna Motor World", division: "Khulna", city: "Sonadanga", address: "Sonadanga, Khulna", brands: ["Hero"] },
  { id: "s9", name: "Barisal Bike Center", division: "Barisal", city: "Sadar Road", address: "Sadar Road, Barisal", brands: ["Honda", "Bajaj"] },
  { id: "s10", name: "Sylhet Two-Wheelers", division: "Sylhet", city: "Zindabazar", address: "Zindabazar, Sylhet", brands: ["Yamaha"] },
  { id: "s11", name: "Rangpur Motor Plaza", division: "Rangpur", city: "Station Road", address: "Station Road, Rangpur", brands: ["TVS", "Hero"] },
  { id: "s12", name: "Mymensingh Bike Bazar", division: "Mymensingh", city: "Town Hall Road", address: "Town Hall Road, Mymensingh", brands: ["Bajaj"] },
];

export function getDivisionCounts(): { division: string; count: number }[] {
  return DIVISIONS.map((division) => ({
    division,
    count: showrooms.filter((s) => s.division === division).length,
  }));
}

export function getShowroomsByDivision(division: string): Showroom[] {
  return showrooms.filter((s) => s.division === division);
}

export function getTotalShowroomCount(): number {
  return showrooms.length;
}