import Dashboard from '../../components/dashboard/Dashboard';
import ProtectedRoute from '../../components/common/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}