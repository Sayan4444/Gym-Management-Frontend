import { IBookConsultationPayload } from '../../hooks/apis/useBookConsultation';
import { fetchApi } from './core';

export const consultationApi = {
  submitConsultationRequest: (gymId: number, data: IBookConsultationPayload) =>
    fetchApi(`/gyms/${gymId}/consultation-requests`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
