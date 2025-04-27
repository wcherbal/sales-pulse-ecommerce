
import { ShoppingCart, TrendingUp, MessageSquare, PiggyBank, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  icon: string;
  title: string;
  value: string;
  change?: number;
  negative?: boolean;
  iconBg: string;
  iconColor: string;
}

const KpiCard = ({ 
  icon, 
  title, 
  value, 
  change, 
  negative = false,
  iconBg,
  iconColor 
}: KpiCardProps) => {
  // Map icon strings to Lucide components
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case "€": return <ShoppingCart className={iconColor} />;
      case "%": return <TrendingUp className={iconColor} />;
      case "↩️": return <MessageSquare className={iconColor} />;
      case "💰": return <PiggyBank className={iconColor} />;
      default: return <span className={cn("text-lg font-semibold", iconColor)}>{icon}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] transition-all duration-300 hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)] border border-gray-100">
      <div className="flex items-center mb-2">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-transform hover:scale-110", iconBg)}>
          {getIcon(icon)}
        </div>
        <h3 className="font-medium text-gray-600 text-sm">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        {change !== undefined && (
          <div className="mt-2 flex items-center">
            {negative ? 
              (change < 0 ? <ArrowDown size={16} className="text-green-600 mr-1" /> : <ArrowUp size={16} className="text-red-600 mr-1" />) : 
              (change < 0 ? <ArrowDown size={16} className="text-red-600 mr-1" /> : <ArrowUp size={16} className="text-green-600 mr-1" />)
            }
            <span className={cn(
              "text-sm font-medium",
              negative 
                ? (change < 0 ? "text-green-600" : "text-red-600") 
                : (change < 0 ? "text-red-600" : "text-green-600")
            )}>
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
