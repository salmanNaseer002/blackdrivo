export type UserRole = "user" | "driver" | "admin";
export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
export type RideType = "one_way" | "hourly" | "city_to_city";
export type VehicleClass = "business" | "first_class" | "suv" | "van";
export type DriverStatus = "pending" | "approved" | "rejected" | "suspended";

// Matches the `users` table (extends auth.users)
export interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriverRow {
  id: string;
  user_id: string;
  license_number: string;
  license_expiry: string;
  license_state: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_color: string;
  vehicle_registration: string;
  vehicle_class: VehicleClass;
  insurance_provider: string | null;
  insurance_policy: string | null;
  insurance_expiry: string | null;
  status: DriverStatus;
  is_available: boolean;
  rating: number | null;
  total_rides: number;
  created_at: string;
  updated_at: string;
}

export interface BookingRow {
  id: string;
  passenger_id: string | null;   // authenticated user's ID
  driver_id: string | null;
  ride_type: RideType;
  vehicle_class: VehicleClass;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  scheduled_at: string;
  distance_km: number | null;
  duration_min: number | null;
  hours: number | null;
  passengers: number;
  fare_estimate: number;
  fare_final: number | null;
  status: BookingStatus;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  flight_number: string | null;
  passenger_first_name: string | null;
  passenger_last_name: string | null;
  passenger_email: string | null;
  passenger_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, "created_at" | "updated_at">;
        Update: Partial<Omit<UserRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      drivers: {
        Row: DriverRow;
        Insert: Omit<DriverRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DriverRow, "id" | "user_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: Omit<BookingRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BookingRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Aliases — kept so existing imports don't break
export type Profile = UserRow;
export type Driver = DriverRow;
export type Booking = BookingRow;
