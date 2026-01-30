/**
 * OperationList Component
 * Displays a list of operations with search and filter functionality
 */

import React, { useState, useEffect } from 'react';
import { operationsAPI, patientsAPI, doctorsAPI, operationTheatersAPI } from '../api';
import OperationCard from './OperationCard';

const OperationList = ({ operations, onUpdate, onEdit, onDelete }) => {
    const [filteredOperations, setFilteredOperations] = useState(operations);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterOT, setFilterOT] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [operationTheaters, setOperationTheaters] = useState([]);

    useEffect(() => {
        loadFilters();
    }, []);

    useEffect(() => {
        filterOperations();
    }, [operations, searchTerm, filterDate, filterDoctor, filterOT, filterStatus]);

    const loadFilters = async () => {
        try {
            const [doctorsRes, otsRes] = await Promise.all([
                doctorsAPI.getAll(),
                operationTheatersAPI.getAll(),
            ]);
            setDoctors(doctorsRes.data);
            setOperationTheaters(otsRes.data);
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    };

    const filterOperations = () => {
        let filtered = [...operations];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(op =>
                op.patient_name.toLowerCase().includes(term) ||
                op.operation_type.toLowerCase().includes(term) ||
                op.doctor_name.toLowerCase().includes(term) ||
                op.ot_number.toLowerCase().includes(term)
            );
        }

        // Date filter
        if (filterDate) {
            filtered = filtered.filter(op => op.date === filterDate);
        }

        // Doctor filter
        if (filterDoctor) {
            filtered = filtered.filter(op => op.doctor_id === parseInt(filterDoctor));
        }

        // OT filter
        if (filterOT) {
            filtered = filtered.filter(op => op.ot_id === parseInt(filterOT));
        }

        // Status filter
        if (filterStatus) {
            filtered = filtered.filter(op => op.status === filterStatus);
        }

        setFilteredOperations(filtered);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await operationsAPI.updateStatus(id, newStatus);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating status:', error);
            // Error will be handled by parent component's notification system
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters & Search
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search by patient, operation, doctor, or OT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Date
                        </label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Surgeon
                        </label>
                        <select
                            value={filterDoctor}
                            onChange={(e) => setFilterDoctor(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                        >
                            <option value="">All Surgeons</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Operation Theater
                        </label>
                        <select
                            value={filterOT}
                            onChange={(e) => setFilterOT(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                        >
                            <option value="">All OTs</option>
                            {operationTheaters.map(ot => (
                                <option key={ot.id} value={ot.id}>{ot.ot_number}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterDate('');
                                setFilterDoctor('');
                                setFilterOT('');
                                setFilterStatus('');
                            }}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600 bg-gradient-to-r from-primary-50 to-blue-50 p-3 rounded-lg border border-primary-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold">Showing <span className="text-primary-600">{filteredOperations.length}</span> of <span className="text-primary-600">{operations.length}</span> operations</span>
            </div>

            {/* Operations Grid */}
            {filteredOperations.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100 animate-fade-in">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No operations found</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOperations.map((operation, index) => (
                        <div key={operation.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-scale-in">
                            <OperationCard
                                operation={operation}
                                onStatusChange={handleStatusChange}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OperationList;

