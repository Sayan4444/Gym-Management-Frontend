export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  photoUrl: string;
  biometricId: string;
  role: "SuperAdmin" | "GymAdmin" | "Trainer" | "Member";
  gymId?: number;
  trainerId?: number;
}

export interface Gym {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  address: string;
  whatsapp?: string;
}

export interface MembershipPlan {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  name: string;
  price: number;
  durationMonths: number;
  isActive: boolean;
}

export interface Subscription {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  planId: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Frozen";
}

export interface Payment {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  amount: number;
  paymentDate: string;
  status: "Paid" | "Pending" | "Failed";
  paymentFor: "Membership Plan" | "Add-On";
}

export interface Attendance {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  date: string;
  timeIn: string;
  timeOut?: string;
  source: "Manual" | "Biometric";
}

export interface WorkoutPlan {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  trainerId: number;
  memberId: number;
  title: string;
  description: string;
}

export interface Addon {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  name: string;
  price: number;
  isActive: boolean;
}
