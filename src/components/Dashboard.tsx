
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
import { toast } from "@/components/ui/use-toast";

interface DynamicFilters {
  year: string;
  month: string;
  product: string;
  city: string;
  deviceType?: string;
  clientType?: string;
  acquisitionChannel?: string;
  status?: string;
  funnelStage?: string;
  selectedMonth?: number;
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
    
    // Filter by standard dropdown filters
    if (filters.year !== "Tous") {
      result = result.filter(item => item.year === filters.year);
    }
    
    if (filters.month !== "Tous") {
      result = result.filter(item => item.month === Number(filters.month));
    }
    
    if (filters.product !== "Tous") {
      result = result.filter(item => item.product === filters.product);
    }
    
    if (filters.city !== "Tous") {
      result = result.filter(item => item.city === filters.city);
    }
    
    // Filter by interactive chart filters
    if (filters.deviceType) {
      result = result.filter(item => item.deviceType === filters.deviceType);
    }
    
    if (filters.clientType) {
      result = result.filter(item => item.clientType === filters.clientType);
    }
    
    if (filters.acquisitionChannel) {
      result = result.filter(item => item.acquisitionChannel === filters.acquisitionChannel);
    }
    
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }
    
    if (filters.funnelStage) {
      if (filters.funnelStage === 'carts') {
        result = result.filter(item => 
          item.status === "Abandonné" || item.status === "Panier récupéré"
        );
      } else if (filters.funnelStage === 'purchases') {
        result = result.filter(item => item.status === "Panier récupéré");
      }
    }
    
    if (filters.selectedMonth) {
      result = result.filter(item => item.month === filters.selectedMonth);
    }
    
    setData(result);
  }, [filters]);

  // Clear all interactive filters
  const clearInteractiveFilters = () => {
    setFilters(prev => ({
      ...prev,
      deviceType: undefined,
      clientType: undefined,
      acquisitionChannel: undefined,
      status: undefined,
      funnelStage: undefined,
      selectedMonth: undefined
    }));
    
    toast({
      title: "Filtres interactifs réinitialisés",
      description: "Tous les graphiques affichent maintenant les données complètes.",
      duration: 3000,
    });
  };

  // Handle chart click events
  const handleDeviceClick = (device: string) => {
    setFilters(prev => ({
      ...prev,
      deviceType: prev.deviceType === device ? undefined : device
    }));
    
    if (filters.deviceType !== device) {
      toast({
        title: `Filtre appliqué : ${device}`,
        description: "Dashboard filtré par type d'appareil",
        duration: 3000,
      });
    }
  };

  const handleClientTypeClick = (type: string) => {
    setFilters(prev => ({
      ...prev,
      clientType: prev.clientType === type ? undefined : type
    }));
    
    if (filters.clientType !== type) {
      toast({
        title: `Filtre appliqué : ${type}`,
        description: "Dashboard filtré par type de client",
        duration: 3000,
      });
    }
  };

  const handleChannelClick = (channel: string) => {
    setFilters(prev => ({
      ...prev,
      acquisitionChannel: prev.acquisitionChannel === channel ? undefined : channel
    }));
    
    if (filters.acquisitionChannel !== channel) {
      toast({
        title: `Filtre appliqué : ${channel}`,
        description: "Dashboard filtré par canal d'acquisition",
        duration: 3000,
      });
    }
  };
  
  const handleStatusClick = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? undefined : status
    }));
    
    if (filters.status !== status) {
      toast({
        title: `Filtre appliqué : ${status === 'Abandonné' ? 'Paniers abandonnés' : 'Paniers récupérés'}`,
        description: "Dashboard filtré par statut de panier",
        duration: 3000,
      });
    }
  };
  
  const handleFunnelStageClick = (stage: string) => {
    setFilters(prev => ({
      ...prev,
      funnelStage: prev.funnelStage === stage ? undefined : stage
    }));
    
    if (filters.funnelStage !== stage) {
      const stageNames: Record<string, string> = {
        'visits': 'Visites du site',
        'carts': 'Paniers créés',
        'purchases': 'Achats confirmés'
      };
      
      toast({
        title: `Filtre appliqué : ${stageNames[stage]}`,
        description: "Dashboard filtré par étape du tunnel",
        duration: 3000,
      });
    }
  };
  
  const handleMonthClick = (month: number) => {
    setFilters(prev => ({
      ...prev,
      selectedMonth: prev.selectedMonth === month ? undefined : month
    }));
    
    if (filters.selectedMonth !== month) {
      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      
      toast({
        title: `Filtre appliqué : ${monthNames[month-1]}`,
        description: "Dashboard filtré par mois",
        duration: 3000,
      });
    }
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
  const salesPotential = abandonedItems.length > 0 ? 
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
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
              Optimisation des ventes - Conversion & abandon de panier
            </h1>
            
            {/* Active filters indicators */}
            {(filters.deviceType || filters.clientType || filters.acquisitionChannel || filters.status || filters.funnelStage || filters.selectedMonth) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {filters.deviceType && (
                  <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Appareil: {filters.deviceType}
                  </span>
                )}
                {filters.clientType && (
                  <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Client: {filters.clientType}
                  </span>
                )}
                {filters.acquisitionChannel && (
                  <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Canal: {filters.acquisitionChannel}
                  </span>
                )}
                {filters.status && (
                  <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Statut: {filters.status}
                  </span>
                )}
                {filters.funnelStage && (
                  <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Étape: {filters.funnelStage === 'visits' ? 'Visites' : filters.funnelStage === 'carts' ? 'Paniers' : 'Achats'}
                  </span>
                )}
                {filters.selectedMonth && (
                  <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Mois: {filters.selectedMonth}
                  </span>
                )}
                <button 
                  onClick={clearInteractiveFilters}
                  className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded hover:bg-red-200"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>
          
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
              onFunnelStageClick={handleFunnelStageClick}
              activeStage={filters.funnelStage}
            />
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Valeur des paniers abandonnés VS récupérés</h3>
            <CartsValueChart 
              abandonedValue={data.filter(item => item.status === "Abandonné").reduce((sum, item) => sum + item.price, 0)} 
              recoveredValue={data.filter(item => item.status === "Panier récupéré").reduce((sum, item) => sum + item.price, 0)} 
              onStatusClick={handleStatusClick}
              activeStatus={filters.status}
            />
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Taux d'abandon par type de client</h3>
            <ClientTypeChart 
              data={data} 
              onClientTypeClick={handleClientTypeClick}
              activeClientType={filters.clientType}
            />
          </div>
        </div>

        {/* Charts - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Évolution du taux d'abandon</h3>
            <AbandonRateChart 
              data={data} 
              onMonthClick={handleMonthClick}
              activeMonth={filters.selectedMonth}
            />
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Taux d'abandon par appareil</h3>
            <DeviceAbandonChart 
              data={data} 
              onDeviceClick={handleDeviceClick}
              activeDevice={filters.deviceType}
            />
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Taux d'abandon par canal</h3>
            <ChannelAbandonChart 
              data={data} 
              onChannelClick={handleChannelClick}
              activeChannel={filters.acquisitionChannel}
            />
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
