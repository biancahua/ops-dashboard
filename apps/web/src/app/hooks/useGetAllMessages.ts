import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ConversationSummary } from '../components/ConversationListItem';

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
const fetchAllMessages = async (): Promise<CustomerMessage[]> => {
  try {
    const response = await axios.get(`http://localhost:3002/messages`);
    const messages = response.data;

    return messages
  } catch (error) {
    console.error('Error fetching all messages:', error);
    throw new Error('Failed to fetch all messages');
  }
};

// hook
export const useAllMessages = () => {
  return useQuery({
    queryKey: ['allMessages'],
    queryFn: () => fetchAllMessages(),
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}; 

export const getUniqueCustomers = (messages: CustomerMessage[]): ConversationSummary[] => {
  return messages.reduce((acc: ConversationSummary[], message: CustomerMessage) => {
    if (!acc.some(customer => customer.phone === message.phone)) {
      acc.push({
        phone: message.phone,
        lastMessage: message.content,
        status: message.status,
        timestamp: message.timestamp,
        job_type: message.job_type,
        messageCount: 1
      });
    }
    return acc;
  }, []);
};