/**
 * OperationCard Component
 * Displays a single operation in a card format with status badge
 */

import React from 'react';

const OperationCard = ({ operation, onStatusChange, onEdit, onDelete }) => {
    const getStatusColor = (status) => {
        const colors = {
            'Scheduled': 'bg-blue-100 text-blue-800',
            'In Progress': 'bg-yellow-100 text-yellow-800',
            'Completed': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-scale-in group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {operation.operation_type}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {operation.ot_number}
                    </p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(operation.status)}`}>
                    {operation.status}
                </span>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm bg-gray-50 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-semibold text-gray-600 w-20">Patient:</span>
                    <span className="text-gray-800 font-medium">{operation.patient_name}</span>
                    <span className="text-gray-500 ml-2">({operation.patient_age} yrs, {operation.patient_gender})</span>
                </div>
                <div className="flex items-center text-sm bg-gray-50 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold text-gray-600 w-20">Surgeon:</span>
                    <span className="text-gray-800 font-medium">{operation.doctor_name}</span>
                    <span className="text-gray-500 ml-2">({operation.doctor_specialization})</span>
                </div>
                {operation.anesthetist_name && (
                    <div className="flex items-center text-sm bg-gray-50 p-2 rounded-lg">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-gray-600 w-20">Anesthetist:</span>
                        <span className="text-gray-800 font-medium">{operation.anesthetist_name}</span>
                    </div>
                )}
                <div className="flex items-center text-sm bg-gray-50 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold text-gray-600 w-20">Date:</span>
                    <span className="text-gray-800 font-medium">{new Date(operation.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm bg-gray-50 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-gray-600 w-20">Time:</span>
                    <span className="text-gray-800 font-medium">
                        {formatTime(operation.start_time)} - {formatTime(operation.end_time)}
                    </span>
                </div>
                {operation.notes && (
                    <div className="flex items-start text-sm mt-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <svg className="w-4 h-4 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <div className="flex-1">
                            <span className="font-semibold text-gray-600 block mb-1">Notes:</span>
                            <span className="text-gray-800">{operation.notes}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
                {onStatusChange && operation.status !== 'Completed' && operation.status !== 'Cancelled' && (
                    <select
                        value={operation.status}
                        onChange={(e) => onStatusChange(operation.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white hover:bg-gray-50"
                    >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                )}
                {onEdit && (
                    <button
                        onClick={() => onEdit(operation)}
                        className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(operation.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default OperationCard;

