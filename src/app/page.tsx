'use client';

import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

interface AgentMessage {
  timestamp: Date;
  rawOutput: string | object | null;
  input: string | object | null;
  topic: string;
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
          
          let parsedMessage;
          try {
            parsedMessage = JSON.parse(messageStr);
          } catch {
            parsedMessage = messageStr;
          }

          const newMessage: AgentMessage = {
            timestamp: new Date(),
            rawOutput: parsedMessage.raw_output || parsedMessage,
            input: parsedMessage.input || null,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'url(/Agentic%20Factoria.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative z-10">
      {/* Banner/Logo Space */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
                  <circle cx="16" cy="16" r="15" fill="#3b82f6"/>
                  <circle cx="10" cy="12" r="2" fill="white"/>
                  <circle cx="22" cy="12" r="2" fill="white"/>
                  <path d="M10 20c0 3.314 2.686 6 6 6s6-2.686 6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="16" cy="8" r="1.5" fill="white"/>
                  <path d="M16 6.5V3M13 7.5L11 5.5M19 7.5L21 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agent Thinking Protocol
              </h1>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Connection Info */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">MQTT URL:</span>
              <span className="ml-2 text-gray-900 dark:text-white font-mono">wss://supos-ce-instance4.supos.app</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Port:</span>
              <span className="ml-2 text-gray-900 dark:text-white font-mono">8084</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Subscribed Topics:</span>
              <div className="ml-2 mt-1 space-y-1">
                <div className="text-gray-900 dark:text-white font-mono text-xs">yangzhi/line1/agent/output/message</div>
                <div className="text-gray-900 dark:text-white font-mono text-xs">yangzhi/line2/agent/output/message</div>
                <div className="text-gray-900 dark:text-white font-mono text-xs">yangzhi/line3/agent/output/message</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-300 text-sm font-medium">Error: {error}</p>
          </div>
        )}

        {/* Messages Display */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Agent Messages</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {messages.length} message{messages.length !== 1 ? 's' : ''} received
                </p>
              </div>
              <button
                onClick={clearMessages}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                disabled={messages.length === 0}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Waiting for agent messages...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message, index) => {
                  // Extract line number from topic
                  const lineMatch = message.topic.match(/line(\d+)/);
                  const lineNumber = lineMatch ? lineMatch[1] : '?';
                  const lineColors = {
                    '1': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                    '2': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 
                    '3': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  };
                  const lineColor = lineColors[lineNumber as keyof typeof lineColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                  
                  return (
                    <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            {formatTimestamp(message.timestamp)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${lineColor}`}>
                            Line {lineNumber}
                          </span>
                        </div>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          #{index + 1}
                        </span>
                      </div>
                    
                    <div className="space-y-2">
                      {message.rawOutput !== null && (
                        <div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Raw Output:</span>
                          <pre className="mt-1 text-sm bg-gray-100 dark:bg-gray-700 rounded p-2 font-mono overflow-x-auto">
                            {typeof message.rawOutput === 'object' 
                              ? JSON.stringify(message.rawOutput, null, 2)
                              : String(message.rawOutput)
                            }
                          </pre>
                        </div>
                      )}
                      
                      {message.input !== null && (
                        <div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Input:</span>
                          <pre className="mt-1 text-sm bg-gray-100 dark:bg-gray-700 rounded p-2 font-mono overflow-x-auto">
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
