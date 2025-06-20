'use client';

import React from 'react';
import { Spin } from 'antd';

interface LoadingPageProps {
  isLoading?: boolean;
}

export function LoadingPage({ isLoading = false }: LoadingPageProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <Spin size="large" />
        <div className="mt-4 text-lg font-medium text-gray-700">
          Loading Dashboard...
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Please wait while we fetch your data
        </div>
      </div>
    </div>
  );
}
