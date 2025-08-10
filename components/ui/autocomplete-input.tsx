'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Textarea } from './textarea';
import { Mic, MicOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AutocompleteInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fieldType: string;
  userId?: string;
  onVoiceInput?: () => void;
  isListening?: boolean;
  className?: string;
  type?: string;
  rows?: number;
  as?: 'input' | 'textarea';
}

interface Suggestion {
  value: string;
  frequency: number;
}

export function AutocompleteInput({
  id,
  value,
  onChange,
  placeholder,
  fieldType,
  userId,
  onVoiceInput,
  isListening = false,
  className = '',
  type = 'text',
  rows = 3,
  as = 'input',
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced function to fetch suggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          fieldType,
          query: query.trim(),
          limit: '8',
        });
        if (userId) {
          params.append('userId', userId);
        }

        const response = await fetch(`/api/typing-history?${params}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
          setShowSuggestions(data.suggestions?.length > 0);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [fieldType, userId]
  );

  // Save typing history when user finishes typing
  const saveTypingHistory = useCallback(
    debounce(async (value: string) => {
      if (!value.trim() || value.length < 2) return;

      try {
        await fetch('/api/typing-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fieldType,
            value: value.trim(),
            userId,
          }),
        });
      } catch (error) {
        console.error('Error saving typing history:', error);
      }
    }, 1000),
    [fieldType, userId]
  );

  useEffect(() => {
    debouncedFetchSuggestions(value);
  }, [value, debouncedFetchSuggestions]);

  useEffect(() => {
    if (value.trim()) {
      saveTypingHistory(value);
    }
  }, [value, saveTypingHistory]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onChange(suggestions[selectedIndex].value);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onChange(suggestion.value);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        {as === 'textarea' ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id={id}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            rows={rows}
            className={`${className} resize-none`}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            id={id}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            type={type}
            className={className}
          />
        )}
        {onVoiceInput && (
          <Button
            type="button"
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={onVoiceInput}
            className={isListening ? 'animate-pulse' : ''}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Loading suggestions...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion.value}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  index === selectedIndex ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex justify-between items-center">
                  <span>{suggestion.value}</span>
                  <span className="text-xs text-gray-400">
                    {suggestion.frequency} time{suggestion.frequency !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
