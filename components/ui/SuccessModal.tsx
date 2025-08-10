'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  duration?: number;
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  title = "Success!", 
  message = "Operation completed successfully",
  duration = 3000 
}: SuccessModalProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen) {
      setProgress(100);
      const startTime = Date.now();
      const endTime = startTime + duration;

      const updateProgress = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const newProgress = (remaining / duration) * 100;
        
        setProgress(newProgress);
        
        if (remaining > 0) {
          requestAnimationFrame(updateProgress);
        } else {
          onClose();
        }
      };

      requestAnimationFrame(updateProgress);
    }
  }, [isOpen, duration, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            {message}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
            <div 
              className="bg-green-500 h-1 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500">
            Auto-closing in {Math.ceil(progress / 100 * (duration / 1000))}s
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
