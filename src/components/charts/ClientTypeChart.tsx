
import { useEffect, useRef } from 'react';
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
}

const ClientTypeChart = ({ data }: ClientTypeChartProps) => {
  // Group data by client type
  const calculateData = () => {
    const newVisitors = data.filter(item => item.clientType === "Nouveau visiteur");
    const recurringClients = data.filter(item => item.clientType === "Client récurrent");
    
    // Calculate abandonment rate for new visitors
    const newVisitorAbandoned = newVisitors.filter(item => item.status === "Abandonné").length;
    const newVisitorTotal = newVisitors.filter(item => 
      item.status === "Abandonné" || item.status === "Panier récupéré"
    ).length;
    const newVisitorRate = newVisitorTotal > 0 ? 
      (newVisitorAbandoned / newVisitorTotal) * 100 : 0;
    
    // Calculate abandonment rate for recurring clients
    const recurringAbandoned = recurringClients.filter(item => item.status === "Abandonné").length;
    const recurringTotal = recurringClients.filter(item => 
      item.status === "Abandonné" || item.status === "Panier récupéré"
    ).length;
    const recurringRate = recurringTotal > 0 ? 
      (recurringAbandoned / recurringTotal) * 100 : 0;
    
    return [newVisitorRate, recurringRate];
  };

  const rates = calculateData();
  
  const chartData = {
    labels: ['Nouveaux visiteurs', 'Clients récurrents'],
    datasets: [
      {
        label: "Taux d'abandon (%)",
        data: rates,
        backgroundColor: ['rgba(110, 64, 170, 0.6)', 'rgba(65, 84, 180, 0.6)'],
        borderColor: ['rgb(110, 64, 170)', 'rgb(65, 84, 180)'],
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
    }
  };

  return (
    <div className="w-full h-56">
      <Bar data={chartData} options={options as any} />
    </div>
  );
};

export default ClientTypeChart;
