import { useAuth } from './context/AuthContext';

export default function JobRequestForm() {
  const { user } = useAuth();
  // ... existing code ...
} 