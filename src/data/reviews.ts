import type { Review } from '../types';

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Elena M.',
    rating: 5,
    comment:
      'The Margherita is a masterclass in simplicity. Blistered crust, perfect balance of tomato and cheese. We come every week.',
    date: '2026-07-12',
    verified: true,
  },
  {
    id: 'r2',
    name: 'Marcus T.',
    rating: 5,
    comment:
      'Truffle Forest pizza is worth every penny. The soft egg on top is genius. Atmosphere is warm and the staff actually care.',
    date: '2026-06-28',
    verified: true,
  },
  {
    id: 'r3',
    name: 'Sofia R.',
    rating: 4,
    comment:
      'Lobster tagliatelle was rich and elegant. Only reason for four stars is that we wanted a larger portion — we finished it in minutes.',
    date: '2026-07-02',
    verified: true,
  },
  {
    id: 'r4',
    name: 'James K.',
    rating: 5,
    comment:
      'Best smash burger I’ve had outside of a dedicated burger spot. The Ember Smash with truffle fries is my go-to order.',
    date: '2026-05-19',
    verified: true,
  },
  {
    id: 'r5',
    name: 'Aisha P.',
    rating: 5,
    comment:
      'Celebrated our anniversary here. The room feels intimate, the food is thoughtful, and the tiramisu sealed the night.',
    date: '2026-08-01',
    verified: true,
  },
  {
    id: 'r6',
    name: 'Daniel W.',
    rating: 4,
    comment:
      'Solid wood-fired pizza and a great selection of non-alcoholic drinks. The Blood Orange Spritz is refreshing after a long day.',
    date: '2026-06-10',
  },
  {
    id: 'r7',
    name: 'Priya S.',
    rating: 5,
    comment:
      'Took the team for a late dinner. Everything arrived hot, the deals are fair, and the space looks beautiful at night.',
    date: '2026-07-22',
    verified: true,
  },
  {
    id: 'r8',
    name: 'Chris L.',
    rating: 5,
    comment:
      'Prosciutto & Fig pizza is a revelation. Sweet, salty, creamy — perfectly balanced. Already planning the next visit.',
    date: '2026-08-08',
    verified: true,
  },
];

export const reviewStats = {
  average: 4.8,
  total: 128,
  breakdown: [
    { stars: 5, count: 98 },
    { stars: 4, count: 22 },
    { stars: 3, count: 5 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ],
};
