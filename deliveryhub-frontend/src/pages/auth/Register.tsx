import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Package, Mail, Lock, User, AlertCircle, Truck } from 'lucide-react';
import { RegisterRequest } from '../../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'TRANSPORTER',
    ratePerKg: '',
    fixedPriceUnderThreshold: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'TRANSPORTER' && (!formData.ratePerKg || !formData.fixedPriceUnderThreshold)) {
      setError('Please provide your pricing information');
      return;
    }

    setLoading(true);

    try {
      const registerData: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
      };

      if (formData.role === 'TRANSPORTER') {
        registerData.transporterInfo = {
          ratePerKg: parseFloat(formData.ratePerKg),
          fixedPriceUnderThreshold: parseFloat(formData.fixedPriceUnderThreshold),
          description: formData.description || undefined,
        };
      }

      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="CUSTOMER">Customer - I want to send packages</option>
                <option value="TRANSPORTER">Transporter - I want to deliver packages</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {formData.role === 'TRANSPORTER' && (
              <>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Transporter Information
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Set your pricing information (can be updated later)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ratePerKg" className="block text-sm font-medium text-gray-700">
                      Rate per KG (€)
                    </label>
                    <input
                      id="ratePerKg"
                      name="ratePerKg"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.ratePerKg}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="5.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="fixedPriceUnderThreshold" className="block text-sm font-medium text-gray-700">
                      Fixed Price (&lt;10kg) (€)
                    </label>
                    <input
                      id="fixedPriceUnderThreshold"
                      name="fixedPriceUnderThreshold"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.fixedPriceUnderThreshold}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="30.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Tell customers about your services..."
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                `Create ${formData.role === 'CUSTOMER' ? 'Customer' : 'Transporter'} Account`
              )}
            </button>
          </div>

          {formData.role === 'TRANSPORTER' && (
            <div className="rounded-md bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Transporter accounts require admin approval before you can start accepting deliveries.
              </p>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;