import { Molecule, QuizQuestion } from '../types';

export const MOLECULES: Molecule[] = [
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H2O',
    category: 'Universal Solvent',
    mass: '18.015 g/mol',
    hazard: 'Non-hazardous',
    funFact: 'Water is the only natural substance that exists in three physical states (liquid, solid, gas) at standard Earth temperatures.',
    description: 'A polar inorganic compound that is the main constituent of Earth\'s hydrosphere and the fluids of all known living organisms. The oxygen atom forms two single covalent bonds with hydrogen atoms at an angle of approximately 104.5 degrees, creating a net dipole moment.',
    atoms: [
      { id: 0, element: 'O', x: 0.0, y: 0.116, z: 0.0 },
      { id: 1, element: 'H', x: -0.758, y: -0.463, z: 0.0 },
      { id: 2, element: 'H', x: 0.758, y: -0.463, z: 0.0 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 0, to: 2, type: 'single' }
    ]
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO2',
    category: 'Atmospheric Gas',
    mass: '44.01 g/mol',
    hazard: 'Asphyxiant in high concentrations',
    funFact: 'Dry ice is solid carbon dioxide, which sublimates directly from a solid state to a gas state at -78.5°C.',
    description: 'A linear triatomic molecule consisting of a carbon atom doubly bonded to two oxygen atoms. It is a vital greenhouse gas in Earth\'s atmosphere and is produced by respiration, fermentation, and combustion of fossil fuels.',
    atoms: [
      { id: 0, element: 'C', x: 0.0, y: 0.0, z: 0.0 },
      { id: 1, element: 'O', x: -1.163, y: 0.0, z: 0.0 },
      { id: 2, element: 'O', x: 1.163, y: 0.0, z: 0.0 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' }
    ]
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'C2H5OH',
    category: 'Alcohols',
    mass: '46.07 g/mol',
    hazard: 'Flammable, Psychoactive',
    funFact: 'Ethanol is used both as a biofuel (often mixed with gasoline) and as the primary alcohol in beverages.',
    description: 'A clear, colorless liquid that is the principal ingredient in alcoholic drinks. It consists of a methyl group (CH3) connected to a methylene group (CH2) connected to a hydroxyl group (OH).',
    atoms: [
      { id: 0, element: 'C', x: -0.662, y: -0.274, z: 0.0 }, // Methyl Carbon
      { id: 1, element: 'C', x: 0.718, y: 0.372, z: 0.0 },  // Methylene Carbon
      { id: 2, element: 'O', x: 1.704, y: -0.638, z: 0.0 }, // Hydroxyl Oxygen
      { id: 3, element: 'H', x: 2.556, y: -0.210, z: 0.0 }, // Hydroxyl Hydrogen
      { id: 4, element: 'H', x: -0.749, y: -0.913, z: 0.88 }, // Methyl H1
      { id: 5, element: 'H', x: -0.749, y: -0.913, z: -0.88 },// Methyl H2
      { id: 6, element: 'H', x: -1.458, y: 0.468, z: 0.0 },   // Methyl H3
      { id: 7, element: 'H', x: 0.840, y: 1.012, z: 0.88 },  // Methylene H1
      { id: 8, element: 'H', x: 0.840, y: 1.012, z: -0.88 }  // Methylene H2
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 1, to: 2, type: 'single' },
      { from: 2, to: 3, type: 'single' },
      { from: 0, to: 4, type: 'single' },
      { from: 0, to: 5, type: 'single' },
      { from: 0, to: 6, type: 'single' },
      { from: 1, to: 7, type: 'single' },
      { from: 1, to: 8, type: 'single' }
    ]
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    formula: 'C8H10N4O2',
    category: 'Stimulants',
    mass: '194.19 g/mol',
    hazard: 'Moderately toxic in pure form',
    funFact: 'Caffeine acts as a natural pesticide in plants, paralyzing and killing insects that try to feed on them.',
    description: 'A central nervous system stimulant of the methylxanthine class. It is the world\'s most widely consumed psychoactive substance. Structurally, it consists of a fused pyrimidinedione and imidazole ring system, with three methyl groups.',
    atoms: [
      // Imidazole Ring
      { id: 0, element: 'C', x: -0.622, y: -1.069, z: 0.0 }, // C8
      { id: 1, element: 'N', x: 0.702, y: -1.218, z: 0.0 },  // N9
      { id: 2, element: 'C', x: 1.258, y: 0.024, z: 0.0 },   // C4
      { id: 3, element: 'C', x: 0.231, y: 0.985, z: 0.0 },   // C5
      { id: 4, element: 'N', x: -0.963, y: -0.278, z: 0.0 },  // N7
      // Pyrimidine Ring
      { id: 5, element: 'C', x: 2.618, y: 0.354, z: 0.0 },   // C5-side C6
      { id: 6, element: 'N', x: 2.946, y: 1.684, z: 0.0 },   // N1
      { id: 7, element: 'C', x: 2.000, y: 2.684, z: 0.0 },   // C2
      { id: 8, element: 'N', x: 0.692, y: 2.327, z: 0.0 },   // N3
      // Carbonyl Oxygens
      { id: 9, element: 'O', x: 3.518, y: -0.490, z: 0.0 },  // O6 (carbonyl)
      { id: 10, element: 'O', x: 2.308, y: 3.864, z: 0.0 },  // O2 (carbonyl)
      // Methyl Groups
      { id: 11, element: 'C', x: 4.346, y: 2.084, z: 0.0 },  // Methyl on N1
      { id: 12, element: 'C', x: -0.308, y: 3.384, z: 0.0 }, // Methyl on N3
      { id: 13, element: 'C', x: -2.346, y: 0.084, z: 0.0 }, // Methyl on N7
      // Imidazole Hydrogen (C8-H)
      { id: 14, element: 'H', x: -1.332, y: -1.884, z: 0.0 }, // H8
      // Hydrogens on N1 Methyl (11)
      { id: 15, element: 'H', x: 4.886, y: 1.704, z: 0.88 },
      { id: 16, element: 'H', x: 4.886, y: 1.704, z: -0.88 },
      { id: 17, element: 'H', x: 4.356, y: 3.174, z: 0.0 },
      // Hydrogens on N3 Methyl (12)
      { id: 18, element: 'H', x: -1.282, y: 2.984, z: 0.0 },
      { id: 19, element: 'H', x: -0.192, y: 4.004, z: 0.88 },
      { id: 20, element: 'H', x: -0.192, y: 4.004, z: -0.88 },
      // Hydrogens on N7 Methyl (13)
      { id: 21, element: 'H', x: -2.856, y: -0.354, z: 0.88 },
      { id: 22, element: 'H', x: -2.856, y: -0.354, z: -0.88 },
      { id: 23, element: 'H', x: -2.396, y: 1.174, z: 0.0 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 1, to: 2, type: 'single' },
      { from: 2, to: 3, type: 'double' },
      { from: 3, to: 4, type: 'single' },
      { from: 4, to: 0, type: 'single' },
      { from: 2, to: 5, type: 'single' },
      { from: 5, to: 6, type: 'single' },
      { from: 6, to: 7, type: 'single' },
      { from: 7, to: 8, type: 'single' },
      { from: 8, to: 3, type: 'single' },
      { from: 5, to: 9, type: 'double' },
      { from: 7, to: 10, type: 'double' },
      { from: 6, to: 11, type: 'single' },
      { from: 8, to: 12, type: 'single' },
      { from: 4, to: 13, type: 'single' },
      { from: 0, to: 14, type: 'single' },
      { from: 11, to: 15, type: 'single' },
      { from: 11, to: 16, type: 'single' },
      { from: 11, to: 17, type: 'single' },
      { from: 12, to: 18, type: 'single' },
      { from: 12, to: 19, type: 'single' },
      { from: 12, to: 20, type: 'single' },
      { from: 13, to: 21, type: 'single' },
      { from: 13, to: 22, type: 'single' },
      { from: 13, to: 23, type: 'single' }
    ]
  },
  {
    id: 'graphene',
    name: 'Graphene Nano-Sheet',
    formula: 'C24',
    category: 'Nanomaterials',
    mass: '288.26 g/mol',
    hazard: 'Potential respiratory irritant in powder form',
    funFact: 'Graphene is about 200 times stronger than steel, conducts electricity better than copper, and is practically transparent.',
    description: 'An allotrope of carbon consisting of a single layer of atoms arranged in a two-dimensional honeycomb lattice. Every carbon atom is sp2 hybridized and bound to three neighbors with high-strength covalent bonds.',
    atoms: [
      // Hexagonal Ring 1 (Center)
      { id: 0, element: 'C', x: 0.0, y: 0.8, z: 0.0 },
      { id: 1, element: 'C', x: 0.7, y: 0.4, z: 0.0 },
      { id: 2, element: 'C', x: 0.7, y: -0.4, z: 0.0 },
      { id: 3, element: 'C', x: 0.0, y: -0.8, z: 0.0 },
      { id: 4, element: 'C', x: -0.7, y: -0.4, z: 0.0 },
      { id: 5, element: 'C', x: -0.7, y: 0.4, z: 0.0 },
      // Ring 2 (Top Right)
      { id: 6, element: 'C', x: 1.4, y: 0.8, z: 0.0 },
      { id: 7, element: 'C', x: 2.1, y: 0.4, z: 0.0 },
      { id: 8, element: 'C', x: 2.1, y: -0.4, z: 0.0 },
      { id: 9, element: 'C', x: 1.4, y: -0.8, z: 0.0 },
      // Ring 3 (Bottom)
      { id: 10, element: 'C', x: 0.7, y: -1.6, z: 0.0 },
      { id: 11, element: 'C', x: 0.0, y: -2.0, z: 0.0 },
      { id: 12, element: 'C', x: -0.7, y: -1.6, z: 0.0 },
      // Ring 4 (Top Left)
      { id: 13, element: 'C', x: -1.4, y: 0.8, z: 0.0 },
      { id: 14, element: 'C', x: -2.1, y: 0.4, z: 0.0 },
      { id: 15, element: 'C', x: -2.1, y: -0.4, z: 0.0 },
      { id: 16, element: 'C', x: -1.4, y: -0.8, z: 0.0 },
      // Ring 5 (Top)
      { id: 17, element: 'C', x: -0.7, y: 1.6, z: 0.0 },
      { id: 18, element: 'C', x: 0.0, y: 2.0, z: 0.0 },
      { id: 19, element: 'C', x: 0.7, y: 1.6, z: 0.0 },
      // Edge binders for nano visual
      { id: 20, element: 'H', x: 2.8, y: 0.8, z: 0.0 },
      { id: 21, element: 'H', x: -2.8, y: 0.8, z: 0.0 },
      { id: 22, element: 'H', x: 0.0, y: 2.7, z: 0.0 },
      { id: 23, element: 'H', x: 0.0, y: -2.7, z: 0.0 }
    ],
    bonds: [
      // Ring 1 Bonds
      { from: 0, to: 1, type: 'covalent' },
      { from: 1, to: 2, type: 'covalent' },
      { from: 2, to: 3, type: 'covalent' },
      { from: 3, to: 4, type: 'covalent' },
      { from: 4, to: 5, type: 'covalent' },
      { from: 5, to: 0, type: 'covalent' },
      // Ring 2 Bonds (attached to 1 & 2)
      { from: 1, to: 6, type: 'covalent' },
      { from: 6, to: 7, type: 'covalent' },
      { from: 7, to: 8, type: 'covalent' },
      { from: 8, to: 9, type: 'covalent' },
      { from: 9, to: 2, type: 'covalent' },
      // Ring 3 Bonds (attached to 3 & 4)
      { from: 3, to: 10, type: 'covalent' },
      { from: 10, to: 11, type: 'covalent' },
      { from: 11, to: 12, type: 'covalent' },
      { from: 12, to: 4, type: 'covalent' },
      // Ring 4 Bonds (attached to 5 & 4)
      { from: 5, to: 13, type: 'covalent' },
      { from: 13, to: 14, type: 'covalent' },
      { from: 14, to: 15, type: 'covalent' },
      { from: 15, to: 16, type: 'covalent' },
      { from: 16, to: 4, type: 'covalent' },
      // Ring 5 Bonds (attached to 0 & 5 & 1)
      { from: 0, to: 17, type: 'covalent' },
      { from: 17, to: 18, type: 'covalent' },
      { from: 18, to: 19, type: 'covalent' },
      { from: 19, to: 1, type: 'covalent' },
      // Hydrogen Edge Bonds
      { from: 7, to: 20, type: 'single' },
      { from: 14, to: 21, type: 'single' },
      { from: 18, to: 22, type: 'single' },
      { from: 11, to: 23, type: 'single' }
    ]
  },
  {
    id: 'dna',
    name: 'DNA Fragment',
    formula: 'C30H38N12O18P2',
    category: 'Biopolymers',
    mass: '~980 g/mol (fragment)',
    hazard: 'Non-hazardous',
    funFact: 'If you uncoiled all the DNA in your body and put it end-to-end, it would stretch from the Earth to the Sun and back over 300 times.',
    description: 'A double-stranded molecule carrying genetic instructions for development, functioning, growth, and reproduction of all organisms. This 3D fragment represents two base pairs (Adenine-Thymine and Guanine-Cytosine) nested inside the double helix phosphate-deoxyribose backbone.',
    atoms: [
      // Base Pair 1: Adenine (left) - Thymine (right)
      // Adenine atoms
      { id: 0, element: 'N', x: -1.2, y: 0.6, z: 0.3 },
      { id: 1, element: 'C', x: -0.6, y: 1.7, z: 0.4 },
      { id: 2, element: 'N', x: 0.7, y: 1.8, z: 0.2 },
      { id: 3, element: 'C', x: 1.3, y: 0.7, z: -0.1 },
      { id: 4, element: 'C', x: 0.6, y: -0.5, z: -0.2 },
      { id: 5, element: 'C', x: -0.7, y: -0.5, z: 0.0 },
      { id: 6, element: 'N', x: -1.5, y: -1.6, z: -0.1 },
      { id: 7, element: 'C', x: -0.7, y: -2.5, z: -0.3 },
      { id: 8, element: 'N', x: 0.6, y: -2.0, z: -0.4 },
      // Thymine atoms
      { id: 9, element: 'N', x: 3.2, y: 0.7, z: -0.2 },
      { id: 10, element: 'C', x: 3.9, y: 1.8, z: -0.1 },
      { id: 11, element: 'C', x: 5.3, y: 1.8, z: -0.3 },
      { id: 12, element: 'C', x: 5.9, y: 0.6, z: -0.5 },
      { id: 13, element: 'N', x: 5.1, y: -0.6, z: -0.5 },
      { id: 14, element: 'C', x: 3.7, y: -0.5, z: -0.3 },
      { id: 15, element: 'O', x: 3.0, y: -1.6, z: -0.3 }, // Carbonyl O
      { id: 16, element: 'O', x: 3.3, y: 2.9, z: 0.1 },  // Carbonyl O
      { id: 17, element: 'C', x: 6.1, y: 3.1, z: -0.3 }, // Methyl carbon
      
      // Sugar-Phosphate Backbone Left Side (Spiral up)
      { id: 18, element: 'C', x: -2.6, y: 0.5, z: 0.5 },  // Sugar C
      { id: 19, element: 'O', x: -3.1, y: -0.8, z: 0.3 }, // Sugar O
      { id: 20, element: 'P', x: -4.5, y: -1.2, z: 0.8 }, // Phosphate P
      { id: 21, element: 'O', x: -5.3, y: -0.1, z: 1.5 }, // Phosphate O
      { id: 22, element: 'O', x: -4.9, y: -2.6, z: 0.6 }, // Phosphate O
      
      // Sugar-Phosphate Backbone Right Side (Spiral down)
      { id: 23, element: 'C', x: 4.6, y: 0.7, z: -0.2 },   // Sugar C
      { id: 24, element: 'O', x: 5.2, y: -0.5, z: -0.3 },  // Sugar O
      { id: 25, element: 'P', x: 6.6, y: -1.1, z: -0.8 },  // Phosphate P
      { id: 26, element: 'O', x: 7.5, y: -0.1, z: -1.4 },  // Phosphate O
      { id: 27, element: 'O', x: 6.8, y: -2.5, z: -0.5 }   // Phosphate O
    ],
    bonds: [
      // Adenine ring bonds
      { from: 0, to: 1, type: 'double' },
      { from: 1, to: 2, type: 'single' },
      { from: 2, to: 3, type: 'double' },
      { from: 3, to: 4, type: 'single' },
      { from: 4, to: 5, type: 'double' },
      { from: 5, to: 0, type: 'single' },
      { from: 5, to: 6, type: 'single' },
      { from: 6, to: 7, type: 'double' },
      { from: 7, to: 8, type: 'single' },
      { from: 8, to: 4, type: 'single' },
      
      // Thymine ring bonds
      { from: 9, to: 10, type: 'single' },
      { from: 10, to: 11, type: 'double' },
      { from: 11, to: 12, type: 'single' },
      { from: 12, to: 13, type: 'double' },
      { from: 13, to: 14, type: 'single' },
      { from: 14, to: 9, type: 'single' },
      { from: 14, to: 15, type: 'double' },
      { from: 10, to: 16, type: 'double' },
      { from: 11, to: 17, type: 'single' },
      
      // Hydrogen bonds between Adenine & Thymine (The key bonds!)
      { from: 3, to: 9, type: 'hydrogen' }, // N-H...N bond
      { from: 2, to: 13, type: 'hydrogen' }, // N...H-N bond
      
      // Backbone Left
      { from: 0, to: 18, type: 'single' },
      { from: 18, to: 19, type: 'single' },
      { from: 19, to: 20, type: 'single' },
      { from: 20, to: 21, type: 'single' },
      { from: 20, to: 22, type: 'single' },
      
      // Backbone Right
      { from: 13, to: 23, type: 'single' },
      { from: 23, to: 24, type: 'single' },
      { from: 24, to: 25, type: 'single' },
      { from: 25, to: 26, type: 'single' },
      { from: 25, to: 27, type: 'single' }
    ]
  }
];

export const getMoleculeById = (id: string): Molecule | undefined => {
  return MOLECULES.find(m => m.id === id);
};

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  galaxy: [
    {
      id: 1,
      question: "Which celestial object accounts for 99.86% of the mass in the Solar System?",
      options: ["Jupiter", "The Sun", "Earth", "The Asteroid Belt"],
      correctAnswer: 1,
      explanation: "The Sun dominates the Solar System, containing 99.86% of its total mass. Jupiter makes up the majority of the remaining 0.14%."
    },
    {
      id: 2,
      question: "How long does it take for Neptune to complete one single orbit around the Sun?",
      options: ["12 Earth years", "29 Earth years", "84 Earth years", "165 Earth years"],
      correctAnswer: 3,
      explanation: "Because of its immense distance from the Sun, Neptune takes approximately 165 Earth years to complete a single orbital revolution."
    }
  ],
  earth: [
    {
      id: 1,
      question: "What is the primary gas composition of Earth's atmosphere?",
      options: ["78% Nitrogen, 21% Oxygen", "50% Carbon Dioxide, 50% Nitrogen", "90% Hydrogen, 10% Helium", "100% Oxygen"],
      correctAnswer: 0,
      explanation: "Earth's atmosphere is primarily Nitrogen (78%) and Oxygen (21%), which supports terrestrial life and atmospheric pressure."
    },
    {
      id: 2,
      question: "What is the average orbital velocity of Earth around the Sun?",
      options: ["5 km/s", "12 km/s", "29.8 km/s", "150 km/s"],
      correctAnswer: 2,
      explanation: "Earth orbits the Sun at an average speed of approximately 29.78 km/s, taking 365.25 days to complete one revolution."
    }
  ],
  cell: [
    {
      id: 1,
      question: "Which organelle is considered the powerhouse of the cell, generating ATP?",
      options: ["Nucleus", "Mitochondria", "Lysosome", "Endoplasmic Reticulum"],
      correctAnswer: 1,
      explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions, stored as ATP."
    },
    {
      id: 2,
      question: "Where is the majority of genetic information (DNA) stored in a eukaryotic cell?",
      options: ["Cytoplasm", "Mitochondria", "Nucleus", "Ribosome"],
      correctAnswer: 2,
      explanation: "The cell nucleus contains the vast majority of the cell's genetic material, organized as multiple linear DNA molecules in chromosomes."
    }
  ],
  h2o: [
    {
      id: 1,
      question: "What is the molecular geometry of a water molecule?",
      options: ["Linear", "Bent", "Tetrahedral", "Trigonal Planar"],
      correctAnswer: 1,
      explanation: "Water has a bent geometry due to the two lone pairs on the oxygen atom repelling the bonding pairs of electrons."
    },
    {
      id: 2,
      question: "Why does ice float on liquid water?",
      options: [
        "Ice is denser than liquid water",
        "Ice is less dense than liquid water because of hydrogen bonding forming a crystalline lattice",
        "Liquid water contains dissolved gas bubbles",
        "Ice has lower molecular weight"
      ],
      correctAnswer: 1,
      explanation: "Hydrogen bonding in ice creates a spacious hexagonal crystalline lattice, making it about 9% less dense than liquid water."
    }
  ],
  co2: [
    {
      id: 1,
      question: "What type of bonds exist between Carbon and Oxygen in CO2?",
      options: ["Single Covalent", "Double Covalent", "Triple Covalent", "Ionic"],
      correctAnswer: 1,
      explanation: "Carbon Dioxide (CO2) consists of a central Carbon atom forming double covalent bonds with each of the two Oxygen atoms."
    },
    {
      id: 2,
      question: "What is the bond angle of Carbon Dioxide?",
      options: ["104.5 degrees", "120 degrees", "180 degrees", "109.5 degrees"],
      correctAnswer: 2,
      explanation: "CO2 is a linear molecule, meaning its atoms lie in a straight line with a bond angle of exactly 180 degrees."
    }
  ],
  caffeine: [
    {
      id: 1,
      question: "Caffeine belongs to which chemical class of alkaloids?",
      options: ["Phenethylamines", "Tryptamines", "Methylxanthines", "Tropanes"],
      correctAnswer: 2,
      explanation: "Caffeine is a purine alkaloid of the methylxanthine class, which also includes theobromine and theophylline."
    },
    {
      id: 2,
      question: "Which organ breaks down caffeine in the human body?",
      options: ["Brain", "Liver", "Stomach", "Kidneys"],
      correctAnswer: 1,
      explanation: "Caffeine is metabolized in the liver by the cytochrome P450 oxidase enzyme system, specifically broken down into paraxanthine, theobromine, and theophylline."
    }
  ],
  graphene: [
    {
      id: 1,
      question: "What is the hybridization state of Carbon atoms in a Graphene sheet?",
      options: ["sp", "sp2", "sp3", "sp3d"],
      correctAnswer: 1,
      explanation: "In graphene, carbon atoms undergo sp2 hybridization, bonding with three adjacent carbons at 120-degree angles in a 2D plane."
    },
    {
      id: 2,
      question: "Who was awarded the Nobel Prize in Physics (2010) for groundbreaking experiments on Graphene?",
      options: [
        "Richard Smalley & Robert Curl",
        "Andre Geim & Konstantin Novoselov",
        "Albert Einstein & Niels Bohr",
        "Marie Curie & Pierre Curie"
      ],
      correctAnswer: 1,
      explanation: "Andre Geim and Konstantin Novoselov at the University of Manchester were awarded the Nobel Prize for isolation of graphene using adhesive tape."
    }
  ],
  dna: [
    {
      id: 1,
      question: "Which nucleotide base pairs with Adenine in a standard DNA double helix?",
      options: ["Cytosine", "Guanine", "Thymine", "Uracil"],
      correctAnswer: 2,
      explanation: "Adenine always pairs with Thymine in DNA (forming 2 hydrogen bonds), whereas Guanine pairs with Cytosine (forming 3 hydrogen bonds)."
    },
    {
      id: 2,
      question: "What holds the two complementary strands of a DNA helix together?",
      options: ["Covalent Bonds", "Ionic Bonds", "Hydrogen Bonds", "Metallic Bonds"],
      correctAnswer: 2,
      explanation: "The two strands are held together by hydrogen bonds between the complementary nitrogenous base pairs."
    }
  ],
  quark: [
    {
      id: 1,
      question: "What valence quark combination constitutes a proton?",
      options: ["Two Up quarks, one Down quark", "One Up quark, two Down quarks", "Three Up quarks", "Three Down quarks"],
      correctAnswer: 0,
      explanation: "A proton contains three valence quarks: two Up quarks (charge +2/3 e each) and one Down quark (charge -1/3 e), yielding a net charge of +1 e."
    },
    {
      id: 2,
      question: "Which gauge bosons mediate the strong nuclear force binding quarks together?",
      options: ["Photons", "W and Z Bosons", "Gluons", "Gravitons"],
      correctAnswer: 2,
      explanation: "Gluons are the gauge bosons that carry color charge and mediate the strong interaction, keeping quarks tightly confined inside hadrons."
    }
  ]
};
