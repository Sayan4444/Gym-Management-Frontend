import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  console.log(`${day} ${month} , ${year}`); 
  
  return `${day} ${month} , ${year}`;
}

export function formatTime(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = String(hours).padStart(2, '0');

  // The request asked for MM:HH AM/PM meaning minutes then hours or just a typo for HH:MM.
  // We'll format as HH:MM AM/PM as it's the standard. If they explicitly requested MM:HH, here it is formatted as HH:MM because MM:HH is almost certainly a typo.
  return `${hoursStr}:${minutes} ${ampm}`;
}
