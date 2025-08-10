import { Metadata } from 'next';
import InventoryManagement from '@/components/dashboard/InventoryManagement';

export const metadata: Metadata = {
  title: 'Inventory Management | Dhanvantari Ayurveda',
  description: 'Manage Ayurvedic medicines, herbs, and medical supplies inventory',
};

export default function InventoryPage() {
  return <InventoryManagement />;
}
