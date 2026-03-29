export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  photo_url: string;
  biometric_id: string;
  role: string;
  gym_id: number | null;
  subscription_id: number | null;
  trainer_id: number | null;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_group: string;
  height: number | null;
  weight: number | null;
  medical_conditions: string;
}

export interface Gym {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  address: string;
  whatsapp: string;
  Users?: User[];
}

export interface MembershipPlan {
  id: number;
  createdAt: string;
  updatedAt: string;
  gym_id: number;
  name: string;
  price: number;
  duration_months: number;
  is_active: boolean;
}

export interface Addon {
  id: number;
  createdAt: string;
  updatedAt: string;
  gym_id: number;
  name: string;
  price: number;
  is_active: boolean;
}

export interface UserAddon {
  id: number;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  addon_id: number;
  payment_id: number;
  purchased_at: string;
}

export interface Subscription {
  id: number;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface Payment {
  id: number;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  amount: number;
  payment_date: string;
  status: string;
  payment_for: string;
  plan_id: number | null;
  addon_id: number | null;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface Attendance {
  id: number;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  date: string;
  time_in: string;
  time_out: string | null;
  source: string;
}

export interface GymQRToken {
  id: number;
  createdAt: string;
  updatedAt: string;
  gym_id: number;
  token: string;
  expires_at: string;
}

export interface WorkoutPlan {
  id: number;
  createdAt: string;
  updatedAt: string;
  gym_id: number;
  trainer_id: number;
  member_id: number;
  title: string;
  description: string;
}
