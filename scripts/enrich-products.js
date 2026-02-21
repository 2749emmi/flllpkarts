const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

function generateImages(image) {
  if (image.startsWith('/images/')) {
    return [image, image, image, image];
  }
  const dimMatch = image.match(/\/image\/(\d+)\/(\d+)\//);
  if (!dimMatch) return [image, image, image, image];
  const [, w, h] = dimMatch;
  const qMatch = image.match(/\?q=(\d+)/);
  const q = qMatch ? parseInt(qMatch[1]) : 90;
  const v1 = image;
  const v2 = q === 70
    ? image.replace('?q=70', '?q=80')
    : image.replace(`?q=${q}`, '?q=70');
  const v3 = image.replace(`/image/${w}/${h}/`, '/image/416/416/');
  const v4 = image.replace(`/image/${w}/${h}/`, '/image/312/312/');
  return [v1, v2, v3, v4];
}

const brandsMap = {
  "1001": "Apple", "1002": "Samsung", "1003": "Apple", "1004": "Apple",
  "1005": "Apple", "1006": "Apple", "1007": "Apple", "1008": "Apple",
  "2001": "Apple", "2002": "Apple", "2003": "Apple", "2004": "Apple",
  "1": "Apple", "2": "Apple", "3": "Apple", "4": "Samsung",
  "91": "Armor Edge", "17": "Levi's", "18": "Nike", "19": "Adidas",
  "24": "Fastrack", "92": "Dennis Lingo",
  "29": "Apple", "30": "HP", "33": "Sony",
  "90": "Portronics", "93": "STRIFF", "94": "boAt",
  "40": "Wakefit", "41": "Nilkamal", "42": "Flipkart Perfect Homes",
  "44": "Home Sizzler", "43": "Prestige",
  "50": "Samsung", "51": "LG", "55": "Crompton", "45": "Butterfly",
  "60": "L'Oreal Paris", "61": "Maybelline New York",
  "62": "LEGO", "63": "Hot Wheels",
  "70": "Aashirvaad", "73": "Maggi", "71": "Tata Tea"
};

const sellersMap = {
  "1001": "TrueComRetail", "1002": "SuperComNet", "1003": "TrueComRetail",
  "1004": "Appario Retail", "1005": "Appario Retail", "1006": "TrueComRetail",
  "1007": "Appario Retail", "1008": "TrueComRetail",
  "2001": "Appario Retail", "2002": "TrueComRetail",
  "2003": "Appario Retail", "2004": "TrueComRetail",
  "1": "Appario Retail", "2": "TrueComRetail", "3": "Appario Retail", "4": "SuperComNet",
  "91": "Flashstar Commerce", "17": "RetailNet", "18": "Flashstar Commerce",
  "19": "RetailNet", "24": "Flashstar Commerce", "92": "RetailNet",
  "29": "Appario Retail", "30": "RetailNet", "33": "SuperComNet",
  "90": "Flashstar Commerce", "93": "Flashstar Commerce", "94": "RetailNet",
  "40": "Cloudtail India", "41": "SuperComNet", "42": "RetailNet",
  "44": "Flashstar Commerce", "43": "SuperComNet",
  "50": "SuperComNet", "51": "RetailNet", "55": "Flashstar Commerce", "45": "RetailNet",
  "60": "Cocoblu Retail", "61": "Cocoblu Retail",
  "62": "RetailNet", "63": "Flashstar Commerce",
  "70": "SuperComNet", "73": "RetailNet", "71": "SuperComNet"
};

const specsMap = {
  "1001": {
    "Brand": "Apple",
    "Model": "iPhone 17 Pro Max",
    "Processor": "A19 Pro Chip",
    "RAM": "8 GB",
    "Storage": "512 GB",
    "Display": "6.9 inch Super Retina XDR OLED",
    "Rear Camera": "48MP + 48MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "4685 mAh",
    "OS": "iOS 18",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "227 g",
    "In The Box": "iPhone, USB-C Cable, Documentation"
  },
  "1002": {
    "Brand": "Samsung",
    "Model": "Galaxy S25 Ultra",
    "Processor": "Snapdragon 8 Elite for Galaxy",
    "RAM": "12 GB",
    "Storage": "512 GB",
    "Display": "6.8 inch QHD+ Dynamic AMOLED 2X",
    "Rear Camera": "200MP + 50MP + 12MP + 10MP",
    "Front Camera": "12MP",
    "Battery": "5000 mAh",
    "OS": "Android 15 (One UI 7)",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "218 g",
    "In The Box": "Phone, USB-C Cable, S Pen, Documentation"
  },
  "1003": {
    "Brand": "Apple",
    "Model": "iPhone 16 Pro Max",
    "Processor": "A18 Pro Chip",
    "RAM": "8 GB",
    "Storage": "256 GB",
    "Display": "6.9 inch Super Retina XDR Display",
    "Rear Camera": "48MP + 12MP + 48MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "4685 mAh",
    "OS": "iOS 18",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "227 g",
    "In The Box": "iPhone, USB-C Cable, Documentation"
  },
  "1004": {
    "Brand": "Apple",
    "Model": "iPhone 16 Pro",
    "Processor": "A18 Pro Chip",
    "RAM": "8 GB",
    "Storage": "256 GB",
    "Display": "6.3 inch Super Retina XDR Display",
    "Rear Camera": "48MP + 12MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "3582 mAh",
    "OS": "iOS 18",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "199 g",
    "In The Box": "iPhone, USB-C Cable, Documentation"
  },
  "1005": {
    "Brand": "Apple",
    "Model": "iPhone 15",
    "Processor": "A16 Bionic Chip",
    "RAM": "6 GB",
    "Storage": "128 GB",
    "Display": "6.1 inch Super Retina XDR Display",
    "Rear Camera": "48MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "3349 mAh",
    "OS": "iOS 17 (upgradable to iOS 18)",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "171 g",
    "In The Box": "iPhone, USB-C Cable, Documentation"
  },
  "1006": {
    "Brand": "Apple",
    "Model": "iPhone 14",
    "Processor": "A15 Bionic Chip",
    "RAM": "6 GB",
    "Storage": "128 GB",
    "Display": "6.1 inch Super Retina XDR Display",
    "Rear Camera": "12MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "3279 mAh",
    "OS": "iOS 16 (upgradable to iOS 18)",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "172 g",
    "In The Box": "iPhone, USB-C Cable, Documentation"
  },
  "1007": {
    "Brand": "Apple",
    "Model": "iPhone 13",
    "Processor": "A15 Bionic Chip",
    "RAM": "4 GB",
    "Storage": "128 GB",
    "Display": "6.1 inch Super Retina XDR Display",
    "Rear Camera": "12MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "3227 mAh",
    "OS": "iOS 15 (upgradable to iOS 18)",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "174 g",
    "In The Box": "iPhone, Lightning Cable, Documentation"
  },
  "1008": {
    "Brand": "Apple",
    "Model": "iPhone 12",
    "Processor": "A14 Bionic Chip",
    "RAM": "4 GB",
    "Storage": "64 GB",
    "Display": "6.1 inch Super Retina XDR Display",
    "Rear Camera": "12MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "2815 mAh",
    "OS": "iOS 14 (upgradable to iOS 18)",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "164 g",
    "In The Box": "iPhone, Lightning Cable, Documentation"
  },
  "2001": {
    "Brand": "Apple",
    "Model": "MacBook Air 15-inch (M3, 2024)",
    "Processor": "Apple M3 (8-core CPU, 10-core GPU)",
    "RAM": "16 GB Unified Memory",
    "Storage": "512 GB SSD",
    "Display": "15.3 inch Liquid Retina (2880 x 1864)",
    "Battery": "Up to 18 hours",
    "OS": "macOS Sonoma",
    "Ports": "2x Thunderbolt/USB 4, MagSafe 3, 3.5mm jack",
    "Weight": "1.51 kg",
    "Colour": "Midnight",
    "In The Box": "MacBook Air, 35W Dual USB-C Adapter, USB-C to MagSafe Cable, Documentation"
  },
  "2002": {
    "Brand": "Apple",
    "Model": "iPad Pro 13-inch (M4, 2024)",
    "Processor": "Apple M4 Chip",
    "RAM": "8 GB",
    "Storage": "256 GB",
    "Display": "13 inch Ultra Retina XDR (Tandem OLED)",
    "Battery": "Up to 10 hours",
    "OS": "iPadOS 17",
    "Connectivity": "Wi-Fi 6E, Bluetooth 5.3",
    "Weight": "579 g",
    "Colour": "Space Black",
    "In The Box": "iPad Pro, USB-C Cable, 20W USB-C Adapter, Documentation"
  },
  "2003": {
    "Brand": "Apple",
    "Model": "AirPods Pro 2 (USB-C)",
    "Chip": "Apple H2",
    "Driver": "Custom Apple High-Excursion",
    "Active Noise Cancellation": "Yes (2x more than previous gen)",
    "Battery (Buds)": "Up to 6 hours (ANC on)",
    "Battery (Case)": "Up to 30 hours total",
    "Connectivity": "Bluetooth 5.3",
    "Water Resistance": "IP54 (Buds & Case)",
    "Weight": "5.3 g per bud",
    "Charging": "USB-C, MagSafe, Qi, Apple Watch charger",
    "In The Box": "AirPods Pro, MagSafe Charging Case (USB-C), Ear Tips (XS/S/M/L), Documentation"
  },
  "2004": {
    "Brand": "Apple",
    "Model": "Apple Watch Series 10",
    "Chip": "Apple S10 SiP",
    "Display": "Always-On Retina LTPO3 OLED",
    "Case Size": "46mm",
    "Case Material": "Jet Black Aluminium",
    "Water Resistance": "WR50 + Depth Gauge",
    "Battery": "Up to 18 hours",
    "OS": "watchOS 11",
    "Connectivity": "GPS, Bluetooth 5.3, Wi-Fi",
    "Sensors": "Blood Oxygen, ECG, Heart Rate, Temperature, Accelerometer",
    "In The Box": "Apple Watch, Band (S/M & M/L), Magnetic Charger, Documentation"
  },
  "1": {
    "Brand": "Apple",
    "Model": "iPhone 13",
    "Processor": "A15 Bionic Chip",
    "RAM": "4 GB",
    "Storage": "128 GB",
    "Display": "6.1 inch Super Retina XDR Display",
    "Rear Camera": "12MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "3227 mAh",
    "OS": "iOS 15 (upgradable to iOS 18)",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "174 g",
    "In The Box": "iPhone, Lightning Cable, Documentation"
  },
  "2": {
    "Brand": "Apple",
    "Model": "iPhone 16 Pro Max",
    "Processor": "A18 Pro Chip",
    "RAM": "8 GB",
    "Storage": "256 GB",
    "Display": "6.9 inch Super Retina XDR Always-On Display",
    "Rear Camera": "48MP + 12MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "4685 mAh",
    "OS": "iOS 18",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "227 g",
    "In The Box": "iPhone, USB-C Cable, Documentation"
  },
  "3": {
    "Brand": "Apple",
    "Model": "iPhone 12",
    "Processor": "A14 Bionic Chip",
    "RAM": "4 GB",
    "Storage": "64 GB",
    "Display": "6.1 inch Super Retina XDR Display",
    "Rear Camera": "12MP + 12MP",
    "Front Camera": "12MP TrueDepth",
    "Battery": "2815 mAh",
    "OS": "iOS 14 (upgradable to iOS 18)",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "164 g",
    "In The Box": "iPhone, Lightning Cable, Documentation"
  },
  "4": {
    "Brand": "Samsung",
    "Model": "Galaxy S25 Ultra 5G",
    "Processor": "Snapdragon 8 Gen 4 for Galaxy",
    "RAM": "12 GB",
    "Storage": "512 GB",
    "Display": "6.8 inch QHD+ Dynamic AMOLED 2X (120Hz)",
    "Rear Camera": "200MP + 50MP + 12MP + 10MP",
    "Front Camera": "12MP",
    "Battery": "5000 mAh",
    "OS": "Android 15 (One UI 7)",
    "SIM": "Dual SIM (Nano + eSIM)",
    "Weight": "218 g",
    "In The Box": "Phone, USB-C Cable, S Pen, Documentation"
  },
  "91": {
    "Brand": "Armor Edge",
    "Material": "Tempered Glass",
    "Hardness": "9H",
    "Thickness": "0.33mm",
    "Transparency": "99.9% HD Clarity",
    "Edge Type": "2.5D Curved",
    "Coating": "Oleophobic Anti-Fingerprint",
    "Compatibility": "Universal Smartphone",
    "Installation": "Bubble-Free Adhesive",
    "In The Box": "Screen Protector, Cleaning Cloth, Dust Sticker, Alignment Frame"
  },
  "17": {
    "Brand": "Levi's",
    "Fit": "Slim Fit",
    "Rise": "Mid Rise",
    "Fabric": "98% Cotton, 2% Elastane",
    "Closure": "Button & Zip Fly",
    "Pockets": "5-Pocket Styling",
    "Pattern": "Solid",
    "Wash Care": "Machine Washable",
    "Suitable For": "Casual & Semi-Formal",
    "Country of Origin": "India",
    "In The Box": "1 Pair of Jeans"
  },
  "18": {
    "Brand": "Nike",
    "Model": "Air Max 270",
    "Type": "Running Shoes",
    "Upper Material": "Engineered Mesh",
    "Sole Material": "Rubber",
    "Closure": "Lace-Up",
    "Cushioning": "Air Max 270 Unit",
    "Weight": "310 g (UK 9)",
    "Suitable For": "Running & Casual Wear",
    "Country of Origin": "Vietnam",
    "In The Box": "1 Pair of Shoes"
  },
  "19": {
    "Brand": "Adidas",
    "Model": "Ultraboost Light",
    "Type": "Running Shoes",
    "Upper Material": "Primeknit+",
    "Sole Material": "Continental Rubber",
    "Closure": "Lace-Up",
    "Cushioning": "Full-length BOOST Midsole",
    "Midfoot Support": "Torsion System",
    "Weight": "280 g (UK 9)",
    "Suitable For": "Running & Training",
    "Country of Origin": "Vietnam",
    "In The Box": "1 Pair of Shoes"
  },
  "24": {
    "Brand": "Fastrack",
    "Type": "Analog Watch",
    "Dial Shape": "Round",
    "Strap Material": "Genuine Leather",
    "Case Material": "Stainless Steel",
    "Case Diameter": "38mm",
    "Movement": "Quartz",
    "Water Resistance": "30 Metres",
    "Warranty": "2 Years Manufacturer",
    "In The Box": "Watch, Warranty Card, User Manual"
  },
  "92": {
    "Brand": "Dennis Lingo",
    "Fabric": "100% Cotton",
    "Fit": "Regular Fit",
    "Neck Type": "Round Neck",
    "Sleeve": "Short Sleeves",
    "Pattern": "Printed",
    "Finish": "Bio-Washed for Softness",
    "Wash Care": "Machine Washable",
    "Suitable For": "Casual Wear",
    "Country of Origin": "India",
    "In The Box": "1 T-Shirt"
  },
  "29": {
    "Brand": "Apple",
    "Model": "MacBook Air 15-inch (M3, 2024)",
    "Processor": "Apple M3 (8-core CPU, 10-core GPU)",
    "RAM": "16 GB Unified Memory",
    "Storage": "512 GB SSD",
    "Display": "15.3 inch Liquid Retina (500 nits, P3)",
    "Graphics": "10-core GPU",
    "Battery": "Up to 18 hours",
    "OS": "macOS Sonoma",
    "Ports": "2x Thunderbolt/USB 4, MagSafe 3, 3.5mm jack",
    "Weight": "1.51 kg",
    "In The Box": "MacBook Air, 35W Dual USB-C Adapter, USB-C to MagSafe Cable, Documentation"
  },
  "30": {
    "Brand": "HP",
    "Model": "Pavilion Plus 14",
    "Processor": "Intel Core Ultra 7",
    "RAM": "16 GB LPDDR5x",
    "Storage": "512 GB NVMe SSD (PCIe Gen4)",
    "Display": "14 inch 2.8K OLED, 120Hz, DisplayHDR True Black 500",
    "Graphics": "Intel Arc",
    "Battery": "Up to 10 hours",
    "OS": "Windows 11 Home",
    "Ports": "Thunderbolt 4, USB-A, HDMI 2.1, 3.5mm jack",
    "Weight": "1.4 kg",
    "In The Box": "Laptop, 65W USB-C Adapter, Documentation"
  },
  "33": {
    "Brand": "Sony",
    "Model": "WH-1000XM5",
    "Type": "Over-Ear Wireless Headphones",
    "Driver": "40mm Custom",
    "Active Noise Cancellation": "Yes (8 microphones, 2 processors)",
    "Bluetooth": "5.2 with LDAC, SBC, AAC",
    "Battery": "30 hours (ANC on)",
    "Charging": "USB-C (3 min charge = 3 hours playback)",
    "Multipoint": "Yes (2 devices simultaneously)",
    "Weight": "250 g",
    "Foldable": "No (Swivel flat)",
    "In The Box": "Headphones, USB-C Cable, Carrying Case, 3.5mm Audio Cable, Documentation"
  },
  "90": {
    "Brand": "Portronics",
    "Type": "USB-C to USB-C Cable",
    "Length": "1 Metre",
    "Power Delivery": "65W PD Fast Charging",
    "Data Transfer": "USB 2.0 (480 Mbps)",
    "Material": "Braided Nylon",
    "Connector": "Reversible USB-C (both ends)",
    "Durability": "10,000+ Bend Tested",
    "Compatibility": "All USB-C Devices",
    "In The Box": "1x USB-C Cable"
  },
  "93": {
    "Brand": "STRIFF",
    "Material": "ABS Plastic + Aluminium Alloy",
    "Adjustable Angle": "0° to 100°",
    "Device Compatibility": "4 to 10 inch Phones & Tablets",
    "Foldable": "Yes (Credit card size when folded)",
    "Anti-Slip": "Silicone Pads",
    "Weight Capacity": "500 g",
    "Colour": "Black",
    "In The Box": "1x Foldable Phone Stand"
  },
  "94": {
    "Brand": "boAt",
    "Model": "BassHeads 100",
    "Type": "Wired In-Ear Earphones",
    "Driver": "10mm Dynamic",
    "Impedance": "16 Ohm",
    "Frequency Response": "20Hz – 20kHz",
    "Cable": "1.2m Braided Tangle-Free",
    "Connector": "3.5mm Gold-Plated",
    "Microphone": "HD Mic with In-line Remote",
    "Water Resistance": "IPX4 Sweat & Splash Proof",
    "In The Box": "Earphones, 3 Pairs Silicone Ear Tips (S/M/L), Warranty Card"
  },
  "40": {
    "Brand": "Wakefit",
    "Type": "Memory Foam Mattress",
    "Firmness": "Medium Firm (6/10)",
    "Thickness": "8 inches (20 cm)",
    "Top Layer": "Cooling Gel-Infused Memory Foam",
    "Base Layer": "High-Resilience Support Foam",
    "Cover": "Removable Zipper Cover (Machine Washable)",
    "Certification": "CertiPUR-US Certified",
    "Trial Period": "100 Nights",
    "Warranty": "10 Years",
    "In The Box": "Mattress (Vacuum Rolled & Compressed), Care Guide"
  },
  "41": {
    "Brand": "Nilkamal",
    "Material": "Engineered Wood with Laminate Finish",
    "Dimensions": "120 cm (L) x 60 cm (W) x 75 cm (H)",
    "Weight Capacity": "50 kg",
    "Storage": "2 Drawers + 1 Open Shelf",
    "Surface": "Anti-Scratch Laminate",
    "Cable Management": "Built-in Rear Shelf",
    "Assembly": "Self-Assembly (Hardware & Manual Included)",
    "Warranty": "1 Year Manufacturer",
    "In The Box": "Table Panels, Hardware Kit, Assembly Manual"
  },
  "42": {
    "Brand": "Flipkart Perfect Homes",
    "Type": "3 Seater Sofa",
    "Frame Material": "Solid Sal Wood",
    "Upholstery": "Premium Polyester (Stone Grey)",
    "Cushion Fill": "High-Density Polyurethane Foam",
    "Seating Height": "43 cm",
    "Dimensions": "183 cm (L) x 76 cm (W) x 82 cm (H)",
    "Weight Capacity": "250 kg",
    "Warranty": "3 Years on Frame",
    "Installation": "Free by Flipkart",
    "In The Box": "Sofa, Assembly Hardware, Care Instructions"
  },
  "44": {
    "Brand": "Home Sizzler",
    "Material": "100% Polyester",
    "Panel Dimensions": "132 cm x 213 cm (52\" x 84\") each",
    "Set Contents": "2 Panels",
    "Blackout Level": "99% Light Blocking",
    "Header Type": "Rod Pocket with 8 Antique Bronze Grommets",
    "Thermal Insulation": "Yes",
    "Noise Reduction": "Yes",
    "Wash Care": "Machine Washable, Tumble Dry Low",
    "In The Box": "2 Curtain Panels"
  },
  "43": {
    "Brand": "Prestige",
    "Model": "Iris 750W",
    "Motor": "750W Copper Motor",
    "Speed Settings": "3 Speeds + Pulse",
    "Jars Included": "3 (1.5L Wet, 1L Dry, 0.5L Chutney)",
    "Jar Material": "Stainless Steel",
    "Safety Features": "Overload Protection, Locking Lid",
    "Base": "Anti-Skid Feet",
    "Voltage": "230V AC, 50Hz",
    "Warranty": "2 Years Manufacturer",
    "In The Box": "Mixer Grinder, 3 Jars with Lids, Blade Assembly, User Manual"
  },
  "50": {
    "Brand": "Samsung",
    "Capacity": "253 Litres",
    "Type": "Frost Free Double Door",
    "Compressor": "Digital Inverter",
    "Energy Rating": "3 Star BEE",
    "Cooling Technology": "All-Around Cooling",
    "Convertible": "5-in-1 Modes",
    "Stabiliser Free": "100V – 300V",
    "Shelves": "Toughened Glass",
    "Compressor Warranty": "10 Years",
    "Dimensions": "55.5 cm (W) x 63.7 cm (D) x 163.5 cm (H)",
    "In The Box": "Refrigerator, Ice Tray, Egg Tray, User Manual, Warranty Card"
  },
  "51": {
    "Brand": "LG",
    "Capacity": "8 Kg",
    "Type": "Fully Automatic Front Load",
    "Motor": "AI Direct Drive (20-Year Warranty)",
    "Energy Rating": "5 Star BEE",
    "Wash Programs": "14",
    "Max Spin Speed": "1200 RPM",
    "In-built Heater": "Up to 60°C",
    "Steam Wash": "Yes (99.9% Allergen Removal)",
    "Child Lock": "Yes",
    "Dimensions": "60 cm (W) x 56 cm (D) x 85 cm (H)",
    "In The Box": "Washing Machine, Inlet Hose, Drain Hose, User Manual, Warranty Card"
  },
  "55": {
    "Brand": "Crompton",
    "Model": "Energion HS",
    "Sweep Size": "1200mm (48 inches)",
    "Air Delivery": "225 CMM",
    "Speed": "400 RPM",
    "Motor Type": "Copper Wound",
    "Number of Blades": "3 (Aluminium)",
    "Finish": "Powder-Coated Anti-Rust",
    "Room Size": "Up to 150 sq ft",
    "Voltage": "220–240V, 50Hz",
    "Warranty": "2 Years Manufacturer",
    "In The Box": "Fan Body, 3 Blades, Mounting Rod, Canopy, Screws, Manual"
  },
  "45": {
    "Brand": "Butterfly",
    "Model": "Rapid",
    "Capacity": "1.5 Litres",
    "Power": "1500W",
    "Inner Body": "Food-Grade Stainless Steel",
    "Safety": "Auto Cut-off + Dry Boil Protection",
    "Base": "360° Swivel Cordless",
    "Indicator": "LED Power Light",
    "Cord Length": "0.75 m",
    "Voltage": "220–240V, 50Hz",
    "Warranty": "1 Year Manufacturer",
    "In The Box": "Kettle, Power Base Unit, User Manual"
  },
  "60": {
    "Brand": "L'Oreal Paris",
    "Product Line": "Revitalift",
    "Key Ingredient": "1.5% Pure Hyaluronic Acid",
    "Volume": "30 ml",
    "Skin Type": "All Skin Types",
    "Texture": "Lightweight, Non-Greasy Serum",
    "Paraben Free": "Yes",
    "Dermatologist Tested": "Yes",
    "Usage": "Apply 2-3 drops, Morning & Night",
    "Shelf Life": "24 Months",
    "Country of Origin": "France",
    "In The Box": "Serum Bottle (30 ml), Product Insert"
  },
  "61": {
    "Brand": "Maybelline New York",
    "Product Line": "Fit Me Matte + Poreless",
    "Type": "Liquid Foundation",
    "SPF": "22",
    "Volume": "30 ml",
    "Finish": "Matte",
    "Skin Type": "Normal to Oily",
    "Shades Available": "18 (for Indian Skin Tones)",
    "Dermatologically Tested": "Yes",
    "Oil Free": "Yes",
    "Country of Origin": "India",
    "In The Box": "Foundation Bottle (30 ml)"
  },
  "62": {
    "Brand": "LEGO",
    "Series": "Classic",
    "Set Name": "Creative Brick Box",
    "Pieces": "790",
    "Colours": "33",
    "Age Range": "4+ Years",
    "Material": "ABS Plastic (non-toxic)",
    "Special Elements": "Windows, Doors, Wheels, Eyes, Roof Tiles",
    "Storage": "Reusable Sturdy Box Included",
    "Compatibility": "All Standard LEGO Sets",
    "Safety": "BIS Certified, CE Marked",
    "In The Box": "790 LEGO Pieces, Building Ideas Booklet, Storage Box"
  },
  "63": {
    "Brand": "Hot Wheels (Mattel)",
    "Set Name": "10 Car Gift Pack",
    "Scale": "1:64",
    "Cars Included": "10",
    "Material": "Die-Cast Metal Body, Plastic Base",
    "Age Range": "3+ Years",
    "Track Compatible": "Yes (all Hot Wheels tracks)",
    "Wheels": "Free-Rolling",
    "Safety": "BIS Certified",
    "Country of Origin": "Malaysia/Thailand",
    "In The Box": "10 Die-Cast Cars in Collector Packaging"
  },
  "70": {
    "Brand": "Aashirvaad (ITC)",
    "Type": "Whole Wheat Flour (Atta)",
    "Variant": "Superior MP Sharbati",
    "Weight": "10 kg",
    "Wheat Source": "Madhya Pradesh Sharbati Wheat",
    "Maida Content": "0%",
    "Cleaning Process": "4-Stage Proprietary Process",
    "Rich In": "Protein & Dietary Fibre",
    "Dietary Info": "100% Vegetarian",
    "Shelf Life": "6 Months from Mfg.",
    "Storage": "Cool & Dry Place, Away from Sunlight",
    "Certification": "FSSAI Approved"
  },
  "73": {
    "Brand": "Maggi (Nestlé)",
    "Variant": "2-Minute Masala Noodles",
    "Pack Size": "12 x 70 g",
    "Total Weight": "840 g",
    "Cooking Time": "2 Minutes",
    "Added MSG": "No",
    "Fortified With": "Iron & Protein",
    "Dietary Info": "100% Vegetarian",
    "Certification": "FSSAI Approved",
    "Shelf Life": "9 Months from Mfg.",
    "Storage": "Cool & Dry Place",
    "Country of Origin": "India"
  },
  "71": {
    "Brand": "Tata Tea",
    "Variant": "Gold",
    "Weight": "1 kg",
    "Type": "Premium Long Leaf Tea",
    "Source": "Assam & Nilgiris Tea Gardens",
    "Packaging": "Vacuum-Sealed for Freshness",
    "Certification": "Rainforest Alliance Certified",
    "Rich In": "Natural Antioxidants",
    "Dietary Info": "100% Vegetarian",
    "Shelf Life": "18 Months from Mfg.",
    "Storage": "Airtight Container, Cool & Dry Place",
    "Country of Origin": "India"
  }
};

const reviewsMap = {
  "1001": [
    { author: "Rahul S.", rating: 5, title: "Best iPhone Ever Made!", comment: "The A19 Pro chip is insanely fast — everything loads instantly. Camera quality in low light is stunning, especially the 5x zoom. Battery easily lasts a full day with heavy use.", date: "January 2026", verifiedPurchase: true, likes: 342, dislikes: 18 },
    { author: "Priya M.", rating: 5, title: "Worth the Upgrade", comment: "Upgraded from iPhone 15 Pro Max and the difference is noticeable. The titanium build feels premium, and the display is gorgeous. Desert Titanium colour is absolutely beautiful.", date: "December 2025", verifiedPurchase: true, likes: 256, dislikes: 9 },
    { author: "Karthik L.", rating: 4, title: "Almost Perfect", comment: "Everything about this phone is top-notch except the price. Camera system is the best I've ever used on any smartphone. USB-C charging is finally fast enough.", date: "January 2026", verifiedPurchase: true, likes: 189, dislikes: 22 },
    { author: "Sneha D.", rating: 5, title: "Camera is Phenomenal", comment: "As a hobby photographer, the camera system blows me away. Night mode portraits look professional. The Action Button is super handy for quick camera access.", date: "November 2025", verifiedPurchase: true, likes: 145, dislikes: 7 }
  ],
  "1002": [
    { author: "Vikram K.", rating: 5, title: "Samsung's Best Phone Yet", comment: "The S25 Ultra is a beast. 200MP camera takes incredibly detailed photos. The S Pen with AI features is a game-changer for note-taking during meetings.", date: "January 2026", verifiedPurchase: true, likes: 287, dislikes: 14 },
    { author: "Ananya R.", rating: 5, title: "Galaxy AI is Amazing", comment: "Circle to Search and live translation features are incredibly useful. Battery lasts well over a day. The titanium frame makes it feel solid without being too heavy.", date: "December 2025", verifiedPurchase: true, likes: 203, dislikes: 11 },
    { author: "Rohan T.", rating: 4, title: "Great but Pricey", comment: "Display is the best I've seen on any phone. The 120Hz refresh rate is buttery smooth. Only complaint is that the phone is a bit large for one-handed use.", date: "January 2026", verifiedPurchase: true, likes: 167, dislikes: 19 },
    { author: "Meera J.", rating: 5, title: "Perfect for Productivity", comment: "S Pen is incredibly useful for quick notes and signing documents. The large display is perfect for multitasking with split-screen. Best Samsung phone I've owned.", date: "November 2025", verifiedPurchase: true, likes: 134, dislikes: 8 },
    { author: "Amit V.", rating: 4, title: "Flagship Experience", comment: "Coming from an iPhone, I'm impressed with the customisation options. Camera zoom at 100x is surprisingly usable. One UI 7 is clean and responsive.", date: "December 2025", verifiedPurchase: true, likes: 98, dislikes: 15 }
  ],
  "1003": [
    { author: "Deepika S.", rating: 5, title: "Absolutely Love It", comment: "The 6.9-inch display is stunning for watching movies. A18 Pro handles everything I throw at it without breaking a sweat. Battery lasts all day easily.", date: "October 2025", verifiedPurchase: true, likes: 412, dislikes: 21 },
    { author: "Sanjay B.", rating: 5, title: "Camera King", comment: "The 5x telephoto zoom is incredible — I can photograph birds from my balcony now. ProRes video recording is a dream for content creators. Highly recommended.", date: "September 2025", verifiedPurchase: true, likes: 298, dislikes: 14 },
    { author: "Kavita N.", rating: 4, title: "Great Phone, Heating Issue", comment: "Phone performs brilliantly and the camera is outstanding. Only issue is slight heating during prolonged gaming sessions. Otherwise, it's near perfect.", date: "November 2025", verifiedPurchase: true, likes: 187, dislikes: 34 },
    { author: "Arjun P.", rating: 5, title: "Best iPhone I've Owned", comment: "Titanium design feels incredible in hand. Camera Control button is surprisingly useful once you get used to it. iOS 18 with Apple Intelligence is the future.", date: "October 2025", verifiedPurchase: true, likes: 223, dislikes: 12 }
  ],
  "1004": [
    { author: "Nikhil A.", rating: 5, title: "Perfect Size Pro Phone", comment: "Not everyone wants a massive phone. The 6.3-inch iPhone 16 Pro is the sweet spot — all Pro features in a compact size. Camera system is fantastic.", date: "October 2025", verifiedPurchase: true, likes: 356, dislikes: 16 },
    { author: "Divya C.", rating: 4, title: "Solid Upgrade from 14 Pro", comment: "Camera improvements are noticeable, especially in video. A18 Pro is snappy for everything. Natural Titanium colour looks classy. Miss the lighter weight though.", date: "November 2025", verifiedPurchase: true, likes: 201, dislikes: 18 },
    { author: "Rajesh W.", rating: 5, title: "Compact Powerhouse", comment: "This phone packs flagship performance into a manageable size. ProMotion display is smooth as butter. 5x zoom on the smaller Pro model is a welcome addition.", date: "September 2025", verifiedPurchase: true, likes: 178, dislikes: 9 },
    { author: "Swathi M.", rating: 4, title: "Almost Perfect Upgrade", comment: "Love the Camera Control button and the overall performance. Battery could be slightly better for heavy use days, but it gets through a normal day fine.", date: "October 2025", verifiedPurchase: true, likes: 134, dislikes: 22 }
  ],
  "1005": [
    { author: "Manish K.", rating: 5, title: "Best Value iPhone", comment: "iPhone 15 is the sweet spot in Apple's lineup. Dynamic Island is great, 48MP camera takes amazing photos, and USB-C finally! Battery lasts a full day.", date: "August 2025", verifiedPurchase: true, likes: 567, dislikes: 23 },
    { author: "Ritu S.", rating: 4, title: "Great Everyday Phone", comment: "Upgraded from iPhone 12 and the difference is huge. Camera quality is noticeably better, and the phone feels snappy. Blue colour is gorgeous in person.", date: "July 2025", verifiedPurchase: true, likes: 345, dislikes: 17 },
    { author: "Aditya B.", rating: 5, title: "USB-C Finally!", comment: "So happy Apple moved to USB-C. One charger for everything now. The A16 chip handles all apps and games without any lag. Highly recommend for most people.", date: "September 2025", verifiedPurchase: true, likes: 289, dislikes: 12 }
  ],
  "1006": [
    { author: "Nisha P.", rating: 4, title: "Reliable Daily Driver", comment: "iPhone 14 still holds up well. Great camera, solid battery life, and smooth performance. Crash Detection feature gives peace of mind for daily commutes.", date: "June 2025", verifiedPurchase: true, likes: 445, dislikes: 28 },
    { author: "Suresh R.", rating: 4, title: "Good Value Now", comment: "At the current price, this is an excellent deal. A15 Bionic still handles everything well. Camera is great for social media. Only downside is Lightning port.", date: "July 2025", verifiedPurchase: true, likes: 312, dislikes: 19 },
    { author: "Lakshmi V.", rating: 5, title: "Perfect for Parents", comment: "Bought this for my mother and she loves it. Simple to use, great camera for video calls, and the battery lasts her two days. Emergency SOS via satellite is reassuring.", date: "August 2025", verifiedPurchase: true, likes: 234, dislikes: 8 }
  ],
  "1007": [
    { author: "Varun D.", rating: 4, title: "Still Going Strong", comment: "iPhone 13 is a workhorse. A15 chip handles everything without issues even in 2025. Cinematic Mode is fun for family videos. Great budget Apple option.", date: "May 2025", verifiedPurchase: true, likes: 534, dislikes: 31 },
    { author: "Anjali T.", rating: 5, title: "Best Budget iPhone", comment: "Got this at a great price and couldn't be happier. Camera takes stunning photos, battery lasts all day, and it still gets the latest iOS updates. Value for money.", date: "June 2025", verifiedPurchase: true, likes: 423, dislikes: 15 },
    { author: "Prakash M.", rating: 4, title: "Solid Choice", comment: "Bought this for daily use and it handles everything — from work emails to BGMI gaming. The Starlight colour looks premium. Only wish it had USB-C.", date: "July 2025", verifiedPurchase: true, likes: 289, dislikes: 22 },
    { author: "Sunita K.", rating: 4, title: "Trustworthy Phone", comment: "Coming from Android, the smoothness of iOS is remarkable. The 12MP camera is still very capable. Face ID works flawlessly every time.", date: "April 2025", verifiedPurchase: true, likes: 198, dislikes: 14 }
  ],
  "1008": [
    { author: "Gaurav H.", rating: 4, title: "Budget Apple Experience", comment: "iPhone 12 at this price is a steal. A14 Bionic still handles daily tasks well. 5G support future-proofs it. Great option for those entering the Apple ecosystem.", date: "March 2025", verifiedPurchase: true, likes: 567, dislikes: 34 },
    { author: "Tanvi R.", rating: 4, title: "Good Entry-Level iPhone", comment: "Perfect as my first iPhone. The display is beautiful, cameras are good for Instagram, and iMessage/FaceTime with family is seamless. Battery gets me through the day.", date: "April 2025", verifiedPurchase: true, likes: 389, dislikes: 21 },
    { author: "Rahul S.", rating: 3, title: "Decent but Ageing", comment: "Still a functional phone but you can feel its age in some newer apps. 64GB feels limited — definitely go for higher storage if available. Camera is still decent though.", date: "May 2025", verifiedPurchase: true, likes: 234, dislikes: 45 }
  ],
  "2001": [
    { author: "Vikram K.", rating: 5, title: "The Perfect Laptop", comment: "M3 chip is incredibly powerful for my coding and video editing workflow. 15-inch display is gorgeous and the 18-hour battery is no joke. Completely silent operation is a bonus.", date: "December 2025", verifiedPurchase: true, likes: 312, dislikes: 11 },
    { author: "Priya M.", rating: 5, title: "Worth Every Penny", comment: "Upgraded from an Intel MacBook and the difference is night and day. Everything is instant, no fan noise ever, and the display is stunning. Best laptop I've ever used.", date: "November 2025", verifiedPurchase: true, likes: 256, dislikes: 8 },
    { author: "Karthik L.", rating: 4, title: "Almost Perfect", comment: "Performance is amazing and the screen size is perfect for productivity. Only wish it had more than 2 USB-C ports. MagSafe charging is convenient though.", date: "January 2026", verifiedPurchase: true, likes: 189, dislikes: 23 },
    { author: "Sneha D.", rating: 5, title: "Best MacBook Air Yet", comment: "As a student, this is everything I need. Light enough to carry everywhere, battery lasts through all my lectures, and it handles Xcode and Figma without issues.", date: "October 2025", verifiedPurchase: true, likes: 167, dislikes: 6 }
  ],
  "2002": [
    { author: "Arjun P.", rating: 5, title: "The Ultimate Tablet", comment: "M4 chip in a tablet is overkill in the best way. The tandem OLED display is the most beautiful screen I've ever seen. Perfect for digital art with Apple Pencil Pro.", date: "December 2025", verifiedPurchase: true, likes: 278, dislikes: 13 },
    { author: "Deepika S.", rating: 5, title: "Replaced My Laptop", comment: "With Stage Manager and the M4 chip, this iPad Pro has completely replaced my MacBook for most tasks. The display quality is absolutely breathtaking.", date: "November 2025", verifiedPurchase: true, likes: 234, dislikes: 9 },
    { author: "Rohan T.", rating: 4, title: "Incredible Hardware", comment: "The thinnest Apple device ever and it's incredibly powerful. Only holding it back is iPadOS — hoping for more desktop-class features. Hardware is 10/10 though.", date: "January 2026", verifiedPurchase: true, likes: 198, dislikes: 27 }
  ],
  "2003": [
    { author: "Ananya R.", rating: 5, title: "Best Earbuds Period", comment: "The noise cancellation is insane — I can't hear anything on the metro. Sound quality is rich and detailed. Adaptive Transparency mode is like having superpowers.", date: "November 2025", verifiedPurchase: true, likes: 456, dislikes: 18 },
    { author: "Amit V.", rating: 5, title: "Worth the Premium", comment: "Tried Sony and Samsung earbuds before these. AirPods Pro 2 win on seamless integration with iPhone. USB-C case is a welcome change. Battery life is excellent.", date: "October 2025", verifiedPurchase: true, likes: 334, dislikes: 14 },
    { author: "Kavita N.", rating: 4, title: "Great Sound, Pricey", comment: "Sound quality and ANC are top-tier. The ear tips fit perfectly and the case is compact. Wish they were a bit cheaper, but you get what you pay for.", date: "December 2025", verifiedPurchase: true, likes: 267, dislikes: 21 },
    { author: "Sanjay B.", rating: 5, title: "Perfect for Commute", comment: "Use these daily on my Bangalore commute. Noise cancellation blocks out auto rickshaws and traffic perfectly. Spatial Audio for movies is immersive. Highly recommended.", date: "September 2025", verifiedPurchase: true, likes: 198, dislikes: 7 }
  ],
  "2004": [
    { author: "Manish K.", rating: 5, title: "Health Tracking Champion", comment: "Sleep tracking and blood oxygen monitoring have genuinely improved my health habits. The always-on display is gorgeous. Best smartwatch for iPhone users.", date: "December 2025", verifiedPurchase: true, likes: 234, dislikes: 12 },
    { author: "Divya C.", rating: 5, title: "Love the New Design", comment: "Thinnest Apple Watch yet and the larger display makes such a difference. Jet Black colour looks sleek. Water resistance tested it in the pool — works perfectly.", date: "November 2025", verifiedPurchase: true, likes: 189, dislikes: 8 },
    { author: "Rajesh W.", rating: 4, title: "Great but Battery Could Be Better", comment: "Everything about Series 10 is an upgrade — display, thinness, sensors. But 18-hour battery means daily charging is mandatory. Still the best smartwatch out there.", date: "January 2026", verifiedPurchase: true, likes: 156, dislikes: 23 }
  ],
  "1": [
    { author: "Nikhil A.", rating: 5, title: "Great Value iPhone", comment: "iPhone 13 at this price is unbeatable. A15 chip runs everything smoothly. Cinematic mode creates beautiful family videos. Highly recommend for budget-conscious Apple fans.", date: "August 2025", verifiedPurchase: true, likes: 567, dislikes: 24 },
    { author: "Ritu S.", rating: 4, title: "Reliable Performance", comment: "Using this as my daily driver for months now. Camera is excellent for the price, and iOS updates keep it feeling fresh. Battery comfortably lasts a full day.", date: "July 2025", verifiedPurchase: true, likes: 398, dislikes: 17 },
    { author: "Gaurav H.", rating: 5, title: "Perfect Mid-Range Choice", comment: "Don't need the latest and greatest — iPhone 13 does everything I need brilliantly. IP68 water resistance saved me during monsoon season. Build quality is solid.", date: "September 2025", verifiedPurchase: true, likes: 312, dislikes: 11 },
    { author: "Swathi M.", rating: 4, title: "Smooth iOS Experience", comment: "Switched from Android and the smoothness of iOS on the A15 chip is remarkable. FaceTime video quality is excellent. Only miss the customisation options of Android.", date: "June 2025", verifiedPurchase: true, likes: 234, dislikes: 19 }
  ],
  "2": [
    { author: "Vikram K.", rating: 5, title: "Flagship Perfection", comment: "iPhone 16 Pro Max is the complete package. The 6.9-inch display is immersive, A18 Pro handles everything, and the camera system is in a league of its own.", date: "October 2025", verifiedPurchase: true, likes: 423, dislikes: 17 },
    { author: "Priya M.", rating: 5, title: "Photography Dream", comment: "As someone who loves mobile photography, this camera is incredible. 48MP main sensor captures insane detail. 5x zoom is sharp even in low light. Best phone camera ever.", date: "November 2025", verifiedPurchase: true, likes: 356, dislikes: 12 },
    { author: "Aditya B.", rating: 4, title: "Excellent but Heavy", comment: "Performance and camera are undeniably the best. Battery lasts well over a day. Titanium build is gorgeous. Only complaint is the weight — my pinky suffers during long use.", date: "October 2025", verifiedPurchase: true, likes: 267, dislikes: 31 },
    { author: "Meera J.", rating: 5, title: "Future-Proof Purchase", comment: "Apple Intelligence features keep getting better with updates. Camera Control is genuinely useful. This phone will easily last 5+ years. Worth the investment.", date: "December 2025", verifiedPurchase: true, likes: 198, dislikes: 9 }
  ],
  "3": [
    { author: "Suresh R.", rating: 4, title: "Solid Budget iPhone", comment: "iPhone 12 at this discounted price is incredible value. A14 chip handles daily tasks perfectly. 5G support is a nice bonus. Great for first-time iPhone buyers.", date: "April 2025", verifiedPurchase: true, likes: 489, dislikes: 27 },
    { author: "Nisha P.", rating: 4, title: "Good for the Price", comment: "MagSafe is convenient and the cameras still take great photos. Ceramic Shield has saved me from two drops already. 64GB is tight though — consider higher storage.", date: "May 2025", verifiedPurchase: true, likes: 345, dislikes: 22 },
    { author: "Lakshmi V.", rating: 3, title: "Functional but Limited Storage", comment: "Phone works well and looks great, but 64GB fills up fast with photos and apps. Camera quality is decent. Battery life is acceptable for moderate use.", date: "June 2025", verifiedPurchase: true, likes: 212, dislikes: 38 },
    { author: "Prakash M.", rating: 4, title: "Still a Good Phone", comment: "Don't let the age fool you — iPhone 12 still receives iOS updates and runs smoothly. Night mode photography is impressive. Recommend getting a case for the flat edges.", date: "March 2025", verifiedPurchase: true, likes: 278, dislikes: 16 }
  ],
  "4": [
    { author: "Rahul S.", rating: 5, title: "Android King", comment: "Galaxy S25 Ultra is the ultimate Android phone. The 200MP camera takes photos that rival my DSLR. S Pen with Galaxy AI makes it a productivity powerhouse.", date: "January 2026", verifiedPurchase: true, likes: 345, dislikes: 15 },
    { author: "Ananya R.", rating: 5, title: "Best Note-Taking Phone", comment: "S Pen is incredible for jotting down ideas during lectures. AI summarisation saves so much time. The display is the best I've ever seen on any device.", date: "December 2025", verifiedPurchase: true, likes: 267, dislikes: 11 },
    { author: "Rohan T.", rating: 4, title: "Impressive Hardware", comment: "Snapdragon 8 Gen 4 is blazing fast. 8K video recording is mind-blowing. Titanium frame feels premium. Wish Samsung would reduce the bloatware though.", date: "January 2026", verifiedPurchase: true, likes: 198, dislikes: 24 },
    { author: "Tanvi R.", rating: 5, title: "Perfect for Creators", comment: "100x Space Zoom, 8K video, and the S Pen make this the perfect phone for content creators. Battery easily lasts a full day of heavy shooting and editing.", date: "November 2025", verifiedPurchase: true, likes: 156, dislikes: 8 }
  ],
  "91": [
    { author: "Varun D.", rating: 4, title: "Does the Job Well", comment: "Easy to apply with the included alignment frame. No bubbles at all. Touch sensitivity is maintained perfectly. Good value protector at this price.", date: "October 2025", verifiedPurchase: true, likes: 189, dislikes: 12 },
    { author: "Anjali T.", rating: 5, title: "Perfect Fit", comment: "Applied it on my iPhone 15 and it fits edge-to-edge perfectly. Crystal clear display — can't even tell it's there. Fingerprint-resistant coating works great.", date: "November 2025", verifiedPurchase: true, likes: 145, dislikes: 6 },
    { author: "Sunita K.", rating: 4, title: "Good Protection", comment: "Already survived one drop that would have cracked my screen. The protector took the hit and I just replaced it. Keeps fingerprints away better than most.", date: "September 2025", verifiedPurchase: true, likes: 123, dislikes: 9 }
  ],
  "17": [
    { author: "Amit V.", rating: 5, title: "Perfect Fit Every Time", comment: "Levi's quality never disappoints. The slim fit is perfect — not too tight, not too loose. The stretch fabric makes them incredibly comfortable for all-day wear.", date: "October 2025", verifiedPurchase: true, likes: 345, dislikes: 14 },
    { author: "Karthik L.", rating: 4, title: "Classic Levi's Quality", comment: "These jeans are well-made and the fabric feels premium. Colour holds up well after multiple washes. The mid-rise sits comfortably. Slightly expensive but worth it.", date: "November 2025", verifiedPurchase: true, likes: 267, dislikes: 18 },
    { author: "Rohan T.", rating: 5, title: "My Go-To Jeans", comment: "Third pair of Levi's from Flipkart and consistently excellent quality. The slim fit is flattering and the elastane gives just enough stretch. Perfect with any shirt.", date: "September 2025", verifiedPurchase: true, likes: 198, dislikes: 8 },
    { author: "Deepika S.", rating: 4, title: "Great Gift for Husband", comment: "Bought these for my husband and he loves them. Size was accurate as per the Flipkart size chart. The dark wash colour is versatile for both casual and semi-formal wear.", date: "December 2025", verifiedPurchase: true, likes: 156, dislikes: 11 }
  ],
  "18": [
    { author: "Arjun P.", rating: 5, title: "Super Comfortable", comment: "The Air Max 270 cushioning is next level — feels like walking on clouds. The mesh upper keeps feet cool even in Indian summers. Looks stylish with jeans or shorts.", date: "October 2025", verifiedPurchase: true, likes: 289, dislikes: 13 },
    { author: "Manish K.", rating: 4, title: "Stylish and Comfortable", comment: "Nike quality is evident from the moment you put them on. Great for casual wear and light running. The visible Air unit gets compliments everywhere. Size runs true.", date: "November 2025", verifiedPurchase: true, likes: 212, dislikes: 17 },
    { author: "Divya C.", rating: 5, title: "Best Running Shoes", comment: "Use these for morning jogs and weekend errands. The cushioning absorbs impact beautifully. Breathable mesh keeps sweating minimal. Worth the premium price.", date: "September 2025", verifiedPurchase: true, likes: 178, dislikes: 9 },
    { author: "Rajesh W.", rating: 4, title: "Good but Run Narrow", comment: "Excellent shoes overall — comfortable, stylish, and well-built. Just note they run slightly narrow. If you have wide feet, go half a size up. Rubber outsole grips well.", date: "August 2025", verifiedPurchase: true, likes: 134, dislikes: 22 }
  ],
  "19": [
    { author: "Vikram K.", rating: 5, title: "Runner's Dream", comment: "The BOOST energy return is incredible — my legs feel less tired after long runs. The Continental rubber sole grips perfectly in Bangalore monsoon. Lightest running shoes I've owned.", date: "October 2025", verifiedPurchase: true, likes: 267, dislikes: 11 },
    { author: "Sneha D.", rating: 5, title: "Best Running Shoes Ever", comment: "Ultraboost Light lives up to its name — incredibly lightweight yet supportive. The Primeknit upper fits like a sock. Completed my first marathon in these. Absolutely love them.", date: "November 2025", verifiedPurchase: true, likes: 234, dislikes: 8 },
    { author: "Nikhil A.", rating: 4, title: "Premium Quality, Premium Price", comment: "Outstanding shoes for serious runners. The cushioning is responsive and the Continental outsole is durable. Expensive but you get what you pay for. Highly recommend.", date: "September 2025", verifiedPurchase: true, likes: 178, dislikes: 15 },
    { author: "Ritu S.", rating: 4, title: "Comfortable All Day", comment: "Not just for running — I wear these to office on casual Fridays. The comfort is unmatched for standing or walking long hours. Size chart on Flipkart is accurate.", date: "August 2025", verifiedPurchase: true, likes: 145, dislikes: 12 }
  ],
  "24": [
    { author: "Sanjay B.", rating: 4, title: "Stylish at Budget Price", comment: "Great watch for daily use. The genuine leather strap looks and feels much more expensive than the price suggests. Keeps accurate time and the design gets compliments.", date: "October 2025", verifiedPurchase: true, likes: 198, dislikes: 14 },
    { author: "Gaurav H.", rating: 4, title: "Value for Money", comment: "Fastrack delivers good quality at an accessible price. The watch face is clean and easy to read. Leather strap needs a few days to break in but becomes comfortable.", date: "November 2025", verifiedPurchase: true, likes: 156, dislikes: 11 },
    { author: "Prakash M.", rating: 5, title: "Perfect Daily Watch", comment: "Been wearing this daily for 3 months and it still looks new. Water-resistant claim tested in rain — works fine. Great option for college students and young professionals.", date: "September 2025", verifiedPurchase: true, likes: 134, dislikes: 7 }
  ],
  "92": [
    { author: "Varun D.", rating: 4, title: "Soft and Comfortable", comment: "The bio-washed fabric is noticeably soft. Print quality is good and hasn't faded after 5 washes. Regular fit is perfect for me. Great deal at this price.", date: "November 2025", verifiedPurchase: true, likes: 145, dislikes: 9 },
    { author: "Tanvi R.", rating: 4, title: "Good Quality for Price", comment: "Bought 3 for the combo offer and all are good quality. Cotton fabric breathes well in summer. Prints are vibrant. Sizing is accurate — go with your regular size.", date: "October 2025", verifiedPurchase: true, likes: 112, dislikes: 7 },
    { author: "Nisha P.", rating: 3, title: "Decent T-Shirt", comment: "Fabric is nice but the print started fading slightly after the 3rd wash. Fit is comfortable though. Good for daily casual wear at home or college.", date: "December 2025", verifiedPurchase: true, likes: 89, dislikes: 14 },
    { author: "Suresh R.", rating: 5, title: "Best Budget T-Shirts", comment: "Amazing quality for the price. Cotton is thick enough to not be see-through. Stitching is clean and sturdy. Bought the whole collection of prints!", date: "September 2025", verifiedPurchase: true, likes: 167, dislikes: 5 }
  ],
  "29": [
    { author: "Ananya R.", rating: 5, title: "Best Laptop Purchase Ever", comment: "M3 MacBook Air 15-inch is a dream machine. Silent operation, all-day battery, and the display is gorgeous. Handles my React development workflow flawlessly.", date: "November 2025", verifiedPurchase: true, likes: 289, dislikes: 12 },
    { author: "Karthik L.", rating: 5, title: "Perfect for Developers", comment: "Running Docker, VS Code, multiple browsers, and Figma simultaneously without a hiccup. 16GB unified memory is more than enough. Battery lasts 14+ hours real-world.", date: "December 2025", verifiedPurchase: true, likes: 234, dislikes: 9 },
    { author: "Priya M.", rating: 4, title: "Stunning Display", comment: "The 15.3-inch Liquid Retina display is perfect for design work. Speakers are surprisingly good. Wish it had more ports, but the performance makes up for it.", date: "October 2025", verifiedPurchase: true, likes: 178, dislikes: 16 },
    { author: "Amit V.", rating: 5, title: "Silent Powerhouse", comment: "Cannot emphasise enough how nice it is to have zero fan noise. Even during heavy compilation tasks, it stays cool and silent. The Midnight colour is beautiful.", date: "January 2026", verifiedPurchase: true, likes: 156, dislikes: 7 }
  ],
  "30": [
    { author: "Rohan T.", rating: 4, title: "Excellent OLED Display", comment: "The 2.8K OLED display is absolutely stunning for photo and video editing. Colours are incredibly accurate. Intel Core Ultra handles multitasking like a champ.", date: "November 2025", verifiedPurchase: true, likes: 198, dislikes: 14 },
    { author: "Sneha D.", rating: 4, title: "Great Windows Laptop", comment: "If you need Windows, this is one of the best options. The OLED display is gorgeous, build quality is premium, and it's surprisingly light at 1.4kg.", date: "October 2025", verifiedPurchase: true, likes: 156, dislikes: 11 },
    { author: "Rajesh W.", rating: 5, title: "Perfect for Creators", comment: "As a video editor, the OLED display with DCI-P3 coverage is essential. The Thunderbolt 4 port handles my external SSD at full speed. Keyboard is comfortable for long sessions.", date: "December 2025", verifiedPurchase: true, likes: 134, dislikes: 8 },
    { author: "Meera J.", rating: 4, title: "Good but Battery Could Be Better", comment: "Performance and display are top-notch. Only drawback is the 10-hour battery life — OLED drains faster. Carry the charger for full-day use. Otherwise, excellent laptop.", date: "November 2025", verifiedPurchase: true, likes: 112, dislikes: 17 }
  ],
  "33": [
    { author: "Arjun P.", rating: 5, title: "Best Headphones I've Owned", comment: "The noise cancellation on XM5 is absolutely phenomenal. On my daily Mumbai local train, I can't hear a thing. Sound quality is rich and detailed with LDAC. Battery lasts a week of commuting.", date: "October 2025", verifiedPurchase: true, likes: 345, dislikes: 14 },
    { author: "Deepika S.", rating: 5, title: "WFH Essential", comment: "These headphones transformed my work-from-home experience. Blocks out all household noise, mic quality is crystal clear for meetings, and they're comfortable for 8+ hour wear.", date: "November 2025", verifiedPurchase: true, likes: 278, dislikes: 9 },
    { author: "Kavita N.", rating: 4, title: "Premium Sound, Premium Price", comment: "Sound quality is exceptional — you hear details in songs you've never noticed before. The carry case is high quality. Only wish they were foldable for easier portability.", date: "December 2025", verifiedPurchase: true, likes: 212, dislikes: 18 },
    { author: "Sanjay B.", rating: 5, title: "Speak-to-Chat is Genius", comment: "The auto-pause when you speak is incredibly convenient. Multipoint connection to phone and laptop simultaneously is seamless. 30-hour battery life is real — tested it myself.", date: "September 2025", verifiedPurchase: true, likes: 189, dislikes: 7 }
  ],
  "90": [
    { author: "Varun D.", rating: 4, title: "Fast Charging, Great Cable", comment: "65W charging for my laptop and phone with one cable type. The braided design is durable and doesn't tangle. Good length for bedside charging. Great value.", date: "November 2025", verifiedPurchase: true, likes: 134, dislikes: 8 },
    { author: "Nikhil A.", rating: 5, title: "Best Budget Cable", comment: "Bought 3 of these for home, office, and car. All working perfectly after months. The braided nylon feels premium. Charges my MacBook Air at full speed.", date: "October 2025", verifiedPurchase: true, likes: 112, dislikes: 5 },
    { author: "Anjali T.", rating: 4, title: "Does What It Should", comment: "Charges fast, transfers data, and the build quality is solid. 1-metre length is perfect for desk use. Would buy the 2-metre version for more flexibility.", date: "December 2025", verifiedPurchase: true, likes: 89, dislikes: 6 }
  ],
  "93": [
    { author: "Ritu S.", rating: 5, title: "Must-Have Desk Accessory", comment: "This stand is incredibly useful for video calls and watching tutorials while cooking. Folds completely flat for travel. The angle adjustment is smooth and holds position well.", date: "November 2025", verifiedPurchase: true, likes: 123, dislikes: 7 },
    { author: "Manish K.", rating: 4, title: "Sturdy and Portable", comment: "Holds my iPad mini perfectly for watching cricket. The anti-slip pads keep the device secure. Aluminium construction feels solid. Good value purchase.", date: "October 2025", verifiedPurchase: true, likes: 98, dislikes: 5 },
    { author: "Lakshmi V.", rating: 4, title: "Great for Video Calls", comment: "Using this for daily office video calls and it keeps my phone at the perfect angle. Easy to adjust and very stable. Folds small enough for my handbag.", date: "September 2025", verifiedPurchase: true, likes: 78, dislikes: 4 }
  ],
  "94": [
    { author: "Aditya B.", rating: 4, title: "Bass Is Impressive", comment: "For the price, the bass on these earphones is phenomenal. Tangle-free cable is a blessing. Mic works well for calls. Perfect budget earphones for bass lovers.", date: "November 2025", verifiedPurchase: true, likes: 234, dislikes: 14 },
    { author: "Gaurav H.", rating: 4, title: "Best Budget Earphones", comment: "boAt delivers consistent quality at budget prices. The BassHeads 100 has punchy bass and the braided cable is durable. In-line controls work perfectly with my phone.", date: "October 2025", verifiedPurchase: true, likes: 189, dislikes: 11 },
    { author: "Sunita K.", rating: 5, title: "Great for Gym Workouts", comment: "IPX4 sweat resistance actually works — used these for months at the gym. Sound quality is impressive for the price. Different ear tip sizes ensure a secure fit.", date: "September 2025", verifiedPurchase: true, likes: 156, dislikes: 7 },
    { author: "Tanvi R.", rating: 3, title: "Good Sound, Average Durability", comment: "Sound quality is excellent for the price. However, the cable near the jack started fraying after 4 months. Good while it lasts. Keep it as a backup pair.", date: "December 2025", verifiedPurchase: true, likes: 123, dislikes: 18 }
  ],
  "40": [
    { author: "Rahul S.", rating: 5, title: "Life-Changing Purchase", comment: "My chronic back pain has significantly reduced since switching to this mattress. The cooling gel layer keeps me comfortable even in Chennai summers. Worth every rupee.", date: "October 2025", verifiedPurchase: true, likes: 456, dislikes: 18 },
    { author: "Priya M.", rating: 4, title: "Excellent Sleep Quality", comment: "The medium-firm support is perfect for side sleepers like me. Takes about a week to fully expand. The removable cover is super convenient to wash. Great investment.", date: "November 2025", verifiedPurchase: true, likes: 345, dislikes: 14 },
    { author: "Vikram K.", rating: 5, title: "Doctor Recommended", comment: "My orthopaedic doctor recommended a memory foam mattress and this was the best-rated one. No more morning stiffness. The 10-year warranty gives confidence in the purchase.", date: "September 2025", verifiedPurchase: true, likes: 289, dislikes: 11 },
    { author: "Kavita N.", rating: 4, title: "Good but Has Initial Odour", comment: "Mattress quality is excellent and very comfortable. Only downside is a chemical smell for the first 2-3 days after unboxing. Airs out completely after that. Sleep quality improved significantly.", date: "December 2025", verifiedPurchase: true, likes: 212, dislikes: 23 }
  ],
  "41": [
    { author: "Sneha D.", rating: 4, title: "Perfect WFH Setup", comment: "Assembled it in about 45 minutes following the video guide. The cable management shelf is a thoughtful touch. Surface is spacious enough for dual monitors. Sturdy build.", date: "November 2025", verifiedPurchase: true, likes: 198, dislikes: 12 },
    { author: "Karthik L.", rating: 4, title: "Good Quality Furniture", comment: "Looks exactly like the pictures. The laminate finish is smooth and cleans easily. Drawers slide smoothly. Assembly was straightforward. Great value for a WFH desk.", date: "October 2025", verifiedPurchase: true, likes: 156, dislikes: 9 },
    { author: "Rohan T.", rating: 3, title: "Decent but Assembly is Tricky", comment: "Table itself is good quality and looks nice. However, the assembly instructions could be clearer. One pre-drilled hole was slightly misaligned. Works well once set up.", date: "December 2025", verifiedPurchase: true, likes: 112, dislikes: 17 },
    { author: "Divya C.", rating: 5, title: "Excellent Study Table", comment: "Bought this for my daughter's study room. She loves the drawers for organising stationery. The anti-scratch surface has survived her art projects. Very happy with the purchase.", date: "September 2025", verifiedPurchase: true, likes: 134, dislikes: 5 }
  ],
  "42": [
    { author: "Sanjay B.", rating: 4, title: "Comfortable and Good Looking", comment: "This sofa exceeded my expectations for the price. The foam cushions are firm and comfortable. Stone grey colour matches our living room perfectly. Free installation was a bonus.", date: "November 2025", verifiedPurchase: true, likes: 234, dislikes: 14 },
    { author: "Meera J.", rating: 4, title: "Great Value Sofa", comment: "For the price, the quality is impressive. Sal wood frame feels solid and the cushions haven't sagged after 3 months. Fabric is easy to clean with a damp cloth.", date: "October 2025", verifiedPurchase: true, likes: 189, dislikes: 11 },
    { author: "Amit V.", rating: 5, title: "Best Budget Sofa", comment: "Looks much more expensive than it costs. Flipkart's installation team was professional and quick. Seats three adults comfortably. The cushion support is excellent.", date: "December 2025", verifiedPurchase: true, likes: 167, dislikes: 8 },
    { author: "Nisha P.", rating: 3, title: "Good but Delivery Was Rough", comment: "Sofa itself is comfortable and well-built. The delivery took longer than expected and the packaging was slightly damaged. But the sofa inside was fine. Satisfactory purchase.", date: "September 2025", verifiedPurchase: true, likes: 98, dislikes: 19 }
  ],
  "44": [
    { author: "Anjali T.", rating: 5, title: "Sleep So Much Better", comment: "These curtains made my bedroom pitch dark. No more 5 AM sunlight waking me up. The thermal insulation is noticeable — AC bill has reduced. Amazing purchase.", date: "October 2025", verifiedPurchase: true, likes: 234, dislikes: 8 },
    { author: "Rajesh W.", rating: 4, title: "Effective Blackout", comment: "99% blackout claim is accurate. Room gets almost completely dark even at noon. The grommets slide smoothly on the curtain rod. Fabric feels thick and premium.", date: "November 2025", verifiedPurchase: true, likes: 178, dislikes: 11 },
    { author: "Lakshmi V.", rating: 4, title: "Good Quality Curtains", comment: "Nice heavy fabric that drapes well. Machine washed them and they came out perfectly. Colour hasn't faded. Only wish they came in more colour options.", date: "September 2025", verifiedPurchase: true, likes: 145, dislikes: 9 }
  ],
  "43": [
    { author: "Sunita K.", rating: 5, title: "Kitchen Workhorse", comment: "This mixer grinder handles everything from rock-hard turmeric to silky dosa batter. The 750W motor is powerful. Three jars cover all cooking needs. Very happy with the purchase.", date: "October 2025", verifiedPurchase: true, likes: 345, dislikes: 14 },
    { author: "Gaurav H.", rating: 4, title: "Powerful and Reliable", comment: "Using this daily for almost 6 months — no issues at all. Grinds masalas to fine powder quickly. The pulse function is useful for coarse grinding. Good build quality.", date: "November 2025", verifiedPurchase: true, likes: 267, dislikes: 11 },
    { author: "Tanvi R.", rating: 4, title: "Perfect for Indian Kitchen", comment: "Handles all Indian cooking prep effortlessly — from chutneys to masala pastes. The leak-proof lids are a relief. Motor is a bit noisy at top speed, but that's expected.", date: "September 2025", verifiedPurchase: true, likes: 198, dislikes: 15 },
    { author: "Prakash M.", rating: 5, title: "Best Mixer Under ₹5000", comment: "Prestige quality shows in every detail. Jars are thick stainless steel, motor is powerful, and the overload protection gives peace of mind. Highly recommended.", date: "December 2025", verifiedPurchase: true, likes: 156, dislikes: 7 }
  ],
  "50": [
    { author: "Rahul S.", rating: 5, title: "Perfect Family Fridge", comment: "253L is ideal for a family of four. The Digital Inverter compressor is whisper quiet. Convertible 5-in-1 is super useful during festivals for extra space. Excellent purchase.", date: "November 2025", verifiedPurchase: true, likes: 312, dislikes: 14 },
    { author: "Deepika S.", rating: 4, title: "Energy Efficient and Spacious", comment: "All-Around Cooling keeps food fresh longer. Stabiliser-free operation is essential in my area with frequent voltage fluctuations. 3 Star rating keeps electricity bills manageable.", date: "October 2025", verifiedPurchase: true, likes: 256, dislikes: 11 },
    { author: "Arjun P.", rating: 5, title: "Samsung Quality", comment: "Been a Samsung appliance user for years and this doesn't disappoint. The Twin Cooling keeps fruits fresh for over a week. Build quality is premium. 10-year compressor warranty is reassuring.", date: "December 2025", verifiedPurchase: true, likes: 198, dislikes: 8 },
    { author: "Kavita N.", rating: 4, title: "Good Fridge, Slow Delivery", comment: "The fridge itself is excellent — spacious, quiet, and keeps food perfectly cold. Installation team was professional. Delivery took 5 extra days though. Product is 5 stars, delivery is 3.", date: "September 2025", verifiedPurchase: true, likes: 145, dislikes: 16 }
  ],
  "51": [
    { author: "Priya M.", rating: 5, title: "Clothes Come Out Pristine", comment: "The AI Direct Drive detects fabric type automatically — delicates are treated gently, heavy loads get deep cleaning. Steam wash removed all allergens from baby clothes. Love it.", date: "November 2025", verifiedPurchase: true, likes: 289, dislikes: 12 },
    { author: "Vikram K.", rating: 5, title: "Quiet and Efficient", comment: "Barely any vibration even at 1200 RPM spin. The 5 Star energy rating shows in my electricity bill — noticeably lower than my old top-loader. 14 wash programs cover everything.", date: "October 2025", verifiedPurchase: true, likes: 234, dislikes: 9 },
    { author: "Meera J.", rating: 4, title: "Excellent Front Loader", comment: "Great washing results and the in-built heater is perfect for sanitising towels and bed sheets. 8Kg handles our family laundry in fewer loads. Only downside — long wash cycles.", date: "December 2025", verifiedPurchase: true, likes: 178, dislikes: 15 },
    { author: "Sanjay B.", rating: 4, title: "Worth the Investment", comment: "Expensive upfront but saves money long-term with energy efficiency and the 20-year motor warranty. Child lock is essential with toddlers around. Installation by LG team was smooth.", date: "September 2025", verifiedPurchase: true, likes: 156, dislikes: 11 }
  ],
  "55": [
    { author: "Manish K.", rating: 4, title: "Good Airflow", comment: "Delivers strong air even at medium speed. Covers my 12x12 bedroom easily. The powder-coated finish looks good on the ceiling. Runs quietly even at full speed.", date: "October 2025", verifiedPurchase: true, likes: 198, dislikes: 12 },
    { author: "Aditya B.", rating: 4, title: "Value for Money Fan", comment: "Crompton makes reliable fans and this one is no different. Installation was easy with standard fittings. Air delivery is good for the price. Runs smoothly without wobble.", date: "November 2025", verifiedPurchase: true, likes: 156, dislikes: 9 },
    { author: "Nisha P.", rating: 5, title: "Best Budget Ceiling Fan", comment: "Bought 3 for different rooms and all perform excellently. The 1200mm sweep covers medium to large rooms well. Energy efficient compared to my old fans. Highly recommended.", date: "September 2025", verifiedPurchase: true, likes: 134, dislikes: 6 },
    { author: "Suresh R.", rating: 4, title: "Does the Job Well", comment: "Simple, effective ceiling fan. Good air delivery at all speeds. Powder coating looks fresh even after monsoon season. Crompton's 2-year warranty gives peace of mind.", date: "December 2025", verifiedPurchase: true, likes: 112, dislikes: 8 }
  ],
  "45": [
    { author: "Ritu S.", rating: 5, title: "Quick and Convenient", comment: "Boils water incredibly fast — perfect for morning chai rush. Auto shut-off works reliably every time. The stainless steel body is easy to clean. Essential kitchen appliance.", date: "October 2025", verifiedPurchase: true, likes: 234, dislikes: 9 },
    { author: "Varun D.", rating: 4, title: "Perfect for Hostel Life", comment: "This kettle is my hostel room's most useful appliance. Instant noodles, tea, coffee, soup — handles everything. Compact size doesn't take much space. Auto cut-off is a lifesaver.", date: "November 2025", verifiedPurchase: true, likes: 198, dislikes: 7 },
    { author: "Anjali T.", rating: 4, title: "Good Build Quality", comment: "Stainless steel inner body feels quality. The 360° base is convenient. Boils 1.5L in about 5 minutes. Cool-touch handle is genuinely cool. LED indicator is helpful.", date: "September 2025", verifiedPurchase: true, likes: 156, dislikes: 11 },
    { author: "Gaurav H.", rating: 5, title: "Kitchen Essential", comment: "Use this 4-5 times a day and it's been going strong for 8 months. No limescale buildup thanks to the concealed element. Dry boil protection tested accidentally once — it works!", date: "December 2025", verifiedPurchase: true, likes: 134, dislikes: 5 }
  ],
  "60": [
    { author: "Divya C.", rating: 5, title: "Visible Results in 2 Weeks", comment: "My skin has never been this hydrated. Fine lines around my eyes have visibly reduced. The serum absorbs quickly and doesn't feel sticky under makeup. Holy grail product.", date: "November 2025", verifiedPurchase: true, likes: 234, dislikes: 8 },
    { author: "Sneha D.", rating: 4, title: "Great Hydrating Serum", comment: "Noticeable improvement in skin plumpness and glow after 3 weeks. The lightweight formula works well under sunscreen. Paraben-free is a big plus. Will definitely repurchase.", date: "October 2025", verifiedPurchase: true, likes: 189, dislikes: 11 },
    { author: "Tanvi R.", rating: 5, title: "Best Serum at This Price", comment: "Tried many hyaluronic acid serums but L'Oreal's formula is superior. Skin feels bouncy and hydrated all day. 30ml lasts about 2 months with daily use. Excellent value.", date: "December 2025", verifiedPurchase: true, likes: 167, dislikes: 6 },
    { author: "Nisha P.", rating: 4, title: "Good for Dry Skin", comment: "My dry skin has improved dramatically. No more flakiness even in Delhi winter. The dropper dispenser is hygienic and easy to use. Recommend using with a good moisturiser on top.", date: "September 2025", verifiedPurchase: true, likes: 134, dislikes: 9 }
  ],
  "61": [
    { author: "Priya M.", rating: 4, title: "Perfect Shade Match", comment: "Finally found a foundation that matches my skin tone perfectly. The matte finish lasts 6-7 hours without touchup. Doesn't clog pores. The 18 shades for Indian skin is appreciated.", date: "November 2025", verifiedPurchase: true, likes: 289, dislikes: 14 },
    { author: "Ananya R.", rating: 5, title: "Best Drugstore Foundation", comment: "This foundation gives medium coverage that looks natural. Blurs pores beautifully. SPF 22 is a bonus. I use shade 230 and it blends seamlessly. Repurchased 3 times already.", date: "October 2025", verifiedPurchase: true, likes: 234, dislikes: 9 },
    { author: "Kavita N.", rating: 4, title: "Good but Oxidises Slightly", comment: "Coverage and finish are great. Only note — it oxidises slightly darker after 2 hours, so pick one shade lighter. Oil control is impressive for my oily T-zone. Good value.", date: "December 2025", verifiedPurchase: true, likes: 178, dislikes: 17 },
    { author: "Deepika S.", rating: 4, title: "Great Everyday Foundation", comment: "Perfect for daily use — lightweight, buildable coverage, and SPF protection. The matte finish controls shine well. At this price, you can't ask for more. Suitable for oily skin.", date: "September 2025", verifiedPurchase: true, likes: 145, dislikes: 11 }
  ],
  "62": [
    { author: "Rajesh W.", rating: 5, title: "Kid Absolutely Loves It!", comment: "Bought this for my 5-year-old's birthday and he hasn't stopped building since. The 790 pieces provide endless creativity. The storage box makes cleanup easy. Best investment for kids.", date: "December 2025", verifiedPurchase: true, likes: 234, dislikes: 7 },
    { author: "Meera J.", rating: 5, title: "Hours of Creative Fun", comment: "Both my kids (ages 6 and 9) play with this together. The variety of pieces and colours sparks incredible creativity. LEGO quality as always — no sharp edges, perfect fit.", date: "November 2025", verifiedPurchase: true, likes: 198, dislikes: 5 },
    { author: "Amit V.", rating: 4, title: "Excellent Toy", comment: "Great set with lots of variety. The special pieces like wheels and windows add so many possibilities. Only wish the instruction booklet had more building ideas. Kids love it.", date: "October 2025", verifiedPurchase: true, likes: 156, dislikes: 9 },
    { author: "Sunita K.", rating: 5, title: "Educational and Fun", comment: "My daughter's creativity has flourished since getting this set. She builds something new every day. Compatible with her older LEGO sets too. Worth the price for the quality.", date: "September 2025", verifiedPurchase: true, likes: 134, dislikes: 4 }
  ],
  "63": [
    { author: "Arjun P.", rating: 5, title: "Perfect Gift for Car-Loving Kids", comment: "My son was thrilled with this 10-car set. Each car has unique detailing and rolls perfectly on Hot Wheels tracks. Die-cast quality feels solid. Great value gift pack.", date: "December 2025", verifiedPurchase: true, likes: 198, dislikes: 8 },
    { author: "Sanjay B.", rating: 4, title: "Good Variety of Cars", comment: "Nice mix of muscle cars, sports cars, and concept vehicles. Paint quality is good for the price. My 4-year-old plays with them daily. Compatible with all our existing tracks.", date: "November 2025", verifiedPurchase: true, likes: 156, dislikes: 7 },
    { author: "Gaurav H.", rating: 5, title: "Collector's Delight", comment: "As an adult Hot Wheels collector, this pack offers good value. Some exclusive designs in this set. Die-cast bodies are hefty and well-made. Packaging is collector-worthy.", date: "October 2025", verifiedPurchase: true, likes: 134, dislikes: 5 },
    { author: "Divya C.", rating: 4, title: "Birthday Party Hit", comment: "Bought multiple packs as return gifts for my son's birthday party. Every kid loved them. Good quality, safe for children, and reasonably priced. Will buy again.", date: "September 2025", verifiedPurchase: true, likes: 112, dislikes: 6 }
  ],
  "70": [
    { author: "Lakshmi V.", rating: 5, title: "Best Atta for Soft Rotis", comment: "Aashirvaad MP atta consistently makes the softest rotis. The dough is easy to knead and absorbs water perfectly. My family can immediately tell if I switch brands. Loyal customer.", date: "November 2025", verifiedPurchase: true, likes: 456, dislikes: 12 },
    { author: "Prakash M.", rating: 4, title: "Premium Quality Atta", comment: "Sharbati wheat quality is noticeably better than regular atta. Rotis are soft even hours after making. 10kg pack lasts our family of 4 about 3 weeks. Good value.", date: "October 2025", verifiedPurchase: true, likes: 345, dislikes: 14 },
    { author: "Sunita K.", rating: 5, title: "Family's First Choice", comment: "Been buying Aashirvaad for over 10 years. The consistency is amazing — every batch produces perfectly soft chapatis. 0% maida claim is trustworthy. Stock up during sales.", date: "December 2025", verifiedPurchase: true, likes: 289, dislikes: 8 },
    { author: "Tanvi R.", rating: 4, title: "Good Atta, Prompt Delivery", comment: "Flipkart delivered 10kg to my door which saved a trip to the store. Atta quality is excellent as always. Packaging was intact. Rotis come out round and soft every time.", date: "September 2025", verifiedPurchase: true, likes: 198, dislikes: 11 }
  ],
  "73": [
    { author: "Varun D.", rating: 5, title: "Hostel Survival Essential", comment: "Maggi is the ultimate comfort food. 2-minute claim is genuine — quick, tasty, and satisfying. This 12-pack lasted me 2 weeks in my hostel. The masala flavour is unbeatable.", date: "November 2025", verifiedPurchase: true, likes: 567, dislikes: 18 },
    { author: "Nisha P.", rating: 5, title: "India's Favourite Comfort Food", comment: "No explanation needed — it's Maggi! The masala tastemaker is perfectly spiced. I add veggies and an egg for a quick nutritious meal. 12-pack is the way to buy.", date: "October 2025", verifiedPurchase: true, likes: 445, dislikes: 12 },
    { author: "Ritu S.", rating: 4, title: "Quick Fix for Late Nights", comment: "Perfect for midnight cravings and lazy Sunday lunches. Consistent taste every time. Good that it has no added MSG now. Only wish they made a spicier variant.", date: "December 2025", verifiedPurchase: true, likes: 334, dislikes: 15 },
    { author: "Aditya B.", rating: 5, title: "Pantry Staple", comment: "Always keep Maggi stocked at home. The kids love it as an after-school snack. 12-pack value is better than buying individual packets from shops. Fresh and within expiry date.", date: "September 2025", verifiedPurchase: true, likes: 267, dislikes: 9 }
  ],
  "71": [
    { author: "Suresh R.", rating: 5, title: "Best Tea for Daily Chai", comment: "Tata Gold has the perfect balance of strength and flavour. The aroma when brewing is heavenly. Makes excellent cutting chai — strong, flavourful, without bitterness. 1kg lasts a month.", date: "November 2025", verifiedPurchase: true, likes: 345, dislikes: 12 },
    { author: "Lakshmi V.", rating: 4, title: "Rich Taste, Great Aroma", comment: "Long leaf tea quality is evident — the brew is deep amber with a wonderful aroma. Tastes best with fresh milk and a pinch of elaichi. Vacuum-sealed pack keeps it fresh.", date: "October 2025", verifiedPurchase: true, likes: 267, dislikes: 9 },
    { author: "Prakash M.", rating: 5, title: "Our Family Tea", comment: "The whole family has been drinking Tata Gold for years. Rich, full-bodied flavour that satisfies with every cup. Rainforest Alliance certified is a nice ethical bonus.", date: "December 2025", verifiedPurchase: true, likes: 198, dislikes: 7 },
    { author: "Anjali T.", rating: 4, title: "Premium Tea Experience", comment: "Noticeably better than regular CTC teas. The long leaf gives a smoother, less bitter brew. Good for guests too — always gets compliments. Reorder every month from Flipkart.", date: "September 2025", verifiedPurchase: true, likes: 156, dislikes: 11 }
  ]
};

const enriched = products.map(product => {
  const id = product.id;
  return {
    ...product,
    images: generateImages(product.image),
    specs: specsMap[id] || {},
    reviews: reviewsMap[id] || [],
    brand: brandsMap[id] || "Generic",
    seller: sellersMap[id] || "RetailNet"
  };
});

fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2));
console.log(`Done! Enriched ${enriched.length} products.`);

const missing = enriched.filter(p => !specsMap[p.id] || !reviewsMap[p.id]);
if (missing.length > 0) {
  console.warn('WARNING: Missing enrichment data for:', missing.map(p => `${p.id} (${p.title})`));
}
