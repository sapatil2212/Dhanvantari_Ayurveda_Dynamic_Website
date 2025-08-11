'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Square, Volume2, VolumeX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceAssistantProps {
  onTranscript: (text: string, field: string) => void;
  currentField: string | null;
  isListening: boolean;
  onStartListening: (field: string) => void;
  onStopListening: () => void;
  className?: string;
}

export default function VoiceAssistant({
  onTranscript,
  currentField,
  isListening,
  onStartListening,
  onStopListening,
  className = ''
}: VoiceAssistantProps) {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    setIsSupported(
      'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    );
  }, []);

  useEffect(() => {
    if (isListening && isSupported) {
      startRecognition();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isListening, isSupported]);

  const startRecognition = () => {
    if (!isSupported) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition. Please use text input instead.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        toast({
          title: "No speech detected",
          description: "Please speak clearly into your microphone.",
          variant: "destructive",
        });
      } else if (event.error === 'audio-capture') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive",
        });
      }
      onStopListening();
    };

    recognitionRef.current.onend = () => {
      if (transcript && currentField) {
        onTranscript(transcript, currentField);
      }
      setTranscript('');
      onStopListening();
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: "Voice recognition failed",
        description: "Failed to start voice recognition. Please try again.",
        variant: "destructive",
      });
      onStopListening();
    }
  };

  const handleStartListening = (field: string) => {
    onStartListening(field);
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onStopListening();
  };

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VolumeX className="h-5 w-5 text-gray-400" />
            Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Voice recognition is not supported in your browser. Please use text input instead.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>Use voice commands to quickly fill prescription details:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>&ldquo;Paracetamol 500mg tablet one tablet three times daily&rdquo;</li>
            <li>&ldquo;Hypertension management&rdquo;</li>
            <li>&ldquo;Take after meals with plenty of water&rdquo;</li>
          </ul>
        </div>

        {isListening && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Listening... Speak now
            </div>
            {transcript && (
              <div className="mt-2 p-2 bg-white rounded border">
                <p className="text-sm text-gray-700">{transcript}</p>
              </div>
            )}
          </div>
        )}

        {currentField && !isListening && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              Voice input applied to: <strong>{currentField.replace('_', ' ')}</strong>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant={isListening ? 'destructive' : 'default'}
            onClick={isListening ? handleStopListening : () => handleStartListening('general')}
            className="w-full"
            disabled={!isSupported}
          >
            {isListening ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Voice Input
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Click the microphone button on any field to start voice input for that specific field.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Voice input button component for individual fields
export function VoiceInputButton({
  field,
  isActive,
  onStartListening,
  onStopListening,
  className = ''
}: {
  field: string;
  isActive: boolean;
  onStartListening: (field: string) => void;
  onStopListening: () => void;
  className?: string;
}) {
  const handleClick = () => {
    if (isActive) {
      onStopListening();
    } else {
      onStartListening(field);
    }
  };

  return (
    <Button
      type="button"
      variant={isActive ? 'destructive' : 'outline'}
      size="icon"
      onClick={handleClick}
      className={className}
      title={isActive ? 'Stop voice input' : 'Start voice input'}
    >
      {isActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}
