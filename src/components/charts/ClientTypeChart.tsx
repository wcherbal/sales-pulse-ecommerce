import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ClientTypeChartProps {
  data: any[];
  onClientTypeClick?: (type: string) => void;
  activeClientType?: string;
}

const ClientTypeChart = ({ data, onClientTypeClick, activeClientType }: ClientTypeChartProps) => {
  const calculateData = () => {
    const newVisitors = data.filter(item => item.clientType === "Nouveau visiteur");
    const recurringClients = data.filter(item => item.clientType === "Client récurrent");
    
    const newVisitorAbandoned = newVisitors.filter(item => item.status === "Abandonné").length;
    const newVisitorTotal = newVisitors.filter(item => 
      item.status === "Abandonné" || item.status === "Panier récupéré"
    ).length;
    const newVisitorRate = newVisitorTotal > 0 ? 
      (newVisitorAbandoned / newVisitorTotal) * 100 : 0;
    
    const recurringAbandoned = recurringClients.filter(item => item.status === "Abandonné").length;
    const recurringTotal = recurringClients.filter(item => 
      item.status === "Abandonné" || item.status === "Panier récupéré"
    ).length;
    const recurringRate = recurringTotal > 0 ? 
      (recurringAbandoned / recurringTotal) * 100 : 0;
    
    return [newVisitorRate, recurringRate];
  };

  const rates = calculateData();
  const clientTypes = ['Nouveau visiteur', 'Client récurrent'];
  
  const chartData = {
    labels: clientTypes,
    datasets: [
      {
        label: "Taux d'abandon (%)",
        data: rates,
        backgroundColor: clientTypes.map(type => 
          type === activeClientType 
            ? '#8B5CF6' 
            : '#0EA5E9'
        ),
        borderColor: clientTypes.map(type => 
          type === activeClientType 
            ? '#8B5CF6' 
            : '#0EA5E9'
        ),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Taux d'abandon (%)"
        },
        max: 100
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + '%';
            }
            return label;
          }
        }
      },
      legend: {
        display: false
      }
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0 && onClientTypeClick) {
        const index = elements[0].index;
        const clientType = clientTypes[index];
        onClientTypeClick(clientType);
      }
    }
  };

  return (
    <div className="w-full h-48">
      <Bar data={chartData} options={options as any} />
    </div>
  );
};

export default ClientTypeChart;
