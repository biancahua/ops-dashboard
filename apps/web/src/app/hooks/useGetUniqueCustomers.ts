import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ConversationSummary } from '../components/ConversationListItem';

// api function to fetch customer journey
const fetchUniqueCustomers = async (limit?: number): Promise<ConversationSummary[]> => {
  try {
    const url = limit 
      ? `http://localhost:3002/messages/unique-customers?limit=${limit}`
      : `http://localhost:3002/messages/unique-customers`;
    
    const response = await axios.get(url);
    const customers = response.data;

    return customers;
  } catch (error) {
    console.error('Error fetching all messages:', error);
    throw new Error('Failed to fetch all messages');
  }
};

// hook 
export const useUniqueCustomers = (limit?: number) => {
  return useQuery({
    queryKey: ['uniqueCustomers', limit],
    queryFn: () => fetchUniqueCustomers(limit),
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}; 
