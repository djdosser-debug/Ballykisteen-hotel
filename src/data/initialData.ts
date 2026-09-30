import { HotelData } from '../types/guidebook';

export const defaultQuickActions = [
  {
    id: "qa-wifi",
    title: "Wi-Fi Connect",
    subtitle: "1-tap copy & QR scan",
    iconName: "Wifi",
    actionType: "modal" as const,
    actionPayload: "wifi",
    bgColor: "emerald" as const,
    isFullWidth: false,
    enabled: true
  },
  {
    id: "qa-room-key",
    title: "Check-in & Keys",
    subtitle: "Arrivals & baggage",
    iconName: "KeyRound",
    actionType: "modal" as const,
    actionPayload: "roomKey",
    bgColor: "amber" as const,
    isFullWidth: false,
    enabled: true
  },
  {
    id: "qa-dining",
    title: "Junction One Dining",
    subtitle: "Carvery, dinner & drinks",
    iconName: "Utensils",
    actionType: "modal" as const,
    actionPayload: "dining",
    bgColor: "orange" as const,
    isFullWidth: false,
    enabled: true
  },
  {
    id: "qa-leisure",
    title: "Pool, Spa & Golf",
    subtitle: "Timetable & gym access",
    iconName: "Waves",
    actionType: "modal" as const,
    actionPayload: "leisure",
    bgColor: "teal" as const,
    isFullWidth: false,
    enabled: true
  },
  {
    id: "qa-front-desk",
    title: "Call Front Desk Reception",
    subtitle: "Direct hotel assistance & room service order",
    iconName: "Phone",
    actionType: "tel" as const,
    actionPayload: "+3536233333",
    bgColor: "primary" as const,
    isFullWidth: true,
    badge: "24/7 Ext. 0",
    enabled: true
  }
];

export const defaultHomeConfig = {
  welcomeSubtitle: "Welcome to Tipperary",
  starRatingText: "4-Star Resort",
  checkInStripText: "Check-in: 3:00 PM",
  wifiStripText: "Wi-Fi: Ballykisteen_Guest",
  bulletinTitle: "Today's Resort Bulletin",
  bulletinLocation: "Limerick Junction",
  bulletinEnabled: true,
  highlightsTitle: "Resort Highlights",
  highlightsSubtitle: "Explore all guides →",
  highlights: [
    {
      id: "hl-golf",
      title: "Championship Parkland Golf",
      subtitle: "Preferential green fees for hotel residents",
      badge: "Des Smyth Design · 18 Holes",
      image: "/images/championship_golf_course_1790677430157.jpg",
      actionType: "tab" as const,
      actionPayload: "guide",
      actionLabel: "Book Tee Time →",
      enabled: true
    },
    {
      id: "hl-dining",
      title: "Junction One Bar & Restaurant",
      subtitle: "Carvery lunch, dinner & afternoon tea",
      badge: "Irish Seasonal Cuisine",
      image: "/images/junction_one_dining_1790677408670.jpg",
      actionType: "modal" as const,
      actionPayload: "dining",
      actionLabel: "View Menus →",
      enabled: true
    }
  ],
  reviewCard: {
    enabled: true,
    rating: "4.5 / 5.0",
    title: "Enjoying your stay at Ballykisteen?",
    subtitle: "Share your feedback on Google Maps reviews.",
    buttonText: "Review Us",
    reviewUrl: "https://www.google.com/maps/place/Great+National+Ballykisteen+Golf+Hotel/@52.502931,-8.204561,15z"
  },
  locationBar: {
    enabled: true,
    eircodeNote: "Eircode: E34 VK12 · N24 Route",
    mapsButtonText: "Maps →"
  }
};

export const initialHotelData: HotelData = {
  name: "Great National Ballykisteen Golf Hotel & Leisure Club",
  tagline: "4-Star Country Resort & 18-Hole Championship Golf Course",
  logoImage: "/ballykisteen_hotel_logo.jpg",
  heroImage: "/images/ballykisteen_resort_hero_1790677395754.jpg",
  diningImage: "/images/junction_one_dining_1790677408670.jpg",
  leisureImage: "/images/leisure_pool_spa_1790677420010.jpg",
  golfImage: "/images/championship_golf_course_1790677430157.jpg",
  contact: {
    receptionPhone: "+3536233333",
    golfPhone: "+3536232117",
    email: "info@ballykisteenhotel.com",
    website: "https://www.ballykisteenhotel.com",
    address: "Limerick Junction, Co. Tipperary, Ireland",
    eircode: "E34 VK12",
    internalDial: "Ext. 0"
  },
  stayHours: {
    checkIn: "From 3:00 PM (15:00)",
    checkOut: "Until 12:00 PM (12:00 noon)",
    expressCheckout: true,
    breakfastWeekdays: "Mon–Fri: 7:00 AM – 10:00 AM",
    breakfastWeekends: "Sat–Sun & Bank Holidays: 7:30 AM – 10:30 AM"
  },
  wifi: {
    ssid: "Ballykisteen_Guest",
    password: "GalteeGolf2025",
    security: "WPA",
    hidden: false,
    notes: "High-speed optical fiber Wi-Fi throughout all guest suites, Junction One Restaurant, and the Golf Clubhouse."
  },
  bulletin: {
    weatherTemp: "16°C",
    weatherCondition: "Crisp Irish Sunshine",
    weatherNote: "Gentle breeze from the Galtee Mountains · Ideal golfing conditions",
    golfCourseStatus: "Course Open · Greens rolling true & fast · Buggies permitted on fairways",
    todaysSpecial: "Slow-Braised Tipperary Beef Featherblade with creamy colcannon & roast shallot jus",
    breakfastStatus: "Served in Junction One Restaurant until 10:30 AM",
    announcement: "Complimentary access to the heated indoor pool, jacuzzi & Finnish sauna is included with your stay key."
  },
  bookingLinks: {
    hotelWebsite: "https://www.ballykisteenhotel.com",
    tableBookingUrl: "https://www.ballykisteenhotel.com/dining/",
    teeTimeBookingUrl: "https://www.ballykisteenhotel.com/golf/",
    spaBookingUrl: "https://www.ballykisteenhotel.com/leisure-spa/",
    roomBookingUrl: "https://www.ballykisteenhotel.com/rooms/"
  },
  dining: [
    {
      id: "full-irish-breakfast",
      name: "Traditional Full Irish Breakfast",
      category: "breakfast",
      description: "Dry cured Tipperary bacon, Crowe's Farm farm pork sausages, Clonakilty black & white pudding, free-range eggs, grilled tomato, hash browns, and homemade soda bread with Irish creamery butter.",
      hours: "7:00 AM – 10:00 AM (Weekdays) | 7:30 AM – 10:30 AM (Weekends)",
      highlight: "Locally sourced Tipperary produce"
    },
    {
      id: "junction-one-carvery",
      name: "Junction One Daily Carvery Lunch",
      category: "lunch",
      description: "Prime Irish roast joints carved to order, seasonal garden vegetables, crisp roast potatoes, and rich pan gravy. Healthy salad bar & daily vegetarian options available.",
      hours: "Daily 12:30 PM – 3:00 PM",
      highlight: "Chef's daily carving cuts"
    },
    {
      id: "evening-table-dhote",
      name: "Evening À La Carte Dining",
      category: "dinner",
      description: "Sophisticated modern Irish dining featuring Helvic Head hake, prime aged sirloin steak, wild mushroom risotto, and handcrafted desserts paired with an extensive international wine cellar.",
      hours: "Daily 5:30 PM – 9:30 PM",
      highlight: "Reservations recommended dial Ext. 0"
    },
    {
      id: "afternoon-tea",
      name: "Galtee View Afternoon Tea",
      category: "lunch",
      description: "Warm buttermilk scones with clotted cream and Tipperary berry preserves, savoury artisan finger sandwiches, and miniature patisseries overlooking the championship 18th green.",
      hours: "Daily 1:00 PM – 4:30 PM (24hr pre-booking)",
      highlight: "Scenic panoramic mountain views"
    },
    {
      id: "bar-bites-whiskey",
      name: "Junction One Bar & Whiskeys",
      category: "drinks",
      description: "Selection of over 30 Irish whiskeys (Midleton, Redbreast, Green Spot, Tullamore D.E.W.), local craft stouts, signature botanical gins, and gourmet bar bites until late.",
      hours: "Mon–Thu: 12:00 PM – 11:30 PM | Fri–Sat: 12:00 PM – 12:30 AM | Sun: 12:30 PM – 11:00 PM"
    }
  ],
  leisure: {
    poolWeekdays: "6:30 AM – 9:30 PM",
    poolWeekends: "8:00 AM – 8:00 PM",
    adultOnlyHours: "8:00 PM – 9:30 PM (Mon–Fri)",
    kidsSwimHours: "9:00 AM – 6:45 PM Daily",
    gymHours: "6:30 AM – 9:30 PM Daily",
    spaBookingPhone: "+353 (0) 62 33333 (Ext. 0)",
    swimCapRequired: true,
    swimCapPrice: "€3.00 at Leisure Reception"
  },
  golf: {
    holes: 18,
    par: 72,
    designer: "Des Smyth (Irish Ryder Cup Legend)",
    lengthYards: "6,700 Yards Parkland",
    proShopHours: "7:30 AM – 7:00 PM Daily",
    buggyHireRate: "€35 per 18 holes (GPS equipped)",
    trolleyHireRate: "€5 push trolley / €15 electric trolley",
    dressCode: "Collared golf shirts, tailored trousers or shorts, soft-spiked golf shoes.",
    courseStatus: "Open · Buggies allowed · Winter mats not required"
  },
  attractions: [
    {
      id: "tipperary-racecourse",
      name: "Tipperary Racecourse",
      category: "racing",
      distanceKm: "0.2 km",
      travelTime: "2 min walk",
      description: "Premier Irish horse racing venue hosting both flat and National Hunt race fixtures right adjacent to the hotel grounds.",
      insiderTip: "Hotel guests receive special discounts on race day admissions. Check with front desk for the current fixture calendar.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tipperary+Racecourse+Limerick+Junction",
      image: "/src/assets/images/championship_golf_course_1790677430157.jpg"
    },
    {
      id: "limerick-junction-station",
      name: "Limerick Junction Railway Station",
      category: "transport",
      distanceKm: "0.4 km",
      travelTime: "3 min walk",
      description: "Historical and vital railway hub connecting Dublin Heuston, Cork Kent, Limerick Colbert, and Kerry directly.",
      insiderTip: "Perfect for a car-free day trip to Limerick City (only 25 mins by direct train) or Cork City (50 mins).",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Limerick+Junction+Railway+Station",
      image: ""
    },
    {
      id: "the-junction-gastrobar",
      name: "The Junction Gastrobar",
      category: "dining",
      distanceKm: "0.3 km",
      travelTime: "3 min walk",
      description: "Cozy local Irish pub known for friendly hospitality, creamy pints of Guinness, and classic bar dining.",
      insiderTip: "A lovely spot for an informal evening pint and chatting with Tipperary locals.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Junction+Gastrobar+Limerick+Junction",
      image: "/src/assets/images/junction_one_dining_1790677408670.jpg"
    },
    {
      id: "glen-of-aherlow",
      name: "The Glen of Aherlow & Nature Trails",
      category: "nature",
      distanceKm: "14 km",
      travelTime: "15 min drive",
      description: "Breath-taking lush valley nestled between the Galtee Mountains and the wooded Slievenamuck ridge, offering loop walks, lake trails, and panoramic viewpoints.",
      insiderTip: "Visit Christ the King statue viewpoint for spectacular panoramic photo views of the entire Galtee mountain range.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Glen+of+Aherlow+Tipperary",
      image: "/src/assets/images/ballykisteen_resort_hero_1790677395754.jpg"
    },
    {
      id: "rock-of-cashel",
      name: "Rock of Cashel",
      category: "historic",
      distanceKm: "26 km",
      travelTime: "25 min drive",
      description: "One of Ireland's most spectacular historic landmarks. The seat of the ancient Kings of Munster featuring a 12th-century round tower, Cormac's Chapel, and Gothic cathedral.",
      insiderTip: "Pre-book tickets online to secure audio guides and climb the historic hill during morning light for the best photographs.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rock+of+Cashel+Tipperary",
      image: ""
    },
    {
      id: "cahir-castle",
      name: "Cahir Castle & Swiss Cottage",
      category: "historic",
      distanceKm: "28 km",
      travelTime: "25 min drive",
      description: "One of Ireland's largest and best-preserved medieval castles on an island in the River Suir. Followed by a scenic woodland walk to the whimsical 19th-century Swiss Cottage.",
      insiderTip: "Movie buffs will recognise Cahir Castle from 'Excalibur' and Ridley Scott's 'The Last Duel'.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cahir+Castle+Tipperary",
      image: ""
    }
  ],
  guideSections: [
    {
      id: "check-in-departure",
      title: "Check-in & Departure Guidelines",
      iconName: "KeyRound",
      badge: "Essential",
      image: "/src/assets/images/ballykisteen_resort_hero_1790677395754.jpg",
      items: [
        {
          heading: "Standard Arrival & Check-in",
          details: "Check-in begins at 3:00 PM (15:00). Early check-in is subject to room availability upon request. Please present photographic ID and payment card upon arrival."
        },
        {
          heading: "Express Check-Out Policy",
          details: "Check-out time is until 12:00 PM (12:00 noon). You can drop your keycards in the Express Box at the main lobby or dial Ext. 0 to settle incidentals without queuing."
        },
        {
          heading: "Complimentary Guest Parking",
          details: "Over 200 free on-site secure surface parking spaces directly in front of the hotel and leisure club. EV charging stations are available in the main car park."
        },
        {
          heading: "Luggage Storage & Locker Services",
          details: "Complimentary secured luggage holding is available before check-in or after departure with the front reception team."
        }
      ]
    },
    {
      id: "dining-room-service",
      title: "Dining, Bar & Room Service",
      iconName: "Utensils",
      badge: "Junction One",
      image: "/src/assets/images/junction_one_dining_1790677408670.jpg",
      items: [
        {
          heading: "Junction One Restaurant Hours",
          details: "Breakfast: 7:00 AM – 10:00 AM (Mon–Fri) / 7:30 AM – 10:30 AM (Sat–Sun). Carvery Lunch: 12:30 PM – 3:00 PM. Evening Dinner: 5:30 PM – 9:30 PM."
        },
        {
          heading: "In-Room Dining (Room Service)",
          details: "Available daily from 12:00 noon until 9:30 PM. A tray delivery service charge of €5 applies. Dial '0' on your room telephone to place your order with our team."
        },
        {
          heading: "Dietary & Allergen Guidance",
          details: "Extensive gluten-free, dairy-free, vegetarian, and vegan options are highlighted on all our menus. Please inform your server of any severe allergies."
        }
      ]
    },
    {
      id: "golf-course-guide",
      title: "18-Hole Championship Golf",
      iconName: "Flag",
      badge: "Des Smyth Design",
      image: "/src/assets/images/championship_golf_course_1790677430157.jpg",
      items: [
        {
          heading: "Tee Time Booking & Preferential Rates",
          details: "Hotel guests receive exclusive discounted green fee rates. Please book directly with the Pro Shop on Ext. 0 or call 062 32117."
        },
        {
          heading: "Club & Equipment Hire",
          details: "Top-tier Titleist and Callaway golf clubs available for hire. GPS-enabled motorized golf carts (€35) and pull/electric trolleys available."
        },
        {
          heading: "Practice Facilities & Driving Range",
          details: "Floodlit driving range with covered bays, large manicured putting green, and chipping practice zone adjacent to the 1st tee."
        },
        {
          heading: "Dress Code & Etiquette",
          details: "Soft spikes only on greens and fairways. Collared polo shirts and tailored shorts/slacks are required on the golf course."
        }
      ]
    },
    {
      id: "leisure-spa-guide",
      title: "Leisure Club, Pool & Beauty Rooms",
      iconName: "Waves",
      badge: "Complimentary",
      image: "/src/assets/images/leisure_pool_spa_1790677420010.jpg",
      items: [
        {
          heading: "Pool, Jacuzzi, Sauna & Steam Room",
          details: "Heated indoor pool open 6:30 AM – 9:30 PM weekdays, 8:00 AM – 8:00 PM weekends. Towels are provided at the leisure desk upon presenting your room key."
        },
        {
          heading: "Swim Cap Requirement Policy",
          details: "In accordance with Irish hygiene and leisure standards, swim caps are mandatory in the swimming pool. High-quality silicone caps are available at the leisure desk for €3.00."
        },
        {
          heading: "Ballykisteen Beauty & Spa Treatments",
          details: "Indulge in holistic massages, Voya organic seaweed facials, and manicure therapies. Advance reservation is strongly recommended. Dial '0' to book."
        },
        {
          heading: "Fitness Suite & Gym",
          details: "State-of-the-art cardiovascular machines, Olympic free weights, resistance cable machines, and stretch mats. Towel and water fountain available."
        }
      ]
    },
    {
      id: "room-amenities",
      title: "In-Room Comfort & Amenities",
      iconName: "Tv",
      items: [
        {
          heading: "High-Speed Wi-Fi & Smart TV",
          details: "Connect to 'Ballykisteen_Guest' with password 'GalteeGolf2025'. TV includes Irish RTÉ channels, BBC, sports channels, and streaming screencasting."
        },
        {
          heading: "Tea & Coffee Hospitality Tray",
          details: "Complimentary Bewley's Irish tea, instant roast coffee, hot chocolate, and fresh milk. Extra pods or fresh dairy milk can be requested via Ext. 0."
        },
        {
          heading: "Climate Control & Heating",
          details: "Individual digital wall thermostats allow you to adjust room temperature. Radiator booster controls ensure a cozy stay during cool Irish evenings."
        },
        {
          heading: "Iron, Ironing Board & Hairdryer",
          details: "Full-size steam iron and board stored inside the wardrobe. High-power salon hairdryer is in the dressing table drawer."
        }
      ]
    },
    {
      id: "hotel-policies",
      title: "Hotel Policies & House Rules",
      iconName: "ShieldAlert",
      items: [
        {
          heading: "100% Smoke-Free Environment",
          details: "All guest bedrooms, corridors, balconies, and indoor resort facilities are strictly non-smoking (including e-cigarettes / vapes). A deep-cleaning fee of €250 applies for violations."
        },
        {
          heading: "Quiet Hours & Rest Policy",
          details: "To ensure peace and relaxation for all guests, quiet hours are observed between 11:00 PM (23:00) and 7:00 AM daily."
        },
        {
          heading: "Pet Policy",
          details: "Certified service and assistance animals are welcomed throughout the hotel. Pet-friendly rooms are subject to advance registration with reservations."
        }
      ]
    }
  ],
  faqs: [
    {
      id: "faq-wifi-pass",
      category: "Wi-Fi",
      question: "What is the hotel Wi-Fi network and password?",
      answer: "The network is 'Ballykisteen_Guest' and the password is 'GalteeGolf2025'. You can also tap the Wi-Fi card on the home screen to scan the instant connection QR code without typing."
    },
    {
      id: "faq-checkout-time",
      category: "Check-in",
      question: "Can I request a late check-out?",
      answer: "Standard check-out is 12:00 PM (noon). Late check-out until 2:00 PM is available upon request at reception for a nominal fee of €20, subject to room availability."
    },
    {
      id: "faq-breakfast-time",
      category: "Dining",
      question: "Where and when is breakfast served?",
      answer: "Breakfast is served in Junction One Restaurant: Mon–Fri from 7:00 AM to 10:00 AM, and weekends/bank holidays from 7:30 AM to 10:30 AM."
    },
    {
      id: "faq-pool-free",
      category: "Golf & Leisure",
      question: "Is pool and leisure centre access complimentary for hotel guests?",
      answer: "Yes! Full access to the heated indoor swimming pool, jacuzzi, sauna, steam room, and gym is completely complimentary for all registered hotel guests."
    },
    {
      id: "faq-swim-cap",
      category: "Golf & Leisure",
      question: "Do I need a swim cap in the pool?",
      answer: "Yes, under Irish leisure and hygiene regulations, swim caps must be worn in the pool. You can bring your own or purchase one at the leisure reception desk for €3.00."
    },
    {
      id: "faq-golf-discount",
      category: "Golf & Leisure",
      question: "Do residents get discounts on championship golf tee times?",
      answer: "Yes, hotel residents enjoy discounted green fees on the Des Smyth championship 18-hole course. Dial Ext. 0 or visit the Pro Shop to book your tee time."
    },
    {
      id: "faq-room-service",
      category: "Dining",
      question: "How do I order room service?",
      answer: "Dial '0' on your bedroom landline telephone. Room service is served daily between 12:00 PM and 9:30 PM with a €5 delivery tray charge."
    },
    {
      id: "faq-smoking-fee",
      category: "Policies",
      question: "Can I smoke on the balcony or in the room?",
      answer: "No, Ballykisteen is a 100% strictly smoke-free and vape-free hotel. Dedicated outdoor smoking zones are provided on the ground floor outside the main entrance and golf clubhouse."
    }
  ],
  standee: {
    title: "Welcome to Ballykisteen",
    subtitle: "Your Digital Resort Welcome Guidebook",
    welcomeMessage: "Scan with your phone camera to explore resort dining menus, pool hours, golf tee times, local Tipperary attractions, and one-tap Wi-Fi connection.",
    qrType: "guidebook",
    customUrl: "",
    showWifiBox: true,
    paperSize: "tent_5x7"
  },
  hostPasscode: "ballykisteen2025",
  quickActions: defaultQuickActions,
  homeConfig: defaultHomeConfig
};
