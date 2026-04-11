import { fetchApi } from './core';
import { Addon } from '../../data/types';
import { IBookDemoPayload } from '../../hooks/apis/useBookDemo';

export const bookDemoApi = {
  // ----- book-demo Routes -----
    submitDemoRequest: (data: IBookDemoPayload) => fetchApi("/demo-request", { method: "POST", body: JSON.stringify(data) }),
};
