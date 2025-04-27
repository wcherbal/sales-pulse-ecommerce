
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

interface ChannelAbandonChartProps {
  data: any[];
}

const ChannelAbandonChart = ({ data }: ChannelAbandonChartProps) => {
  // Group data by acquisition channel
  const calculateData = () => {
    const channels = ["Email", "SEO", "Publicité payante", "Accès direct", "Réseaux sociaux"];
    const channelData = [];
    
    for (const channel of channels) {
      const channelItems = data.filter(item => item.acquisitionChannel === channel);
      const abandoned = channelItems.filter(item => item.status === "Abandonné").length;
      const total = channelItems.filter(item => 
        item.status === "Abandonné" || item.status === "Panier récupéré"
      ).length;
      
      const rate = total > 0 ? (abandoned / total) * 100 : 0;
      channelData.push({
        channel: channel,
        rate: rate
      });
    }
    
    // Sort by abandonment rate (highest to lowest)
    channelData.sort((a, b) => b.rate - a.rate);
    
    return channelData;
  };

  const channelData = calculateData();
  
  const chartData = {
    labels: channelData.map(item => item.channel),
    datasets: [
      {
        label: "Taux d'abandon (%)",
        data: channelData.map(item => item.rate),
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(153, 102, 255, 0.3)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgb(153, 102, 255)',
          'rgb(153, 102, 255)',
          'rgb(153, 102, 255)',
          'rgb(153, 102, 255)',
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

export default ChannelAbandonChart;
