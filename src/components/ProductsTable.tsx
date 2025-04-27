
import { useState } from "react";
import { Search } from "lucide-react";

interface ProductsTableProps {
  data: any[];
}

const ProductsTable = ({ data }: ProductsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter data based on search term
  const filteredData = data.filter(item => {
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return sortOrder === "asc" 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Rechercher..."
          className="pl-10 pr-4 py-2 w-full md:w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th onClick={() => handleSort("orderNumber")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Numéro commande {getSortIcon("orderNumber")}
              </th>
              <th onClick={() => handleSort("product")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Produit {getSortIcon("product")}
              </th>
              <th onClick={() => handleSort("client")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Client {getSortIcon("client")}
              </th>
              <th onClick={() => handleSort("country")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Pays {getSortIcon("country")}
              </th>
              <th onClick={() => handleSort("city")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Ville {getSortIcon("city")}
              </th>
              <th onClick={() => handleSort("price")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Prix {getSortIcon("price")}
              </th>
              <th onClick={() => handleSort("status")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Statut {getSortIcon("status")}
              </th>
              <th onClick={() => handleSort("actions")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Actions {getSortIcon("actions")}
              </th>
              <th onClick={() => handleSort("acquisitionChannel")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Canal acquisition {getSortIcon("acquisitionChannel")}
              </th>
              <th onClick={() => handleSort("deviceType")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Type appareil {getSortIcon("deviceType")}
              </th>
              <th onClick={() => handleSort("clientType")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Type client {getSortIcon("clientType")}
              </th>
              <th onClick={() => handleSort("year")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Année {getSortIcon("year")}
              </th>
              <th onClick={() => handleSort("month")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Mois {getSortIcon("month")}
              </th>
              <th onClick={() => handleSort("day")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Jour {getSortIcon("day")}
              </th>
              <th onClick={() => handleSort("hour")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Heure {getSortIcon("hour")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price}€</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === "Panier récupéré" ? "bg-green-100 text-green-800" :
                      item.status === "Abandonné" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.actions || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.acquisitionChannel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.deviceType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.clientType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.day}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.hour}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={15} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun résultat trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
