// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useHealthMetrics } from '../../hooks/useHealthMetrics';

// export default function HealthMetricsDisplay() {
//   const { 
//     data: metrics, 
//     isLoading, 
//     error, 
//     isError 
//   } = useHealthMetrics();

//   const [currentTime, setCurrentTime] = useState<string>('');

//   useEffect(() => {
//     setCurrentTime(new Date().toLocaleString());
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="animate-pulse">
//           <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-8 bg-gray-200 rounded"></div>
//             <div className="h-8 bg-gray-200 rounded"></div>
//             <div className="h-8 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
//         <div className="text-red-600">
//           <h3 className="text-lg font-semibold mb-2">Error Loading Metrics</h3>
//           <p className="text-sm">
//             {error instanceof Error ? error.message : 'An unexpected error occurred'}
//           </p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!metrics) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <p className="text-gray-500">No metrics available</p>
//       </div>
//     );
//   }

//   // Ensure all metrics values are numbers and have fallbacks
//   const resolutionRate = typeof metrics.resolutionRate === 'number' ? metrics.resolutionRate : 0;
//   const escalationRate = typeof metrics.escalationRate === 'number' ? metrics.escalationRate : 0;
//   const avgTimeToBooking = typeof metrics.avgTimeToBooking === 'number' ? metrics.avgTimeToBooking : 0;
//   const needsAttentionCount = typeof metrics.needsAttentionCount === 'number' ? metrics.needsAttentionCount : 0;

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="p-4 bg-blue-50 rounded-lg">
//           <p className="text-sm font-medium text-blue-600">AI Resolution Rate</p>
//           <p className="text-2xl font-bold text-blue-900">{(resolutionRate * 100).toFixed(1)}%</p>
//         </div>
//         <div className="p-4 bg-orange-50 rounded-lg">
//           <p className="text-sm font-medium text-orange-600">Escalation Rate</p>
//           <p className="text-2xl font-bold text-orange-900">{(escalationRate * 100).toFixed(1)}%</p>
//         </div>
//         <div className="p-4 bg-green-50 rounded-lg">
//           <p className="text-sm font-medium text-green-600">Avg Time to Booking</p>
//           <p className="text-2xl font-bold text-green-900">{avgTimeToBooking.toFixed(1)} min</p>
//         </div>
//         <div className="p-4 bg-red-50 rounded-lg">
//           <p className="text-sm font-medium text-red-600">Needs Attention</p>
//           <p className="text-2xl font-bold text-red-900">{needsAttentionCount}</p>
//         </div>
//       </div>
//       {currentTime && (
//         <p className="text-xs text-gray-500 mt-4">
//           Last updated: {currentTime}
//         </p>
//       )}
//     </div>
//   );
// } 
