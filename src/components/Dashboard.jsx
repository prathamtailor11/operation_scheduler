/**
 * Dashboard Component
 * Main dashboard with OT schedule calendar and operation list
 */

import React, { useState, useEffect } from 'react';
import { operationsAPI } from '../api';
import OTTable from './OTTable';
import OperationList from './OperationList';
import ScheduleForm from './ScheduleForm';
import DatabaseViewer from './DatabaseViewer';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showForm, setShowForm] = useState(false);
    const [editingOperation, setEditingOperation] = useState(null);
    const [activeTab, setActiveTab] = useState('timetable'); // 'timetable', 'list', or 'database'
    const [notification, setNotification] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        loadOperations();
    }, []);

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const loadOperations = async (retry = false) => {
        try {
            setLoading(true);
            const response = await operationsAPI.getAll();
            setOperations(response.data);
            setRetryCount(0);
            if (retry) {
                showNotification('Operations loaded successfully', 'success');
            }
        } catch (error) {
            console.error('Error loading operations:', error);
            const errorMessage = error.userMessage || error.response?.data?.error || 'Failed to load operations';
            
            if (errorMessage.includes('Cannot connect') && retryCount < 3) {
                showNotification(`${errorMessage}. Retrying... (${retryCount + 1}/3)`, 'warning');
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    loadOperations(true);
                }, 2000);
            } else {
                showNotification(errorMessage, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingOperation(null);
        loadOperations();
    };

    const handleEdit = (operation) => {
        setEditingOperation(operation);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to cancel this operation?')) {
            try {
                await operationsAPI.delete(id);
                showNotification('Operation cancelled successfully', 'success');
                loadOperations();
            } catch (error) {
                console.error('Error deleting operation:', error);
                const errorMessage = error.userMessage || error.response?.data?.error || 'Failed to cancel operation';
                showNotification(errorMessage, 'error');
            }
        }
    };

    const getStats = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayOps = operations.filter(op => op.date === today);
        
        return {
            total: operations.length,
            scheduled: operations.filter(op => op.status === 'Scheduled').length,
            inProgress: operations.filter(op => op.status === 'In Progress').length,
            completed: operations.filter(op => op.status === 'Completed').length,
            today: todayOps.length,
        };
    };

    const stats = getStats();

    if (loading && operations.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
            {/* Notification */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Header */}
            <header className="bg-white shadow-lg sticky top-0 z-40 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex justify-between items-center animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Hospital Operation Scheduler
                            </h1>
                        </div>
                        <button
                            onClick={() => {
                                setEditingOperation(null);
                                setShowForm(true);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Schedule Operation
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in border-l-4 border-gray-400">
                        <div className="text-sm text-gray-600 font-medium mb-1">Total Operations</div>
                        <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in border-l-4 border-blue-500" style={{ animationDelay: '0.1s' }}>
                        <div className="text-sm text-gray-600 font-medium mb-1">Scheduled</div>
                        <div className="text-3xl font-bold text-blue-600">{stats.scheduled}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in border-l-4 border-yellow-500" style={{ animationDelay: '0.2s' }}>
                        <div className="text-sm text-gray-600 font-medium mb-1">In Progress</div>
                        <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in border-l-4 border-green-500" style={{ animationDelay: '0.3s' }}>
                        <div className="text-sm text-gray-600 font-medium mb-1">Completed</div>
                        <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in border-l-4 border-primary-500" style={{ animationDelay: '0.4s' }}>
                        <div className="text-sm text-gray-600 font-medium mb-1">Today's Operations</div>
                        <div className="text-3xl font-bold text-primary-600">{stats.today}</div>
                    </div>
                </div>

                {/* Schedule Form Modal */}
                {showForm && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
                        onClick={() => {
                            setShowForm(false);
                            setEditingOperation(null);
                        }}
                    >
                        <div 
                            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ScheduleForm
                                operation={editingOperation}
                                onSave={handleSave}
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditingOperation(null);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden animate-fade-in">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('timetable')}
                                className={`px-6 py-4 text-sm font-semibold border-b-3 transition-all duration-300 relative ${
                                    activeTab === 'timetable'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    OT Timetable
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`px-6 py-4 text-sm font-semibold border-b-3 transition-all duration-300 relative ${
                                    activeTab === 'list'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Operations List
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('database')}
                                className={`px-6 py-4 text-sm font-semibold border-b-3 transition-all duration-300 relative ${
                                    activeTab === 'database'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                    </svg>
                                    Database Viewer
                                </span>
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'timetable' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center gap-4 bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg border border-primary-100">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Select Date:
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                                    />
                                </div>
                                <OTTable selectedDate={selectedDate} />
                            </div>
                        )}

                        {activeTab === 'list' && (
                            <div className="animate-fade-in">
                                <OperationList
                                    operations={operations}
                                    onUpdate={loadOperations}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}

                        {activeTab === 'database' && (
                            <div className="animate-fade-in">
                                <DatabaseViewer />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

