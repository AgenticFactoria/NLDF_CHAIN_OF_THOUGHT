'use client';

import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

interface AgentMessage {
  timestamp: Date;
  rawOutput: string | object | null;
  input: string | object | null;
  topic: string;
}

interface ParsedMqttMessage {
  raw_output?: unknown;
  input?: unknown;
  [key: string]: unknown;
}

export default function AgentThinkingProtocol() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isConnectingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Prevent multiple connections during hydration
    if (isConnectingRef.current || clientRef.current) {
      return;
    }

    isConnectingRef.current = true;

    // MQTT connection setup
    const options = {
      clean: true,
      connectTimeout: 4000,
      clientId: `emqx_test_${Date.now()}`, // Make clientId unique to prevent conflicts
      rejectUnauthorized: false,
      keepalive: 60,
      reconnectPeriod: 5000, // Reconnect every 5 seconds if connection is lost
    };

    const connectUrl = 'wss://supos-ce-instance4.supos.app:8084/mqtt';
    
    setConnectionStatus('connecting');
    setError(null);

    try {
      const client = mqtt.connect(connectUrl, options);
      clientRef.current = client;

      client.on('connect', function () {
        console.log('Connected to MQTT broker');
        setConnectionStatus('connected');
        isConnectingRef.current = false;
        
        // Subscribe to all three lines
        const topics = [
          'yangzhi/line1/agent/output/message',
          'yangzhi/line2/agent/output/message',
          'yangzhi/line3/agent/output/message'
        ];
        
        topics.forEach(topic => {
          client.subscribe(topic, function (err) {
            if (err) {
              console.error(`Subscription error for ${topic}:`, err);
              setError(`Subscription failed for ${topic}: ${err.message}`);
            } else {
              console.log(`Successfully subscribed to ${topic}`);
            }
          });
        });
      });

      client.on('message', function (topic, message) {
        try {
          const messageStr = message.toString();
          console.log('Received message:', topic, messageStr);
          
          let parsedMessage: string | ParsedMqttMessage;
          try {
            parsedMessage = JSON.parse(messageStr) as ParsedMqttMessage;
          } catch {
            parsedMessage = messageStr;
          }

          const getRawOutput = (): string | object | null => {
            if (typeof parsedMessage === 'string') {
              return parsedMessage;
            }
            return parsedMessage.raw_output as string | object || parsedMessage;
          };

          const getInput = (): string | object | null => {
            if (typeof parsedMessage === 'string') {
              return null;
            }
            return parsedMessage.input as string | object || null;
          };

          const newMessage: AgentMessage = {
            timestamp: new Date(),
            rawOutput: getRawOutput(),
            input: getInput(),
            topic: topic
          };

          setMessages(prev => [...prev, newMessage]);
        } catch (err) {
          console.error('Message processing error:', err);
        }
      });

      client.on('error', function (error) {
        console.error('MQTT Error:', error);
        setConnectionStatus('disconnected');
        setError(`Connection error: ${error.message}`);
        isConnectingRef.current = false;
      });

      client.on('offline', function () {
        console.log('MQTT client is offline');
        setConnectionStatus('disconnected');
      });

      client.on('reconnect', function () {
        console.log('MQTT client is reconnecting');
        setConnectionStatus('connecting');
      });

      client.on('close', function () {
        console.log('MQTT connection closed');
        setConnectionStatus('disconnected');
        isConnectingRef.current = false;
      });

    } catch (err) {
      console.error('Failed to connect:', err);
      setConnectionStatus('disconnected');
      setError('Failed to establish connection');
      isConnectingRef.current = false;
    }

    return () => {
      console.log('Cleaning up MQTT connection');
      if (clientRef.current) {
        clientRef.current.end(true); // Force close
        clientRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, []); // Empty dependency array - only run once

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-orange-500/20 rotate-45 rounded-lg"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-orange-400/10 rotate-12 rounded-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-orange-600/15 -rotate-12 rounded-lg"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-orange-500/10 rotate-45 rounded-lg"></div>
      </div>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/Agentic%20Factoria.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative z-10">
              {/* Banner/Logo Space */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-orange-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                      <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-xl border-2 border-orange-500/30">
                  <img 
                    src="/agentic-factoria-logo.png" 
                    alt="Agentic Factoria Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-wide">
                    AGENT THINKING PROTOCOL
                  </h1>
                  <p className="text-xs text-orange-400 font-medium tracking-wider">REAL-TIME MONITORING</p>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-4">
                  <a 
                    href="/marketplace" 
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all duration-200 shadow-lg border border-orange-400/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>MARKETPLACE</span>
                  </a>
                  
                  {/* Connection Status */}
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800/60 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <div className={`w-3 h-3 rounded-full shadow-lg ${connectionStatus === 'connected' ? 'bg-green-400 shadow-green-400/50' : connectionStatus === 'connecting' ? 'bg-orange-400 shadow-orange-400/50' : 'bg-red-400 shadow-red-400/50'}`}></div>
                    <span className={`text-sm font-medium tracking-wide ${connectionStatus === 'connected' ? 'text-green-400' : connectionStatus === 'connecting' ? 'text-orange-400' : 'text-red-400'}`}>
                      {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Connection Info */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-500/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-400 font-semibold text-xs tracking-wider uppercase">MQTT URL</span>
              </div>
              <span className="text-white font-mono text-sm bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700/50">wss://supos-ce-instance4.supos.app</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-400 font-semibold text-xs tracking-wider uppercase">PORT</span>
              </div>
              <span className="text-white font-mono text-sm bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700/50">8084</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-400 font-semibold text-xs tracking-wider uppercase">TOPICS</span>
              </div>
              <div className="space-y-1">
                <div className="text-gray-300 font-mono text-xs bg-gray-900/50 px-3 py-1 rounded border border-gray-700/50">yangzhi/line1/agent/output/message</div>
                <div className="text-gray-300 font-mono text-xs bg-gray-900/50 px-3 py-1 rounded border border-gray-700/50">yangzhi/line2/agent/output/message</div>
                <div className="text-gray-300 font-mono text-xs bg-gray-900/50 px-3 py-1 rounded border border-gray-700/50">yangzhi/line3/agent/output/message</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-400 font-semibold text-xs tracking-wider uppercase">ERROR</span>
            </div>
            <p className="text-red-300 text-sm font-medium mt-2">{error}</p>
          </div>
        )}

        {/* Messages Display */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-500/20">
          <div className="p-6 border-b border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white tracking-wide">REAL-TIME AGENT MESSAGES</h2>
                </div>
                <p className="text-orange-400 text-sm font-medium mt-1 tracking-wide">
                  {messages.length} MESSAGE{messages.length !== 1 ? 'S' : ''} RECEIVED
                </p>
              </div>
              <button
                onClick={clearMessages}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all duration-200 border border-gray-600/50 backdrop-blur-sm"
                disabled={messages.length === 0}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>CLEAR</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center border border-orange-500/30">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium tracking-wide">WAITING FOR AGENT MESSAGES...</p>
              </div>
            ) : (
              <div className="divide-y divide-orange-500/10">
                {messages.map((message, index) => {
                  // Extract line number from topic
                  const lineMatch = message.topic.match(/line(\d+)/);
                  const lineNumber = lineMatch ? lineMatch[1] : '?';
                  const lineColors = {
                    '1': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                    '2': 'bg-green-500/20 text-green-300 border-green-500/30', 
                    '3': 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  };
                  const lineColor = lineColors[lineNumber as keyof typeof lineColors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
                  
                  return (
                    <div key={index} className="p-6 hover:bg-orange-500/5 transition-all duration-200 border-l-2 border-transparent hover:border-orange-500/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono text-orange-400 bg-gray-900/50 px-3 py-1 rounded-lg border border-gray-700/50">
                            {formatTimestamp(message.timestamp)}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-lg font-medium border ${lineColor}`}>
                            LINE {lineNumber}
                          </span>
                        </div>
                        <span className="text-xs text-orange-500 font-bold bg-orange-500/10 px-2 py-1 rounded border border-orange-500/30">
                          #{index + 1}
                        </span>
                      </div>
                    
                                          <div className="space-y-4">
                        {message.rawOutput !== null && (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">RAW OUTPUT</span>
                            </div>
                            <pre className="text-sm bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 font-mono overflow-x-auto text-gray-300 backdrop-blur-sm">
                              {typeof message.rawOutput === 'object' 
                                ? JSON.stringify(message.rawOutput, null, 2)
                                : String(message.rawOutput)
                              }
                            </pre>
                          </div>
                        )}
                        
                        {message.input !== null && (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">INPUT</span>
                            </div>
                            <pre className="text-sm bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 font-mono overflow-x-auto text-gray-300 backdrop-blur-sm">
                              {typeof message.input === 'object' 
                                ? JSON.stringify(message.input, null, 2)
                                : String(message.input)
                              }
                            </pre>
                          </div>
                        )}
                      </div>
                  </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
