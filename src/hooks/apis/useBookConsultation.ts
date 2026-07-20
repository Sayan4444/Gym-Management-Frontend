import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface IBookConsultationPayload {
  fullName: string;
  mobile: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export function useBookConsultation(gymId: number) {
  return useMutation({
    mutationFn: (body: IBookConsultationPayload) =>
      api.submitConsultationRequest(gymId, body),
  });
}
