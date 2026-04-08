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
  gymId: number | null;
  subscriptionId: number | null;
  trainerId: number | null;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  height: number | null;
  weight: number | null;
  medicalConditions: string;
  workoutPlanId: number | null;
  gym?: Gym;
  subscription?: Subscription;
  trainer?: User;
  workoutPlans?: WorkoutPlan[];
}

export interface Gym {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  address: string;
  whatsapp: string;
  users?: User[];
  phone: string;
  email: string;
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
  paymentId: number;
  purchasedAt: string;
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
  paymentDate: string;
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