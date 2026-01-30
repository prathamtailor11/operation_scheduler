/**
 * LoadingSpinner Component
 * Professional loading spinner with animation
 */

import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
            <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
            {text && <p className="text-gray-600 text-sm animate-pulse-slow">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;

