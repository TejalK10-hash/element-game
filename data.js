// ============================================================
// LEVEL + ELEMENT DATA
// Five levels, each modeling a different spacecraft. Every
// element pairs with a `hotspot` id that must match a
// data-target on a .hotspot group inside that level's craft
// group in index.html.
//
// Every level now uses a full-bleed background photo (same
// treatment as the rocket). Drop a photo with the matching
// filename into this project folder and it swaps in
// automatically; until then a dashed placeholder frame shows
// where to put it.
// ============================================================

const LEVELS = [
  {
    id: "rocket",
    label: "Rocket",
    icon: "🚀",
    craftName: "Launch Vehicle",
    photo: "rocket.png",
    elements: [
      {
        id: "r_alli",
        symbol: "Al-Li",
        name: "Aluminum-Lithium Alloy",
        hotspot: "r_airframe",
        use: "Fuel Tanks & Airframe",
        color: "#7dd3fc",
        fact: "Aluminum-lithium alloy is extremely light yet strong. Shaving mass off the tanks and airframe directly increases how much payload a rocket can carry, which is why it's a workhorse material for launch vehicle structures like the Space Shuttle's external tank.",
        surpriseFact: "Lithium is so light it actually floats on water — alloy it with aluminum and you get a metal that's almost embarrassed to be called heavy."

      },
      {
        id: "r_niobium",
        symbol: "Nb",
        name: "Niobium / Inconel",
        hotspot: "r_nozzle",
        use: "Engine Nozzle & Combustion Chamber",
        color: "#fca5a5",
        fact: "Niobium and nickel-chromium superalloys like Inconel survive combustion temperatures over 3,000°C without melting or losing strength, which is exactly what's needed where fuel and oxidizer burn and get funneled out through the nozzle.",
        surpriseFact: "Niobium used to be called 'columbium,' and chemists argued over its name for over 100 years before it was settled in 1949."
      },
      {
        id: "r_copper",
        symbol: "Cu",
        name: "Copper",
        hotspot: "r_cooling",
        use: "Cooling Channels",
        color: "#fb923c",
        fact: "Copper has the best thermal conductivity of any structural metal, so engineers route it into channels wrapped around the combustion chamber. It wicks heat away from the walls fast enough to prevent burn-through during engine firing.",
        surpriseFact: "The Statue of Liberty is copper too — its green color is just over a century of copper slowly oxidizing in the air."
      },
      {
        id: "r_carbon",
        symbol: "C-C",
        name: "Carbon-Carbon Composite",
        hotspot: "r_heatshield",
        use: "Heat Shield / Nose Cone",
        color: "#cbd5e1",
        fact: "Carbon-carbon composite is ablative, meaning it sacrifices itself layer by layer to protect what's underneath. That makes it ideal for the nose cone, which takes the brunt of aerodynamic heating as a rocket punches through the atmosphere.",
        surpriseFact: "Diamonds, pencil graphite, and this heat shield are all made of the same element — carbon, just arranged completely differently."
      },
      {
        id: "r_propellant",
        symbol: "LH2/LOX",
        name: "Liquid Hydrogen & Liquid Oxygen",
        hotspot: "r_propellant",
        use: "Propellant",
        color: "#facc15",
        fact: "Liquid hydrogen and liquid oxygen form the highest-energy chemical propellant combination available. Hydrogen's low atomic mass gives it the best thrust-to-weight ratio of any fuel, which is why it powered engines like the Space Shuttle Main Engines.",
        surpriseFact: "Liquid hydrogen is only about 20 degrees above absolute zero — colder than anywhere that naturally occurs anywhere in our solar system."
      }
    ]
  },
  {
    id: "shuttle",
    label: "Space Shuttle",
    icon: "🛰️",
    craftName: "Orbiter",
    photo: "shuttle.png",
    elements: [
      {
        id: "s_rcc",
        symbol: "RCC",
        name: "Reinforced Carbon-Carbon",
        hotspot: "s_nosecap",
        use: "Nose Cap & Wing Leading Edges",
        color: "#e2e8f0",
        fact: "Reinforced carbon-carbon was the only part of the Shuttle's thermal protection that also served as structure. It shielded the nose cap and wing leading edges, the hottest spots on the vehicle, where reentry temperatures topped 1,260°C (2,300°F).",
        surpriseFact: "Reinforced carbon-carbon is chemically close to graphite — the stuff in your pencil, just engineered to survive reentry instead of writing homework."
      },
      {
        id: "s_silica",
        symbol: "SiO2",
        name: "Silica Fiber Tiles (HRSI)",
        hotspot: "s_belly",
        use: "Underside Heat Shield Tiles",
        color: "#fca5a5",
        fact: "The orbiter's black underside was covered in thousands of high-purity silica tiles. They were 90% empty space by volume, making them remarkably lightweight while still shrugging off reentry heat below 1,260°C.",
        surpriseFact: "Shuttle tiles insulated so well that astronauts could hold one bare-handed seconds after the opposite face was glowing red-hot."
      },
      {
        id: "s_aluminum",
        symbol: "Al",
        name: "Aluminum Alloy",
        hotspot: "s_fuselage",
        use: "Fuselage & Primary Structure",
        color: "#7dd3fc",
        fact: "A lightweight aluminum airframe formed the orbiter's primary structure. The entire reusable tile system was engineered specifically to bond onto and protect this aluminum skin from the heat it couldn't survive on its own.",
        surpriseFact: "Aluminum used to be worth more than gold — Napoleon III reportedly kept aluminum cutlery for his most honored dinner guests."
      },
      {
        id: "s_inconel",
        symbol: "Ni-Cr",
        name: "Inconel Superalloy",
        hotspot: "s_fittings",
        use: "Hot Structural Fittings",
        color: "#fb923c",
        fact: "Inconel fittings bolted the RCC wing panels to the aluminum wing spars, and Inconel-covered insulation shielded those metal attachments from the heat radiating off the inside surface of the RCC — a superalloy doing quiet, critical work out of sight.",
        surpriseFact: "Inconel is so tough it dulls machining tools faster than almost any other metal used in aerospace manufacturing."
      },
      {
        id: "s_nomex",
        symbol: "Nomex",
        name: "Nomex Felt Insulation",
        hotspot: "s_upperwing",
        use: "Upper Surface Insulation (FRSI)",
        color: "#c084fc",
        fact: "Flexible felt insulation blankets covered the cooler upper wing surfaces and payload bay doors, protecting them up to about 371°C. It was far lighter and cheaper than tiles for the parts of the orbiter that never got dangerously hot.",
        surpriseFact: "Nomex is the same material in firefighter suits — the Shuttle and firefighters both trust it to survive extreme heat."
      }
    ]
  },
  {
    id: "jet",
    label: "Fighter Jet",
    icon: "✈️",
    craftName: "Fighter Jet",
    photo: "jet.png",
    elements: [
      {
        "id": "hyp_hafnium_carbide",
        "symbol": "HfC",
        "name": "Hafnium Carbide",
        "hotspot": "hyp_leading_edge",
        "use": "Leading Edges",
        "color": "#B87333",
        "fact": "Hafnium carbide endures temperatures of approximately 3,900°C — one of the highest melting points of any known compound, surpassing the surface temperature of Mercury by nearly 700°C. This makes it the ultimate thermal shield for the razor-thin leading edges that slice through hypersonic air friction where no other material could survive.",
        surpriseFact: "Hafnium is named after Hafnia, the old Latin name for Copenhagen, where it was discovered in 1923."
      },
      {
        "id": "hyp_titanium_aluminide",
        "symbol": "TiAl",
        "name": "Titanium Aluminide",
        "hotspot": "hyp_airframe",
        "use": "Airframe Skin",
        "color": "#C0D6E4",
        "fact": "At roughly half the density of conventional titanium alloys while stubbornly retaining its strength at temperatures that would reduce standard aerospace metals to structural jelly, titanium aluminide is the miracle material that keeps hypersonic vehicles light enough to fly yet tough enough to survive atmospheric fire.",
        surpriseFact: "Titanium is so corrosion-resistant it's also used in body piercings and hip replacements — the same metal in hypersonic jets lives in some human joints."
      },
      {
        "id": "hyp_silicon_carbide",
        "symbol": "SiC",
        "name": "Silicon Carbide",
        "hotspot": "hyp_thermal",
        "use": "Thermal Protection Tiles",
        "color": "#36454F",
        "fact": "This ceramic warrior withstands re-entry-level heat so extreme it would turn most metals into vapor, acting as a featherweight outer armor that insulates the vehicle's core structure. Silicon carbide transforms lethal thermal energy into a mere warmth, making the impossible journey from orbit to ground survivable.",
        surpriseFact: "Silicon carbide occurs naturally in meteorites and was once mistaken for diamonds when found in an Arizona crater."
      },
      {
        "id": "hyp_rhenium_niobium",
        "symbol": "Re+Nb",
        "name": "Rhenium-Coated Niobium",
        "hotspot": "hyp_combustor",
        "use": "Scramjet Combustor Walls",
        "color": "#9B59B6",
        "fact": "Rhenium — rarer than gold in Earth's crust — forms a protective skin over niobium that raises the effective melting point so dramatically the scramjet combustor survives continuous supersonic combustion. It is essentially holding back an eternal inferno that would burn through nearly any other material in mere seconds.",
        surpriseFact: "Rhenium was one of the last stable elements ever discovered, isolated in 1925, and it's still one of the rarest metals on Earth."
      },
      {
        "id": "hyp_rhenium_nickel",
        "symbol": "Re+Ni",
        "name": "Rhenium-Nickel Superalloy",
        "hotspot": "hyp_turbine",
        "use": "Engine Turbine Blades",
        "color": "#BDC3C7",
        "fact": "At temperatures exceeding 1,100°C where ordinary steel softens like warm clay within seconds, rhenium-nickel superalloys laugh at thermodynamic doom by resisting 'creep' — the slow, fatal deformation under heat and stress — enabling turbine blades to spin at hypersonic engine speeds without warping into useless metal spaghetti.",
        surpriseFact: "The 'gamma-prime' phase that makes nickel superalloys so strong was discovered somewhat by accident during 1940s jet engine research."
      }
    ]
  },
  {
    id: "probe",
    label: "Space Probe",
    icon: "🔭",
    craftName: "Deep Space Probe",
    photo: "probe.png",
    elements: [
      {
        id: "pb_plutonium",
        symbol: "Pu-238",
        name: "Plutonium-238",
        hotspot: "pb_rtg",
        use: "Power Source (RTG)",
        color: "#fb923c",
        fact: "Plutonium-238's radioactive decay generates steady heat for decades. It's the only practical power source once a probe travels too far from the Sun for solar panels to work.",
        surpriseFact: "Early RTG plutonium pellets gave off a faint warmth — engineers described handling them as like holding a warm potato."
      },
      {
        id: "pb_xenon",
        symbol: "Xe",
        name: "Xenon",
        hotspot: "pb_ion",
        use: "Ion Propulsion",
        color: "#7dd3fc",
        fact: "Xenon is ionized and electrically accelerated for incredibly fuel-efficient thrust, letting a probe sustain gentle acceleration over years-long journeys through deep space.",
        surpriseFact: "Xenon is so rare in our atmosphere you'd need to filter about 11 million liters of air to collect just 1 liter of it."
      },
      {
        id: "pb_tantalum",
        symbol: "Ta",
        name: "Tantalum",
        hotspot: "pb_electronics",
        use: "Onboard Electronics (Capacitors)",
        color: "#c084fc",
        fact: "Tantalum capacitors are extremely reliable and stable under the radiation and temperature extremes of deep space, where a single component failure means total mission loss.",
        surpriseFact: "Tantalum is named after the Greek myth of Tantalus, chosen because the metal 'tantalizingly' resists almost every acid thrown at it."
      },
      {
        id: "pb_beryllium",
        symbol: "Be",
        name: "Beryllium",
        hotspot: "pb_structural",
        use: "Structural Components & Mirrors",
        color: "#e2e8f0",
        fact: "Beryllium is one of the lightest structural metals that's still stiff enough to hold precise optical alignment, which is critical for the cameras and instruments a probe relies on.",
        surpriseFact: "Beryllium is one of the few metals transparent to X-rays, which is why it also shows up in windows for X-ray machines."
      },
      {
        id: "pb_gold",
        symbol: "Au",
        name: "Gold",
        hotspot: "pb_plating",
        use: "Corrosion-Resistant Plating",
        color: "#fbbf24",
        fact: "Gold doesn't oxidize or degrade over the decades-long mission lifespans that deep space probes are built for, which is why it shows up as plating on connectors and critical surfaces.",
        surpriseFact: "Nearly all the gold on Earth came from ancient neutron star collisions — the gold plating on a spacecraft predates our solar system."
      }
    ]
  }
];
