import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
const BASE_URL = process.env.REACT_APP_API_URL || 'https://parking-management-system-6t4i.onrender.com';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminStatistics = () => {
  const [stats, setStats] = useState({
    bookingsPerMonth: [],
    carTypes: [],
    frequentSlots: [],
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin stats:', err);
        setLoading(false);
      });
  }, [token]);

  const bookingsPerMonthData = {
    labels: stats.bookingsPerMonth.map((m) => m.month),
    datasets: [
      {
        label: 'Bookings per Month',
        data: stats.bookingsPerMonth.map((m) => m.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const carTypesData = {
    labels: stats.carTypes.map((c) => c.type),
    datasets: [
      {
        label: 'Car Types',
        data: stats.carTypes.map((c) => c.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const frequentSlotsData = {
    labels: stats.frequentSlots.map((s) => s.slotNumber),
    datasets: [
      {
        label: 'Frequent Slots',
        data: stats.frequentSlots.map((s) => s.count),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">System Statistics</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading statistics...</div>
      ) : (
        <div className="grid gap-8">
          {/* Bookings per Month */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Bookings per Month (Last 12 Months)
            </h3>
            {stats.bookingsPerMonth.length > 0 ? (
              <Bar
                data={bookingsPerMonthData}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Bookings per Month' } } }}
              />
            ) : (
              <p className="text-gray-500 text-center">No booking data available.</p>
            )}
          </div>

          {/* Car Types */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Car Types Booked</h3>
            {stats.carTypes.length > 0 ? (
              <Pie
                data={carTypesData}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Car Types Distribution' } } }}
              />
            ) : (
              <p className="text-gray-500 text-center">No car type data available.</p>
            )}
          </div>

          {/* Frequent Slots */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Frequently Booked Slots</h3>
            {stats.frequentSlots.length > 0 ? (
              <Bar
                data={frequentSlotsData}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Top 5 Frequently Booked Slots' } } }}
              />
            ) : (
              <p className="text-gray-500 text-center">No slot data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatistics;