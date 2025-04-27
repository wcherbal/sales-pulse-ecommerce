
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
}

const DeviceAbandonChart = ({ data }: DeviceAbandonChartProps) => {
  // Group data by device type
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
  
  const chartData = {
    labels: ['Mobile', 'Desktop', 'Tablette'],
    datasets: [
      {
        label: "Taux d'abandon (%)",
        data: rates,
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
        ],
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
    }
  };

  return (
    <div className="w-full h-56">
      <Bar data={chartData} options={options as any} />
    </div>
  );
};

export default DeviceAbandonChart;
