import React, { useState, useEffect } from 'react';
import { Delivery } from '../../types';
import { deliveryAPI } from '../../services/api';
import { Package, MapPin, Weight, Clock, CreditCard, CheckCircle } from 'lucide-react';

const AvailableJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingJob, setAcceptingJob] = useState<number | null>(null);

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      const data = await deliveryAPI.getAvailableDeliveries();
      setJobs(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch available jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId: number) => {
    try {
      setAcceptingJob(jobId);
      await deliveryAPI.acceptDelivery(jobId);
      // Remove the accepted job from the list
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to accept job');
    } finally {
      setAcceptingJob(null);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'COD':
        return '💵';
      case 'PAYPAL':
        return '🏦';
      case 'STRIPE':
        return '💳';
      default:
        return '💰';
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
        <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
        <p className="text-gray-600">Find delivery opportunities and grow your business</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <Package className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Weight</p>
              <p className="text-3xl font-bold text-gray-900">
                {jobs.reduce((sum, job) => sum + job.weight, 0).toFixed(1)}kg
              </p>
            </div>
            <Weight className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Refresh Rate</p>
              <p className="text-3xl font-bold text-gray-900">Auto</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available</h3>
          <p className="text-gray-600 mb-6">
            There are currently no delivery requests waiting for transporters.
          </p>
          <button
            onClick={fetchAvailableJobs}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Package className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Delivery Request #{job.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Posted by {job.customer.fullName} • {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-green-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Pickup (Europe)</p>
                          <p className="text-gray-900">{job.pickupAddress}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-red-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Drop-off (Morocco)</p>
                          <p className="text-gray-900">{job.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Weight className="h-4 w-4" />
                      <span>{job.weight}kg</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CreditCard className="h-4 w-4" />
                      <span>{getPaymentMethodIcon(job.paymentMethod)} {job.paymentMethod}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(job.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {job.description && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Package Description:</p>
                      <p className="text-gray-900">{job.description}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Payment will be calculated based on your configured rates. 
                      Your rate per kg and fixed pricing for packages under your threshold will apply.
                    </p>
                  </div>
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => handleAcceptJob(job.id)}
                    disabled={acceptingJob === job.id}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {acceptingJob === job.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Accepting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept Job</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      {jobs.length > 0 && (
        <div className="text-center">
          <button
            onClick={fetchAvailableJobs}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableJobs;