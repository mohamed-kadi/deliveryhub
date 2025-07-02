import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, Truck, Users, BarChart3, Clock, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'CUSTOMER':
        return {
          title: `Welcome back, ${user.fullName}!`,
          subtitle: 'Manage your deliveries and track packages',
          icon: Package,
        };
      case 'TRANSPORTER':
        return {
          title: `Welcome back, ${user.fullName}!`,
          subtitle: 'View available jobs and manage your deliveries',
          icon: Truck,
        };
      case 'ADMIN':
        return {
          title: `Admin Dashboard - ${user.fullName}`,
          subtitle: 'Manage transporters and view analytics',
          icon: Users,
        };
      default:
        return {
          title: 'Welcome to DeliveryHub!',
          subtitle: 'Your delivery management platform',
          icon: Package,
        };
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'CUSTOMER':
        return [
          {
            title: 'Create New Delivery',
            description: 'Send a package to Morocco',
            icon: Package,
            href: '/deliveries/create',
            color: 'bg-primary-600',
          },
          {
            title: 'Track Deliveries',
            description: 'Monitor your packages',
            icon: Clock,
            href: '/deliveries',
            color: 'bg-green-600',
          },
        ];
      case 'TRANSPORTER':
        if (user.accountStatus !== 'APPROVED') {
          return [
            {
              title: 'Account Pending',
              description: 'Waiting for admin approval',
              icon: Clock,
              href: '#',
              color: 'bg-yellow-600',
            },
          ];
        }
        return [
          {
            title: 'Available Jobs',
            description: 'Find delivery opportunities',
            icon: Package,
            href: '/jobs',
            color: 'bg-primary-600',
          },
          {
            title: 'My Deliveries',
            description: 'Manage assigned deliveries',
            icon: Truck,
            href: '/transporter/deliveries',
            color: 'bg-green-600',
          },
          {
            title: 'Messages',
            description: 'Chat with customers',
            icon: BarChart3,
            href: '/messages',
            color: 'bg-blue-600',
          },
        ];
      case 'ADMIN':
        return [
          {
            title: 'Manage Transporters',
            description: 'Approve/reject applications',
            icon: Users,
            href: '/admin/transporters',
            color: 'bg-primary-600',
          },
          {
            title: 'Analytics',
            description: 'View platform statistics',
            icon: BarChart3,
            href: '/admin/analytics',
            color: 'bg-green-600',
          },
        ];
      default:
        return [];
    }
  };

  const welcome = getWelcomeMessage();
  const quickActions = getQuickActions();
  const WelcomeIcon = welcome.icon;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <WelcomeIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{welcome.title}</h1>
            <p className="text-primary-100 text-lg">{welcome.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Account Status for Transporters */}
      {user?.role === 'TRANSPORTER' && user.accountStatus !== 'APPROVED' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                Account Under Review
              </h3>
              <p className="text-yellow-700">
                Your transporter account is pending approval. You'll be able to accept deliveries once approved by an administrator.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <a
                key={index}
                href={action.href}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${action.color} p-3 rounded-full text-white`}>
                    <ActionIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-gray-600">{action.description}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-center text-gray-500 py-8">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No recent activity</p>
            <p className="text-sm">Your recent deliveries and updates will appear here</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards (for future implementation) */}
      {user?.role === 'ADMIN' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                  <p className="text-3xl font-bold text-gray-900">--</p>
                </div>
                <Package className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Transporters</p>
                  <p className="text-3xl font-bold text-gray-900">--</p>
                </div>
                <Truck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-3xl font-bold text-gray-900">--</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;