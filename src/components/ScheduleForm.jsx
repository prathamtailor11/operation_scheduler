/**
 * ScheduleForm Component
 * Form for creating and editing operations
 */

import React, { useState, useEffect } from 'react';
import { operationsAPI, patientsAPI, doctorsAPI, operationTheatersAPI } from '../api';

const ScheduleForm = ({ operation, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        ot_id: '',
        operation_type: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '12:00',
        anesthetist_id: '',
        notes: '',
        status: 'Scheduled',
    });
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [anesthetists, setAnesthetists] = useState([]);
    const [operationTheaters, setOperationTheaters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [conflictError, setConflictError] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    useEffect(() => {
        loadFormData();
        if (operation) {
            setFormData({
                patient_id: operation.patient_id || '',
                doctor_id: operation.doctor_id || '',
                ot_id: operation.ot_id || '',
                operation_type: operation.operation_type || '',
                date: operation.date || new Date().toISOString().split('T')[0],
                start_time: operation.start_time || '09:00',
                end_time: operation.end_time || '12:00',
                anesthetist_id: operation.anesthetist_id || '',
                notes: operation.notes || '',
                status: operation.status || 'Scheduled',
            });
        }
    }, [operation]);

    const loadFormData = async () => {
        try {
            const [patientsRes, doctorsRes, otsRes] = await Promise.all([
                patientsAPI.getAll(),
                doctorsAPI.getAll(),
                operationTheatersAPI.getAll({ status: 'Available' }),
            ]);

            setPatients(patientsRes.data);
            setDoctors(doctorsRes.data);
            setAnesthetists(doctorsRes.data.filter(d => d.specialization.toLowerCase().includes('anesthes')));
            setOperationTheaters(otsRes.data);
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setConflictError(null);
    };

    const checkAvailability = async () => {
        if (!formData.doctor_id || !formData.ot_id || !formData.date || !formData.start_time || !formData.end_time) {
            return;
        }

        try {
            setCheckingAvailability(true);
            const response = await operationsAPI.checkAvailability({
                doctor_id: formData.doctor_id,
                ot_id: formData.ot_id,
                date: formData.date,
                start_time: formData.start_time,
                end_time: formData.end_time,
                operation_id: operation?.id || null,
            });

            if (!response.data.available) {
                setConflictError(response.data.conflicts);
            } else {
                setConflictError(null);
            }
        } catch (error) {
            console.error('Error checking availability:', error);
        } finally {
            setCheckingAvailability(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.doctor_id && formData.ot_id && formData.date && formData.start_time && formData.end_time) {
                checkAvailability();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.doctor_id, formData.ot_id, formData.date, formData.start_time, formData.end_time]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setConflictError(null);

        try {
            if (operation) {
                await operationsAPI.update(operation.id, formData);
            } else {
                await operationsAPI.create(formData);
            }
            if (onSave) onSave();
        } catch (error) {
            if (error.response?.status === 409) {
                setConflictError(error.response.data.conflicts);
            } else {
                alert(error.response?.data?.error || 'Failed to save operation');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-xl p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    {operation ? 'Edit Operation' : 'Schedule New Operation'}
                </h2>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Patient <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="patient_id"
                            value={formData.patient_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                        >
                            <option value="">Select Patient</option>
                            {patients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name} ({patient.age} yrs, {patient.gender})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Operation Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="operation_type"
                            value={formData.operation_type}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Heart Bypass Surgery"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Surgeon <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select Surgeon</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name} - {doctor.specialization}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Operation Theater <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="ot_id"
                            value={formData.ot_id}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select OT</option>
                            {operationTheaters.map(ot => (
                                <option key={ot.id} value={ot.id}>
                                    {ot.ot_number} ({ot.status})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Anesthetist
                        </label>
                        <select
                            name="anesthetist_id"
                            value={formData.anesthetist_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select Anesthetist (Optional)</option>
                            {anesthetists.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {operation && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Additional notes or instructions..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                {/* Conflict Warning */}
                {checkingAvailability && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
                        Checking availability...
                    </div>
                )}

                {conflictError && conflictError.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <h3 className="font-semibold text-red-800 mb-2">Conflict Detected!</h3>
                        {conflictError.map((conflict, idx) => (
                            <div key={idx} className="mb-2">
                                <p className="text-red-700 font-medium">{conflict.message}</p>
                                {conflict.conflicts && conflict.conflicts.length > 0 && (
                                    <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                                        {conflict.conflicts.map((c, i) => (
                                            <li key={i}>
                                                {c.ot_number} - {c.patient_name} ({c.start_time} - {c.end_time})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading || (conflictError && conflictError.length > 0)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {operation ? 'Update Operation' : 'Schedule Operation'}
                            </>
                        )}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ScheduleForm;

