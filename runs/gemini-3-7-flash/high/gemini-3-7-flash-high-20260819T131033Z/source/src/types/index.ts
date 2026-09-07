export type VibeType = 
  | 'Coastal & Beach'
  | 'Mountain & Alpine'
  | 'Wine Country'
  | 'Desert & Stargazing'
  | 'Forest & Cabins'
  | 'Lakeside'
  | 'City & Culture';

export type BudgetTier = '$' | '$$' | '$$$' | '$$$$';

export type TransportType = 'Drive' | 'Scenic Train' | 'Quick Flight';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: 'Organizer' | 'Member';
  location: string;
  preference: {
    maxDriveHours: number;
    maxBudget: number;
    preferredVibe: VibeType[];
  };
}

export interface CostBreakdown {
  lodgingPerNight: number;
  estimatedTravel: number;
  foodAndDrinksPerDay: number;
  activitiesTotal: number;
  notes?: string;
}

export interface LodgingOption {
  name: string;
  type: string;
  pricePerNight: number;
  rating: number;
  bedrooms: number;
  bathrooms: number;
  perks: string[];
  imageUrl: string;
}

export interface ItineraryActivity {
  id: string;
  day: 'Friday' | 'Saturday' | 'Sunday';
  time: string; // e.g. "06:00 PM"
  title: string;
  description: string;
  category: 'Travel & Check-in' | 'Food & Drinks' | 'Outdoors & Adventure' | 'Relaxation' | 'Nightlife & Social' | 'Culture & Sightseeing';
  location: string;
  estimatedCostPerPerson: number;
  isCompleted?: boolean;
  assignedFriendIds?: string[];
  tips?: string;
}

export interface DestinationComment {
  id: string;
  friendId: string;
  destinationId: string;
  text: string;
  createdAt: string;
  reaction?: string;
}

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  stateOrRegion: string;
  vibe: VibeType[];
  budgetTier: BudgetTier;
  heroImage: string;
  galleryImages: string[];
  driveTimeHours: number;
  distanceMiles: number;
  transportType: TransportType;
  avgTemperature: string;
  weatherCondition: string;
  description: string;
  highlights: string[];
  pros: string[];
  cons: string[];
  costBreakdown: CostBreakdown;
  lodgingOptions: LodgingOption[];
  sampleItinerary: ItineraryActivity[];
  featuredBadge?: string;
  rating: number;
  reviewCount: number;
}

export interface TripExpense {
  id: string;
  title: string;
  category: 'Lodging' | 'Transport & Gas' | 'Groceries & Meals' | 'Activities' | 'Supplies';
  amount: number;
  paidByFriendId: string;
  splitAmongFriendIds: string[];
  date: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'Shared Gear' | 'Food & Drinks' | 'First Aid & Safety' | 'Games & Fun' | 'Personal Essentials';
  assignedToFriendId?: string;
  isCompleted: boolean;
}

export interface CarpoolGroup {
  id: string;
  driverId: string;
  vehicleName: string;
  totalSeats: number;
  departureTime: string;
  departureLocation: string;
  passengerIds: string[];
  notes?: string;
}

export interface TripMeta {
  title: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  originCity: string;
  groupDescription: string;
  isVotingLocked: boolean;
  winningDestinationId?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}
