import React from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import UserManagement from '../components/admin/UserManagement';
import BookingManagement from '../components/admin/BookingManagement';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import { withAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
  return (
    <Box p={4}>
      <Tabs>
        <TabList>
          <Tab>User Management</Tab>
          <Tab>Booking Management</Tab>
          <Tab>Analytics Dashboard</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <UserManagement />
          </TabPanel>
          <TabPanel>
            <BookingManagement />
          </TabPanel>
          <TabPanel>
            <AnalyticsDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default withAuth(AdminPanel);
