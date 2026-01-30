/**
 * DatabaseViewer Component
 * Displays database contents in a professional table format
 */

import React, { useState, useEffect } from 'react';
import { databaseAPI } from '../api';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';

const DatabaseViewer = () => {
    const [databaseData, setDatabaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTable, setActiveTable] = useState('patients');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        loadDatabase();
    }, []);

    const loadDatabase = async () => {
        try {
            setLoading(true);
            setNotification(null);
            const response = await databaseAPI.getView();
            
            if (response.data) {
                setDatabaseData(response.data);
                
                // Show warnings if any
                if (response.data.warnings && response.data.warnings.length > 0) {
                    setNotification({ 
                        message: `Loaded with warnings: ${response.data.warnings.join('; ')}`, 
                        type: 'warning' 
                    });
                } else {
                    setNotification({ 
                        message: 'Database loaded successfully', 
                        type: 'success' 
                    });
                    setTimeout(() => setNotification(null), 3000);
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error loading database:', error);
            let errorMessage = 'Failed to load database';
            
            if (error.response) {
                errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
                if (error.response.data?.details) {
                    errorMessage += '. ' + error.response.data.details;
                }
            } else if (error.userMessage) {
                errorMessage = error.userMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setNotification({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const formatValue = (value) => {
        if (value === null || value === undefined) return <span className="text-gray-400 italic">null</span>;
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'string' && value.length > 50) {
            return <span title={value}>{value.substring(0, 50)}...</span>;
        }
        return value;
    };

    const getTableIcon = (tableName) => {
        const icons = {
            patients: '👤',
            doctors: '👨‍⚕️',
            operation_theaters: '🏥',
            operations: '📋',
        };
        return icons[tableName] || '📊';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
                <LoadingSpinner size="lg" text="Loading database..." />
            </div>
        );
    }

    if (!databaseData && !loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium mb-2">Failed to load database</p>
                    <p className="text-gray-400 text-sm mb-4">Please ensure the backend server is running</p>
                    <button
                        onClick={loadDatabase}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const tables = Object.keys(databaseData.tables);
    const currentTable = databaseData.tables[activeTable];

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(databaseData.summary).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-primary-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-sm text-gray-600 font-medium mb-1 capitalize">
                            {key.replace(/_/g, ' ')}
                        </div>
                        <div className="text-3xl font-bold text-primary-600">{value}</div>
                    </div>
                ))}
            </div>

            {/* Table Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    Database Tables
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                    {tables.map((table) => (
                        <button
                            key={table}
                            onClick={() => setActiveTable(table)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                activeTable === table
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span className="mr-2">{getTableIcon(table)}</span>
                            {table.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            <span className="ml-2 text-xs opacity-75">
                                ({databaseData.tables[table].count})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Table Schema removed as requested */}

                {/* Table Data */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    {currentTable.data.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50">
                            <p className="text-gray-500">No data in this table</p>
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    {currentTable.schema.map((col) => (
                                        <th
                                            key={col.cid}
                                            className="border border-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-sm"
                                        >
                                            {col.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentTable.data.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100"
                                    >
                                        {currentTable.schema.map((col) => (
                                            <td
                                                key={col.cid}
                                                className="border border-gray-200 px-4 py-3 text-sm text-gray-700"
                                            >
                                                {formatValue(row[col.name])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Table Info */}
                <div className="mt-4 text-sm text-gray-600 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {currentTable.count} {currentTable.count === 1 ? 'record' : 'records'}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                        {currentTable.schema.length} columns
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DatabaseViewer;

