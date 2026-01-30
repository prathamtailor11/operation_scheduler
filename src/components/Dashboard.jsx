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

const Dashboard = ({ user, onLoginClick }) => {
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showForm, setShowForm] = useState(false);
    const [editingOperation, setEditingOperation] = useState(null);
    const [activeTab, setActiveTab] = useState('timetable'); // 'timetable', 'list', or 'database'
    const [notification, setNotification] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 transform rotate-12 scale-150"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Notification */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Header */}
            <header className="bg-white/80 shadow-xl sticky top-0 z-40 backdrop-blur-lg border-b border-white/20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent tracking-tight">
                                    Hospital Operation Scheduler
                                </h1>
                                <p className="text-sm text-slate-600 font-medium">Advanced Surgical Management System</p>
                            </div>
                        </div>
                                                <div className="flex gap-4 items-center">
                                                        {user ? (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingOperation(null);
                                                                        setShowForm(true);
                                                                    }}
                                                                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3 font-semibold text-lg relative overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                >
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                                    <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                    <span className="relative z-10">Schedule Operation</span>
                                                                </button>
                                                                <button
                                                                    onClick={user.onLogout}
                                                                    className="px-6 py-2 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 rounded-lg font-semibold hover:from-gray-400 hover:to-gray-500 transition-all shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                >
                                                                    Logout
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={onLoginClick}
                                                                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-xl font-semibold text-lg shadow-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                            >
                                                                Login
                                                            </button>
                                                        )}
                                                </div>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10" style={{ marginTop: '32px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scale-in border border-white/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="text-sm text-slate-600 font-semibold mb-2">Total Operations</div>
                            <div className="text-4xl font-black text-slate-800 group-hover:text-slate-900 transition-colors">{stats.total}</div>
                            <div className="mt-2 text-xs text-slate-500">All time records</div>
                        </div>
                    </div>
                    <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scale-in border border-white/20 relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="text-sm text-slate-600 font-semibold mb-2">Scheduled</div>
                            <div className="text-4xl font-black text-blue-600 group-hover:text-blue-700 transition-colors">{stats.scheduled}</div>
                            <div className="mt-2 text-xs text-blue-500">Ready for surgery</div>
                        </div>
                    </div>
                    <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scale-in border border-white/20 relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="text-sm text-slate-600 font-semibold mb-2">In Progress</div>
                            <div className="text-4xl font-black text-yellow-600 group-hover:text-yellow-700 transition-colors">{stats.inProgress}</div>
                            <div className="mt-2 text-xs text-yellow-500">Currently active</div>
                        </div>
                    </div>
                    <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scale-in border border-white/20 relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="text-sm text-slate-600 font-semibold mb-2">Completed</div>
                            <div className="text-4xl font-black text-green-600 group-hover:text-green-700 transition-colors">{stats.completed}</div>
                            <div className="mt-2 text-xs text-green-500">Successfully done</div>
                        </div>
                    </div>
                    <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-scale-in border border-white/20 relative overflow-hidden lg:col-span-1" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="text-sm text-slate-600 font-semibold mb-2">Today's Ops</div>
                            <div className="text-4xl font-black text-purple-600 group-hover:text-purple-700 transition-colors">{stats.today}</div>
                            <div className="mt-2 text-xs text-purple-500">Scheduled today</div>
                        </div>
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
                                    user={user}
                                />
                            </div>
                        )}

                        {activeTab === 'database' && user?.role === 'doctor' && !isMobile && (
                            <div className="animate-fade-in">
                                <DatabaseViewer />
                            </div>
                        )}
                        {activeTab === 'database' && user?.role === 'doctor' && isMobile && (
                            <div className="text-center text-gray-500 font-semibold animate-fade-in">
                                Database Viewer is not available on mobile devices.
                            </div>
                        )}
                        {activeTab === 'database' && user?.role !== 'doctor' && (
                            <div className="text-center text-gray-500 font-semibold animate-fade-in">
                                Only doctors can access the Database Viewer.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

