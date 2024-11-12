import React, { useContext } from 'react';
import { LoadingContext } from '@/app/context/LoadingContext';
import { cn } from "@/lib/utils";

const Spinner = () => {
  const { isLoading } = useContext(LoadingContext);

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-30 transition-all duration-300 mt-1",
        isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative">
        {/* Outer spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        
        {/* Inner spinning element */}
        <div 
          className="w-12 h-12 rounded-full border-4 border-[#9d2235] border-t-transparent animate-spin"
          style={{
            filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))'
          }}
        />
      </div>
    </div>
  );
};

export default Spinner;