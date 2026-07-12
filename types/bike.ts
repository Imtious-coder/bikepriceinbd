export interface Mileage {
  city: string | null;
  highway: string | null;
}

export interface BikeImages {
  primary: string;
}

export interface Bike {
  slug: string;
  name: string;
  brandName: string;
  brand: string;
  price_bdt: string | null;
  priceText: string;
  availability: string;
  description: string;
  bike_type: string | null;
  colors: string[];
  images: BikeImages;
  specs: Record<string, string> | null;
  quick_specs: Record<string, string> | null;
  mileage: Mileage | null;
  showroom: string;
}

// New bike info
export interface BikeTModified {
  slug: string;
  name: string;
  brandName: string;
  brand: string;
  price: string | null;
  availability: string;
  description: string;
  bike_type: string | null;
  colors: string[];
  images: BikeImages;
  specs: Record<string, string> | null;
  // quick_specs: Record<string, string> | null;
  mileage: Mileage | null;
  showroom: string;
  made_in: string;
  assembly: string;
  distributor: string;
}


// New bike info type

interface OEngine {
  type: string;
  displacement: string;
  maximum_power: string;
  maximum_torque: string;
  bore: string;
  stroke: string;
  compression_ratio: string;
  valves: string;
  fuel_supply: string;
  no_of_cylinders: string;
  engine_cooling: string;
  starting_method: string;
  engine_oil_grade: string;
  engine_oil_capacity: string;
}

interface OTransmission {
  transmission_type: string;
  clutch_type: string;
  no_of_gears: string;
  drive_type: string;
}

interface OMileageTopSpeed {
  mileage: string;
  top_speed: string;
}

interface OChassisSuspension {
  chassis_type: string;
  front_suspension: string;
  rear_suspension: string;
}

interface OBrakes {
  front_brake_type: string;
  rear_brake_type: string;
  front_brake_diameter: string;
  rear_brake_diameter: string;
  braking_system: string;
}

interface OWheelTyres {
  front_tyre_size: string;
  rear_tyre_size: string;
  tyre_type: string;
  wheel_type: string;
}

interface ODimensions {
  overall_length: string;
  overall_width: string;
  height: string;
  weight: string;
  ground_clearance: string;
  fuel_tank_capacity: string;
  Wheelbase: string;
  seat_height: string;
}

interface OElectricals {
  battery_type: string;
  battery_voltage: string;
  head_light: string;
  tail_light: string;
  indicators: string;
}

interface OOthers {
  speedometer: string;
  odometer: string;
  rpm_meter: string;
  handle_type: string;
  seat_type: string;
  passenger_grab_rail: string;
  engine_kill_switch: string;
  additional_feature: string;
}

interface OImages {
  primary: string;
}

interface OMileage {
  city?: string;
  highway?: string;
}

export interface OBike {
  slug: string;
  name: string;
  brand: string;
  cc: string;
  bike_type: string;
  distributor: string;
  model_year: string;
  brand_origin: string;
  made_in: string;
  assembly: string;
  launched: string;
  price: string;
  engine: OEngine;
  transmission: OTransmission;
  mileage_top_speed: OMileageTopSpeed;
  chassis_suspension: OChassisSuspension;
  brakes: OBrakes;
  wheel_tyres: OWheelTyres;
  dimensions: ODimensions;
  electricals: OElectricals;
  others: OOthers;
  availability: string;
  description: string;
  colors: string[];
  images: OImages;
  mileage: OMileage;
  showroom: string | null;
}
