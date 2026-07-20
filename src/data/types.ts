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
  timings?: string | null;
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
  socialMedia?: string[];
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
  gymIcon?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  googleMapsLink?: string;
  openingTime?: string;
  closingTime?: string;
  renewalNoticeDays?: number;
  membershipPlans?: MembershipPlan[];
  addons?: Addon[];
}

export interface MembershipPlan {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  name: string;
  description?: string | null;
  price: number;
  durationMonths: number;
  isActive: boolean;
  planIcon?: string | null;
  planAddons?: PlanAddon[];
}

export interface PlanAddon {
  id: number;
  createdAt: string;
  updatedAt: string;
  planId: number;
  addonId: number;
  frequency: number; // free-text e.g. "monthly", "twice a week", "12 sessions"
  addon?: Addon;
}

export interface Addon {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  name: string;
  description?: string | null;
  price: number;
  isActive: boolean;
  duration: number; // duration in minutes (0 = not set)
}

export interface UserAddon {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  addonId: number;
  purchasedAt: string;
  scheduledAt?: string | null; // optional scheduled date/time (ISO 8601)
  status: string; // Dynamically computed: "Purchased", "Scheduled", "In Progress", "Completed"
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
  userName?: string;
  invoice?: string;
  planName?: string;
  itemName?: string;
  paymentMethod?: string;
}

export interface Notification {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  gymId?: number;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  readAt?: string | null;
  dismissedAt?: string | null;
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

export interface Review {
  id: number;
  createdAt: string;
  updatedAt: string;
  gymId: number;
  userId: number;
  userName: string;
  userPhotoUrl: string;
  rating: number;
  content: string;
  isFeatured: boolean;
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
