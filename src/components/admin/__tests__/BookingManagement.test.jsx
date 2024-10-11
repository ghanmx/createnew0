import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingManagement from '../BookingManagement';

describe('BookingManagement', () => {
  it('renders booking table', async () => {
    render(<BookingManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Customer Name')).toBeInTheDocument();
      expect(screen.getByText('Service')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    render(<BookingManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Previous'));
    
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    });
  });
});