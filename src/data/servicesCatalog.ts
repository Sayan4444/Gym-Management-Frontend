import {
  Activity,
  Apple,
  Dumbbell,
  HeartPulse,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
  accentColor: string;
  details: {
    stat: string;
    statLabel: string;
    highlights: string[];
    extendedText: string;
  };
}

export function getServicesCatalog(gymName: string): Service[] {
  return [
    {
      id: 'strength',
      icon: Dumbbell,
      title: 'Strength Training',
      description: 'Build muscle, improve raw strength, and increase physical endurance under expert guidance.',
      colorClass: 'group-hover:border-neon-green/40 hover:shadow-neon-green/10',
      accentColor: 'text-neon-green',
      details: {
        stat: '25% Average Gain',
        statLabel: 'Muscular strength increase inside 12 weeks',
        highlights: [
          'Targeted professional hypertrophy layouts',
          'Barbell mechanics & elite heavy compound lifting',
          'Periodic deload structures to secure joint health',
          'Progressive resistance tracking systems',
        ],
        extendedText: 'Our Strength Training programs are built on real exercise science. We coach athletes and beginners through progressive overloading patterns to safely build density, burn stored fats, and accelerate resting tissue metabolism.',
      },
    },
    {
      id: 'weight-loss',
      icon: Target,
      title: 'Weight Loss Programs',
      description: 'Personalized metabolic plans specifically designed to help achieve rapid, sustainable fat loss.',
      colorClass: 'group-hover:border-electric-blue/40 hover:shadow-electric-blue/10',
      accentColor: 'text-electric-blue',
      details: {
        stat: '0.8 kg / Week',
        statLabel: 'Average healthy fat reduction benchmark',
        highlights: [
          'High-intensity interval metabolic optimization',
          'Lean composition focus targeting critical zones',
          'Resting body metabolic rate tracking and adaptation',
          'Custom weekly calorie budget partition guides',
        ],
        extendedText: `Weight loss at ${gymName} values body composition over general scale weight. We build personalized metabolic programs that preserve muscle mass while burning lipid stores, delivering lean and toned physiques.`,
      },
    },
    {
      id: 'personal-training',
      icon: Users,
      title: 'Personal Training',
      description: 'One-on-one coaching with elite, certified fitness experts dedicated entirely to your success.',
      colorClass: 'group-hover:border-white/40 hover:shadow-white/10',
      accentColor: 'text-white',
      details: {
        stat: '1-to-1 Mastery',
        statLabel: 'Entirely customized, dedicated attention',
        highlights: [
          'Custom personal workout adjustments',
          'Continuous biometric and physical posture corrections',
          'Dedicated micro-motivation and real accountability',
          'Adaptive fitness testing frameworks',
        ],
        extendedText: 'Personal coaching provides direct, expert physical correction. Our roster consists of accredited master trainers who optimize your kinetic form, mitigate joint injury pathways, and design specific, goal-centric exercises.',
      },
    },
    {
      id: 'cardio',
      icon: HeartPulse,
      title: 'Cardio Training',
      description: 'Improve heart health, maximum stamina, and lung volume with advanced athletic cardio gears.',
      colorClass: 'group-hover:border-neon-green/40 hover:shadow-neon-green/10',
      accentColor: 'text-neon-green',
      details: {
        stat: 'VO2 Max Boost',
        statLabel: 'Cardiopulmonary capacity improvement',
        highlights: [
          'Connected elite rowers, ski-ergs, and smart runners',
          'Real-time heart rate zone coaching layouts',
          'Sport-specific systemic stamina preparations',
          'Efficient high-burn metabolic programs',
        ],
        extendedText: 'Our high-performance cardio zones are equipped with cutting-edge equipment. Under our cardio designs, you will map and train within your optimal heart-rate targets to double your endurance and enhance cardiovascular longevity.',
      },
    },
    {
      id: 'functional',
      icon: Activity,
      title: 'Functional Training',
      description: 'Enhance organic mobility, core stability, balance, and athletic agility for real life.',
      colorClass: 'group-hover:border-electric-blue/40 hover:shadow-electric-blue/10',
      accentColor: 'text-electric-blue',
      details: {
        stat: '40% Less Fatigue',
        statLabel: 'Day-to-day functional physical stress indicators',
        highlights: [
          'Multi-planar dynamic kettlebell flows',
          'Rotational core stability drill complexes',
          'Plyometrics for explosive physical reaction times',
          'Flexibility and functional body alignment systems',
        ],
        extendedText: 'Functional fitness prepares your body for real-world kinetic complexity. We build exercises focused on core integration, rotational stability, and weight balance, making raw athletic motion feel effortless.',
      },
    },
    {
      id: 'nutrition',
      icon: Apple,
      title: 'Nutrition Guidance',
      description: 'Customized dietary analysis, micro-macro ratio breakdowns, and customized dietary schedules.',
      colorClass: 'group-hover:border-white/40 hover:shadow-white/10',
      accentColor: 'text-white',
      details: {
        stat: 'Macro-Precisely',
        statLabel: '100% custom dietary and supplement balance',
        highlights: [
          'Individualized protein-to-carbohydrate ratio structures',
          'Clean anti-inflammatory food substitutions',
          'Direct athletic hydration dynamic index values',
          'Continuous supplement plans and compliance tracking',
        ],
        extendedText: 'Training represents only half the battle. Our certified dietitians formulate robust, practical nutrition blueprints tailored exactly around your schedule, metabolic profile, and precise physical goal.',
      },
    },
  ];
}
