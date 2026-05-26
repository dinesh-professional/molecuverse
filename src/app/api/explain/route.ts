import { NextResponse } from 'next/server';

// Detailed offline scientific database (acts as high-fidelity fallback when API keys are not configured)
const OFFLINE_DB: Record<string, Array<{ keywords: string[]; text: string }>> = {
  galaxy: [
    {
      keywords: ['speed', 'mass', 'orbital', 'class', 'star', 'sun'],
      text: "The Solar System orbits the Milky Way center at 220 km/s. The Sun (G2V Yellow Dwarf) accounts for 99.86% of the system's mass (~1.99e30 kg). Using the Cosmic scale physics slider, you can modify the solar orbit velocity to speed up or slow down planetary rotation."
    },
    {
      keywords: ['planets', 'inner', 'outer', 'gas', 'terrestrial'],
      text: "Our Solar System features 4 inner terrestrial rocky planets (Mercury, Venus, Earth, Mars) and 4 outer gas/ice giants (Jupiter, Saturn, Uranus, Neptune). Orbits are locked in gravitational harmony. In the viewport, toggle orbit trails to trace their spatial paths."
    },
    {
      keywords: ['structure', 'moons', 'dwarf', 'moon'],
      text: "In addition to the 8 primary planets, the Solar System contains dwarf planets (like Pluto and Ceres), over 290 natural satellites (moons), and billions of asteroids and comets, all bound by gravitational forces."
    }
  ],
  quark: [
    {
      keywords: ['proton', 'hadrons', 'structure', 'nucleus'],
      text: "A proton is a stable baryon (subatomic hadron) found in the nucleus of atoms. It has a mass of 1.67e-27 kg. It is a composite particle consisting of three valence quarks bound together by gluons carrying the strong nuclear force."
    },
    {
      keywords: ['quarks', 'charge', 'fractional', 'up', 'down'],
      text: "The proton contains two Up quarks (charge +2/3 e each) and one Down quark (charge -1/3 e). This results in a net electric charge of +1 e. Quarks also carry 'color charge' (red, green, blue) that continuously cycles via gluon exchange."
    },
    {
      keywords: ['force', 'strong', 'gluons', 'gluon', 'confinement'],
      text: "Gluons are the gauge bosons that mediate the strong interaction between quarks. Due to 'color confinement', quarks cannot exist in isolation. The Gluon Binding Strength slider regulates the tension and vibrations of the gluon fields connecting the quarks."
    }
  ],
  earth: [
    {
      keywords: ['atmosphere', 'oxygen', 'nitrogen', 'composition'],
      text: "Earth's atmosphere consists of approximately 78% Nitrogen, 21% Oxygen, 0.9% Argon, and 0.04% Carbon Dioxide. This unique mixture protects the biosphere by absorbing ultraviolet solar radiation, warming the surface through the greenhouse effect, and reducing temperature extremes between day and night."
    },
    {
      keywords: ['satellite', 'satellites', 'orbit', 'moon', 'space'],
      text: "Earth has one natural satellite, the Moon, orbiting at a mean distance of 384,400 km. In low-Earth orbit (LEO), there are over 2,400 active communication satellites, 340+ weather/meteorological satellites, and an estimated 12,000+ pieces of trackable space debris monitored by space safety networks."
    },
    {
      keywords: ['speed', 'mass', 'orbital', 'class', 'weight'],
      text: "Planet Earth has a mass of 5.97e24 kg, classifying it as a Terrestrial (rocky) planet. Its average orbital speed around the Sun is 29.78 km/s (approx. 107,200 km/h). In our dashboard controls, you can adjust the orbital speed multiplier to observe satellite dynamics."
    }
  ],
  cell: [
    {
      keywords: ['organelles', 'organelle', 'structure', 'mitochondria', 'lysosome'],
      text: "Eukaryotic cells contain membrane-bound compartments called organelles. The mitochondria act as biochemical power stations generating ATP; lysosomes act as recycling facilities disposing of cellular waste; and the endoplasmic reticulum handles protein and lipid synthesis."
    },
    {
      keywords: ['mitochondria', 'atp', 'respiration', 'energy', 'power'],
      text: "Mitochondria convert oxygen and nutrients into adenosine triphosphate (ATP) via the electron transport chain in aerobic cellular respiration. Because they possess their own independent genome (mtDNA) and double-membrane structure, evolutionary biologists theorize they originated from ancient symbiotic bacteria."
    },
    {
      keywords: ['nucleus', 'dna', 'nucleolus', 'core', 'gene'],
      text: "The cell nucleus is the information repository of the cell. It houses the linear chromosomes composed of DNA. Inside the nucleus, the dense nucleolus produces ribosomal subunits. The nuclear envelope has selective pores that regulate macromolecular traffic into and out of the cytoplasm."
    }
  ],
  h2o: [
    {
      keywords: ['body', 'human', 'interact', 'biological'],
      text: "In the human body, Water (H2O) serves as the primary cellular solvent. It accounts for roughly 60% of adult body mass. It is crucial for: \n1. Nutrient Transport: Dissolving vitamins, minerals, and glucose for delivery to target organs.\n2. Thermoregulation: Absorbing metabolic heat and dissipating it through perspiration due to its high specific heat capacity.\n3. Lubrication: Acting as a friction-reducing cushion in joints and mucous membranes.\n4. Metabolism: Serving as an active reactant in biochemical hydrolysis reactions to break down proteins and carbohydrates."
    },
    {
      keywords: ['bond', 'bonding', 'geometry', 'angle', 'polar', 'structure'],
      text: "Water is a polar molecule with a bent molecular geometry. The central Oxygen atom is sp3 hybridized, forming two covalent bonds with Hydrogen and harboring two lone electron pairs. \nDue to the electronegativity of Oxygen (3.44) compared to Hydrogen (2.20), electrons are pulled closer to the oxygen nucleus, creating a net dipole moment with a negative charge at the vertex and positive charges at the terminals. This polarity enables H2O to form intermolecular Hydrogen Bonds, giving water its anomalously high boiling point, surface tension, and liquid density."
    },
    {
      keywords: ['use', 'industry', 'industrial', 'commercial'],
      text: "Industrially, water is the universal utility fluid. It is used as: \n1. Heat Transfer Agent: Steam generation in power plants and coolants in heavy factories.\n2. Chemical Feedstock: Source of hydrogen gas via electrolysis and reactant in petro-chemical processing.\n3. Processing Solvent: Used in food manufacturing, paper mills, textiles, and ore purification.\n4. Cleaning: Rinsing toxic chemical residues due to its high solvent properties."
    }
  ],
  co2: [
    {
      keywords: ['body', 'human', 'breath', 'blood', 'ph'],
      text: "In human physiology, Carbon Dioxide (CO2) is the waste product of aerobic cellular respiration. It is transported in blood back to the lungs in three forms: dissolved gas, bound to carbamino compounds, and primarily as bicarbonate ions (HCO3-). \nCO2 plays a vital role in regulating blood pH. The carbonic anhydrase enzyme converts CO2 and water into carbonic acid, which buffers blood pH near 7.40. Elevated blood CO2 (hypercapnia) triggers respiratory centers in the brain to increase breathing rates."
    },
    {
      keywords: ['bond', 'bonding', 'geometry', 'structure', 'linear'],
      text: "Carbon Dioxide is a linear, triatomic molecule. The central Carbon atom forms two double covalent bonds with neighboring Oxygen atoms. \nCarbon undergoes sp hybridization, leaving two unhybridized p-orbitals to form pi-bonds with oxygen. Although the individual C=O bonds are highly polar, the symmetrical linear geometry (180° bond angle) cancels out the dipole moments, rendering the CO2 molecule entirely non-polar."
    },
    {
      keywords: ['use', 'industry', 'industrial', 'commercial'],
      text: "CO2 is used extensively across multiple industries:\n1. Food & Beverage: Carbonation in soft drinks and flash-freezing food via liquid CO2.\n2. Cryogenics: Solid CO2 (dry ice) is used as a sublimation coolant down to -78.5°C.\n3. Fire Safety: CO2 gas smothers fires by displacement of oxygen.\n4. Extraction: Supercritical CO2 fluid is used to decaffeinate coffee beans and extract essential oils."
    }
  ],
  caffeine: [
    {
      keywords: ['body', 'human', 'brain', 'sleep', 'adenosine'],
      text: "Caffeine acts as a central nervous system stimulant by structurally mimicking adenosine. \nNormally, adenosine binds to adenosine A1 and A2A receptors in the brain, slowing neural firing and causing drowsiness. Caffeine acts as a competitive antagonist, binding to these receptors without activating them. This blocks adenosine, resulting in increased alertness, constriction of cerebral blood vessels, and increased release of neurotransmitters like dopamine and norepinephrine, which elevate heart rate and focus."
    },
    {
      keywords: ['bond', 'bonding', 'geometry', 'structure', 'rings'],
      text: "Caffeine (C8H10N4O2) is a bicyclic purine derivative. Its structure features a fused pyrimidinedione ring and an imidazole ring.\nAll ring Carbon and Nitrogen atoms are sp2 hybridized, creating a flat, conjugated pi-cloud system. The three methyl groups (CH3) bound to nitrogen atoms give the molecule lipophilic properties, allowing it to easily cross the blood-brain barrier."
    },
    {
      keywords: ['use', 'industry', 'pharmaceutical', 'medical'],
      text: "Caffeine has widespread consumer and pharmaceutical uses:\n1. Alertness: The active ingredient in energy drinks, tablets, and coffee.\n2. Analgesic Enhancer: Combined with aspirin or acetaminophen in pain medications, as it increases their efficacy by 40%.\n3. Athletic Performance: Used in sports supplements to increase lipolysis and glycogen sparing."
    }
  ],
  graphene: [
    {
      keywords: ['body', 'human', 'biocompatible', 'toxic'],
      text: "Raw graphene sheets have low biocompatibility due to their hydrophobic sharp edges, which can damage cell membranes. However, modified Graphene Oxide is heavily researched for:\n1. Target Drug Delivery: Carrying chemotherapy drugs on its wide flat surface directly to cancer cells.\n2. Biosensors: High electrical conductivity allows detecting tiny molecular shifts in glucose or DNA strands.\n3. Neural Interfaces: Designing flexible brain implants that conduct electrical signals without triggering tissue rejection."
    },
    {
      keywords: ['bond', 'bonding', 'geometry', 'lattice', 'hybridization'],
      text: "Graphene consists of a single layer of Carbon atoms arranged in a 2D honeycomb lattice. Each carbon atom is sp2 hybridized, forming three strong sigma (covalent) bonds with neighbors at 120° angles. \nThe remaining unhybridized p-orbital on each carbon overlaps to form a delocalized pi-band. This allows electrons to behave as massless particles (Dirac fermions), granting graphene near-room temperature superconductivity and extraordinary thermal conduction."
    },
    {
      keywords: ['use', 'industry', 'electronics', 'aerospace'],
      text: "Graphene is often called a wonder material due to its uses:\n1. Electronics: High-speed transistors, touchscreens, and light-emitting components.\n2. Energy: Supercapacitors that charge in seconds and high-capacity lithium batteries.\n3. Materials Science: Adding tensile strength to polymers for aerospace fuselages and sporting gear.\n4. Desalination: Nanoporous graphene filters separate salt ions from seawater."
    }
  ],
  dna: [
    {
      keywords: ['body', 'human', 'protein', 'cell', 'genetic'],
      text: "Deoxyribonucleic Acid (DNA) is the blueprints of life. In human cells, it is packed into 46 chromosomes inside the nucleus.\nIts sequence of nitrogenous bases encodes the genes. During transcription, RNA polymerase copies DNA sections into mRNA. Ribosomes then translate mRNA sequences to assemble amino acids into proteins, which drive cellular metabolism, muscle building, hormone production, and enzymatic cascades."
    },
    {
      keywords: ['bond', 'bonding', 'helix', 'sugar', 'hydrogen'],
      text: "DNA features a double helix structure composed of two antiparallel strands. Each strand has a deoxyribose sugar-phosphate backbone linked by strong phosphodiester covalent bonds.\nThe two strands are bound together by Hydrogen Bonds between complementary base pairs:\n- Adenine (A) binds to Thymine (T) via two hydrogen bonds.\n- Guanine (G) binds to Cytosine (C) via three hydrogen bonds.\nHydrophobic base stacking forces also align the flat aromatic rings parallel to each other inside the core, stabilizing the helix."
    },
    {
      keywords: ['use', 'industry', 'engineering', 'crispr'],
      text: "DNA technology is vital for biotechnology:\n1. Genetic Engineering: Recombinant DNA is used to produce insulin, vaccines, and pest-resistant crops.\n2. Forensic PCR: Replicating trace DNA samples from crime scenes for sequence profiling.\n3. Data Storage: DNA has extreme storage density; scientists have encoded digital books and images into synthetic DNA.\n4. CRISPR Editing: Utilizing guiding RNA strands to splice and replace mutations in live patients."
    }
  ]
};

export async function POST(req: Request) {
  try {
    const { moleculeId, question } = await req.json();
    const queryLower = question.toLowerCase();

    // 1. If Gemini API Key exists, try to get live response
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const systemPrompt = `You are MolecuVerse AI Cognitive Core, a Senior Scientific Visualization Engineer and Chemistry professor. 
        Provide a concise, professional, and visually formatted response (2-3 paragraphs with markdown bullets) to the user's question. 
        The context is the molecule: ${moleculeId}.
        Question: ${question}`;

        const apiResp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }]
            })
          }
        );

        const data = await apiResp.json();
        const liveText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (liveText) {
          return NextResponse.json({ explanation: liveText });
        }
      } catch (liveErr) {
        console.warn("Live API fetch failed, switching to offline fallback: ", liveErr);
      }
    }

    // 2. Offline Database Search Fallback
    const moleculeDocs = OFFLINE_DB[moleculeId] || OFFLINE_DB.h2o;
    let matchedExplanation = null;

    // Search keywords
    for (const doc of moleculeDocs!) {
      if (doc.keywords.some(kw => queryLower.includes(kw))) {
        matchedExplanation = doc.text;
        break;
      }
    }

    // Default fallback explanation if keywords don't match
    if (!matchedExplanation) {
      matchedExplanation = `Cognitive Core analysis for ${moleculeId.toUpperCase()}:\nThis compound belongs to high-importance molecular classes. In this scale viewport, you can adjust the Thermal Energy slider to simulate atomic kinetic motion. For educational evaluations, please enter the QUIZ tab to test your understanding, or specify your question with keywords such as 'body' (biological role), 'bonding' (chemical structure), or 'industrial' (uses) to query local offline archives.`;
    }

    return NextResponse.json({ explanation: matchedExplanation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
