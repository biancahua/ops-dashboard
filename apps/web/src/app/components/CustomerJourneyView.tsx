'use client';

import React from 'react';
import Link from 'next/link';
import { useUniqueCustomers } from '../hooks/useGetUniqueCustomers';
import { formatTimestamp } from '../utils/utils';

export default function CustomerJourneyView() {
  const { data: uniqueCustomers, isLoading: uniqueCustomersLoading } = useUniqueCustomers(10);

  if (uniqueCustomersLoading) {
      return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'text-green-600 bg-green-50';
      case 'blocked_needs_human':
        return 'text-red-600 bg-red-50';
      case 'declined':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'booked':
        return 'Booked';
      case 'blocked_needs_human':
        return 'Needs Help';
      case 'declined':
        return 'Declined';
      default:
        return 'Active';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Customer Conversations</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {uniqueCustomers?.map((conversation) => (
          <div 
            key={conversation.phone} 
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {conversation.phone}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conversation.status)}`}>
                    {getStatusLabel(conversation.status)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(conversation.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {conversation.lastMessage}
                </p>
                
                {conversation.job_type && (
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {conversation.job_type}
                  </span>
                )}
              </div>
              
              <Link
                href={`/customer-journey/${conversation.phone}`}
                className="text-sm text-blue-600 cursor-not-allowed pointer-events-none font-medium"
                onClick={(e) => e.preventDefault()}
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/customer-journey"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all conversations →
        </Link>
      </div>
    </div>
  );
} 
