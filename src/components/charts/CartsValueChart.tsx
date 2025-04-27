
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

interface CartsValueChartProps {
  abandonedValue: number;
  recoveredValue: number;
  onStatusClick?: (status: string) => void;
  activeStatus?: string;
}

const CartsValueChart = ({ abandonedValue, recoveredValue, onStatusClick, activeStatus }: CartsValueChartProps) => {
  const statuses = ['Abandonné', 'Panier récupéré'];
  
  const data = {
    labels: ['Paniers abandonnés', 'Paniers récupérés'],
    datasets: [
      {
        label: 'Valeur (€)',
        data: [abandonedValue, recoveredValue],
        backgroundColor: [
          activeStatus === 'Abandonné' ? '#FF1A75' : '#FF4D94',
          activeStatus === 'Panier récupéré' ? '#00E5B7' : '#00FFB3'
        ],
        borderColor: [
          activeStatus === 'Abandonné' ? '#FF1A75' : '#FF4D94',
          activeStatus === 'Panier récupéré' ? '#00E5B7' : '#00FFB3'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valeur (€)'
        }
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
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0 && onStatusClick) {
        const index = elements[0].index;
        const status = statuses[index];
        onStatusClick(status);
      }
    }
  };

  return (
    <div className="w-full h-48">
      <Bar data={data} options={options as any} />
    </div>
  );
};

export default CartsValueChart;
