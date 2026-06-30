// ============================================================
// ELEMENT DATA
// Each entry pairs an element with the spacecraft hotspot that
// represents its real use in space technology.
//
// `hotspot` must match a data-target value on a .hotspot group
// in index.html's SVG scene.
// ============================================================

const ELEMENTS = [
  {
    id: "xenon",
    symbol: "Xe",
    name: "Xenon",
    hotspot: "thruster",
    use: "Ion Thrusters",
    color: "#7dd3fc",
    fact: "Xenon gas is ionized and accelerated by an electric field to produce thrust. It's far more fuel-efficient than chemical rockets, which is why missions like NASA's Dawn spacecraft used xenon ion engines for years-long journeys through the solar system."
  },
  {
    id: "titanium",
    symbol: "Ti",
    name: "Titanium",
    hotspot: "hull",
    use: "Rocket Airframes & Hulls",
    color: "#cbd5e1",
    fact: "Titanium has an excellent strength-to-weight ratio and resists corrosion and extreme temperatures, making it a go-to material for rocket airframes, spacecraft hulls, and structural components that have to survive launch stress and the harshness of space."
  },
  {
    id: "silicon",
    symbol: "Si",
    name: "Silicon",
    hotspot: "solarpanel",
    use: "Solar Panels",
    color: "#facc15",
    fact: "Silicon is the semiconductor at the heart of most photovoltaic cells. The ISS's solar arrays, built from silicon photovoltaic cells, span an area larger than a football field and convert sunlight directly into electrical power for the station."
  },
  {
    id: "neodymium",
    symbol: "Nd",
    name: "Neodymium",
    hotspot: "magnets",
    use: "Attitude Control Magnets",
    color: "#c084fc",
    fact: "Neodymium-iron-boron (NdFeB) magnets are the strongest permanent magnets available. Satellites use them inside reaction wheels and magnetorquers -- devices that let a spacecraft rotate and orient itself precisely without firing thrusters."
  }
];