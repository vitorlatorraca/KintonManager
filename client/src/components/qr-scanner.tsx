import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerProps {
  onScan: (result: string) => void;
  isActive: boolean;
}

export default function QRScanner({ onScan, isActive }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasCamera(true);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Mock QR detection for demo
  const handleVideoClick = () => {
    if (isScanning) {
      // Simulate QR code detection
      const mockQRCode = `QR-${Math.random().toString(36).substr(2, 12)}`;
      onScan(mockQRCode);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden relative" style={{ height: '400px' }}>
      {isScanning && hasCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleVideoClick}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            {hasCamera ? (
              <CameraOff className="w-12 h-12 mx-auto mb-4" />
            ) : (
              <Camera className="w-12 h-12 mx-auto mb-4" />
            )}
            <p className="text-lg font-medium">
              {hasCamera ? 'Camera stopped' : 'Camera not available'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {hasCamera 
                ? 'Click to start scanning' 
                : 'Please enable camera access or use manual entry'
              }
            </p>
            {!isScanning && (
              <Button onClick={startCamera} variant="outline" className="text-white border-white">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Scanner overlay */}
      {isScanning && (
        <>
          <div className="qr-scanner-overlay absolute inset-0 opacity-30"></div>
          
          {/* Scanner frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-4 border-[#FF6B35] rounded-lg relative">
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#FF6B35]"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-[#FF6B35]"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-[#FF6B35]"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#FF6B35]"></div>
            </div>
          </div>
          
          {/* Click instruction */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full inline-block">
              Click anywhere to simulate QR scan
            </p>
          </div>
        </>
      )}
    </div>
  );
}
