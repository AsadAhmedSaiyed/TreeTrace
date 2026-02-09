import { UserButton, useUser } from '@clerk/clerk-react';

export default function NGODashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">TreeTrace - NGO Panel</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">
          Welcome, {user?.firstName}!
        </h2>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="mb-2">
            <strong>Role:</strong> {user?.publicMetadata?.role}
          </p>
          <p>
            <strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Verifications</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Campaigns</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}