import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/save-user`,
        { role: selectedRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await user.reload();

      if (selectedRole === 'NGO_MANAGER') {
        navigate('/ngo-form');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>

        <div className="space-y-4">
          <div
            onClick={() => setSelectedRole('STANDARD_USER')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedRole === 'USER'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-300'
            }`}
          >
            <h3 className="font-bold text-lg">🌱 User</h3>
            <p className="text-gray-600 text-sm">
              Plant trees and track your environmental impact
            </p>
          </div>

          <div
            onClick={() => setSelectedRole('NGO_MANAGER')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedRole === 'NGO'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            <h3 className="font-bold text-lg">🏢 NGO</h3>
            <p className="text-gray-600 text-sm">
              Verify plantations and manage campaigns
            </p>
          </div>
        </div>

        <button
          onClick={handleRoleSelection}
          disabled={!selectedRole || loading}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}