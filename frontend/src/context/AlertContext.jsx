import { createContext, useContext, useState, useCallback } from 'react';
import { X, Check, AlertCircle, Info } from 'lucide-react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setAlerts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeAlert(id);
    }, 3000);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const success = (message) => addAlert(message, 'success');
  const error = (message) => addAlert(message, 'error');
  const info = (message) => addAlert(message, 'info');

  return (
    <AlertContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px] animate-slide-in
              ${alert.type === 'success' ? 'bg-green-600' : ''}
              ${alert.type === 'error' ? 'bg-red-600' : ''}
              ${alert.type === 'info' ? 'bg-blue-600' : ''}
            `}
          >
            {alert.type === 'success' && <Check size={20} />}
            {alert.type === 'error' && <AlertCircle size={20} />}
            {alert.type === 'info' && <Info size={20} />}
            
            <p className="flex-1 font-medium">{alert.message}</p>
            
            <button 
              onClick={() => removeAlert(alert.id)}
              className="hover:bg-white/20 rounded-full p-1 transition"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};
