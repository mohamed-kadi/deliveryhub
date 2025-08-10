export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'CUSTOMER' | 'TRANSPORTER' | 'ADMIN';
  accountStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  transporterInfo?: TransporterInfo;
}

export interface TransporterInfo {
  id: number;
  ratePerKg: number;
  fixedPriceUnderThreshold: number;
  description?: string;
  rating?: number;
  completedDeliveries?: number;
}

export interface Delivery {
  id: number;
  pickupAddress: string;
  dropoffAddress: string;
  weight: number;
  description?: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'COD' | 'PAYPAL' | 'STRIPE';
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
  customer: User;
  transporter?: User;
}

export interface Message {
  id: number;
  content: string;
  fileName?: string;
  fileUrl?: string;
  sentAt: string;
  readAt?: string;
  sender: User;
  receiver: User;
  deliveryId: number;
}

export interface Rating {
  id: number;
  rating: number;
  feedback?: string;
  createdAt: string;
  delivery: Delivery;
  customer: User;
  transporter: User;
}

export interface PaymentSummary {
  deliveryId: number;
  baseAmount: number;
  additionalFees: number;
  totalAmount: number;
  paymentMethod: string;
  transporter: {
    name: string;
    ratePerKg: number;
    fixedPriceUnderThreshold: number;
  };
}

export interface DashboardStats {
  totalDeliveries: number;
  deliveryStatusStats: { [key: string]: number };
  topPickupCities: Array<{ city: string; count: number }>;
  topDropoffCities: Array<{ city: string; count: number }>;
  transporterPerformance: Array<{
    id: number;
    name: string;
    completedDeliveries: number;
    averageRating: number;
    reliabilityScore: number;
  }>;
  completionTimeStats: {
    averageHours: number;
    medianHours: number;
  };
  cancellationStats: { [key: string]: number };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'CUSTOMER' | 'TRANSPORTER';
  transporterInfo?: {
    ratePerKg: number;
    fixedPriceUnderThreshold: number;
    description?: string;
  };
}

export interface CreateDeliveryRequest {
  pickupAddress: string;
  dropoffAddress: string;
  weight: number;
  description?: string;
  paymentMethod: 'COD' | 'PAYPAL' | 'STRIPE';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>;
  loading: boolean;
}