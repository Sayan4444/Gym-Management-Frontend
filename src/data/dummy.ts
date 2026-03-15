import { User, Gym, MembershipPlan, Subscription, Payment, Attendance, WorkoutPlan, Addon } from "./types";

export const gyms: Gym[] = [
  { id: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01", name: "Iron Forge Fitness", slug: "iron-forge-fitness", address: "123 Main St, Downtown, NY 10001", whatsapp: "+15550100" },
  { id: 2, createdAt: "2024-02-01", updatedAt: "2024-02-01", name: "Peak Performance Gym", slug: "peak-performance-gym", address: "456 Oak Ave, Midtown, LA 90001", whatsapp: "+15550200" },
  { id: 3, createdAt: "2024-03-01", updatedAt: "2024-03-01", name: "Titan Strength Hub", slug: "titan-strength-hub", address: "789 Pine Rd, Uptown, CHI 60601", whatsapp: "+15550300" },
  { id: 4, createdAt: "2024-04-01", updatedAt: "2024-04-01", name: "Iron Flex Gym", slug: "iron-flex-gym", address: "101 Fit Lane, Dallas, TX 75201", whatsapp: "+15550400" },
];

export const users: User[] = [
  // Super Admin
  { id: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01", name: "Alex Rivera", email: "alex@gymflow.com", phone: "+1-555-0101", dob: "1985-06-15", gender: "Male", photoUrl: "", biometricId: "", role: "SuperAdmin" },
  // Gym Admins
  { id: 2, createdAt: "2024-01-02", updatedAt: "2024-01-02", name: "Sarah Chen", email: "sarah@ironforge.com", phone: "+1-555-0102", dob: "1990-03-22", gender: "Female", photoUrl: "", biometricId: "", role: "GymAdmin", gymId: 1 },
  { id: 3, createdAt: "2024-02-02", updatedAt: "2024-02-02", name: "David Kim", email: "david@peakperf.com", phone: "+1-555-0103", dob: "1988-11-10", gender: "Male", photoUrl: "", biometricId: "", role: "GymAdmin", gymId: 2 },
  // Trainers
  { id: 4, createdAt: "2024-01-05", updatedAt: "2024-01-05", name: "Marcus Johnson", email: "marcus@ironforge.com", phone: "+1-555-0104", dob: "1992-07-08", gender: "Male", photoUrl: "", biometricId: "BIO-004", role: "Trainer", gymId: 1 },
  { id: 5, createdAt: "2024-01-06", updatedAt: "2024-01-06", name: "Emily Torres", email: "emily@ironforge.com", phone: "+1-555-0105", dob: "1994-12-30", gender: "Female", photoUrl: "", biometricId: "BIO-005", role: "Trainer", gymId: 1 },
  { id: 6, createdAt: "2024-02-05", updatedAt: "2024-02-05", name: "Ryan Patel", email: "ryan@peakperf.com", phone: "+1-555-0106", dob: "1991-04-18", gender: "Male", photoUrl: "", biometricId: "BIO-006", role: "Trainer", gymId: 2 },
  // Members - Gym 1
  { id: 7, createdAt: "2024-01-10", updatedAt: "2024-01-10", name: "Jessica Williams", email: "jessica@mail.com", phone: "+1-555-0107", dob: "1995-08-25", gender: "Female", photoUrl: "", biometricId: "BIO-007", role: "Member", gymId: 1, trainerId: 4, address: "456 Elm Street, Apt 12, Brooklyn, NY 11201", emergencyContactName: "Robert Williams", emergencyContactPhone: "+1-555-0190", bloodGroup: "O+", height: 165, weight: 58 },
  { id: 8, createdAt: "2024-01-11", updatedAt: "2024-01-11", name: "Michael Brown", email: "michael@mail.com", phone: "+1-555-0108", dob: "1993-02-14", gender: "Male", photoUrl: "", biometricId: "BIO-008", role: "Member", gymId: 1, trainerId: 4 },
  { id: 9, createdAt: "2024-01-12", updatedAt: "2024-01-12", name: "Amanda Garcia", email: "amanda@mail.com", phone: "+1-555-0109", dob: "1997-05-03", gender: "Female", photoUrl: "", biometricId: "BIO-009", role: "Member", gymId: 1, trainerId: 5 },
  { id: 10, createdAt: "2024-01-15", updatedAt: "2024-01-15", name: "Chris Davis", email: "chris@mail.com", phone: "+1-555-0110", dob: "1990-09-20", gender: "Male", photoUrl: "", biometricId: "", role: "Member", gymId: 1, trainerId: 5 },
  { id: 11, createdAt: "2024-02-01", updatedAt: "2024-02-01", name: "Olivia Martinez", email: "olivia@mail.com", phone: "+1-555-0111", dob: "1996-01-12", gender: "Female", photoUrl: "", biometricId: "BIO-011", role: "Member", gymId: 1, trainerId: 4 },
  { id: 12, createdAt: "2024-02-05", updatedAt: "2024-02-05", name: "Daniel Lee", email: "daniel@mail.com", phone: "+1-555-0112", dob: "1989-11-28", gender: "Male", photoUrl: "", biometricId: "BIO-012", role: "Member", gymId: 1 },
  { id: 13, createdAt: "2024-02-10", updatedAt: "2024-02-10", name: "Sophie Anderson", email: "sophie@mail.com", phone: "+1-555-0113", dob: "1998-07-07", gender: "Female", photoUrl: "", biometricId: "", role: "Member", gymId: 1, trainerId: 5 },
  // Members - Gym 2
  { id: 14, createdAt: "2024-02-10", updatedAt: "2024-02-10", name: "James Wilson", email: "james@mail.com", phone: "+1-555-0114", dob: "1991-03-16", gender: "Male", photoUrl: "", biometricId: "BIO-014", role: "Member", gymId: 2, trainerId: 6 },
  { id: 15, createdAt: "2024-02-12", updatedAt: "2024-02-12", name: "Emma Taylor", email: "emma@mail.com", phone: "+1-555-0115", dob: "1994-10-05", gender: "Female", photoUrl: "", biometricId: "BIO-015", role: "Member", gymId: 2, trainerId: 6 },
  { id: 16, createdAt: "2024-02-15", updatedAt: "2024-02-15", name: "Liam Thomas", email: "liam@mail.com", phone: "+1-555-0116", dob: "1992-06-22", gender: "Male", photoUrl: "", biometricId: "", role: "Member", gymId: 2 },
  { id: 17, createdAt: "2024-03-01", updatedAt: "2024-03-01", name: "Mia Jackson", email: "mia@mail.com", phone: "+1-555-0117", dob: "1999-04-11", gender: "Female", photoUrl: "", biometricId: "BIO-017", role: "Member", gymId: 2, trainerId: 6 },
  { id: 18, createdAt: "2024-03-05", updatedAt: "2024-03-05", name: "Noah White", email: "noah@mail.com", phone: "+1-555-0118", dob: "1993-12-01", gender: "Male", photoUrl: "", biometricId: "BIO-018", role: "Member", gymId: 2 },
];

export const membershipPlans: MembershipPlan[] = [
  { id: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01", gymId: 1, name: "Basic Monthly", price: 29.99, durationMonths: 1, isActive: true },
  { id: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01", gymId: 1, name: "Premium Monthly", price: 59.99, durationMonths: 1, isActive: true },
  { id: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01", gymId: 1, name: "Annual Basic", price: 299.99, durationMonths: 12, isActive: true },
  { id: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01", gymId: 1, name: "Annual Premium", price: 599.99, durationMonths: 12, isActive: true },
  { id: 5, createdAt: "2024-01-01", updatedAt: "2024-01-01", gymId: 1, name: "Student Special", price: 19.99, durationMonths: 1, isActive: false },
  { id: 6, createdAt: "2024-02-01", updatedAt: "2024-02-01", gymId: 2, name: "Standard", price: 39.99, durationMonths: 1, isActive: true },
  { id: 7, createdAt: "2024-02-01", updatedAt: "2024-02-01", gymId: 2, name: "Pro Annual", price: 399.99, durationMonths: 12, isActive: true },
];

export const subscriptions: Subscription[] = [
  { id: 1, createdAt: "2024-01-10", updatedAt: "2024-01-10", userId: 7, planId: 2, startDate: "2024-01-10", endDate: "2026-04-10", status: "Active" },
  { id: 2, createdAt: "2024-01-11", updatedAt: "2024-01-11", userId: 8, planId: 4, startDate: "2024-01-11", endDate: "2025-01-11", status: "Expired" },
  { id: 3, createdAt: "2024-01-12", updatedAt: "2024-01-12", userId: 9, planId: 2, startDate: "2025-01-12", endDate: "2026-04-12", status: "Active" },
  { id: 4, createdAt: "2024-01-15", updatedAt: "2024-01-15", userId: 10, planId: 1, startDate: "2026-02-15", endDate: "2026-03-15", status: "Active" },
  { id: 5, createdAt: "2024-02-01", updatedAt: "2024-02-01", userId: 11, planId: 3, startDate: "2024-02-01", endDate: "2025-02-01", status: "Expired" },
  { id: 6, createdAt: "2024-02-05", updatedAt: "2024-02-05", userId: 12, planId: 2, startDate: "2025-12-05", endDate: "2026-06-05", status: "Active" },
  { id: 7, createdAt: "2024-02-10", updatedAt: "2024-02-10", userId: 13, planId: 1, startDate: "2025-12-10", endDate: "2026-05-10", status: "Frozen" },
  { id: 8, createdAt: "2024-02-10", updatedAt: "2024-02-10", userId: 14, planId: 6, startDate: "2025-12-10", endDate: "2026-06-10", status: "Active" },
  { id: 9, createdAt: "2024-02-12", updatedAt: "2024-02-12", userId: 15, planId: 7, startDate: "2024-02-12", endDate: "2025-02-12", status: "Expired" },
  { id: 10, createdAt: "2024-02-15", updatedAt: "2024-02-15", userId: 16, planId: 6, startDate: "2026-01-15", endDate: "2026-04-15", status: "Active" },
];

const generateAttendanceRecords = (): Attendance[] => {
  const records: Attendance[] = [];
  const memberIds = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  let id = 1;
  for (let d = 30; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];
    const attending = memberIds.filter(() => Math.random() > 0.35);
    for (const uid of attending) {
      const hourIn = 6 + Math.floor(Math.random() * 10);
      const minIn = Math.floor(Math.random() * 60);
      const hourOut = hourIn + 1 + Math.floor(Math.random() * 2);
      const minOut = Math.floor(Math.random() * 60);
      records.push({
        id: id++,
        createdAt: dateStr,
        updatedAt: dateStr,
        userId: uid,
        date: dateStr,
        timeIn: `${dateStr}T${String(hourIn).padStart(2, "0")}:${String(minIn).padStart(2, "0")}:00`,
        timeOut: d === 0 && Math.random() > 0.5 ? undefined : `${dateStr}T${String(hourOut).padStart(2, "0")}:${String(minOut).padStart(2, "0")}:00`,
        source: Math.random() > 0.3 ? "Biometric" : "Manual",
      });
    }
  }
  return records;
};

export const attendanceRecords: Attendance[] = generateAttendanceRecords();

export const payments: Payment[] = [
  { id: 1, createdAt: "2024-01-10", updatedAt: "2024-01-10", userId: 7, amount: 59.99, paymentDate: "2024-01-10", status: "Paid", paymentFor: "Membership Plan" },
  { id: 2, createdAt: "2024-01-11", updatedAt: "2024-01-11", userId: 8, amount: 599.99, paymentDate: "2024-01-11", status: "Paid", paymentFor: "Membership Plan" },
  { id: 3, createdAt: "2024-01-12", updatedAt: "2024-01-12", userId: 9, amount: 59.99, paymentDate: "2024-01-12", status: "Paid", paymentFor: "Membership Plan" },
  { id: 4, createdAt: "2024-01-15", updatedAt: "2024-01-15", userId: 10, amount: 29.99, paymentDate: "2024-01-15", status: "Paid", paymentFor: "Membership Plan" },
  { id: 5, createdAt: "2024-02-01", updatedAt: "2024-02-01", userId: 11, amount: 299.99, paymentDate: "2024-02-01", status: "Paid", paymentFor: "Membership Plan" },
  { id: 6, createdAt: "2024-02-05", updatedAt: "2024-02-05", userId: 12, amount: 59.99, paymentDate: "2024-02-05", status: "Paid", paymentFor: "Membership Plan" },
  { id: 7, createdAt: "2024-02-10", updatedAt: "2024-02-10", userId: 13, amount: 29.99, paymentDate: "2024-02-10", status: "Pending", paymentFor: "Membership Plan" },
  { id: 8, createdAt: "2024-02-10", updatedAt: "2024-02-10", userId: 14, amount: 39.99, paymentDate: "2024-02-10", status: "Paid", paymentFor: "Membership Plan" },
  { id: 9, createdAt: "2024-02-12", updatedAt: "2024-02-12", userId: 15, amount: 399.99, paymentDate: "2024-02-12", status: "Paid", paymentFor: "Membership Plan" },
  { id: 10, createdAt: "2024-02-15", updatedAt: "2024-02-15", userId: 16, amount: 39.99, paymentDate: "2024-02-15", status: "Failed", paymentFor: "Add-On" },
  { id: 11, createdAt: "2024-03-01", updatedAt: "2024-03-01", userId: 7, amount: 59.99, paymentDate: "2025-03-01", status: "Paid", paymentFor: "Add-On" },
  { id: 12, createdAt: "2024-03-01", updatedAt: "2024-03-01", userId: 9, amount: 59.99, paymentDate: "2025-03-01", status: "Paid", paymentFor: "Membership Plan" },
  { id: 13, createdAt: "2024-03-05", updatedAt: "2024-03-05", userId: 10, amount: 29.99, paymentDate: "2025-03-05", status: "Pending", paymentFor: "Add-On" },
  { id: 14, createdAt: "2024-03-10", updatedAt: "2024-03-10", userId: 17, amount: 39.99, paymentDate: "2025-03-10", status: "Paid", paymentFor: "Membership Plan" },
  { id: 15, createdAt: "2024-03-11", updatedAt: "2024-03-11", userId: 18, amount: 39.99, paymentDate: "2025-03-11", status: "Paid", paymentFor: "Membership Plan" },
];

export const workoutPlans: WorkoutPlan[] = [
  { id: 1, createdAt: "2024-01-15", updatedAt: "2024-01-15", gymId: 1, trainerId: 4, memberId: 7, title: "Strength Foundation", description: "4-week progressive overload program focusing on compound movements: squats, deadlifts, bench press, overhead press. 4 days/week." },
  { id: 2, createdAt: "2024-01-15", updatedAt: "2024-01-15", gymId: 1, trainerId: 4, memberId: 8, title: "Mass Builder", description: "Hypertrophy-focused program with high volume training. Push/Pull/Legs split, 6 days/week with progressive overload." },
  { id: 3, createdAt: "2024-01-16", updatedAt: "2024-01-16", gymId: 1, trainerId: 5, memberId: 9, title: "HIIT & Tone", description: "High intensity interval training combined with resistance training. Full body circuits 3 days + 2 cardio sessions." },
  { id: 4, createdAt: "2024-01-20", updatedAt: "2024-01-20", gymId: 1, trainerId: 5, memberId: 10, title: "Beginner Basics", description: "Introduction to weight training. Learn proper form on all major exercises. 3 days/week full body routine." },
  { id: 5, createdAt: "2024-02-01", updatedAt: "2024-02-01", gymId: 1, trainerId: 4, memberId: 11, title: "Athletic Performance", description: "Sport-specific training combining strength, agility, and conditioning. 5 days/week with periodization." },
  { id: 6, createdAt: "2024-02-12", updatedAt: "2024-02-12", gymId: 2, trainerId: 6, memberId: 14, title: "Powerlifting Prep", description: "Competition prep program focusing on squat, bench, deadlift. Peaking cycle over 8 weeks." },
  { id: 7, createdAt: "2024-02-12", updatedAt: "2024-02-12", gymId: 2, trainerId: 6, memberId: 15, title: "Functional Fitness", description: "Functional movement patterns for everyday strength. Kettlebells, bodyweight, and mobility work. 4 days/week." },
];

export const addons: Addon[] = [
  { id: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01", gymId: 1, name: "Oxygen Tube1", price: 15.00, isActive: true },
  { id: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01", gymId: 1, name: "Oxygen Tube2", price: 20.00, isActive: true },
];

// Helper functions
export const getUserById = (id: number) => users.find(u => u.id === id);
export const getGymById = (id: number) => gyms.find(g => g.id === id);
export const getPlanById = (id: number) => membershipPlans.find(p => p.id === id);
export const getMembersByGym = (gymId: number) => users.filter(u => u.gymId === gymId && u.role === "Member");
export const getTrainersByGym = (gymId: number) => users.filter(u => u.gymId === gymId && u.role === "Trainer");
export const getSubscriptionByUser = (userId: number) => subscriptions.find(s => s.userId === userId);
export const getPaymentsByUser = (userId: number) => payments.filter(p => p.userId === userId);
export const getAttendanceByUser = (userId: number) => attendanceRecords.filter(a => a.userId === userId);
export const getAttendanceByDate = (date: string) => attendanceRecords.filter(a => a.date === date);
export const getWorkoutPlansByTrainer = (trainerId: number) => workoutPlans.filter(w => w.trainerId === trainerId);
export const getWorkoutPlansByMember = (memberId: number) => workoutPlans.filter(w => w.memberId === memberId);
export const getPlansByGym = (gymId: number) => membershipPlans.filter(p => p.gymId === gymId);
export const getAddonsByGym = (gymId: number) => addons.filter(a => a.gymId === gymId);
export const getGymBySlug = (slug: string) => gyms.find(g => g.slug === slug);
