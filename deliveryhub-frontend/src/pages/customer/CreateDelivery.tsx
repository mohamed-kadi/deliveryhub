import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateDeliveryRequest } from '../../types';
import { deliveryAPI } from '../../services/api';
import { Package, MapPin, Weight, CreditCard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateDelivery: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateDeliveryRequest>({
    pickupAddress: '',
    dropoffAddress: '',
    weight: 0,
    description: '',
    paymentMethod: 'COD',
  });

  const paymentMethods = [
    { value: 'COD', label: 'Cash on Delivery', description: 'Pay when package is delivered' },
    { value: 'PAYPAL', label: 'PayPal', description: 'Pay online with PayPal' },
    { value: 'STRIPE', label: 'Credit Card', description: 'Pay online with credit/debit card' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.pickupAddress.trim()) {
      setError('Pickup address is required');
      return;
    }
    if (!formData.dropoffAddress.trim()) {
      setError('Drop-off address is required');
      return;
    }
    if (formData.weight <= 0) {
      setError('Weight must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      await deliveryAPI.create(formData);
      navigate('/deliveries', { 
        state: { message: 'Delivery request created successfully!' }
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create delivery request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link
          to="/deliveries"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Deliveries
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-full">
            <Package className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Delivery</h1>
            <p className="text-gray-600">Send your package from Europe to Morocco</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup Address */}
          <div>
            <label htmlFor="pickupAddress" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Pickup Address (Europe)
            </label>
            <input
              type="text"
              id="pickupAddress"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter pickup address in Europe"
            />
          </div>

          {/* Drop-off Address */}
          <div>
            <label htmlFor="dropoffAddress" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Drop-off Address (Morocco)
            </label>
            <input
              type="text"
              id="dropoffAddress"
              name="dropoffAddress"
              value={formData.dropoffAddress}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter delivery address in Morocco"
            />
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Weight className="h-4 w-4 mr-2" />
              Package Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight || ''}
              onChange={handleInputChange}
              required
              min="0.1"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter package weight in kg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Pricing varies by transporter. You'll see exact costs when a transporter accepts.
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 mr-2" />
              Package Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe your package contents (optional)"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Method
            </label>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.paymentMethod === method.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={formData.paymentMethod === method.value}
                    onChange={handleInputChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{method.label}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Important Information:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your delivery request will be visible to approved transporters</li>
              <li>• You'll be notified when a transporter accepts your request</li>
              <li>• You can chat with your assigned transporter for updates</li>
              <li>• Payment amount will be calculated based on the transporter's rates</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link
              to="/deliveries"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Delivery Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDelivery;