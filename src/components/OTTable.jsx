/**
 * OTTable Component
 * Displays daily/weekly timetable view for Operation Theaters
 */

import React, { useState, useEffect } from 'react';
import { operationsAPI, operationTheatersAPI } from '../api';

const OTTable = ({ selectedDate }) => {
    const [operations, setOperations] = useState([]);
    const [operationTheaters, setOperationTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'

    useEffect(() => {
        loadData();
    }, [selectedDate, viewMode]);

    const loadData = async () => {
        try {
            setLoading(true);
            const date = selectedDate || new Date().toISOString().split('T')[0];
            
            // For weekly view, load all operations and filter client-side
            // For daily view, filter by date on server
            const [opsRes, otsRes] = await Promise.all([
                operationsAPI.getAll(viewMode === 'daily' ? { date } : {}),
                operationTheatersAPI.getAll({ status: 'Available' }),
            ]);

            setOperations(opsRes.data);
            setOperationTheaters(otsRes.data);
        } catch (error) {
            console.error('Error loading OT table data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOperationsForOT = (otId, date) => {
        return operations.filter(op => 
            op.ot_id === otId && 
            op.date === date && 
            op.status !== 'Cancelled'
        );
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes}${ampm}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            'Scheduled': 'bg-blue-500',
            'In Progress': 'bg-yellow-500',
            'Completed': 'bg-green-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 18; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    };

    const getDatesForWeek = () => {
        const dates = [];
        const startDate = new Date(selectedDate || new Date());
        const dayOfWeek = startDate.getDay();
        const diff = startDate.getDate() - dayOfWeek;
        const monday = new Date(startDate.setDate(diff));
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    const datesToShow = viewMode === 'daily' 
        ? [selectedDate || new Date().toISOString().split('T')[0]]
        : getDatesForWeek();

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <div className="text-gray-500 font-medium">Loading timetable...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fade-in">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
                    <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Operation Theater Timetable
                </h2>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('daily')}
                        className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                            viewMode === 'daily'
                                ? 'bg-white text-primary-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setViewMode('weekly')}
                        className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                            viewMode === 'weekly'
                                ? 'bg-white text-primary-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Weekly
                    </button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-inner">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <th className="border border-gray-200 px-4 py-4 text-left font-bold text-gray-700 sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10">
                                OT / Date
                            </th>
                            {datesToShow.map(date => (
                                <th
                                    key={date}
                                    className="border border-gray-200 px-4 py-4 text-center font-bold text-gray-700 min-w-[200px] bg-white"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-normal">
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className="text-sm">
                                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {operationTheaters.map(ot => (
                            <tr key={ot.id} className="hover:bg-blue-50 transition-colors duration-200">
                                <td className="border border-gray-200 px-4 py-4 font-bold text-gray-800 sticky left-0 bg-white z-10 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-block w-3 h-3 rounded-full ${
                                            ot.status === 'Available' ? 'bg-green-500 animate-pulse-slow' : 'bg-red-500'
                                        }`}></span>
                                        {ot.ot_number}
                                    </div>
                                </td>
                                {datesToShow.map(date => {
                                    const otOperations = getOperationsForOT(ot.id, date);
                                    return (
                                        <td key={date} className="border border-gray-200 px-2 py-3 align-top bg-gray-50/50">
                                            <div className="space-y-2">
                                                {otOperations.length === 0 ? (
                                                    <div className="text-xs text-gray-400 text-center py-3 bg-gray-100 rounded-lg">
                                                        Available
                                                    </div>
                                                ) : (
                                                    otOperations.map(op => (
                                                        <div
                                                            key={op.id}
                                                            className={`${getStatusColor(op.status)} text-white p-3 rounded-lg text-xs shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer animate-scale-in`}
                                                            title={`${op.operation_type} - ${op.patient_name}`}
                                                        >
                                                            <div className="font-bold truncate mb-1">{op.operation_type}</div>
                                                            <div className="text-xs opacity-95 font-medium mb-1">
                                                                {formatTime(op.start_time)} - {formatTime(op.end_time)}
                                                            </div>
                                                            <div className="text-xs opacity-90 truncate">{op.patient_name}</div>
                                                            <div className="text-xs opacity-80 truncate">{op.doctor_name}</div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-6">
                {operationTheaters.map(ot => (
                    <div key={ot.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                            <span className={`inline-block w-4 h-4 rounded-full ${ot.status === 'Available' ? 'bg-green-500 animate-pulse-slow' : 'bg-red-500'}`}></span>
                            <h3 className="text-lg font-bold text-gray-800">{ot.ot_number}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${ot.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {ot.status}
                            </span>
                        </div>

                        <div className="grid gap-4">
                            {datesToShow.map(date => {
                                const otOperations = getOperationsForOT(ot.id, date);
                                return (
                                    <div key={date} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-semibold text-gray-700">
                                                {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                            {otOperations.length === 0 && (
                                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">Available</span>
                                            )}
                                        </div>

                                        {otOperations.length === 0 ? (
                                            <div className="text-sm text-gray-500 text-center py-4">
                                                No operations scheduled
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {otOperations.map(op => (
                                                    <div
                                                        key={op.id}
                                                        className={`${getStatusColor(op.status)} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
                                                    >
                                                        <div className="font-bold mb-2">{op.operation_type}</div>
                                                        <div className="text-sm opacity-95 mb-2">
                                                            {formatTime(op.start_time)} - {formatTime(op.end_time)}
                                                        </div>
                                                        <div className="text-sm opacity-90">{op.patient_name}</div>
                                                        <div className="text-sm opacity-80">{op.doctor_name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-sm">
                <span className="font-medium text-gray-700">Status:</span>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-500 rounded"></span>
                    <span>Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-yellow-500 rounded"></span>
                    <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-500 rounded"></span>
                    <span>Completed</span>
                </div>
            </div>
        </div>
    );
};

export default OTTable;

            