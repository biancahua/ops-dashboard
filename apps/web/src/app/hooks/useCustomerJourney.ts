import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface CustomerMessage {
  id: string;
  phone: number;
  sender_type: 'customer' | 'agent' | 'operator';
  content: string;
  status: string;
  reason: string | null;
  job_type: string | null;
  urgency: number;
  operator_id: string | null;
  timestamp: string;
  actions: Array<{
    type: string;
    result: string;
    error: string | null;
  }>;
}

// api function to fetch customer journey
const fetchCustomerJourney = async (phoneNumber: string): Promise<CustomerMessage[]> => {
  try {
    const response = await axios.get(`http://localhost:3002/messages?phone=${phoneNumber}`);
    const messages = response.data;

    return messages.sort((a: CustomerMessage, b: CustomerMessage) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error fetching customer journey:', error);
    throw new Error('Failed to fetch customer journey');
  }
};

// hook
export const useCustomerJourney = (phoneNumber?: string) => {
  return useQuery({
    queryKey: ['customerJourney', phoneNumber],
    queryFn: () => fetchCustomerJourney(phoneNumber!),
    enabled: !!phoneNumber,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}; 
