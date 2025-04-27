import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AbandonRateChartProps {
  data: any[];
  onMonthClick?: (month: number) => void;
  activeMonth?: number;
}

const AbandonRateChart = ({ data, onMonthClick, activeMonth }: AbandonRateChartProps) => {
  const calculateMonthlyRates = () => {
    const monthlyData: Record<number, { abandoned: number, recovered: number }> = {};
    
    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = { abandoned: 0, recovered: 0 };
    }
    
    data.forEach(item => {
      const month = item.month;
      if (item.status === "Abandonné") {
        monthlyData[month].abandoned++;
      } else if (item.status === "Panier récupéré") {
        monthlyData[month].recovered++;
      }
    });
    
    const rates = [];
    const monthNames = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
    ];
    
    for (let i = 1; i <= 12; i++) {
      const totalCarts = monthlyData[i].abandoned + monthlyData[i].recovered;
      const rate = totalCarts > 0 ? 
        (monthlyData[i].abandoned / totalCarts) * 100 : 0;
      
      rates.push({
        month: monthNames[i-1],
        monthNumber: i,
        rate: Math.round(rate)
      });
    }
    
    return rates;
  };

  const monthlyRates = calculateMonthlyRates();
  
  const chartData = {
    labels: monthlyRates.map(item => item.month),
    datasets: [
      {
        label: "Taux d'abandon (%)",
        data: monthlyRates.map(item => item.rate),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        pointBackgroundColor: monthlyRates.map(item => 
          item.monthNumber === activeMonth 
            ? '#FF1A75'
            : '#8B5CF6'
        ),
        pointBorderColor: monthlyRates.map(item => 
          item.monthNumber === activeMonth 
            ? '#fff' 
            : '#fff'
        ),
        pointBorderWidth: monthlyRates.map(item => 
          item.monthNumber === activeMonth 
            ? 3 
            : 2
        ),
        pointRadius: monthlyRates.map(item => 
          item.monthNumber === activeMonth 
            ? 6 
            : 4
        ),
        tension: 0.3,
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
        max: 100,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        grid: {
          display: false
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
              label += context.parsed.y.toFixed(1) + '%';
            }
            return label;
          }
        }
      }
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0 && onMonthClick) {
        const index = elements[0].index;
        const monthNumber = monthlyRates[index].monthNumber;
        onMonthClick(monthNumber);
      }
    }
  };

  return (
    <div className="w-full h-48">
      <Line data={chartData} options={options as any} />
    </div>
  );
};

export default AbandonRateChart;
