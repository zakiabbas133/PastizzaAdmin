import type { Location } from '../types';

export const locations: Location[] = [
  {
    id: 'loc1',
    name: 'Riverside',
    address: '42 Ember Lane, Riverside District',
    phone: '+1 (555) 014-2200',
    whatsapp: '+15550142200',
    openingHours: [
      'Mon–Thu: 11:00 – 22:00',
      'Fri–Sat: 11:00 – 23:30',
      'Sun: 12:00 – 21:00',
    ],
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 'loc2',
    name: 'Oak & Main',
    address: '118 Main Street, Oak Quarter',
    phone: '+1 (555) 014-3300',
    whatsapp: '+15550143300',
    openingHours: [
      'Mon–Thu: 11:30 – 22:00',
      'Fri–Sat: 11:30 – 00:00',
      'Sun: 12:00 – 21:30',
    ],
    coordinates: { lat: 40.7282, lng: -73.9942 },
  },
];
