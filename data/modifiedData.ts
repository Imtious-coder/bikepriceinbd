import { Bike, BikeTModified } from "@/types/bike";

export const bikes: BikeTModified[] = [
  {
    slug: "bajaj-pulsar-n250",
    name: "Bajaj Pulsar N250 Price in Bangladesh",
    brand: "bajaj",
    brandName: "Bajaj",
    price: "330100",
    availability: "upcoming",
    description:
      "Bajaj Pulsar N250 Price in Bangladesh is 330,100 BDT. mileage in city 35 KM and on highway 40 KM (approx.). It has a Dual Channel ABS Breaking system.",
    bike_type: "Sports",
    colors: [
      "Racing Red",
      "Caribbean-Blue",
      "Brooklyn Black",
      "Octane (145 tk)",
      "Petrol (140 tk)",
    ],
    images: {
      primary:
        "https://www.bikebd.com/den/storage/app/files/shares/images/productimages/bajaj-pulsar-n250655eea6963372.webp",
    },
    specs: {
      engine: "150 Cc",
      power: "18.5 HP",
      torque: "14 nm",
      mileage: "40 Kmpl",
      brakes: "Dual Channel ABS",
      tyre_type: "Tubeless",
      weight: "162 kg",
      fuel_tank_capacity: "12 L",
      cooling_system: "Liquid Cooled",
      starting_system: "Self Start",
      seat_height: "800 mm",
      fuel_system: "Fuel Injection",
      gearbox: "5 Speed",
      clutch_type: "Wet Multiplate",
      engine_oil_grade: "SAE 10W-30",
      suspension_front: "Telescopic Fork",
      suspension_rear: "Mono Shock",
      wheelbase: "1350 mm",
      ground_clearance: "165 mm",
      tyre_front: "100/80-17",
      tyre_rear: "130/70-17",
      battery: "12V 7Ah",
      headlight: "LED",
      taillight: "LED",
      indicators: "LED",
      wheel_front: "Alloy",
      wheel_rear: "Alloy",
      model_year: "2023",
      bore: "72 mm",
      stroke: "61 mm",
      valves: "2",
      cylinders: "1",
      engine_oil_capacity: "1.2 L",
      drive_type: "Chain",
      top_speed: "130 km/h",
      front_brake_diameter: "300 mm",
      rear_brake_diameter: "230 mm",
      seat_type: "Split Seat",
      rpm_meter: "Digital",
      odometer: "Digital",
      handle_type: "Clip-On",
      overall_length: "2,020 mm",
      overall_width: "800 mm",
      overall_height: "1,070 mm",
    },
    mileage: {
      city: "35 km/l",
      highway: "40 km/l",
    },
    showroom: "Feature Your Showroom Here Book Now",
    made_in: "India",
    assembly: "CKD",
    distributor: "rancon motorcycles",
  },
];

export function getBikeBySlug(slug: string): BikeTModified | undefined {
  return bikes.find((bike) => bike.slug === slug);
}

export function getBikesByType(type: string): BikeTModified[] {
  return bikes.filter((bike) => bike.bike_type === type);
}

export const bikeTypes = [...new Set(bikes.map((b) => b.bike_type))];
