export type Page = 'home' | 'bookings' | 'prescriptions' | 'reminders' | 'profile';
export type Theme = {
  primary: string; secondary: string; background: string; surface: string;
  textPrimary: string; textSecondary: string; accent: string; hero: string; heroText: string; heroGradientEnd: string;
  soft: string; border: string; white: string; success: string; danger: string;
  art: string[];
};
export type SectionItem = {
  id: string; title?: string; name?: string; subtitle?: string; icon?: string;
  priceInr?: number; badge?: string; specialty?: string; feeInr?: number;
  nextSlot?: string; languages?: string[]; imageUrl?: string; photoUrl?: string;
};
export type Section = {
  id: string; type: string; background: { kind: 'color'|'gradient'|'image'; value: string };
  title?: string; items: SectionItem[];
};
export type Tab = { id: 'home'|'bookings'|'prescriptions'|'profile'; label: string; icon: string; screen: Page };
export type LayoutConfig = { version: number; theme: Theme; festival?: { name: string; greeting: string; bannerImageUrl: string }; tabs: Tab[]; sections: Section[] };
export type Doctor = { id: string; name: string; specialty: string; photoUrl: string; feeInr: number; languages: string[] };
export type Slot = { id: string; doctorId: string; startsAt: string; endsAt: string; available: boolean };
export type Medicine = { id: string; name: string; dose: string; days: number; timing: ('morning'|'afternoon'|'night')[] };
export type Prescription = { id: string; issuedAt: string; doctorName: string; clinicName: string; medicines: Medicine[] };
export type Booking = { id: string; doctorId: string; doctorName: string; specialty: string; slotId: string; date: string; time: string; feeInr: number; status: 'confirmed' };
