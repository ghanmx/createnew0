import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserManagement from '../UserManagement';

describe('UserManagement', () => {
  it('renders user table', async () => {
    render(<UserManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    render(<UserManagement />);
    
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