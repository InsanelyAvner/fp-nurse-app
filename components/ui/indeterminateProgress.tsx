import React from 'react';

const IndeterminateProgressBar = () => {
    return (
        <div className="relative w-full h-1 overflow-hidden bg-primary/10">
            <div className="absolute inset-0 bg-[#9d2235] animate-indeterminate rounded-md">
                <div className="absolute inset-0 bg-inherit animate-indeterminate-short rounded-md" />
            </div>
        </div>
    );
};

export default IndeterminateProgressBar;
