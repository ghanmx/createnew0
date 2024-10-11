import React, { useState, useEffect } from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch analytics data from your backend
    // This is a placeholder. Replace with actual API call.
    const fetchData = async () => {
      // const response = await fetch('/api/analytics');
      // const result = await response.json();
      const result = {
        totalBookings: 1500,
        totalRevenue: 75000,
        averageRating: 4.7,
        bookingsPerDay: [10, 15, 20, 18, 25, 30, 28],
        revenuePerDay: [500, 750, 1000, 900, 1250, 1500, 1400],
      };
      setData(result);
    };

    fetchData();
  }, []);

  if (!data) return <Box>Loading...</Box>;

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bookings',
        data: data.bookingsPerDay,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Revenue',
        data: data.revenuePerDay,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box>
      <Heading mb={6}>Analytics Dashboard</Heading>
      <SimpleGrid columns={3} spacing={10} mb={10}>
        <Stat>
          <StatLabel>Total Bookings</StatLabel>
          <StatNumber>{data.totalBookings}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Revenue</StatLabel>
          <StatNumber>${data.totalRevenue}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            28.14%
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Average Rating</StatLabel>
          <StatNumber>{data.averageRating}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            5.38%
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      <Box>
        <Heading size="md" mb={4}>Bookings and Revenue Trend</Heading>
        <Line data={chartData} />
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;