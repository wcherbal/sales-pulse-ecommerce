
import { ArrowUp, ArrowDown } from "lucide-react";
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
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border">
      <div className="flex items-center mb-2">
        <div className={cn("w-9 h-9 rounded-md flex items-center justify-center mr-3", iconBg)}>
          <span className={cn("text-lg font-semibold", iconColor)}>{icon}</span>
        </div>
        <h3 className="font-medium text-gray-600 text-sm">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="mt-2 flex items-center">
            {negative ? 
              (change < 0 ? <ArrowDown size={16} className="text-green-500 mr-1" /> : <ArrowUp size={16} className="text-red-500 mr-1" />) : 
              (change < 0 ? <ArrowDown size={16} className="text-red-500 mr-1" /> : <ArrowUp size={16} className="text-green-500 mr-1" />)
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
