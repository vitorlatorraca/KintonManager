import { useLocation } from "wouter";
import { User, QrCode } from "lucide-react";

export default function TabNavigation() {
  const [location, setLocation] = useLocation();
  
  const isCustomerActive = !location.startsWith('/manager');
  const isManagerActive = location.startsWith('/manager');

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex">
        <button
          onClick={() => setLocation('/')}
          className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors ${
            isCustomerActive
              ? 'text-[#FF6B35] border-[#FF6B35]'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <User className="w-4 h-4 mr-2 inline-block" />
          Customer
        </button>
        <button
          onClick={() => setLocation('/manager')}
          className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors ${
            isManagerActive
              ? 'text-[#FF6B35] border-[#FF6B35]'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <QrCode className="w-4 h-4 mr-2 inline-block" />
          Manager
        </button>
      </div>
    </div>
  );
}
