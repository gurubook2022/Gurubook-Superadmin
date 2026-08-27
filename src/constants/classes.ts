const dlClasses = [
    "A",
    "A1",
    "A2",
    "AM",
    "B",
    "C",
    "C1",
    "CE",
    "D",
    "D1",
    "L",
    "MOFA",
    "T",
]

const bkfClasses = [
    "LKW",
    "BUS"
]

// BKF classes have no dedicated icon assets of their own — Gurubook-User's
// payment flow reuses the DL C/D icons for them, so mirror that here.
const bkfClassIcons: Record<string, string> = {
    LKW: "C",
    BUS: "D",
}

// MOFA is never an already-acquired licence, so it's excluded from the
// "already owned" class picker.
const acquiredClasses = dlClasses.filter((item) => item !== "MOFA")

export { dlClasses, bkfClasses, bkfClassIcons, acquiredClasses }