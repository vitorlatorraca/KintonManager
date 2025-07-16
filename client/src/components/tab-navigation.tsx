import { useLocation } from "wouter";
import { User, QrCode } from "lucide-react";
import KintonLogo from "./kinton-logo";

export default function TabNavigation() {
  const [location, setLocation] = useLocation();

  const isCustomerActive = !location.startsWith("/manager");
  const isManagerActive = location.startsWith("/manager");

  return (
    <div className="kinton-card border-b border-[#FFD700]/20 sticky top-0 z-50 backdrop-blur-lg">
      <div className="p-4 text-center">
        <KintonLogo size="sm" />
      </div>
      <div className="flex">
        <button
          onClick={() => setLocation("/")}
          className={`flex-1 py-4 px-6 text-center font-bold transition-all kinton-tab ${
            isCustomerActive ? "active" : ""
          }`}
        >
          <User className="w-5 h-5 mr-2 inline-block" />
          CLIENT
        </button>
        <button
          onClick={() => setLocation("/manager")}
          className={`flex-1 py-4 px-6 text-center font-bold transition-all kinton-tab ${
            isManagerActive ? "active" : ""
          }`}
        >
          <QrCode className="w-5 h-5 mr-2 inline-block" />
          MANAGER
        </button>
      </div>
    </div>
  );
}
