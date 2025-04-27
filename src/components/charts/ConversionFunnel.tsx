
import { useState, useEffect } from 'react';

interface ConversionFunnelProps {
  totalVisits: number;
  cartsCreated: number;
  confirmedPurchases: number;
}

const ConversionFunnel = ({ totalVisits, cartsCreated, confirmedPurchases }: ConversionFunnelProps) => {
  // Calculate percentages
  const cartCreationRate = ((cartsCreated / totalVisits) * 100).toFixed(2);
  const purchaseRate = ((confirmedPurchases / cartsCreated) * 100).toFixed(2);
  const overallConversionRate = ((confirmedPurchases / totalVisits) * 100).toFixed(2);

  return (
    <div className="flex flex-col items-center">
      {/* Stage 1: Visits */}
      <div className="w-full bg-violet-100 rounded-t-lg p-4 text-center relative">
        <div className="font-medium text-violet-900">Visites du site</div>
        <div className="font-bold text-violet-900 text-xl">{totalVisits.toLocaleString()}</div>
        <div className="text-xs text-violet-600">100%</div>
      </div>
      
      {/* Arrow */}
      <div className="h-6 w-6 transform rotate-45 border-b-2 border-r-2 border-violet-300 -mt-2 mb-2"></div>
      
      {/* Stage 2: Cart Creation */}
      <div className="w-4/5 bg-violet-200 p-4 text-center relative">
        <div className="font-medium text-violet-900">Paniers créés</div>
        <div className="font-bold text-violet-900 text-xl">{cartsCreated.toLocaleString()}</div>
        <div className="text-xs text-violet-600">
          {cartCreationRate}% des visites
        </div>
      </div>
      
      {/* Arrow */}
      <div className="h-6 w-6 transform rotate-45 border-b-2 border-r-2 border-violet-400 -mt-2 mb-2"></div>
      
      {/* Stage 3: Purchases */}
      <div className="w-3/5 bg-violet-300 rounded-b-lg p-4 text-center">
        <div className="font-medium text-violet-900">Achats confirmés</div>
        <div className="font-bold text-violet-900 text-xl">{confirmedPurchases.toLocaleString()}</div>
        <div className="text-xs text-violet-800">
          {purchaseRate}% des paniers | {overallConversionRate}% des visites
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnel;
