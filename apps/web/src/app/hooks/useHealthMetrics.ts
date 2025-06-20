import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface HealthMetrics {
  resolutionRate: number;
  escalationRate: number;
  avgTimeToBooking: number;
  needsAttentionCount: number;
}

// api function to fetch health metrics
const fetchHealthMetrics = async (): Promise<HealthMetrics> => {
  try {
    const response = await axios.get<HealthMetrics>('http://localhost:3002/messages/health-metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    throw new Error('Failed to fetch health metrics');
  }
};

// hook
export const useHealthMetrics = () => {
  return useQuery({
    queryKey: ['healthMetrics'],
    queryFn: fetchHealthMetrics,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
    retry: 3,
  });
};
