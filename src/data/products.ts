import { Product } from "@/components/ProductCard";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=300&fit=crop",
    category: "Electronics",
    subcategory: "Audio",
    brand: "AudioTech",
    description: "Premium wireless headphones with industry-leading noise cancellation and 30-hour battery life.",
    features: [
      "Active Noise Cancellation with 8 microphones",
      "30-hour battery life with quick charge",
      "Premium comfort with memory foam cushions",
      "High-quality audio with custom drivers",
      "Multipoint Bluetooth connection"
    ],
    tags: ["wireless", "noise-canceling", "bluetooth", "premium", "long-battery"],
    specifications: {
      batteryLife: "30 hours",
      connectivity: "Bluetooth 5.0",
      weight: "250g",
      driverSize: "40mm"
    },
    inStock: true
  },
  {
    id: "2",
    name: "Smart Fitness Tracker",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=300&fit=crop",
    category: "Wearables",
    subcategory: "Fitness",
    brand: "FitPro",
    description: "Advanced fitness tracker with GPS, heart rate monitoring, and 7-day battery life.",
    features: [
      "Built-in GPS for accurate tracking",
      "24/7 heart rate monitoring",
      "Sleep quality analysis",
      "Water-resistant up to 50 meters",
      "Smart notifications and app ecosystem"
    ],
    tags: ["fitness", "gps", "heart-rate", "waterproof", "health"],
    specifications: {
      batteryLife: "7 days",
      waterResistance: "50m",
      displaySize: "1.4 inches",
      sensors: ["GPS", "Heart Rate", "Accelerometer"]
    },
    inStock: true
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop",
    category: "Furniture",
    subcategory: "Office",
    brand: "ErgoComfort",
    description: "Professional ergonomic office chair with lumbar support and adjustable features.",
    features: [
      "Adjustable lumbar support",
      "Height and tilt adjustment",
      "Breathable mesh fabric",
      "360-degree swivel base",
      "Weight capacity up to 300 lbs"
    ],
    tags: ["ergonomic", "office", "adjustable", "lumbar-support", "professional"],
    specifications: {
      material: "Mesh fabric",
      weightCapacity: "300 lbs",
      adjustments: ["height", "tilt", "lumbar"],
      warranty: "5 years"
    },
    inStock: false
  },
  {
    id: "4",
    name: "Portable Bluetooth Speaker",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=300&fit=crop",
    category: "Electronics",
    subcategory: "Audio",
    brand: "SoundWave",
    description: "Waterproof portable speaker with 360-degree sound and 20-hour battery life.",
    features: [
      "360-degree surround sound",
      "IPX7 waterproof rating",
      "20-hour battery life",
      "Wireless stereo pairing",
      "Built-in microphone for calls"
    ],
    tags: ["portable", "bluetooth", "waterproof", "360-sound", "long-battery"],
    specifications: {
      batteryLife: "20 hours",
      waterproof: "IPX7",
      connectivity: "Bluetooth 5.0",
      power: "20W"
    },
    inStock: true
  },
  {
    id: "5",
    name: "Smart Home Security Camera",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    category: "Smart Home",
    subcategory: "Security",
    brand: "SecureVision",
    description: "AI-powered security camera with 4K video, night vision, and smart alerts.",
    features: [
      "4K Ultra HD video recording",
      "Advanced night vision",
      "AI person and vehicle detection",
      "Two-way audio communication",
      "Cloud and local storage options"
    ],
    tags: ["security", "4k", "night-vision", "ai-detection", "smart-home"],
    specifications: {
      resolution: "4K Ultra HD",
      nightVision: "Advanced IR",
      storage: ["Cloud", "Local"],
      detection: "AI-powered"
    },
    inStock: true
  },
  {
    id: "6",
    name: "Premium Coffee Maker",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop",
    category: "Kitchen",
    subcategory: "Appliances",
    brand: "BrewMaster",
    description: "Programmable drip coffee maker with thermal carafe and customizable brewing options.",
    features: [
      "12-cup thermal carafe",
      "Programmable 24-hour timer",
      "Adjustable brew strength",
      "Auto shut-off safety feature",
      "Permanent gold-tone filter included"
    ],
    tags: ["coffee", "programmable", "thermal", "12-cup", "premium"],
    specifications: {
      capacity: "12 cups",
      carafeType: "Thermal",
      programmable: true,
      filterType: "Gold-tone permanent"
    },
    inStock: true
  },
  {
    id: "7",
    name: "Mechanical Gaming Keyboard",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop",
    category: "Gaming",
    subcategory: "Peripherals",
    brand: "GamePro",
    description: "RGB mechanical keyboard with tactile switches and customizable lighting effects.",
    features: [
      "Mechanical tactile switches",
      "RGB backlighting with effects",
      "Anti-ghosting technology",
      "Programmable macro keys",
      "Detachable USB-C cable"
    ],
    tags: ["mechanical", "gaming", "rgb", "tactile", "programmable"],
    specifications: {
      switchType: "Mechanical tactile",
      backlighting: "RGB",
      connectivity: "USB-C",
      keyLayout: "Full-size"
    },
    inStock: true
  },
  {
    id: "8",
    name: "Wireless Charging Pad",
    price: 39.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1609592193419-8e3c0c7c9b3e?w=500&h=300&fit=crop",
    category: "Accessories",
    subcategory: "Charging",
    brand: "ChargeTech",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    features: [
      "10W fast wireless charging",
      "Qi-certified compatibility",
      "LED charging indicator",
      "Non-slip surface design",
      "Overcharge protection"
    ],
    tags: ["wireless-charging", "qi-compatible", "fast-charging", "accessory", "safe"],
    specifications: {
      power: "10W",
      compatibility: "Qi-enabled devices",
      safety: "Overcharge protection",
      indicator: "LED"
    },
    inStock: true
  },
  {
    id: "9",
    name: "Studio Monitor Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=300&fit=crop",
    category: "Electronics",
    subcategory: "Audio",
    brand: "AudioTech",
    description: "Professional studio monitor headphones with flat frequency response and exceptional clarity.",
    features: [
      "Flat frequency response",
      "Open-back design for natural sound",
      "Detachable cable",
      "Comfortable over-ear design",
      "Professional-grade drivers"
    ],
    tags: ["studio", "monitor", "professional", "open-back", "flat-response"],
    specifications: {
      impedance: "250 ohms",
      frequency: "5Hz-35kHz",
      design: "Open-back",
      driverSize: "40mm"
    },
    inStock: true
  },
  {
    id: "10",
    name: "Budget Wireless Headphones",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500&h=300&fit=crop",
    category: "Electronics",
    subcategory: "Audio",
    brand: "SoundWave",
    description: "Affordable wireless headphones with good sound quality and 25-hour battery life.",
    features: [
      "25-hour battery life",
      "Lightweight design",
      "Clear call quality",
      "Foldable for portability",
      "Quick charge feature"
    ],
    tags: ["budget", "wireless", "lightweight", "long-battery", "portable"],
    specifications: {
      batteryLife: "25 hours",
      weight: "180g",
      connectivity: "Bluetooth 5.0",
      quickCharge: "2 hours for full charge"
    },
    inStock: true
  },
  {
    id: "11",
    name: "Advanced Sports Watch",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=300&fit=crop",
    category: "Wearables",
    subcategory: "Fitness",
    brand: "SportsTech",
    description: "Premium sports watch with advanced metrics, GPS, and multi-sport tracking.",
    features: [
      "Multi-sport tracking modes",
      "Advanced performance metrics",
      "Built-in GPS and GLONASS",
      "10-day battery life",
      "Rugged design with sapphire glass"
    ],
    tags: ["sports", "premium", "gps", "multi-sport", "rugged"],
    specifications: {
      batteryLife: "10 days",
      waterResistance: "100m",
      glass: "Sapphire crystal",
      sensors: ["GPS", "GLONASS", "Heart Rate", "Barometer"]
    },
    inStock: true
  },
  {
    id: "12",
    name: "Basic Fitness Band",
    price: 49.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=300&fit=crop",
    category: "Wearables",
    subcategory: "Fitness",
    brand: "FitBasic",
    description: "Simple and affordable fitness band with step tracking and heart rate monitoring.",
    features: [
      "Step and calorie tracking",
      "Heart rate monitoring",
      "Sleep tracking",
      "14-day battery life",
      "Water-resistant design"
    ],
    tags: ["basic", "affordable", "step-tracking", "heart-rate", "simple"],
    specifications: {
      batteryLife: "14 days",
      waterResistance: "5ATM",
      display: "OLED",
      connectivity: "Bluetooth 4.0"
    },
    inStock: true
  },
  {
    id: "13",
    name: "Resistance Bands Set",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    category: "Fitness",
    subcategory: "Equipment",
    brand: "FlexFit",
    description: "Complete resistance bands set with multiple resistance levels and accessories.",
    features: [
      "5 resistance levels",
      "Door anchor included",
      "Foam handles for comfort",
      "Carrying bag included",
      "Exercise guide provided"
    ],
    tags: ["resistance", "bands", "home-gym", "portable", "complete-set"],
    specifications: {
      resistanceLevels: 5,
      maxResistance: "150 lbs",
      material: "Natural latex",
      accessories: ["Door anchor", "Handles", "Bag"]
    },
    inStock: true
  },
  {
    id: "14",
    name: "Executive Leather Chair",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=300&fit=crop",
    category: "Furniture",
    subcategory: "Office",
    brand: "LuxurySeating",
    description: "Premium executive chair with genuine leather upholstery and advanced ergonomics.",
    features: [
      "Genuine leather upholstery",
      "Advanced lumbar support",
      "Heated and massage functions",
      "Memory foam cushioning",
      "Premium gas cylinder"
    ],
    tags: ["executive", "leather", "premium", "heated", "massage"],
    specifications: {
      material: "Genuine leather",
      features: ["Heating", "Massage", "Memory foam"],
      weightCapacity: "350 lbs",
      warranty: "10 years"
    },
    inStock: true
  },
  {
    id: "15",
    name: "Standing Desk Converter",
    price: 279.99,
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&h=300&fit=crop",
    category: "Furniture",
    subcategory: "Office",
    brand: "ErgoDesk",
    description: "Adjustable standing desk converter that transforms any desk into a sit-stand workstation.",
    features: [
      "Height adjustable design",
      "Dual monitor support",
      "Keyboard tray included",
      "Easy assembly",
      "Stable platform design"
    ],
    tags: ["standing-desk", "adjustable", "ergonomic", "converter", "dual-monitor"],
    specifications: {
      adjustmentRange: "15 inches",
      monitorSupport: "Dual 24-inch",
      weightCapacity: "33 lbs",
      dimensions: "36 x 22 inches"
    },
    inStock: true
  },
  {
    id: "16",
    name: "LED Desk Lamp",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
    category: "Furniture",
    subcategory: "Lighting",
    brand: "BrightWork",
    description: "Smart LED desk lamp with adjustable brightness and color temperature.",
    features: [
      "Adjustable brightness levels",
      "Color temperature control",
      "USB charging port",
      "Touch controls",
      "Memory function"
    ],
    tags: ["led", "desk-lamp", "adjustable", "usb-charging", "smart"],
    specifications: {
      brightness: "2000 lumens",
      colorTemp: "3000K-6500K",
      usbPort: "5V/1A",
      power: "12W LED"
    },
    inStock: true
  },
  {
    id: "17",
    name: "Rugged Outdoor Speaker",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=300&fit=crop",
    category: "Electronics",
    subcategory: "Audio",
    brand: "AdventureTech",
    description: "Ultra-rugged Bluetooth speaker designed for extreme outdoor conditions.",
    features: [
      "IP67 waterproof and dustproof",
      "Shockproof design",
      "40-hour battery life",
      "Built-in power bank",
      "360-degree sound"
    ],
    tags: ["rugged", "outdoor", "waterproof", "shockproof", "power-bank"],
    specifications: {
      batteryLife: "40 hours",
      waterproof: "IP67",
      shockproof: "Military grade",
      powerBank: "Built-in USB"
    },
    inStock: true
  },
  {
    id: "18",
    name: "Compact Travel Speaker",
    price: 39.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=300&fit=crop",
    category: "Electronics",
    subcategory: "Audio",
    brand: "TravelSound",
    description: "Ultra-compact Bluetooth speaker perfect for travel with surprising sound quality.",
    features: [
      "Ultra-compact design",
      "12-hour battery life",
      "Water-resistant coating",
      "Built-in microphone",
      "Easy pairing"
    ],
    tags: ["compact", "travel", "portable", "water-resistant", "small"],
    specifications: {
      size: "2.5 x 2.5 x 1.5 inches",
      weight: "6 oz",
      batteryLife: "12 hours",
      waterResistance: "IPX4"
    },
    inStock: true
  },
  {
    id: "19",
    name: "Pan-Tilt Security Camera",
    price: 229.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    category: "Smart Home",
    subcategory: "Security",
    brand: "SecureVision",
    description: "Advanced pan-tilt security camera with 4K resolution and smart tracking.",
    features: [
      "Pan and tilt functionality",
      "4K Ultra HD recording",
      "Auto-tracking subjects",
      "Two-way audio",
      "Smart motion zones"
    ],
    tags: ["pan-tilt", "4k", "auto-tracking", "smart", "security"],
    specifications: {
      resolution: "4K Ultra HD",
      panTilt: "355°/90°",
      tracking: "AI-powered",
      nightVision: "Color night vision"
    },
    inStock: true
  },
  {
    id: "20",
    name: "Budget Security Camera",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop",
    category: "Smart Home",
    subcategory: "Security",
    brand: "HomeSafe",
    description: "Affordable security camera with essential features for basic home monitoring.",
    features: [
      "1080p HD recording",
      "Night vision",
      "Motion detection",
      "Mobile app access",
      "Easy installation"
    ],
    tags: ["budget", "1080p", "basic", "motion-detection", "easy-install"],
    specifications: {
      resolution: "1080p HD",
      nightVision: "Infrared",
      storage: "Cloud/SD card",
      connectivity: "Wi-Fi"
    },
    inStock: true
  },
  {
    id: "21",
    name: "Car Phone Mount",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1609592193419-8e3c0c7c9b3e?w=500&h=300&fit=crop",
    category: "Accessories",
    subcategory: "Automotive",
    brand: "DriveEasy",
    description: "Universal car phone mount with wireless charging capability.",
    features: [
      "Wireless charging pad",
      "Universal phone compatibility",
      "360-degree rotation",
      "Strong magnetic hold",
      "Easy one-hand operation"
    ],
    tags: ["car-mount", "wireless-charging", "magnetic", "universal", "hands-free"],
    specifications: {
      charging: "10W wireless",
      compatibility: "4-7 inch phones",
      mounting: "Dashboard/Windshield",
      rotation: "360 degrees"
    },
    inStock: true
  },
  {
    id: "22",
    name: "Smart Door Lock",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop",
    category: "Smart Home",
    subcategory: "Security",
    brand: "SecureHome",
    description: "Smart deadbolt lock with keypad, fingerprint, and smartphone access.",
    features: [
      "Multiple access methods",
      "Fingerprint recognition",
      "Smartphone app control",
      "Auto-lock function",
      "Guest access codes"
    ],
    tags: ["smart-lock", "fingerprint", "keypad", "smartphone", "auto-lock"],
    specifications: {
      accessMethods: ["Fingerprint", "Keypad", "App", "Key"],
      battery: "4 AA batteries",
      connectivity: "Bluetooth/Wi-Fi",
      userCapacity: "100 users"
    },
    inStock: true
  },
  {
    id: "23",
    name: "Smart Doorbell Camera",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop",
    category: "Smart Home",
    subcategory: "Security",
    brand: "DoorGuard",
    description: "Smart video doorbell with HD video, two-way talk, and motion detection.",
    features: [
      "1080p HD video",
      "Two-way audio communication",
      "Motion detection alerts",
      "Night vision capability",
      "Cloud storage included"
    ],
    tags: ["doorbell", "video", "two-way-audio", "motion-alerts", "hd"],
    specifications: {
      resolution: "1080p HD",
      fieldOfView: "160 degrees",
      storage: "Cloud included",
      power: "Rechargeable battery"
    },
    inStock: true
  }
];
