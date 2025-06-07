import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Trash2, User, Bot, Clock, X } from "lucide-react";
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

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

const VoiceAssistant = ({ isActive, onToggle, products }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pauseCountdown, setPauseCountdown] = useState(0);
  const [isWaitingForPause, setIsWaitingForPause] = useState(false);

  const voiceServiceRef = useRef<VoiceService | null>(null);
  const aiServiceRef = useRef<AIService | null>(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef("");
  const pauseDetectionRef = useRef<NodeJS.Timeout | null>(null);

  // Configuration for auto-submit timing - More conservative settings
  const PAUSE_DETECTION_DELAY = 3000; // 3 seconds to detect meaningful pause
  const AUTO_SUBMIT_DELAY = 10000; // 10 seconds countdown for auto-submit
  const MIN_WORDS_FOR_AUTO_SUBMIT = 3; // Minimum 3 words to trigger auto-submit

  // Auto scroll to latest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showHistory) {
      scrollToBottom();
    }
  }, [chatHistory, showHistory]);

  // Cleanup timers
  const cleanupTimers = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (pauseDetectionRef.current) {
      clearTimeout(pauseDetectionRef.current);
      pauseDetectionRef.current = null;
    }
    setPauseCountdown(0);
    setIsWaitingForPause(false);
  }, []);

  // Start pause detection and auto-submit countdown
  const startPauseDetection = useCallback((currentTranscript: string) => {
    cleanupTimers();
    
    // Don't start countdown for very short inputs
    const wordCount = currentTranscript.trim().split(/\s+/).length;
    if (wordCount < MIN_WORDS_FOR_AUTO_SUBMIT) {
      return;
    }

    // Start pause detection
    pauseDetectionRef.current = setTimeout(() => {
      if (!isMountedRef.current || isProcessingRef.current) return;
      
      setIsWaitingForPause(true);
      let countdown = AUTO_SUBMIT_DELAY / 1000; // Convert to seconds
      setPauseCountdown(countdown);
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        countdown -= 1;
        setPauseCountdown(countdown);
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          if (isMountedRef.current && !isProcessingRef.current && currentTranscript.trim()) {
            processUserInput(currentTranscript);
          }
        }
      }, 1000);
      
      // Store the interval reference for cleanup
      pauseTimerRef.current = countdownInterval as any;
    }, PAUSE_DETECTION_DELAY);
  }, []);

  // Add message to chat history
  const addToHistory = useCallback((type: 'user' | 'assistant', message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, newMessage]);
  }, []);

  // Clear chat history
  const clearHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    cleanupTimers();
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stopListening();
      voiceServiceRef.current.stopSpeaking();
    }
    setIsListening(false);
    setIsSpeaking(false);
    isProcessingRef.current = false;
    lastTranscriptRef.current = "";
  }, [cleanupTimers]);

  // Initialize services when activated
  useEffect(() => {
    isMountedRef.current = true;

    if (isActive && !voiceServiceRef.current) {
      voiceServiceRef.current = new VoiceService();
      aiServiceRef.current = new AIService(products);
      
      // Welcome message when activated with delay to avoid interruption
      const welcomeTimer = setTimeout(async () => {
        if (isMountedRef.current && isActive) {
          const welcomeMessage = "Hello! I'm your voice shopping assistant. You can ask me about products, prices, or recommendations. Take your time speaking - I'll automatically process your question after you pause. How can I help you today?";
          await handleAIResponse(welcomeMessage);
          addToHistory('assistant', welcomeMessage);
        }
      }, 1000);

      return () => clearTimeout(welcomeTimer);
    }

    return cleanup;
  }, [isActive, products, cleanup, addToHistory]);

  // Cleanup on unmount or when deactivated
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  const handleVoiceToggle = async () => {
    if (!voiceServiceRef.current || isProcessingRef.current) return;

    // Clear any previous errors and timers
    setError("");
    cleanupTimers();

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
            lastTranscriptRef.current = newTranscript;
            
            if (isFinal && newTranscript.trim() && !isProcessingRef.current) {
              // Process immediately if final
              processUserInput(newTranscript);
            } else if (newTranscript.trim() && !isProcessingRef.current) {
              // Start pause detection for intermediate results
              startPauseDetection(newTranscript);
            }
          },
          (errorMessage) => {
            if (!isMountedRef.current) return;
            
            setError(errorMessage);
            setIsListening(false);
            setTranscript("");
            cleanupTimers();
            console.error('Voice recognition error:', errorMessage);
          }
        );

        if (success) {
          setIsListening(true);
          lastTranscriptRef.current = "";
        } else {
          setError('Unable to start voice recognition. Please check your microphone.');
        }
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        setError('Failed to start voice recognition.');
      }
    }
  };

  // Cancel auto-submit countdown
  const cancelAutoSubmit = useCallback(() => {
    cleanupTimers();
  }, [cleanupTimers]);

  const processUserInput = async (userInput: string) => {
    if (!aiServiceRef.current || !voiceServiceRef.current || isProcessingRef.current || !isMountedRef.current) {
      return;
    }

    isProcessingRef.current = true;
    cleanupTimers(); // Clear any pending timers

    try {
      // Stop listening while processing
      voiceServiceRef.current.stopListening();
      setIsListening(false);
      
      // Add user message to history
      addToHistory('user', userInput);
      setTranscript("");
      lastTranscriptRef.current = "";

      // Show processing feedback
      setLastResponse("Let me think about that...");

      // Get AI response (will try RAG first, fallback to local)
      const response = await aiServiceRef.current.processUserQuery(userInput);
      
      if (isMountedRef.current) {
        // Add AI response to history
        addToHistory('assistant', response);
        await handleAIResponse(response);
      }
    } catch (error) {
      console.error('Error processing user input:', error);
      if (isMountedRef.current) {
        const errorMessage = 'Sorry, I had trouble processing your request. Please try again.';
        setError(errorMessage);
        addToHistory('assistant', errorMessage);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isActive) return null;

  return (
    <Card className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-sm shadow-2xl border-purple-200 z-50 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-bold text-gray-800">AI Shopping Assistant</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => setShowHistory(!showHistory)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-purple-50"
            title="Toggle chat history"
          >
            <MessageCircle className="h-4 w-4 text-purple-600" />
          </Button>
          {chatHistory.length > 0 && (
            <Button
              onClick={clearHistory}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-50"
              title="Clear chat history"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
          <Button
            onClick={onToggle}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-700"
            title="Close voice assistant"
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Chat History */}
      {showHistory && chatHistory.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="max-h-64 overflow-y-auto p-3 space-y-3">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-purple-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-2 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-xs leading-relaxed break-words">
                    {message.message}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* Main Interface */}
      <div className="p-4">
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
            {/* Auto-submit countdown */}
            {isWaitingForPause && pauseCountdown > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-yellow-600" />
                      <strong className="text-yellow-700 text-xs">Auto-submitting in {pauseCountdown}s</strong>
                    </div>
                    <Button
                      onClick={cancelAutoSubmit}
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs hover:bg-yellow-100"
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-1">
                    <div 
                      className="bg-yellow-500 h-1 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(pauseCountdown / (AUTO_SUBMIT_DELAY / 1000)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Current Transcript */}
            {transcript && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <strong className="text-blue-700 text-xs">You (Live)</strong>
                    </div>
                    {isListening && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-800 leading-relaxed break-words">
                    {transcript}
                  </p>
                </div>
              </div>
            )}
            
            {/* Current Response */}
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
                  
                  <p className="text-sm text-gray-800 leading-relaxed break-words">
                    {lastResponse}
                  </p>
                </div>
              </div>
            )}
            
            {/* Error Display */}
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
            
            {/* Status Bar */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {isSpeaking 
                      ? "🎤" 
                      : isListening 
                        ? "👂" 
                        : "🛍️"
                    }
                  </span>
                  <p className="text-xs text-gray-600 leading-tight font-medium">
                    {isSpeaking 
                      ? "I'm responding to your question..."
                      : isListening 
                        ? "Speak naturally - I'll process your question after you pause!"
                        : "Voice assistant ready. Speak naturally and I'll auto-submit!"
                    }
                  </p>
                </div>
                
                {chatHistory.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MessageCircle className="h-3 w-3" />
                    <span>{chatHistory.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VoiceAssistant;
