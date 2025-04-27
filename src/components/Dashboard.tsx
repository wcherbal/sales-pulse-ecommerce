import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import KpiCard from "@/components/KpiCard";
import ConversionFunnel from "@/components/charts/ConversionFunnel";
import CartsValueChart from "@/components/charts/CartsValueChart";
import ClientTypeChart from "@/components/charts/ClientTypeChart";
import AbandonRateChart from "@/components/charts/AbandonRateChart";
import DeviceAbandonChart from "@/components/charts/DeviceAbandonChart";
import ChannelAbandonChart from "@/components/charts/ChannelAbandonChart";
import ProductsTable from "@/components/ProductsTable";
import { mockEcommerceData } from "@/data/mockData";

interface DynamicFilters {
  year: string;
  month: string;
  product: string;
  city: string;
  deviceType?: string;
  clientType?: string;
  acquisitionChannel?: string;
}

const Dashboard = () => {
  const [data, setData] = useState(mockEcommerceData);
  const [filters, setFilters] = useState<DynamicFilters>({
    year: "Tous",
    month: "Tous",
    product: "Tous",
    city: "Tous"
  });
  
  // Apply filters to data
  useEffect(() => {
    let result = [...mockEcommerceData];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "Tous" && value !== undefined) {
        result = result.filter(item => item[key as keyof typeof item] === value);
      }
    });
    
    setData(result);
  }, [filters]);

  // Handle chart click events
  const handleDeviceClick = (device: string) => {
    setFilters(prev => ({
      ...prev,
      deviceType: prev.deviceType === device ? undefined : device
    }));
  };

  const handleClientTypeClick = (type: string) => {
    setFilters(prev => ({
      ...prev,
      clientType: prev.clientType === type ? undefined : type
    }));
  };

  const handleChannelClick = (channel: string) => {
    setFilters(prev => ({
      ...prev,
      acquisitionChannel: prev.acquisitionChannel === channel ? undefined : channel
    }));
  };

  // Calculate KPI values from filtered data
  const totalVisits = 300000;
  const confirmedOrders = data.filter(item => item.status === "Panier récupéré").length;
  const abandonedCarts = data.filter(item => item.status === "Abandonné").length;
  const totalCarts = confirmedOrders + abandonedCarts;
  
  // 1. Conversion Rate
  const conversionRate = ((confirmedOrders / totalVisits) * 100).toFixed(1);
  
  // 2. Average Cart Value
  const confirmedCartItems = data.filter(item => item.status === "Panier récupéré");
  const totalConfirmedValue = confirmedCartItems.reduce((sum, item) => sum + item.price, 0);
  const averageCartValue = confirmedOrders > 0 ? 
    (totalConfirmedValue / confirmedOrders).toFixed(0) : 0;
  
  // 3. Cart Abandonment Rate
  const abandonmentRate = totalCarts > 0 ? 
    ((abandonedCarts / totalCarts) * 100).toFixed(1) : 0;
  
  // 4. Recovery Rate After Marketing Actions
  const recoveredAfterMarketing = data.filter(
    item => item.status === "Panier récupéré" && 
    item.actions && 
    ["Relancé par email", "Retargeting pub", "Offre spéciale envoyée"].includes(item.actions)
  ).length;
  
  const recoveryRate = abandonedCarts > 0 ? 
    ((recoveredAfterMarketing / abandonedCarts) * 100).toFixed(1) : 0;
  
  // 5. Sales Potential from Abandoned Carts
  const abandonedItems = data.filter(item => item.status === "Abandonné");
  const totalAbandonedValue = abandonedItems.reduce((sum, item) => sum + item.price, 0);
  const salesPotential = abandonedCarts > 0 ? 
    (totalAbandonedValue).toFixed(0) : 0;

  // Filter options
  const yearOptions = ["Tous", ...new Set(mockEcommerceData.map(item => item.year))].sort();
  const monthOptions = ["Tous", ...Array.from({length: 12}, (_, i) => i + 1)];
  const productOptions = ["Tous", ...new Set(mockEcommerceData.map(item => item.product))];
  const cityOptions = ["Tous", ...new Set(mockEcommerceData.map(item => item.city))];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
            Optimisation des ventes - Conversion & abandon de panier
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-violet-50 transition-colors">
              <Bell size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select 
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white hover:border-violet-300 transition-colors"
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year === "Tous" ? "Année" : year}</option>
            ))}
          </select>
          
          <select 
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white hover:border-violet-300 transition-colors"
            value={filters.month}
            onChange={(e) => setFilters({...filters, month: e.target.value})}
          >
            {monthOptions.map(month => (
              <option key={month} value={month}>
                {month === "Tous" ? "Mois" : month}
              </option>
            ))}
          </select>
          
          <select 
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white hover:border-violet-300 transition-colors"
            value={filters.product}
            onChange={(e) => setFilters({...filters, product: e.target.value})}
          >
            {productOptions.map(product => (
              <option key={product} value={product}>
                {product === "Tous" ? "Produit" : product}
              </option>
            ))}
          </select>
          
          <select 
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white hover:border-violet-300 transition-colors"
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          >
            {cityOptions.map(city => (
              <option key={city} value={city}>
                {city === "Tous" ? "Ville" : city}
              </option>
            ))}
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard 
            icon="%"
            title="Taux de conversion"
            value={`${conversionRate} %`}
            change={+2.5}
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
          />
          
          <KpiCard 
            icon="€"
            title="Panier moyen"
            value={`€ ${averageCartValue}`}
            change={+12}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          
          <KpiCard 
            icon="❗"
            title="Taux Abandon panier"
            value={`${abandonmentRate} %`}
            change={-0.8}
            negative={true}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />
          
          <KpiCard 
            icon="↩️"
            title="Conversion après relance"
            value={`${recoveryRate} %`}
            change={+2.1}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          
          <KpiCard 
            icon="💰"
            title="Potentiels de vente"
            value={`€ ${salesPotential}`}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>

        {/* Charts - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Taux de conversion à chaque étape</h3>
            <ConversionFunnel 
              totalVisits={totalVisits} 
              cartsCreated={totalCarts} 
              confirmedPurchases={confirmedOrders}
            />
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Valeur des paniers abandonnés VS récupérés</h3>
            <CartsValueChart 
              abandonedValue={data.filter(item => item.status === "Abandonné").reduce((sum, item) => sum + item.price, 0)} 
              recoveredValue={data.filter(item => item.status === "Panier récupéré").reduce((sum, item) => sum + item.price, 0)} 
            />
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Taux d'abandon par type de client</h3>
            <ClientTypeChart data={data} onClientTypeClick={handleClientTypeClick} />
          </div>
        </div>

        {/* Charts - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Évolution du taux d'abandon</h3>
            <AbandonRateChart data={data} />
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Taux d'abandon par appareil</h3>
            <DeviceAbandonChart data={data} onDeviceClick={handleDeviceClick} />
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Taux d'abandon par canal</h3>
            <ChannelAbandonChart data={data} onChannelClick={handleChannelClick} />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Tableau complet des produits</h3>
          <ProductsTable data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
