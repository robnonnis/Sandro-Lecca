// Dati di default — verranno sovrascritti dall'admin via localStorage
export const DEFAULT_DATA = {
  info: {
    name: "Sandro Lecca",
    location: "Uta, Cagliari",
    whatsapp: "+39 347 123 4567",
    zone: "Campidano, Sardegna",
    banner: "🍅 Stagione in corso — disponibile fino a novembre!",
    bannerActive: true,
  },
  products: [
    {
      id: "cdb",
      name: "Pomodoro Cuore di Bue",
      emoji: "🍅",
      description: "Varietà antica, polpa densa, quasi senza semi. Ideale crudo, in insalata o farcito.",
      price: 8.0,
      unit: "cassa da 10 kg",
      available: true,
    },
    {
      id: "dat",
      name: "Pomodorino Datterino",
      emoji: "🍒",
      description: "Piccolo, zuccherino, a forma di dattero. Perfetto per sughi, arrosti o da mangiare così.",
      price: 10.0,
      unit: "confezione da 3 kg",
      available: true,
    },
  ],
  delivery: {
    zones: "Uta, Cagliari, Assemini, Capoterra, Decimomannu",
    days: "Martedì e Venerdì",
    notes: "Ritiro diretto in azienda su appuntamento.",
    cost: 3.0,
    freeAbove: 30,
  },
};

const STORAGE_KEY = "sandro_lecca_data";

export function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_DATA;
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}
