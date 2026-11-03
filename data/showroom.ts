import type { Showroom } from "@/types/showroom";

/** Official directory-sourced motorcycle sales outlets, reviewed 2026-11-03.
 * This is a curated, non-exhaustive list, not an on-site verification.
 * `mapSearchUrl` is a Google Maps SEARCH, not a confirmed Place ID or pin.
 * No exact latitude/longitude is asserted without a verified source.
 */
export const DIVISIONS = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna",
  "Barisal", "Sylhet", "Rangpur", "Mymensingh",
] as const;

export type VerifiedShowroom = Showroom & {
  district: string;
  sourceUrl: string;
  mapSearchUrl: string;
  verifiedFrom: "manufacturer-dealer-directory";
  reviewedOn: "2026-11-03";
  coordinates: null;
};

const BAJAJ = "https://www.bajajauto.com/en-bd/store-locator";
const HONDA = "https://www.bdhonda.com/pages/awarded-dealer";
const mapsSearch = (name: string, address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}, Bangladesh`)}`;

const records: Array<Showroom & { district: string; sourceUrl: string }> = [
  { id: "bd-001", name: "Azad Agency", division: "Dhaka", district: "Dhaka", city: "Tejgaon", address: "88, Kazi Nazrul Islam Avenue, Tejgaon, Dhaka", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-002", name: "S K Traders", division: "Dhaka", district: "Dhaka", city: "Tejgaon", address: "115/3, Bijoy Sarani Link Road, Opposite Rangs Bhaban, Tejgaon, Dhaka", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-003", name: "Bajaj World", division: "Dhaka", district: "Dhaka", city: "Uttara", address: "House 11, Road 10/A, Sector 09, Uttara, Abdullahpur, Dhaka", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-004", name: "Arya Motors", division: "Dhaka", district: "Dhaka", city: "Mirpur", address: "146, Senpara Parbata, Begum Rokeya Sarani, Kafrul, Mirpur-10, Dhaka", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-005", name: "Bajaj Collection", division: "Dhaka", district: "Dhaka", city: "Mohammadpur", address: "3/1/A, Bashbari, Mohammadpur Bus Stand, Mohammadpur, Dhaka", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-006", name: "Honda Life", division: "Dhaka", district: "Dhaka", city: "Baridhara", address: "42, Pragati Sarani, Block J, Road 9, Baridhara, Dhaka 1212", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-007", name: "Masminu Motors", division: "Dhaka", district: "Dhaka", city: "Uttara", address: "House 06, Road 01, Sector 03, Jashimuddin Avenue, Uttara, Dhaka", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-008", name: "City Honda", division: "Dhaka", district: "Dhaka", city: "Karwan Bazar", address: "House 46, Ahmed Mansion, Kazi Nazrul Islam Avenue, Karwan Bazar, Dhaka 1215", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-009", name: "NBC Motors", division: "Dhaka", district: "Gazipur", city: "Sreepur", address: "Mawna Chowrasta, Sreepur, Gazipur 1740", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-010", name: "Zam Zam Motors", division: "Dhaka", district: "Tangail", city: "Tangail Sadar", address: "Biswash Bekta, Mymensingh Road, Tangail", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-011", name: "Chittagong Bajaj", division: "Chittagong", district: "Chattogram", city: "Kotowali", address: "Sadarghat Road, Kotowali, Chattogram", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-012", name: "Friends Motors", division: "Chittagong", district: "Chattogram", city: "Muradpur", address: "36/7 CDA Avenue, Muradpur, Panchlaish, Chattogram", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-013", name: "Bajaj Avenue", division: "Chittagong", district: "Chattogram", city: "Hathazari", address: "11 Mile, Hathazari, Chattogram", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-014", name: "BM Motors", division: "Chittagong", district: "Chattogram", city: "Hathazari", address: "Al-Amin Plaza, Hathazari Road, Chattogram", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-015", name: "Taif Bajaj", division: "Chittagong", district: "Chattogram", city: "Pahartali", address: "Takwa Market, D.T. Road, Colonel Hat, Pahartali, Chattogram", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-016", name: "Binning and Company (Bangladesh) Ltd.", division: "Chittagong", district: "Chattogram", city: "Muradpur", address: "429, Muradpur, Sholasahar, Chattogram 4203", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-017", name: "Samia Auto", division: "Chittagong", district: "Cumilla", city: "Cumilla Cantonment", address: "Nischintapur, Cumilla Cantonment, Cumilla", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-018", name: "Gold Wing", division: "Chittagong", district: "Feni", city: "Feni Sadar", address: "722, Moti Manzil Market, Trunk Road, Feni", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-019", name: "Ambiya Traders", division: "Chittagong", district: "Khagrachhari", city: "Khagrachhari Sadar", address: "College Road, Narikel Bagan, Khagrachhari", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-020", name: "Rahman Motors", division: "Chittagong", district: "Noakhali", city: "Begumganj", address: "Nurul Haque Sarak, Chowmuhani, Begumganj, Noakhali", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-021", name: "Sarkar Enterprise", division: "Rajshahi", district: "Rajshahi", city: "Rani Bazar", address: "Madrasha Market, Rani Bazar, Rajshahi", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-022", name: "F J Enterprise", division: "Rajshahi", district: "Rajshahi", city: "Shiroil", address: "Railway Station to Vodra Road, Shiroil, Rajshahi", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-023", name: "Lucky Motors", division: "Rajshahi", district: "Rajshahi", city: "Paba", address: "Naohata Bazar, Paba, Rajshahi", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-024", name: "Masud Traders", division: "Rajshahi", district: "Rajshahi", city: "Godagari", address: "Ramnagar, Daying Para, Godagari, Rajshahi", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-025", name: "Auto Bitan", division: "Rajshahi", district: "Bogura", city: "Sutrapur", address: "Sherpur Road, Sutrapur, Bogura", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-026", name: "Bajaj Point Bogura", division: "Rajshahi", district: "Bogura", city: "Sutrapur", address: "50-53, Zila Parishad Market, Gohail Road, Sutrapur, Bogura", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-027", name: "Ahsan Trading", division: "Rajshahi", district: "Naogaon", city: "Naogaon Sadar", address: "Ahsan Trade Center, Rubir More, Main Road, Naogaon", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-028", name: "Bajaj Valley", division: "Khulna", district: "Khulna", city: "Moylapota", address: "6, K D A Avenue, Moylapota, Khulna", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-029", name: "Hossain & Brothers", division: "Khulna", district: "Khulna", city: "Daulatpur", address: "Khan A Sabur Road, Daulatpur, Khulna", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-030", name: "Rafi Traders", division: "Khulna", district: "Khulna", city: "Sonadanga", address: "M.A. Bari Road, Sonadanga, Khulna", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-031", name: "R Associates", division: "Khulna", district: "Khulna", city: "Boyra", address: "927, Jessore Road, Nur Nagar, Boyra, Khulna", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-032", name: "Momo Motors", division: "Khulna", district: "Khulna", city: "Nirala More", address: "Nirala More, Sher-e-Bangla Road, Khulna", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-033", name: "Venus Auto", division: "Khulna", district: "Jashore", city: "Jashore Sadar", address: "Ashrom Mor, Rail Road, Jashore", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-034", name: "Sardar Motors", division: "Khulna", district: "Kushtia", city: "Kushtia Sadar", address: "Upazila Mor, Kushtia Sadar, Kushtia", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-035", name: "Jakir Motors", division: "Khulna", district: "Chuadanga", city: "Chuadanga Sadar", address: "College Road, Chuadanga", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-036", name: "Honda Wing", division: "Khulna", district: "Satkhira", city: "Satkhira Sadar", address: "Jessore Road, Rosulpur, Satkhira", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-037", name: "Talha Motors", division: "Barisal", district: "Barishal", city: "Rupatoli", address: "685 Hawlader Bhobon, Jhalokathi Road, Rupatoli, Barishal", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-038", name: "Gournadi Motors", division: "Barisal", district: "Barishal", city: "Gournadi", address: "Gournadi, Barishal", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-039", name: "Muladi Motors", division: "Barisal", district: "Barishal", city: "Muladi", address: "Kazi Villa, Sadar Road, Muladi, Barishal", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-040", name: "Layla Motors", division: "Barisal", district: "Barishal", city: "C&B Road", address: "01 No. C & B Pool, Sadar, Barishal", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-041", name: "Max Plus", division: "Barisal", district: "Barishal", city: "C&B Road", address: "1 No. Pool, C&B Road, Barishal", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-042", name: "New Panchayet Motors", division: "Barisal", district: "Barguna", city: "Barguna Sadar", address: "Sadar Road, Barguna", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-043", name: "S.A. Motors", division: "Barisal", district: "Bhola", city: "Bhola Sadar", address: "Ukilpara, Sadar Road, Bhola", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-044", name: "Sarder Trading", division: "Barisal", district: "Pirojpur", city: "Mathbaria", address: "Thana Para Road, Mathbaria, Pirojpur", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-045", name: "Sylhet Bajaj Center", division: "Sylhet", district: "Sylhet", city: "Kadamtali", address: "Ittadhe Complex, Link Road, Humayun Rashid Chattor, Kadamtali, Sylhet", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-046", name: "Amco Bajaj International", division: "Sylhet", district: "Sylhet", city: "Subhanighat", address: "6, Shahjalal Plaza, Subhanighat, Sylhet", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-047", name: "Darning Bajaj Centre", division: "Sylhet", district: "Sylhet", city: "West Pathantula", address: "Aziz Complex, West Pathantula, Sylhet", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-048", name: "R M Motors", division: "Sylhet", district: "Sylhet", city: "Shibganj", address: "Shibganj, Sylhet", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-049", name: "Aymaan Bajaj", division: "Sylhet", district: "Sylhet", city: "Beanibazar", address: "Main Road, Supatola, Beanibazar, Sylhet", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-050", name: "Jaflong Bajaj", division: "Sylhet", district: "Sylhet", city: "Jaflong", address: "Jaflong Bazar, Jaflong, Sylhet", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-051", name: "Suprova International", division: "Sylhet", district: "Sunamganj", city: "Sunamganj Sadar", address: "Sunamganj-Sylhet Highway Road, Sunamganj", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-052", name: "Rangpur Bajaj", division: "Rangpur", district: "Rangpur", city: "R K Road", address: "Ideal More, R K Road, Rangpur", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-053", name: "Arifin Motors", division: "Rangpur", district: "Rangpur", city: "Chartola More", address: "College Road, Chartola More, Rangpur Sadar, Rangpur", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-054", name: "Arifin Ent.", division: "Rangpur", district: "Rangpur", city: "R K Road", address: "20 Megawatt, R K Road, Rangpur", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-055", name: "MBC Honda", division: "Rangpur", district: "Rangpur", city: "Rangpur Sadar", address: "Chartola, College Road, Sadar, Rangpur", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-056", name: "Islam Motors Nilphamari", division: "Rangpur", district: "Nilphamari", city: "Nilphamari Sadar", address: "Haji Mohosin Road, Near Islami Bank Ltd., Nilphamari", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-057", name: "Islam Motors", division: "Rangpur", district: "Nilphamari", city: "Saidpur", address: "Rangpur Road, Saidpur, Nilphamari", brands: ["Honda"], sourceUrl: HONDA },
  { id: "bd-058", name: "Siyam Bajaj", division: "Rangpur", district: "Dinajpur", city: "Birol", address: "Bokultola More, Birol, Dinajpur", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-059", name: "Arham Motors", division: "Mymensingh", district: "Mymensingh", city: "Mymensingh Sadar", address: "Digarkanda Bypass More, Mymensingh Sadar, Mymensingh", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-060", name: "Surma Bajaj", division: "Mymensingh", district: "Mymensingh", city: "Kalibari Road", address: "Kalibari Road, Mymensingh", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-061", name: "Zannat Bajaj", division: "Mymensingh", district: "Mymensingh", city: "Muktagachha", address: "Laxmi Khola, Muktagachha, Mymensingh", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-062", name: "Rawan Bajaj", division: "Mymensingh", district: "Mymensingh", city: "Phulpur", address: "Sherpur Road, Phulpur, Mymensingh", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-063", name: "Duronto Motors", division: "Mymensingh", district: "Mymensingh", city: "Ishwarganj", address: "Ray Bazar, Atharabari, Ishwarganj, Mymensingh", brands: ["Bajaj"], sourceUrl: BAJAJ },
  { id: "bd-064", name: "N.N Enterprise-3", division: "Mymensingh", district: "Netrokona", city: "Netrokona Sadar", address: "Sha-Sultan Road, Kurpar, Netrokona Sadar, Netrokona", brands: ["Bajaj"], sourceUrl: BAJAJ },
];

export const showrooms: VerifiedShowroom[] = records.map((record) => ({
  ...record,
  mapSearchUrl: mapsSearch(record.name, record.address),
  verifiedFrom: "manufacturer-dealer-directory" as const,
  reviewedOn: "2026-11-03" as const,
  coordinates: null,
}));

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

// For an interactive map, use the official Maps search link until each
// showroom has a separately verified Google Place ID or GPS coordinate.
