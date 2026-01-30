// /**
//  * OperationList Component
//  * Displays a list of operations with search and filter functionality
//  */

// import React, { useState, useEffect } from 'react';
// import { operationsAPI, patientsAPI, doctorsAPI, operationTheatersAPI } from '../api';
// import OperationCard from './OperationCard';

// const OperationList = ({ operations, onUpdate, onEdit, onDelete, user }) => {
//     const [filteredOperations, setFilteredOperations] = useState(operations);
//     const [searchTerm, setSearchTermState] = useState('');
//     const [filterDate, setFilterDateState] = useState('');
//     const [filterDoctor, setFilterDoctorState] = useState('');
//     const [filterOT, setFilterOTState] = useState('');
//     const [filterStatus, setFilterStatusState] = useState('');
//     const [doctors, setDoctors] = useState([]);
//     const [operationTheaters, setOperationTheaters] = useState([]);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         loadFilters();
//     }, []);

//     useEffect(() => {
//         filterOperations();
//     }, [operations, searchTerm, filterDate, filterDoctor, filterOT, filterStatus]);

//     const loadFilters = async () => {
//         try {
//             const [doctorsRes, otsRes] = await Promise.all([
//                 doctorsAPI.getAll(),
//                 operationTheatersAPI.getAll(),
//             ]);
//             setDoctors(doctorsRes.data);
//             setOperationTheaters(otsRes.data);
//         } catch (error) {
//             console.error('Error loading filters:', error);
//             setError(`Error loading filters: ${error.message}`);
//         }
//     };

//     const filterOperations = () => {
//         let filtered = [...operations];

//         // Search filter
//         if (searchTerm) {
//             const term = searchTerm.toLowerCase();
//             filtered = filtered.filter(op =>
//                 op.patient_name.toLowerCase().includes(term) ||
//                 op.operation_type.toLowerCase().includes(term) ||
//                 op.doctor_name.toLowerCase().includes(term) ||
//                 op.ot_number.toLowerCase().includes(term)
//             );
//         }

//         // Date filter
//         if (filterDate) {
//             filtered = filtered.filter(op => op.date === filterDate);
//         }

//         // Doctor filter
//         if (filterDoctor) {
//             filtered = filtered.filter(op => op.doctor_id === parseInt(filterDoctor));
//         }

//         // OT filter
//         if (filterOT) {
//             filtered = filtered.filter(op => op.ot_id === parseInt(filterOT));
//         }

//         // Status filter
//         if (filterStatus) {
//             filtered = filtered.filter(op => op.status === filterStatus);
//         }

//         setFilteredOperations(filtered);
//     };

//     const handleStatusChange = async (id, newStatus) => {
//         try {
//             await operationsAPI.updateStatus(id, newStatus);
//             if (onUpdate) onUpdate();
//         } catch (error) {
//             console.error('Error updating status:', error);
//             setError(`Error updating status: ${error.message}`);
//         }
//     };

//     return (
//         <div className="space-y-4 flex flex-col">
//             {error && (<p className="text-red-600 text-sm">{error}</p>)}
//             {/* Filters */}
//             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
//                 <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
//                     <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                     </svg>
//                     Filters & Search
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
//                     <div className="col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
//                         <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                             </svg>
//                             Search
//                         </label>
//                         <input
//                             type="text"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTermState(e.target.value)}
//                             className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
//                             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                             </svg>
//                             Surgeon
//                         </label>
//                         <select
//                             value={filterDoctor}
//                             onChange={(e) => setFilterDoctorState(e.target.value)}
//                             className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white text-sm sm:text-base"
//                         >
//                             <option value="">All Surgeons</option>
//                             {doctors.map(doctor => (
//                                 <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
//                             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 011-2 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                             </svg>
//                             OT
//                         </label>
//                         <select
//                             value={filterOT}
//                             onChange={(e) => setFilterOTState(e.target.value)}
//                             className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white text-sm sm:text-base"
//                         >
//                             <option value="">All OTs</option>
//                             {operationThearters.map(ot => (
//                                 <option key={ot.id} value={ot.id}>{ot.ot_number}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-1 flex items-end">
//                         <button
//                             onClick={() => {
//                                 setSearchTermState('');
//                                 setFilterDateState('');
//                                 setFilterDoctorState('');
//                                 setFilterOTState('');
//                                 setFilterStatusState('');
//                             }}
//                             className="w-full px-3 sm:px-4 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-sm sm:text-base"
//                         >
//                             Clear Filters
//                         </button>
//                     </div>
//                 </div>
//             </div>


/**
 * OperationList Component
 * Displays a list of operations with search and filter functionality
 */

import React, { useState, useEffect } from 'react';
import {
    operationsAPI,
    doctorsAPI,
    operationTheatersAPI
} from '../api';
import OperationCard from './OperationCard';

const OperationList = ({ operations, onUpdate, onEdit, onDelete, user }) => {
    const [filteredOperations, setFilteredOperations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterOT, setFilterOT] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [operationTheaters, setOperationTheaters] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        setFilteredOperations(operations);
    }, [operations]);

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
                operationTheatersAPI.getAll()
            ]);
            setDoctors(doctorsRes.data);
            setOperationTheaters(otsRes.data);
        } catch (error) {
            console.error('Error loading filters:', error);
            setError(`Error loading filters: ${error.message}`);
        }
    };

    const filterOperations = () => {
        let filtered = [...operations];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(op =>
                op.patient_name?.toLowerCase().includes(term) ||
                op.operation_type?.toLowerCase().includes(term) ||
                op.doctor_name?.toLowerCase().includes(term) ||
                op.ot_number?.toLowerCase().includes(term)
            );
        }

        // Date filter
        if (filterDate) {
            filtered = filtered.filter(op => op.date === filterDate);
        }

        // Doctor filter
        if (filterDoctor) {
            filtered = filtered.filter(
                op => op.doctor_id === parseInt(filterDoctor)
            );
        }

        // OT filter
        if (filterOT) {
            filtered = filtered.filter(
                op => op.ot_id === parseInt(filterOT)
            );
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
            setError(`Error updating status: ${error.message}`);
        }
    };

    return (
        <div className="space-y-4 flex flex-col">
            {error && (
                <p className="text-red-600 text-sm">{error}</p>
            )}

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Filters & Search
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                    {/* Search */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Search by patient, doctor, OT..."
                        />
                    </div>

                    {/* Doctor Filter */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Surgeon
                        </label>
                        <select
                            value={filterDoctor}
                            onChange={(e) => setFilterDoctor(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                        >
                            <option value="">All Surgeons</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* OT Filter */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            OT
                        </label>
                        <select
                            value={filterOT}
                            onChange={(e) => setFilterOT(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                        >
                            <option value="">All OTs</option>
                            {operationTheaters.map(ot => (
                                <option key={ot.id} value={ot.id}>
                                    {ot.ot_number}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterDate('');
                                setFilterDoctor('');
                                setFilterOT('');
                                setFilterStatus('');
                            }}
                            className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Operation List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredOperations.length > 0 ? (
                    filteredOperations.map(operation => (
                        <OperationCard
                            key={operation.id}
                            operation={operation}
                            user={user}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">
                        No operations found
                    </p>
                )}
            </div>
        </div>
    );
};

export default OperationList;
