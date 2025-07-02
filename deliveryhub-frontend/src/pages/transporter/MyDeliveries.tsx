import React, { useState, useEffect } from 'react';
import { Delivery } from '../../types';
import { deliveryAPI } from '../../services/api';
import { Package, Truck, Clock, CheckCircle, MapPin, MessageCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyDeliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchMyDeliveries();
  }, []);

  const fetchMyDeliveries = async () => {
    try {
      setLoading(true);
      const data = await deliveryAPI.getAssignedDeliveries();
      setDeliveries(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId: number, newStatus: string) => {
    try {
      setUpdatingStatus(deliveryId);
      const updatedDelivery = await deliveryAPI.updateStatus(deliveryId, newStatus);
      
      // Update the delivery in the list
      setDeliveries(deliveries.map(delivery => 
        delivery.id === deliveryId ? updatedDelivery : delivery
      ));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'PICKED_UP':
        return <Package className="h-5 w-5 text-orange-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP':
        return 'bg-orange-100 text-orange-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'ASSIGNED':
        return 'PICKED_UP';
      case 'PICKED_UP':
        return 'DELIVERED';
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'ASSIGNED':
        return 'Mark as Picked Up';
      case 'PICKED_UP':
        return 'Mark as Delivered';
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Deliveries</h1>
          <p className="text-gray-600">Manage your assigned delivery tasks</p>
        </div>
        <Link
          to="/jobs"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Find New Jobs
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 underline mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assigned</p>
              <p className="text-3xl font-bold text-gray-900">{deliveries.length}</p>
            </div>
            <Package className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Picked Up</p>
              <p className="text-3xl font-bold text-gray-900">
                {deliveries.filter(d => d.status === 'PICKED_UP').length}
              </p>
            </div>
            <Truck className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-3xl font-bold text-gray-900">
                {deliveries.filter(d => d.status === 'DELIVERED').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Weight</p>
              <p className="text-3xl font-bold text-gray-900">
                {deliveries.reduce((sum, d) => sum + d.weight, 0).toFixed(1)}kg
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      {deliveries.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries assigned</h3>
          <p className="text-gray-600 mb-6">
            You don't have any assigned deliveries yet. Check available jobs to get started.
          </p>
          <Link
            to="/jobs"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Find Available Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    {getStatusIcon(delivery.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        delivery.status
                      )}`}
                    >
                      {delivery.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      #{delivery.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-green-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Pickup</p>
                          <p className="text-gray-900">{delivery.pickupAddress}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-red-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Drop-off</p>
                          <p className="text-gray-900">{delivery.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span>Weight: {delivery.weight}kg</span>
                    <span>Payment: {delivery.paymentMethod}</span>
                    {delivery.totalAmount && (
                      <span>Amount: €{delivery.totalAmount}</span>
                    )}
                    <span>Customer: {delivery.customer.fullName}</span>
                  </div>

                  {delivery.description && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Package Description:</p>
                      <p className="text-gray-900">{delivery.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  {/* Status Update Button */}
                  {getNextStatus(delivery.status) && (
                    <button
                      onClick={() => handleStatusUpdate(delivery.id, getNextStatus(delivery.status)!)}
                      disabled={updatingStatus === delivery.id}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {updatingStatus === delivery.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          {getNextStatus(delivery.status) === 'PICKED_UP' ? (
                            <Package className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          <span>{getNextStatusLabel(delivery.status)}</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Chat Button */}
                  <Link
                    to={`/chat/${delivery.id}`}
                    className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat</span>
                  </Link>

                  {/* View Details Button */}
                  <Link
                    to={`/deliveries/${delivery.id}`}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Details</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDeliveries;