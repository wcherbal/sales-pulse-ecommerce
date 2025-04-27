
// Generate realistic mock data for e-commerce dashboard
const generateMockData = () => {
  const data = [];
  const products = ["Crème hydratante", "Sérum anti-âge", "Masque purifiant", "Huile essentielle", 
    "Coffret soins visage", "Crème solaire", "Lotion tonique", "Sérum vitamine C", "Gommage corps", 
    "Crème mains", "Huile de soin", "Masque hydratant", "Crème anti-rides", "Sérum hydratant"];
  const cities = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nice", "Nantes", 
    "Strasbourg", "Montpellier", "Rennes", "Reims", "Toulon", "Grenoble"];
  const countries = ["France", "Belgique", "Suisse"];
  const acquisitionChannels = ["Email", "SEO", "Publicité payante", "Accès direct", "Réseaux sociaux"];
  const deviceTypes = ["Mobile", "Desktop", "Tablette"];
  const clientTypes = ["Nouveau visiteur", "Client récurrent"];
  const status = ["Panier récupéré", "Abandonné", "En attente"];
  const actions = ["Relancé par email", "Retargeting pub", "Offre spéciale envoyée", "Remise appliquée", ""];

  for (let i = 1; i <= 2000; i++) {
    const date = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const currentStatus = status[Math.floor(Math.random() * status.length)];
    const price = Math.floor(Math.random() * (100 - 15) + 15) * (Math.random() < 0.3 ? 2 : 1);
    
    data.push({
      orderNumber: `ORD-${String(i).padStart(4, '0')}`,
      product: products[Math.floor(Math.random() * products.length)],
      client: `client${i}@example.com`,
      country: countries[Math.floor(Math.random() * countries.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      price: price,
      status: currentStatus,
      actions: currentStatus === "Panier récupéré" ? actions[Math.floor(Math.random() * actions.length)] : "",
      acquisitionChannel: acquisitionChannels[Math.floor(Math.random() * acquisitionChannels.length)],
      deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
      clientType: clientTypes[Math.floor(Math.random() * clientTypes.length)],
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    });
  }

  return data;
};

export const mockEcommerceData = generateMockData();

// Generate monthly data for abandonment rate evolution
export const generateMonthlyAbandonmentData = () => {
  const data = [];
  for (let month = 1; month <= 12; month++) {
    const monthData = mockEcommerceData.filter(item => item.month === month);
    const abandoned = monthData.filter(item => item.status === "Abandonné").length;
    const recovered = monthData.filter(item => item.status === "Panier récupéré").length;
    const total = abandoned + recovered;
    
    const rate = total > 0 ? (abandoned / total) * 100 : 0;
    
    data.push({
      month,
      rate: Math.round(rate)
    });
  }
  return data;
};

export const monthlyAbandonmentData = generateMonthlyAbandonmentData();
