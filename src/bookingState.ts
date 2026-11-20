import type { Booking } from './types';

export function addOptimisticBooking(bookings: Booking[], booking: Booking): Booking[] {
  return [booking, ...bookings];
}

export function reconcileBooking(bookings: Booking[], pendingId: string, confirmed: Booking): Booking[] {
  return bookings.map(booking => booking.id === pendingId ? confirmed : booking);
}

export function rollbackBooking(bookings: Booking[], pendingId: string): Booking[] {
  return bookings.filter(booking => booking.id !== pendingId);
}
