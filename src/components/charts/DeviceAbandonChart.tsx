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

interface DeviceAbandonChartProps {
  data: any[];
  onDeviceClick?: (device: string) => void;
  activeDevice?: string;
}

const DeviceAbandonChart = ({ data, onDeviceClick, activeDevice }: DeviceAbandonChartProps) => {
  const calculateData = () => {
    const deviceTypes = ["Mobile", "Desktop", "Tablette"];
    const rates = [];
    
    for (const deviceType of deviceTypes) {
      const deviceItems = data.filter(item => item.deviceType === deviceType);
      const abandoned = deviceItems.filter(item => item.status === "Abandonné").length;
      const total = deviceItems.filter(item => 
        item.status === "Abandonné" || item.status === "Panier récupéré"
      ).length;
      
      const rate = total > 0 ? (abandoned / total) * 100 : 0;
      rates.push(rate);
    }
    
    return rates;
  };

  const rates = calculateData();
  const deviceTypes = ["Mobile", "Desktop", "Tablette"];
  
  const chartData = {
    labels: deviceTypes,
    datasets: [
      {
        label: "Taux d'abandon (%)",
        data: rates,
        backgroundColor: deviceTypes.map(device => 
          device === activeDevice 
            ? '#D946EF' 
            : '#F97316'
        ),
        borderColor: deviceTypes.map(device => 
          device === activeDevice 
            ? '#D946EF' 
            : '#F97316'
        ),
        borderWidth: 1
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Taux d'abandon (%)"
        },
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += context.parsed.x.toFixed(1) + '%';
            }
            return label;
          }
        }
      }
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0 && onDeviceClick) {
        const index = elements[0].index;
        const deviceType = deviceTypes[index];
        onDeviceClick(deviceType);
      }
    }
  };

  return (
    <div className="w-full h-56">
      <Bar data={chartData} options={options as any} />
    </div>
  );
};

export default DeviceAbandonChart;
