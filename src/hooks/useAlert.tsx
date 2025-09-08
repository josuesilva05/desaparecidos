import { createContext, useContext, useState, type ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertItem {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface AlertContextType {
  success: (message: string) => void;
  error: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const addAlert = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, type, message }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const success = (message: string) => addAlert('success', message);
  const error = (message: string) => addAlert('error', message);

  return (
    <AlertContext.Provider value={{ success, error }}>
      {children}
      
      {/* Alert Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            variant={alert.type === 'error' ? 'destructive' : 'default'}
            className={`
              animate-in slide-in-from-right-full duration-300 shadow-lg
              ${alert.type === 'success' 
                ? 'bg-green-400 border-green-600 text-green-900 border-2' 
                : ''
              }
            `}
          >
            {alert.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <div className="flex items-center justify-between w-full">
              <AlertDescription className={`flex-1 pr-2 font-semibold ${alert.type === 'success' ? 'text-green-900' : ''}`}>
                {alert.message}
              </AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 hover:bg-transparent ${alert.type === 'success' ? 'text-green-700 hover:text-green-900' : ''}`}
                onClick={() => removeAlert(alert.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </Alert>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
