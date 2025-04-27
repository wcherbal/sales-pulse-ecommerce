
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart2, 
  Bot,
  Users,
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-[#6C5B9B] text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">CraftedInsights</h1>
        <p className="text-sm text-gray-200">Dashboard e-commerce</p>
      </div>

      <div className="flex flex-col flex-1">
        <div className="px-4 py-2">
          <p className="text-xs text-gray-300 mb-2">Principal</p>
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active />
        </div>

        <div className="px-4 py-2">
          <p className="text-xs text-gray-300 mb-2">Analyses</p>
          <SidebarItem icon={<ShoppingCart size={20} />} text="Conversion & abandon de panier" />
          <SidebarItem icon={<BarChart2 size={20} />} text="Personnalisation & ventes additionnelles" />
          <SidebarItem icon={<Bot size={20} />} text="Optimisation UX & A/B Testing" />
        </div>

        <div className="px-4 py-2">
          <p className="text-xs text-gray-300 mb-2">Gestion</p>
          <SidebarItem icon={<Users size={20} />} text="Clients" />
          <SidebarItem icon={<Settings size={20} />} text="Paramètres" />
        </div>

        <div className="mt-auto p-4 border-t border-[#7d6dad] flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#8A2BE2] text-white flex items-center justify-center text-xs font-medium">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm">Jean Dupont</p>
            <p className="text-xs text-gray-300">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active = false }) => {
  return (
    <div
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md mb-1 cursor-pointer",
        active ? "bg-[#9271D9] text-white" : "text-gray-200 hover:bg-[#7d6dad]"
      )}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
};

export default Sidebar;
