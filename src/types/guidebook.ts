export interface HotelContact {
  receptionPhone: string;
  golfPhone: string;
  email: string;
  website: string;
  address: string;
  eircode: string;
  internalDial: string;
}

export interface StayHours {
  checkIn: string;
  checkOut: string;
  expressCheckout: boolean;
  breakfastWeekdays: string;
  breakfastWeekends: string;
}

export interface WifiInfo {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
  notes: string;
}

export interface DiningItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'drinks';
  description: string;
  hours: string;
  highlight?: string;
}

export interface LeisureSchedule {
  poolWeekdays: string;
  poolWeekends: string;
  adultOnlyHours: string;
  kidsSwimHours: string;
  gymHours: string;
  spaBookingPhone: string;
  swimCapRequired: boolean;
  swimCapPrice: string;
}

export interface GolfInfo {
  holes: number;
  par: number;
  designer: string;
  lengthYards: string;
  proShopHours: string;
  buggyHireRate: string;
  trolleyHireRate: string;
  dressCode: string;
  courseStatus: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: 'racing' | 'dining' | 'historic' | 'nature' | 'transport';
  distanceKm: string;
  travelTime: string;
  description: string;
  insiderTip: string;
  mapsUrl: string;
  image?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  iconName: string;
  badge?: string;
  items: {
    heading: string;
    details: string;
    actionLabel?: string;
    actionType?: 'call' | 'wifi' | 'modal' | 'link';
    actionPayload?: string;
  }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Check-in' | 'Wi-Fi' | 'Dining' | 'Golf & Leisure' | 'Policies';
}

export interface ResortBulletin {
  weatherTemp: string;
  weatherCondition: string;
  weatherNote: string;
  golfCourseStatus: string;
  todaysSpecial: string;
  breakfastStatus: string;
  announcement: string;
}

export interface StandeeConfig {
  title: string;
  subtitle: string;
  welcomeMessage: string;
  qrType: 'guidebook' | 'wifi';
  customUrl: string;
  showWifiBox: boolean;
  paperSize: 'a4' | 'tent_5x7';
}

export interface HotelData {
  name: string;
  tagline: string;
  heroImage: string;
  diningImage: string;
  leisureImage: string;
  golfImage: string;
  contact: HotelContact;
  stayHours: StayHours;
  wifi: WifiInfo;
  bulletin: ResortBulletin;
  dining: DiningItem[];
  leisure: LeisureSchedule;
  golf: GolfInfo;
  attractions: Attraction[];
  guideSections: GuideSection[];
  faqs: FAQItem[];
  standee: StandeeConfig;
  hostPasscode: string;
}
