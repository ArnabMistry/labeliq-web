
import React, { useRef, useState, useEffect } from 'react';

interface CameraScannerProps {
  onCapture: (imageBuffer: string) => void;
  onCancel: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setIsInitializing(false);
      } catch (err) {
        console.error("Camera error:", err);
        setError("Could not access camera. Please check permissions.");
        setIsInitializing(false);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col max-w-md mx-auto border-x border-slate-900">
      <div className="relative flex-1 overflow-hidden">
        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium">Initializing camera...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black p-8 text-center">
            <div>
              <p className="text-lg font-semibold mb-4">{error}</p>
              <button 
                onClick={onCancel}
                className="px-6 py-2 bg-white text-black rounded-lg font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="h-full w-full object-cover"
        />
        
        {/* Scanning Reticle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-64 h-80 border-2 border-white/50 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 animate-pulse"></div>
          </div>
          <p className="mt-8 text-white text-sm font-medium drop-shadow-lg text-center px-8">
            Position ingredients within frame
          </p>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="bg-black/90 p-8 flex items-center justify-between safe-area-bottom">
        <button onClick={onCancel} className="text-white text-sm font-medium">Cancel</button>
        <button 
          onClick={handleCapture}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-full border-2 border-black"></div>
        </button>
        <div className="w-10"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default CameraScanner;
