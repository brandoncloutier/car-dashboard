const displayComponentsMenuLibrary = {
  small: {
    name: "Small Block",
    width: { type: "value", value: 1 },
    height: { type: "value", value: 1 },
  },
  medium: {
    name: "Medium Block",
    width: { type: "value", value: 4 },
    height: { type: "value", value: 4 },
  },
  large: {
    name: "Large Block",
    width: { type: "value", value: 6 },
    height: { type: "value", value: 6 },
  },
  halfTall: {
    name: "Half Tall Panel",
    width: { type: "ratio", value: 0.5 },
    height: { type: "ratio", value: 1 },
  },
  row: {
    name: "Row Strip",
    width: { type: "ratio", value: 1 },
    height: { type: "value", value: 2 },
  },
  full: {
    name: "Full Screen",
    width: { type: "ratio", value: 1 },
    height: { type: "ratio", value: 1 },
  },
  tile: {
    name: "Tile (2x2)",
    width: { type: "value", value: 2 },
    height: { type: "value", value: 2 },
  },
  card: {
    name: "Card (3x2)",
    width: { type: "value", value: 3 },
    height: { type: "value", value: 2 },
  },
  wideCard: {
    name: "Wide Card (6x2)",
    width: { type: "value", value: 6 },
    height: { type: "value", value: 2 },
  },
  tallPanel: {
    name: "Tall Panel (2x6)",
    width: { type: "value", value: 2 },
    height: { type: "value", value: 6 },
  },
  utilityBar: {
    name: "Utility Bar",
    width: { type: "ratio", value: 1 },
    height: { type: "value", value: 1 },
  },
  quarterPanel: {
    name: "Quarter Panel",
    width: { type: "ratio", value: 0.5 },
    height: { type: "ratio", value: 0.5 },
  },
  halfWidePanel: {
    name: "Half Wide Panel",
    width: { type: "ratio", value: 1 },
    height: { type: "ratio", value: 0.5 },
  }
}

export default displayComponentsMenuLibrary;
