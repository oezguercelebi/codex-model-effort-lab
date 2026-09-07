import React from 'react';
import { useTrip } from '../../context/TripContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTrip();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgClass = 'bg-stone-900 text-white border-stone-700';
        let Icon = Info;
        let iconColor = 'text-sky-400';

        if (toast.type === 'success') {
          bgClass = 'bg-emerald-950 text-emerald-50 border-emerald-800';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          bgClass = 'bg-amber-950 text-amber-50 border-amber-800';
          Icon = AlertCircle;
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${bgClass}`}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
              <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 shrink-0 rounded-lg p-1 text-stone-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
