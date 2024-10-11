import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AnalyticsDashboard from '../AnalyticsDashboard';

// Mock the Chart.js library
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
}));

// Mock the react-chartjs-2 library
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
}));

describe('AnalyticsDashboard', () => {
  it('renders loading state initially', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders analytics data after loading', async () => {
    render(<AnalyticsDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Average Rating')).toBeInTheDocument();
      expect(screen.getByText('Bookings and Revenue Trend')).toBeInTheDocument();
    });
  });
});