import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface GymBrandProps {
  name: string;
  icon?: string | null;
  className?: string;
}

export function GymBrand({ name, icon, className }: GymBrandProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-electric-blue to-neon-green text-black">
        {icon ? (
          <img src={icon} alt={`${name} icon`} className="h-full w-full object-cover" />
        ) : (
          <Dumbbell className="h-5 w-5 text-black" aria-hidden="true" />
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="truncate whitespace-nowrap font-display text-lg font-black leading-none tracking-tight text-white md:text-xl">
          {name}
        </span>
        <span className="-mt-0.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          Fitness Club
        </span>
      </div>
    </div>
  );
}
