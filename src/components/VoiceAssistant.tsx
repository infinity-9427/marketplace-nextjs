import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VoiceService } from "@/services/voiceService";
import { AIService } from "@/services/aiService";
import { Product } from "@/components/ProductCard";

interface VoiceAssistantProps {
  isActive: boolean;
  onToggle: () => void;
  products: Product[];
}

const VoiceAssistant = ({ isActive, onToggle, products }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [error, setError] = useState("");

  const voiceServiceRef = useRef<VoiceService | null>(null);
  const aiServiceRef = useRef<AIService | null>(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stopListening();
      voiceServiceRef.current.stopSpeaking();
    }
    setIsListening(false);
    setIsSpeaking(false);
    isProcessingRef.current = false;
  }, []);

  // Initialize services when activated
  useEffect(() => {
    isMountedRef.current = true;

    if (isActive && !voiceServiceRef.current) {
      voiceServiceRef.current = new VoiceService();
      aiServiceRef.current = new AIService(products);
      
      // Welcome message when activated with delay to avoid interruption
      const welcomeTimer = setTimeout(async () => {
        if (isMountedRef.current && isActive) {
          await handleAIResponse("Hello! I'm your voice shopping assistant. You can ask me about products, prices, or recommendations. How can I help you today?");
        }
      }, 1000);

      return () => clearTimeout(welcomeTimer);
    }

    return cleanup;
  }, [isActive, products, cleanup]);

  // Cleanup on unmount or when deactivated
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  const handleVoiceToggle = async () => {
    if (!voiceServiceRef.current || isProcessingRef.current) return;

    // Clear any previous errors
    setError("");

    if (isListening) {
      // Stop listening
      try {
        voiceServiceRef.current.stopListening();
        setIsListening(false);
        
        // Process the final transcript if available
        if (transcript.trim()) {
          await processUserInput(transcript);
        } else {
          setTranscript("");
        }
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
        setIsListening(false);
        setTranscript("");
      }
    } else {
      // Stop any current speech before starting to listen
      if (isSpeaking) {
        handleStopSpeaking();
        // Wait a bit for speech to stop
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Start listening
      try {
        const success = voiceServiceRef.current.startListening(
          (newTranscript, isFinal) => {
            if (!isMountedRef.current) return;
            
            setTranscript(newTranscript);
            
            if (isFinal && newTranscript.trim() && !isProcessingRef.current) {
              processUserInput(newTranscript);
            }
          },
          (errorMessage) => {
            if (!isMountedRef.current) return;
            
            setError(errorMessage);
            setIsListening(false);
            setTranscript("");
            console.error('Voice recognition error:', errorMessage);
          }
        );

        if (success) {
          setIsListening(true);
        } else {
          setError('Unable to start voice recognition. Please check your microphone.');
        }
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        setError('Failed to start voice recognition.');
      }
    }
  };

  const processUserInput = async (userInput: string) => {
    if (!aiServiceRef.current || !voiceServiceRef.current || isProcessingRef.current || !isMountedRef.current) {
      return;
    }

    isProcessingRef.current = true;

    try {
      // Stop listening while processing
      voiceServiceRef.current.stopListening();
      setIsListening(false);
      setTranscript("");

      // Show processing feedback
      setLastResponse("Let me think about that...");

      // Get AI response (will try RAG first, fallback to local)
      const response = await aiServiceRef.current.processUserQuery(userInput);
      
      if (isMountedRef.current) {
        await handleAIResponse(response);
      }
    } catch (error) {
      console.error('Error processing user input:', error);
      if (isMountedRef.current) {
        const errorMessage = 'Sorry, I had trouble processing your request. Please try again.';
        setError(errorMessage);
        await handleAIResponse(errorMessage);
      }
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleAIResponse = async (response: string) => {
    if (!voiceServiceRef.current || !isMountedRef.current) return;

    try {
      // Stop any current speech first
      voiceServiceRef.current.stopSpeaking();
      
      // Wait a moment to ensure speech is stopped
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isMountedRef.current) return;

      setLastResponse(response);
      setIsSpeaking(true);
      setError(""); // Clear any previous errors
      
      await voiceServiceRef.current.speak(response);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsSpeaking(false);
      }
    } catch (error) {
      // Handle speech interruption gracefully
      const errorMessage = error?.message || error?.toString() || '';
      const isInterruption = errorMessage.toLowerCase().includes('interrupted') || 
                            errorMessage.toLowerCase().includes('abort') ||
                            errorMessage.toLowerCase().includes('cancel');
      
      if (isInterruption) {
        // This is expected behavior when user stops speech
        console.log('Speech interrupted by user');
      } else {
        // Log unexpected errors
        console.error('Error speaking response:', error);
      }
      
      if (isMountedRef.current) {
        setIsSpeaking(false);
        
        // Only show error message for unexpected errors, not interruptions
        if (!isInterruption) {
          setError('Sorry, I had trouble speaking the response.');
        }
      }
    }
  };

  const handleStopSpeaking = useCallback(() => {
    if (voiceServiceRef.current) {
      try {
        voiceServiceRef.current.stopSpeaking();
        setIsSpeaking(false);
        setError(""); // Clear any errors when user manually stops
        
        // Optional: Provide feedback that speech was stopped
        console.log('Speech stopped by user');
      } catch (error) {
        console.error('Error stopping speech:', error);
        setIsSpeaking(false);
        // Don't set error state for stop operations
      }
    }
  }, []);

  if (!isActive) return null;

  return (
    <Card className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-4 bg-white/95 backdrop-blur-sm shadow-2xl border-purple-200 z-50 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex flex-col items-center">
          <Button
            onClick={handleVoiceToggle}
            size="lg"
            className={`rounded-full w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-200'
            }`}
            disabled={isSpeaking && !isListening}
          >
            {isListening ? <MicOff className="h-5 w-5 sm:h-6 sm:w-6" /> : <Mic className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
          
          {isSpeaking && (
            <Button
              onClick={handleStopSpeaking}
              size="sm"
              variant="outline"
              className="mt-2 h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <VolumeX className="h-3 w-3" />
            </Button>
          )}
          
          <span className={`text-xs mt-2 text-center leading-tight font-medium transition-colors ${
            isSpeaking ? 'text-purple-600' : isListening ? 'text-red-600' : 'text-gray-600'
          }`}>
            {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Tap to speak'}
          </span>
        </div>
        
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <span className="text-sm font-bold text-gray-800 truncate">AI Shopping Assistant</span>
          </div>
          
          {transcript && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <strong className="text-blue-700 text-xs">You</strong>
                  </div>
                  {isListening && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  {transcript.length > 100 ? (
                    <div className="space-y-2">
                      <div 
                        className="max-h-24 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 text-sm text-gray-800 leading-relaxed"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#93C5FD #DBEAFE'
                        }}
                      >
                        <span className="break-words">{transcript}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-blue-200/60">
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <span className="font-medium">{transcript.split(' ').length} words</span>
                          <span className="text-blue-400">•</span>
                          <span>{transcript.length} chars</span>
                        </div>
                        {isListening && (
                          <div className="flex items-center gap-1 text-xs text-blue-500">
                            <span className="animate-pulse font-medium">Recording</span>
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-800 leading-relaxed break-words">
                        {transcript}
                      </p>
                      {isListening && transcript.length > 20 && (
                        <div className="flex items-center justify-between text-xs text-blue-600">
                          <span>{transcript.split(' ').length} words</span>
                          <div className="flex items-center gap-1">
                            <span className="animate-pulse">Recording</span>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {lastResponse && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <strong className="text-purple-700 text-xs">Assistant</strong>
                  </div>
                  {isSpeaking && (
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-purple-500 animate-pulse" />
                      <span className="text-xs text-purple-600 animate-pulse">Speaking</span>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  {lastResponse.length > 150 ? (
                    <div className="space-y-2">
                      <div 
                        className="max-h-28 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 text-sm text-gray-800 leading-relaxed"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#C4B5FD #E9D5FF'
                        }}
                      >
                        <span className="break-words">{lastResponse}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-purple-200/60">
                        <div className="flex items-center gap-2 text-xs text-purple-600">
                          <span className="font-medium">{lastResponse.split(' ').length} words</span>
                          <span className="text-purple-400">•</span>
                          <span>{lastResponse.length} chars</span>
                        </div>
                        {isSpeaking && (
                          <div className="flex items-center gap-1 text-xs text-purple-500">
                            <Volume2 className="w-3 h-3 animate-pulse" />
                            <span className="animate-pulse font-medium">Playing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-800 leading-relaxed break-words">
                        {lastResponse}
                      </p>
                      {isSpeaking && (
                        <div className="flex items-center justify-end gap-1 text-xs text-purple-600">
                          <Volume2 className="w-3 h-3 animate-pulse" />
                          <span className="animate-pulse">Playing audio</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <strong className="text-red-700 text-xs">Error</strong>
                </div>
                <p className="text-sm text-red-700 leading-relaxed break-words">
                  {error}
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">
                {isSpeaking 
                  ? "🎤" 
                  : isListening 
                    ? "👂" 
                    : "🛍️"
                }
              </span>
              <p className="text-xs text-gray-600 leading-tight text-center font-medium">
                {isSpeaking 
                  ? "I'm responding to your question..."
                  : isListening 
                    ? "Ask me about products, prices, or recommendations!"
                    : "Voice assistant ready. Ask me about our products!"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </Card>
  );
};

export default VoiceAssistant;
