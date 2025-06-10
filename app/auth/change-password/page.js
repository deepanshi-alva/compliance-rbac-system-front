import ChangePasswordForm from '../../../components/auth/ChangePasswordForm';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <ChangePasswordForm />
    </ProtectedRoute>
  );
}