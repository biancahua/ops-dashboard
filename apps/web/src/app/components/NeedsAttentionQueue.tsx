'use client';

import React from 'react';
import { useNeedsAttentionQueue } from '../hooks/useNeedsAttentionQueue';
import Link from 'next/link';
import { getUrgencyColor, getUrgencyLabel, formatTimestamp } from '../utils/utils';

export default function NeedsAttentionQueue() {
  const { 
    data: messages, 
    isLoading, 
    error, 
    isError 
  } = useNeedsAttentionQueue();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="text-red-600">
          <h3 className="text-lg font-semibold mb-2">Error Loading Queue</h3>
          <p className="text-sm">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Needs Attention Queue</h2>
        <p className="text-gray-500">No conversations currently need attention.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Needs Attention Queue</h2>
        <span className="text-sm text-gray-500">{messages.length} conversations</span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.slice(0, 5).map((message) => (
          <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {message.phone}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(message.urgency, 'component')}`}>
                    {getUrgencyLabel(message.urgency)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {message.content}
                </p>
                
                {message.reason && (
                  <p className="text-xs text-gray-500">
                    Reason: {message.reason}
                  </p>
                )}
                
                {message.job_type && (
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mr-2">
                    {message.job_type}
                  </span>
                )}
              </div>
              
              <Link
                href={`/customer-journey/${message.phone}`}
                className="text-sm text-gray-400 cursor-not-allowed pointer-events-none font-medium"
                onClick={(e) => e.preventDefault()}
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {messages.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href="/needs-attention"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all {messages.length} conversations →
          </Link>
        </div>
      )}
    </div>
  );
} 
