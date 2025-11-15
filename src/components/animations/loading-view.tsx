"use client";

import React from 'react';

export default function LoadingView(): React.JSX.Element {
  return (
    <div className='flex h-[110vh] items-center justify-center bg-gradient-to-br from-background to-secondary/20'>
      <div className='flex flex-col items-center space-y-6'>

        <div className='text-center'>
          <h3 className='text-lg font-semibold text-foreground mb-2 animate-pulse'>
            Chargement en cours
          </h3>
          <div className='flex items-center justify-center space-x-1'>
            <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-2 w-2 bg-primary rounded-full animate-bounce'></div>
          </div>
        </div>

      </div>

      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 h-2 w-2 bg-primary/20 rounded-full animate-float'></div>
        <div className='absolute top-1/3 right-1/4 h-3 w-3 bg-secondary/20 rounded-full animate-float [animation-delay:1s]'></div>
        <div className='absolute bottom-1/4 left-1/3 h-1 w-1 bg-accent/20 rounded-full animate-float [animation-delay:2s]'></div>
        <div className='absolute bottom-1/3 right-1/3 h-2 w-2 bg-primary/15 rounded-full animate-float [animation-delay:1.5s]'></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
        
        .animate-fade-in {
          animation: fade-in 2s ease-in-out infinite alternate;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
