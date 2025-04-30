import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../components/admin/AdminNavbar';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminStatistics = () => {
  const [stats, setStats] = useState({
    bookingsPerMonth: [],
    carTypes: [],
    frequentSlots: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:5000/admin/stats', {
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
  }, [navigate, token]);

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
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            System Statistics
          </h2>

          {loading ? (
            <div className="text-center text-gray-500">Loading statistics...</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Bookings per Month */}
              <div className="bg-white shadow-md rounded-md p-6 w-full">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Bookings per Month
                </h3>
                {stats.bookingsPerMonth.length > 0 ? (
                  <div className="h-[450px]">
                    <Bar
                      data={bookingsPerMonthData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: { ...chartOptions.plugins.title, text: 'Last 12 Months' },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No booking data available.</p>
                )}
              </div>

              {/* Car Types */}
              <div className="bg-white shadow-md rounded-md p-6 w-full">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Car Types Booked</h3>
                {stats.carTypes.length > 0 ? (
                  <div className="h-[450px]">
                    <Pie
                      data={carTypesData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: { ...chartOptions.plugins.title, text: 'Car Types Distribution' },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No car type data available.</p>
                )}
              </div>

              {/* Frequent Slots */}
              <div className="bg-white shadow-md rounded-md p-6 w-full">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Frequently Booked Slots
                </h3>
                {stats.frequentSlots.length > 0 ? (
                  <div className="h-[450px]">
                    <Bar
                      data={frequentSlotsData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: { ...chartOptions.plugins.title, text: 'Top 5 Slots' },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No slot data available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminStatistics;