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
  role: string;
  gymId?: number;
  trainerId?: number;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  medicalConditions?: string;
  gym?: Gym;
  subscription?: Subscription[];
  userAddon?: UserAddon[];
  trainer?: User;
  workoutPlans?: WorkoutPlan[];
  payments?: Payment[];
}

export interface Gym {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  domain: string;
  address: string;
  whatsapp: string;
  users?: User[];
  phone: string;
  email: string;
  membershipPlans?: MembershipPlan[];
  addons?: Addon[];
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

export interface Addon {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  name: string;
  price: number;
  isActive: boolean;
}

export interface UserAddon {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  addonId: number;
  purchasedAt: string;
  addon?: Addon;
}

export interface Subscription {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  planId: number;
  startDate: string;
  endDate: string;
  status: string;
  plan?: MembershipPlan;
}

export interface Payment {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  amount: number;
  status: string;
  paymentFor: string;
  planId: number | null;
  addonId: number | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface Attendance {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  date: string;
  timeIn: string;
  timeOut: string | null;
  source: string;
  user?: User;
}

export interface GymQRToken {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  token: string;
  expiresAt: string;
}

export interface WorkoutExercise {
  id: number;
  createdAt: string;
  updatedAt: string;
  workoutPlanId: number;
  name: string;
}

export interface WorkoutPlan {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  trainerId: number;
  memberId: number;
  title: string;
  exercises: WorkoutExercise[];
}