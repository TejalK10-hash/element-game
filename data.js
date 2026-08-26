// ============================================================
// LEVEL + ELEMENT DATA
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
        fact: "Aluminum-lithium alloy is stupid light but still strong. Every pound shaved off the tanks and frame is a pound more payload you can launch. That is why it is the go-to for rocket structures like the Space Shuttle's external tank.",
        surpriseFact: "Lithium is so light it floats on water. Mix it with aluminum and you get a metal that barely feels like metal."

      },
      {
        id: "r_niobium",
        symbol: "Nb",
        name: "Niobium / Inconel",
        hotspot: "r_nozzle",
        use: "Engine Nozzle & Combustion Chamber",
        color: "#fca5a5",
        fact: "Niobium and Inconel do not care about 3,000°C. They sit right where fuel and oxidizer burn and funnel that fire out the nozzle without melting. That is the job.",
        surpriseFact: "Niobium used to be called 'columbium.' Chemists argued over the name for over 100 years before settling it in 1949."
      },
      {
        id: "r_copper",
        symbol: "Cu",
        name: "Copper",
        hotspot: "r_cooling",
        use: "Cooling Channels",
        color: "#fb923c",
        fact: "Copper conducts heat better than any structural metal. Engineers wrap it in channels around the combustion chamber so it sucks heat away fast enough to stop the walls from burning through mid-flight.",
        surpriseFact: "The Statue of Liberty is copper too. The green is just a century of slow oxidation."
      },
      {
        id: "r_carbon",
        symbol: "C-C",
        name: "Carbon-Carbon Composite",
        hotspot: "r_heatshield",
        use: "Heat Shield / Nose Cone",
        color: "#cbd5e1",
        fact: "Carbon-carbon composite is ablative — it burns away layer by layer to protect what is underneath. The nose cone takes the worst aerodynamic heating as the rocket punches through the atmosphere, so it needs a material willing to sacrifice itself.",
        surpriseFact: "Diamonds, pencil graphite, and this heat shield are all the same element — carbon. Just arranged differently."
      },
      {
        id: "r_propellant",
        symbol: "LH2/LOX",
        name: "Liquid Hydrogen & Liquid Oxygen",
        hotspot: "r_propellant",
        use: "Propellant",
        color: "#facc15",
        fact: "Hydrogen and oxygen make the highest-energy chemical propellant combo we have. Hydrogen is the lightest element, so it gives the best thrust-to-weight ratio. That is why it powered the Space Shuttle Main Engines.",
        surpriseFact: "Liquid hydrogen sits at about 20 degrees above absolute zero — colder than anywhere natural in our entire solar system."
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
        fact: "RCC is the only part of the Shuttle's thermal protection that also acts as structure. It shields the nose cap and wing leading edges — the hottest spots — where reentry hits 1,260°C (2,300°F).",
        surpriseFact: "RCC is basically engineered graphite — the same stuff in your pencil, just built to survive reentry instead of homework."
      },
      {
        id: "s_silica",
        symbol: "SiO2",
        name: "Silica Fiber Tiles (HRSI)",
        hotspot: "s_belly",
        use: "Underside Heat Shield Tiles",
        color: "#fca5a5",
        fact: "The Shuttle's black underside was covered in thousands of silica tiles. They are 90% empty space, which makes them incredibly light while still shrugging off reentry heat below 1,260°C.",
        surpriseFact: "Shuttle tiles insulate so well that astronauts could hold one bare-handed seconds after the other side was glowing red-hot."
      },
      {
        id: "s_aluminum",
        symbol: "Al",
        name: "Aluminum Alloy",
        hotspot: "s_fuselage",
        use: "Fuselage & Primary Structure",
        color: "#7dd3fc",
        fact: "A lightweight aluminum airframe forms the orbiter's skeleton. The entire reusable tile system exists specifically to bond onto and protect this aluminum skin from heat it could never survive alone.",
        surpriseFact: "Aluminum used to be worth more than gold. Napoleon III reportedly kept aluminum cutlery for his most honored guests."
      },
      {
        id: "s_inconel",
        symbol: "Ni-Cr",
        name: "Inconel Superalloy",
        hotspot: "s_fittings",
        use: "Hot Structural Fittings",
        color: "#fb923c",
        fact: "Inconel fittings bolt the RCC wing panels to the aluminum wing spars. Inconel-covered insulation also shields those metal attachments from heat radiating off the inside of the RCC. Quiet, critical work you never see.",
        surpriseFact: "Inconel is so tough it dulls machining tools faster than almost any other aerospace metal."
      },
      {
        id: "s_nomex",
        symbol: "Nomex",
        name: "Nomex Felt Insulation",
        hotspot: "s_upperwing",
        use: "Upper Surface Insulation (FRSI)",
        color: "#c084fc",
        fact: "Flexible felt blankets cover the cooler upper wing surfaces and payload bay doors, protecting them up to about 371°C. Way lighter and cheaper than tiles for the parts that never get dangerously hot.",
        surpriseFact: "Nomex is the same material in firefighter suits. The Shuttle and firefighters both trust it to survive extreme heat."
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
        "fact": "Hafnium carbide melts around 3,900°C — one of the highest melting points of any known compound. That is 700°C hotter than the surface of Mercury. It is basically the only thing that can survive on the razor-thin leading edges slicing through hypersonic air.",
        "surpriseFact": "Hafnium is named after Hafnia, the old Latin name for Copenhagen, where it was discovered in 1923."
      },
      {
        "id": "hyp_titanium_aluminide",
        "symbol": "TiAl",
        "name": "Titanium Aluminide",
        "hotspot": "hyp_airframe",
        "use": "Airframe Skin",
        "color": "#C0D6E4",
        "fact": "Titanium aluminide is about half the density of normal titanium alloys but keeps its strength at temperatures that turn standard aerospace metals to mush. It is what keeps hypersonic vehicles light enough to fly and tough enough to survive.",
        "surpriseFact": "Titanium is so corrosion-resistant it is also used in body piercings and hip replacements. The same metal in hypersonic jets lives in some human joints."
      },
      {
        "id": "hyp_silicon_carbide",
        "symbol": "SiC",
        "name": "Silicon Carbide",
        "hotspot": "hyp_thermal",
        "use": "Thermal Protection Tiles",
        "color": "#36454F",
        "fact": "Silicon carbide handles re-entry-level heat that would vaporize most metals. It acts as featherweight outer armor, insulating the vehicle's core structure and turning lethal thermal energy into something survivable.",
        "surpriseFact": "Silicon carbide occurs naturally in meteorites and was once mistaken for diamonds when found in an Arizona crater."
      },
      {
        "id": "hyp_rhenium_niobium",
        "symbol": "Re+Nb",
        "name": "Rhenium-Coated Niobium",
        "hotspot": "hyp_combustor",
        "use": "Scramjet Combustor Walls",
        "color": "#9B59B6",
        "fact": "Rhenium is rarer than gold. Coated over niobium, it raises the effective melting point so dramatically that the scramjet combustor survives continuous supersonic combustion. It is holding back an inferno that would burn through nearly anything else in seconds.",
        "surpriseFact": "Rhenium was one of the last stable elements ever discovered, isolated in 1925, and it is still one of the rarest metals on Earth."
      },
      {
        "id": "hyp_rhenium_nickel",
        "symbol": "Re+Ni",
        "name": "Rhenium-Nickel Superalloy",
        "hotspot": "hyp_turbine",
        "use": "Engine Turbine Blades",
        "color": "#BDC3C7",
        "fact": "Above 1,100°C, ordinary steel softens like warm clay. Rhenium-nickel superalloys resist 'creep' — the slow deformation under heat and stress — so turbine blades can spin at hypersonic engine speeds without warping into useless metal spaghetti.",
        "surpriseFact": "The 'gamma-prime' phase that makes nickel superalloys so strong was discovered somewhat by accident during 1940s jet engine research."
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
        fact: "Plutonium-238's radioactive decay generates steady heat for decades. Once a probe is too far from the Sun for solar panels, this is the only practical power source.",
        surpriseFact: "Early RTG plutonium pellets gave off a faint warmth — engineers described handling them like holding a warm potato."
      },
      {
        id: "pb_xenon",
        symbol: "Xe",
        name: "Xenon",
        hotspot: "pb_ion",
        use: "Ion Propulsion",
        color: "#7dd3fc",
        fact: "Xenon gets ionized and electrically accelerated for incredibly fuel-efficient thrust. A probe can sustain gentle acceleration over years-long journeys through deep space.",
        surpriseFact: "Xenon is so rare in our atmosphere you would need to filter about 11 million liters of air to collect just 1 liter of it."
      },
      {
        id: "pb_tantalum",
        symbol: "Ta",
        name: "Tantalum",
        hotspot: "pb_electronics",
        use: "Onboard Electronics (Capacitors)",
        color: "#c084fc",
        fact: "Tantalum capacitors are extremely reliable under the radiation and temperature extremes of deep space. Out there, one component failure can mean total mission loss.",
        surpriseFact: "Tantalum is named after the Greek myth of Tantalus, chosen because the metal 'tantalizingly' resists almost every acid."
      },
      {
        id: "pb_beryllium",
        symbol: "Be",
        name: "Beryllium",
        hotspot: "pb_structural",
        use: "Structural Components & Mirrors",
        color: "#e2e8f0",
        fact: "Beryllium is one of the lightest structural metals that is still stiff enough to hold precise optical alignment. That is critical for the cameras and instruments a probe relies on.",
        surpriseFact: "Beryllium is one of the few metals transparent to X-rays, which is why it also shows up in windows for X-ray machines."
      },
      {
        id: "pb_gold",
        symbol: "Au",
        name: "Gold",
        hotspot: "pb_plating",
        use: "Corrosion-Resistant Plating",
        color: "#fbbf24",
        fact: "Gold does not oxidize or degrade over the decades-long mission lifespans that deep space probes are built for. That is why it shows up as plating on connectors and critical surfaces.",
        surpriseFact: "Nearly all the gold on Earth came from ancient neutron star collisions. The gold plating on a spacecraft predates our solar system."
      }
    ]
  }
];
