import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import axios from 'axios';

interface NeedsAttentionMessage {
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
}

// api function to fetch needs attention queue
const fetchNeedsAttentionQueue = async (): Promise<NeedsAttentionMessage[]> => {
  try {
    const response = await axios.get('http://localhost:3002/messages');
    const allMessages = response.data;
    
    const needsAttentionMessages = allMessages.filter((message: NeedsAttentionMessage) => 
      message.status === 'blocked_needs_human'
    );
    
    console.log({
      loc: "useNeedsAttentionQueue",
      needsAttentionMessages
    })
    
    return needsAttentionMessages.sort((a: NeedsAttentionMessage, b: NeedsAttentionMessage) => {
      if (b.urgency !== a.urgency) {
        return b.urgency - a.urgency; 
      }
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(); 
    });
  } catch (error) {
    console.error('Error fetching needs attention queue:', error);
    throw new Error('Failed to fetch needs attention queue');
  }
};

// hook
export const useNeedsAttentionQueue = () => {
  const queryOptions = useMemo(() => ({
    queryKey: ['needsAttentionQueue'] as const,
    queryFn: fetchNeedsAttentionQueue,
    staleTime: 30 * 1000,
    refetchInterval: 10 * 1000,
    retry: 3,
  }), []);

  return useQuery(queryOptions);
}; 
