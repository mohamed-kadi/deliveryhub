import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { adminAPI } from '../../services/api';
import { User as UserIcon, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

const ManageTransporters: React.FC = () => {
  const [pendingTransporters, setPendingTransporters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingTransporters();
  }, []);

  const fetchPendingTransporters = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getPendingTransporters();
      setPendingTransporters(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch pending transporters');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transporterId: number) => {
    try {
      setProcessingId(transporterId);
      await adminAPI.approveTransporter(transporterId);
      setPendingTransporters(pendingTransporters.filter(t => t.id !== transporterId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to approve transporter');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (transporterId: number) => {
    try {
      setProcessingId(transporterId);
      await adminAPI.rejectTransporter(transporterId);
      setPendingTransporters(pendingTransporters.filter(t => t.id !== transporterId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to reject transporter');
    } finally {
      setProcessingId(null);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Transporters</h1>
        <p className="text-gray-600">Review and approve transporter applications</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-3xl font-bold text-gray-900">{pendingTransporters.length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Action Required</p>
              <p className="text-3xl font-bold text-gray-900">
                {pendingTransporters.length > 0 ? 'Yes' : 'No'}
              </p>
            </div>
            <UserIcon className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Pending Transporters List */}
      {pendingTransporters.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600 mb-6">
            There are no pending transporter applications to review.
          </p>
          <button
            onClick={fetchPendingTransporters}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Pending Applications</h2>
          {pendingTransporters.map((transporter) => (
            <div
              key={transporter.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Truck className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {transporter.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">{transporter.email}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {transporter.accountStatus}
                    </span>
                  </div>

                  {transporter.transporterInfo && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Pricing Information</p>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>Rate per kg: €{transporter.transporterInfo.ratePerKg}</p>
                          <p>Fixed price under threshold: €{transporter.transporterInfo.fixedPriceUnderThreshold}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Description</p>
                        <p className="mt-2 text-sm text-gray-600">
                          {transporter.transporterInfo.description || 'No description provided'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      📋 <strong>Review Required:</strong> Please verify the transporter's credentials 
                      and pricing information before approval.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => handleApprove(transporter.id)}
                    disabled={processingId === transporter.id}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {processingId === transporter.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleReject(transporter.id)}
                    disabled={processingId === transporter.id}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {processingId === transporter.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Guidelines */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">✅ Approve if:</h4>
            <ul className="space-y-1">
              <li>• Reasonable pricing structure</li>
              <li>• Professional description provided</li>
              <li>• Valid email address</li>
              <li>• Complete profile information</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">❌ Reject if:</h4>
            <ul className="space-y-1">
              <li>• Unrealistic pricing (too high/low)</li>
              <li>• Incomplete information</li>
              <li>• Suspicious or fake profile</li>
              <li>• Inappropriate content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTransporters;