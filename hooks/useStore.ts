import { create } from 'zustand';
import { v4 as uuid } from 'uuid';

interface Store {
  sessionId: string;
  bookingToken: string;
  setBookingToken: (bookingToken: string) => void;
}

const useStore = create<Store>((set) => ({
  sessionId: uuid(),
  bookingToken: '',
  setBookingToken: (bookingToken: string) =>
    set((state: any) => ({ ...state, bookingToken })),
}));

export default useStore;
