const items_data = [
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro Max",
    category: "tech",
    description:
      "Apple's top-tier smartphone model featuring the latest chip, camera, and display technology.", // Added description
    reviewCount: 1245,
    averageRating: 4.6,
    tags: ["smartphone", "apple", "flagship"],
  },
  {
    id: "cybertruck",
    name: "Tesla Cybertruck",
    category: "auto",
    description:
      "The unique, angular electric pickup truck known for its stainless steel exoskeleton.", // Added description
    reviewCount: 450,
    averageRating: 3.1,
    tags: ["truck", "electric", "tesla"],
  },
  {
    id: "dune-2",
    name: "Dune: Part Two",
    category: "media",
    description:
      "The highly-anticipated second film adaptation of the classic Frank Herbert science fiction novel.", // Added description
    reviewCount: 980,
    averageRating: 4.9,
    tags: ["movie", "scifi", "imax"],
  },
  {
    id: "a380-seat",
    name: "Airbus A380 Economy Seat",
    category: "travel",
    description:
      "A specific standard economy seat model found on the double-decker wide-body jet, reviewed for long-haul comfort.", // Added description
    reviewCount: 450,
    averageRating: 2.1,
    tags: ["airplane", "comfort", "long-haul"],
  },
  {
    id: "i95-va",
    name: "I-95 Southbound (VA)",
    category: "infrastructure",
    description:
      "A section of the major North-South interstate highway running through Virginia, notorious for traffic and road quality.", // Added description
    reviewCount: 2100,
    averageRating: 1.9,
    tags: ["road", "highway", "pothole"],
  },
  {
    id: "wh-1000xm6",
    name: "Sony WH-1000XM6 Headphones",
    category: "tech",
    description:
      "Premium over-ear headphones celebrated for industry-leading active noise cancellation (ANC) and sound quality.", // Added description
    reviewCount: 650,
    averageRating: 4.4,
    tags: ["audio", "anc", "wireless"],
  },
  {
    id: "macbook-pro-m4",
    name: 'MacBook Pro 16" (M4)',
    category: "tech",
    description:
      "Apple's professional 16-inch laptop, powered by the M4 chip, designed for power users and creators.", // Added description
    reviewCount: 300,
    averageRating: 4.8,
    tags: ["laptop", "apple", "pro"],
  },
  {
    id: "toyota-prius-2024",
    name: "Toyota Prius (2024)",
    category: "auto",
    description:
      "The modern, redesigned hybrid car model known for its exceptional fuel efficiency and striking new exterior.", // Added description
    reviewCount: 120,
    averageRating: 4.2,
    tags: ["hybrid", "car", "economy"],
  },
];

const nu_items = [
  {
    name: "Microsoft Surface Studio 2",
    category: "tech",
    description:
      "A high-end desktop computer with an adjustable zero-gravity hinge display designed for graphic designers.",
  },
  {
    name: "Ford F-150 Lightning (2025)",
    category: "auto",
    description:
      "The latest model of Ford's all-electric pickup truck, focusing on range and towing capabilities.",
  },
  {
    name: "Oppenheimer (Film)",
    category: "media",
    description:
      "Christopher Nolan's biopic about the theoretical physicist J. Robert Oppenheimer and the development of the atomic bomb.",
  },
  {
    name: "Tokyo Narita Airport (NRT)",
    category: "travel",
    description:
      "Review of the main international gateway to the Greater Tokyo Area, focusing on customs and amenities.",
  },
  {
    name: "Brooklyn Bridge (NYC)",
    category: "infrastructure",
    description:
      "The historic hybrid cable-stayed/suspension bridge spanning the East River between Manhattan and Brooklyn.",
  },
  {
    name: "The French Laundry",
    category: "food",
    description:
      "A world-renowned three-Michelin-star restaurant located in Yountville, California.",
  },
  {
    name: "IKEA Billy Bookcase",
    category: "home",
    description:
      "A ubiquitous, modular, and affordable shelving unit known for its versatility and simple assembly.",
  },
  {
    name: '"The Three-Body Problem"',
    category: "books",
    description:
      "The first novel in the Hugo Award-winning Chinese science fiction book series by Cixin Liu.",
  },
  {
    name: "Robinhood Investment App",
    category: "finance",
    description:
      "A financial trading app known for commission-free trading, often reviewed for its user experience and volatility.",
  },
  {
    name: "Peloton Bike+",
    category: "health",
    description:
      "A premium indoor cycling machine with a rotating screen used for interactive fitness classes.",
  },
  {
    name: "Wacom Cintiq Pro 24",
    category: "art",
    description:
      "A professional pen display for artists and designers, reviewed for color accuracy and pen sensitivity.",
  },
  {
    name: "MasterClass Subscription",
    category: "education",
    description:
      "An online platform offering video courses taught by celebrity experts across various fields.",
  },
  {
    name: "Hinge Dating App",
    category: "dating",
    description:
      "A popular mobile dating app that focuses on matching users with friends-of-friends.",
  },
  {
    name: "Tiffany Solitaire Diamond Ring",
    category: "jewelry",
    description:
      "The classic, six-prong setting engagement ring offered by the luxury jeweler.",
  },
  {
    name: "Adobe Photoshop CC",
    category: "software",
    description:
      "The industry-standard raster graphics editor used globally for photo manipulation and digital art.",
  },
  {
    name: "Dyson Supersonic Hair Dryer",
    category: "beauty",
    description:
      "A high-velocity hair dryer known for its fast drying time and intelligent heat control.",
  },
  {
    name: "Lego Millennium Falcon (UCS)",
    category: "toys",
    description:
      "The massive, highly-detailed Ultimate Collector Series model kit of the Star Wars spaceship.",
  },
  {
    name: "Caterpillar D11 Bulldozer",
    category: "industrial",
    description:
      "One of the world's largest and most powerful track-type tractors used in large-scale mining operations.",
  },
  {
    name: "Starlink Internet Service",
    category: "startup",
    description:
      "SpaceX's satellite internet constellation, reviewed for high speed but often spotty latency in early stages.",
  },
  {
    name: "CERN Large Hadron Collider",
    category: "science",
    description:
      "The world's largest and most powerful particle collider, reviewed for its scientific output and complexity.",
  },
  {
    name: "Zillow Home Listing Service",
    category: "real_estate",
    description:
      "The real estate technology company and app, reviewed for valuation accuracy and listing quality.",
  },
  {
    name: "Nike Air Force 1 Sneakers",
    category: "fashion",
    description:
      "An iconic, long-standing leather athletic shoe model reviewed for comfort and style.",
  },
  {
    name: "Bowflex SelectTech 552 Dumbbells",
    category: "sports",
    description:
      "Adjustable dumbbells that replace multiple weight sets, reviewed for convenience and durability.",
  },
  {
    name: "Spotify Premium Subscription",
    category: "music",
    description:
      "The paid tier of the music streaming service, reviewed for catalog size, audio quality, and offline access.",
  },
  {
    name: "Royal Canin Veterinary Diet",
    category: "pets",
    description:
      "A prescription-only line of specialized pet food formulated for various canine health conditions.",
  },
  {
    name: "LegalZoom Business Formation",
    category: "legal",
    description:
      "An online service providing legal solutions for starting a business, reviewed for ease of use and cost.",
  },
  {
    name: "NordVPN Service",
    category: "security",
    description:
      "A popular virtual private network (VPN) provider, reviewed for speed, logging policy, and security features.",
  },
  {
    name: "U.S. Postal Service (USPS)",
    category: "gov",
    description:
      "A review of the national postal service regarding package delivery speed and customer service.",
  },
  {
    name: "Fluke 87V Digital Multimeter",
    category: "measurement",
    description:
      "A professional-grade handheld tool used for measuring electrical properties.",
  },
  {
    name: "GoPro HERO14 Black",
    category: "other",
    description:
      "The latest flagship rugged action camera model, reviewed for video stabilization and durability.",
  },
];

async function add_data_to_db() {
  for (const itm of nu_items) {
    try {
      const response = await fetch("http://localhost:3000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itm),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Success:", result);
      } else {
        const errorMessage =
          result.message || "An unknown error occurred during submission.";
        console.error("Error:", errorMessage);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
}

add_data_to_db();
