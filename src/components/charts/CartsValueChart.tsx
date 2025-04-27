
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
          activeStatus === 'Abandonné' ? 'rgba(234, 56, 76, 0.9)' : 'rgba(255, 99, 132, 0.6)',
          activeStatus === 'Panier récupéré' ? 'rgba(75, 250, 192, 0.9)' : 'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          activeStatus === 'Abandonné' ? 'rgb(234, 56, 76)' : 'rgb(255, 99, 132)',
          activeStatus === 'Panier récupéré' ? 'rgb(75, 250, 192)' : 'rgb(75, 192, 192)'
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
    <div className="w-full h-56">
      <Bar data={data} options={options as any} />
    </div>
  );
};

export default CartsValueChart;
