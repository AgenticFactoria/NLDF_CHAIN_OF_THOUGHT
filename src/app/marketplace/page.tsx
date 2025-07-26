'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  price: number;
  revenueShare: number;
  downloads: number;
  rating: number;
  status: 'published' | 'pending' | 'rejected';
  lastUpdated: Date;
  capabilities: string[];
  licenseType: 'MIT' | 'Commercial' | 'Custom';
}

interface MarketplaceStats {
  totalAgents: number;
  totalRevenue: number;
  avgTimeToMarket: number;
  securityIncidents: number;
  successfulDeployments: number;
}

interface Web3State {
  isConnected: boolean;
  address: string | null;
  balance: number;
  injBalance: number;
  network: string;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'purchase' | 'revenue' | 'stake' | 'unstake';
  amount: number;
  token: 'INJ' | 'BNB';
  agentName?: string;
  timestamp: Date;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export default function AgentMarketplace() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<MarketplaceStats>({
    totalAgents: 147,
    totalRevenue: 89420,
    avgTimeToMarket: 31,
    securityIncidents: 0,
    successfulDeployments: 1247
  });
  const [activeTab, setActiveTab] = useState<'browse' | 'publish' | 'dashboard' | 'defi'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    address: null,
    balance: 0,
    injBalance: 0,
    network: 'BNB Chain',
    transactions: []
  });
  const [injPrice, setInjPrice] = useState(23.45);
  const [loading, setLoading] = useState(false);
  const [deployingAgent, setDeployingAgent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'downloads' | 'newest'>('rating');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Mock Web3 connection
  const connectWallet = async () => {
    // Simulate wallet connection
    setTimeout(() => {
      setWeb3State({
        isConnected: true,
        address: '0x742d35Cc6E8AC45A5C9F6D9f65d5c2e3c8A1B9D2',
        balance: 2.4567,
        injBalance: 892.34,
        network: 'BNB Chain',
        transactions: [
          {
            id: 'tx001',
            type: 'purchase',
            amount: 12.7,
            token: 'INJ',
            agentName: 'Quality Inspector Pro',
            timestamp: new Date('2024-01-15T10:30:00'),
            hash: '0xabcd1234...',
            status: 'confirmed'
          },
          {
            id: 'tx002',
            type: 'revenue',
            amount: 5.2,
            token: 'INJ',
            agentName: 'My AI Agent',
            timestamp: new Date('2024-01-14T15:45:00'),
            hash: '0xefgh5678...',
            status: 'confirmed'
          },
          {
            id: 'tx003',
            type: 'stake',
            amount: 100,
            token: 'INJ',
            timestamp: new Date('2024-01-13T09:15:00'),
            hash: '0xijkl9012...',
            status: 'confirmed'
          }
        ]
      });
    }, 1000);
  };

  const disconnectWallet = () => {
    setWeb3State({
      isConnected: false,
      address: null,
      balance: 0,
      injBalance: 0,
      network: 'BNB Chain',
      transactions: []
    });
  };

  // Simulate real-time INJ price updates
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setInjPrice(prev => {
        const volatility = (Math.random() - 0.5) * 0.02; // ±1% change
        const newPrice = prev * (1 + volatility);
        return Math.max(15, Math.min(35, Number(newPrice.toFixed(2)))); // Keep price between $15-35
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(priceInterval);
  }, []);

  // Load agents with realistic data
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockAgents: Agent[] = [
        {
          id: 'agent-001',
          name: 'Quality Inspector Pro',
          version: '2.1.4',
          description: 'Advanced computer vision agent for automated quality control in manufacturing lines with real-time defect detection and classification capabilities.',
          author: 'TechCorp Industries',
          category: 'Quality Control',
          price: 299,
          revenueShare: 70,
          downloads: 1247 + Math.floor(Math.random() * 50), // Dynamic downloads
          rating: 4.8,
          status: 'published',
          lastUpdated: new Date('2024-01-15'),
          capabilities: ['Computer Vision', 'Defect Detection', 'Real-time Analysis', 'ML Classification'],
          licenseType: 'Commercial'
        },
        {
          id: 'agent-002',
          name: 'Predictive Maintenance AI',
          version: '1.8.2',
          description: 'Machine learning agent that predicts equipment failures before they occur using IoT sensor data and historical patterns.',
          author: 'AI Solutions Ltd',
          category: 'Maintenance',
          price: 499,
          revenueShare: 70,
          downloads: 892 + Math.floor(Math.random() * 30),
          rating: 4.6,
          status: 'published',
          lastUpdated: new Date('2024-01-10'),
          capabilities: ['Machine Learning', 'IoT Integration', 'Anomaly Detection', 'Predictive Analytics'],
          licenseType: 'Commercial'
        },
        {
          id: 'agent-003',
          name: 'Supply Chain Optimizer',
          version: '3.0.1',
          description: 'Intelligent agent for optimizing supply chain logistics and inventory management with real-time route optimization.',
          author: 'LogiTech Corp',
          category: 'Logistics',
          price: 799,
          revenueShare: 70,
          downloads: 634 + Math.floor(Math.random() * 25),
          rating: 4.9,
          status: 'published',
          lastUpdated: new Date('2024-01-12'),
          capabilities: ['Route Optimization', 'Inventory Management', 'Cost Analysis', 'Demand Forecasting'],
          licenseType: 'Commercial'
        },
        {
          id: 'agent-004',
          name: 'Energy Monitor',
          version: '1.5.7',
          description: 'Smart energy consumption monitoring and optimization agent for industrial facilities.',
          author: 'GreenTech Solutions',
          category: 'Energy Management',
          price: 199,
          revenueShare: 70,
          downloads: 445 + Math.floor(Math.random() * 20),
          rating: 4.4,
          status: 'published',
          lastUpdated: new Date('2024-01-08'),
          capabilities: ['Energy Monitoring', 'Optimization Algorithms', 'Carbon Tracking'],
          licenseType: 'MIT'
        },
        {
          id: 'agent-005',
          name: 'Safety Compliance Bot',
          version: '2.3.1',
          description: 'Automated safety compliance monitoring and reporting agent for workplace safety management.',
          author: 'SafeWork Industries',
          category: 'Safety',
          price: 399,
          revenueShare: 70,
          downloads: 723 + Math.floor(Math.random() * 15),
          rating: 4.7,
          status: 'published',
          lastUpdated: new Date('2024-01-14'),
          capabilities: ['Compliance Monitoring', 'Risk Assessment', 'Incident Reporting'],
          licenseType: 'Commercial'
        }
      ];
      
      setAgents(mockAgents);
      setLoading(false);
      
      // Update stats based on agents
      const totalDownloads = mockAgents.reduce((sum, agent) => sum + agent.downloads, 0);
      const avgRating = mockAgents.reduce((sum, agent) => sum + agent.rating, 0) / mockAgents.length;
      const totalRevenue = mockAgents.reduce((sum, agent) => sum + (agent.price * agent.downloads * 0.3), 0); // Platform's 30% share
      
      setStats(prev => ({
        ...prev,
        totalAgents: mockAgents.length,
        totalRevenue: Math.round(totalRevenue),
        successfulDeployments: totalDownloads
      }));
    }, 1500);
  }, []);

  const categories = ['all', 'Quality Control', 'Maintenance', 'Logistics', 'Safety', 'Energy Management'];

  // Enhanced filtering and sorting logic
  const filteredAndSortedAgents = agents
    .filter(agent => {
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = agent.price >= priceRange[0] && agent.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  // Agent deployment logic
  const deployAgent = async (agentId: string) => {
    if (!web3State.isConnected) return;
    
    setDeployingAgent(agentId);
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const injCost = agent.price / injPrice;
    
    if (web3State.injBalance < injCost) {
      alert('Insufficient INJ balance for deployment');
      setDeployingAgent(null);
      return;
    }

    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update user's balance and add transaction
      setWeb3State(prev => ({
        ...prev,
        injBalance: prev.injBalance - injCost,
        transactions: [
          {
            id: `tx_${Date.now()}`,
            type: 'purchase',
            amount: injCost,
            token: 'INJ',
            agentName: agent.name,
            timestamp: new Date(),
            hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
            status: 'confirmed'
          },
          ...prev.transactions
        ]
      }));

      // Update agent downloads
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { ...a, downloads: a.downloads + 1 }
          : a
      ));

      alert(`Successfully deployed ${agent.name}!`);
    } catch (error) {
      alert('Deployment failed. Please try again.');
    } finally {
      setDeployingAgent(null);
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-orange-500/20 rotate-45 rounded-lg"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-orange-400/10 rotate-12 rounded-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-orange-600/15 -rotate-12 rounded-lg"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-orange-500/10 rotate-45 rounded-lg"></div>
        <div className="absolute top-1/3 left-1/2 w-28 h-28 border border-orange-400/15 rotate-30 rounded-lg"></div>
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
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-orange-500/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                                <Link href="/" className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium tracking-wide">BACK TO MONITORING</span>
                </Link>
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-xl border-2 border-orange-500/30">
                  <img 
                    src="/agentic-factoria-logo.png" 
                    alt="Agentic Factoria Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-wide">
                    AGENTIC FACTORIA — AGENT MARKETPLACE
                  </h1>
                  <p className="text-xs text-orange-400 font-medium tracking-wider">WEB3 ECOSYSTEM</p>
                </div>
               </div>
               
               {/* Web3 Wallet Connection */}
               <div className="flex items-center space-x-4">
                                   {/* INJ Price Display */}
                  <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-xl border border-orange-500/30 backdrop-blur-sm">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">INJ</span>
                    </div>
                    <span className="text-sm font-bold text-orange-400 tracking-wide">
                      ${injPrice.toFixed(2)}
                    </span>
                  </div>
                 
                                   {web3State.isConnected ? (
                    <div className="flex items-center space-x-3">
                      <div className="text-right px-4 py-2 bg-gray-800/60 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                        <div className="text-sm font-bold text-white">
                          {web3State.injBalance.toFixed(2)} INJ
                        </div>
                        <div className="text-xs text-orange-400 font-mono">
                          {web3State.address?.slice(0, 6)}...{web3State.address?.slice(-4)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                        <span className="text-sm text-green-400 font-bold tracking-wide">
                          {web3State.network}
                        </span>
                      </div>
                      <button
                        onClick={disconnectWallet}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all duration-200 border border-gray-600/50 backdrop-blur-sm"
                      >
                        DISCONNECT
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={connectWallet}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 shadow-lg border border-orange-400/20 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>CONNECT WALLET</span>
                    </button>
                  )}
               </div>
             </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-400 font-semibold text-xs tracking-wider uppercase">AGENTS</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalAgents}</div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-semibold text-xs tracking-wider uppercase">REVENUE</span>
              </div>
              <div className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-yellow-500/20 p-6 hover:border-yellow-500/40 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-400 font-semibold text-xs tracking-wider uppercase">AVG TTM</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.avgTimeToMarket}h</div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-red-500/20 p-6 hover:border-red-500/40 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-400 font-semibold text-xs tracking-wider uppercase">INCIDENTS</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.securityIncidents}</div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-purple-400 font-semibold text-xs tracking-wider uppercase">DEPLOYS</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.successfulDeployments}</div>
            </div>
          </div>

                               {/* Navigation Tabs */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-500/20 mb-8">
                         <div className="border-b border-orange-500/20">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'browse', label: 'BROWSE AGENTS', icon: '🔍' },
                  { id: 'publish', label: 'PUBLISH AGENT', icon: '📤' },
                  { id: 'dashboard', label: 'DEVELOPER DASHBOARD', icon: '📊' },
                  { id: 'defi', label: 'DEFI YIELD', icon: '💎' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'browse' | 'publish' | 'dashboard' | 'defi')}
                    className={`py-6 px-1 border-b-2 font-bold text-sm tracking-wide transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-400'
                        : 'border-transparent text-gray-400 hover:text-orange-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'browse' && (
                <div>
                  {/* Search and Filters */}
                  <div className="space-y-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search agents, capabilities, or authors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                        />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category} className="bg-gray-800">
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                      >
                        <option value="rating" className="bg-gray-800">Highest Rated</option>
                        <option value="price" className="bg-gray-800">Lowest Price</option>
                        <option value="downloads" className="bg-gray-800">Most Popular</option>
                        <option value="newest" className="bg-gray-800">Newest</option>
                      </select>
                    </div>
                    
                    {/* Price Range Filter */}
                    <div className="flex items-center space-x-4 px-4 py-3 bg-gray-800/40 rounded-xl border border-gray-600/30">
                      <span className="text-orange-400 text-sm font-medium whitespace-nowrap">PRICE RANGE:</span>
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="text-white text-sm">${priceRange[0]}</span>
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="50"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-white text-sm">${priceRange[1]}</span>
                      </div>
                    </div>
                    
                    {/* Results Summary */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {loading ? 'Loading...' : `${filteredAndSortedAgents.length} agents found`}
                      </span>
                      <span className="text-orange-400">
                        INJ: ${injPrice.toFixed(2)} {injPrice > 23.45 ? '📈' : '📉'}
                      </span>
                    </div>
                  </div>

                  {/* Agent Grid */}
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-800/40 rounded-2xl p-6 border border-gray-600/30 animate-pulse">
                          <div className="h-4 bg-gray-700 rounded mb-4"></div>
                          <div className="h-3 bg-gray-700 rounded mb-2"></div>
                          <div className="h-3 bg-gray-700 rounded mb-4"></div>
                          <div className="flex space-x-2 mb-4">
                            <div className="h-6 bg-gray-700 rounded w-16"></div>
                            <div className="h-6 bg-gray-700 rounded w-20"></div>
                          </div>
                          <div className="h-8 bg-gray-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAndSortedAgents.map((agent) => (
                        <div key={agent.id} className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-600/30 hover:border-orange-500/50 transition-all duration-200 hover:shadow-2xl hover:shadow-orange-500/10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
                              <p className="text-sm text-gray-400">v{agent.version} by <span className="text-orange-400">{agent.author}</span></p>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span className="px-3 py-1 text-xs font-bold bg-orange-500/20 text-orange-400 rounded-lg border border-orange-500/30">
                                {agent.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {agent.lastUpdated.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                         
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agent.description}</p>
                         
                          <div className="flex flex-wrap gap-2 mb-4">
                            {agent.capabilities.slice(0, 3).map((capability) => (
                              <span key={capability} className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded border border-gray-600/50">
                                {capability}
                              </span>
                            ))}
                            {agent.capabilities.length > 3 && (
                              <span className="px-2 py-1 text-xs text-orange-400 rounded">
                                +{agent.capabilities.length - 3} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            {renderStarRating(agent.rating)}
                            <div className="text-right">
                              <div className="text-sm text-gray-300">{agent.downloads.toLocaleString()} downloads</div>
                              <div className="text-xs text-gray-500">{agent.licenseType}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-white">${agent.price}</span>
                                <span className="text-sm text-gray-400">/month</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">I</span>
                                </div>
                                <span className="text-sm font-medium text-orange-400">
                                  {(agent.price / injPrice).toFixed(1)} INJ
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => deployAgent(agent.id)}
                                disabled={!web3State.isConnected || deployingAgent === agent.id}
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                                  web3State.isConnected 
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg' 
                                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {deployingAgent === agent.id ? (
                                  <div className="flex items-center justify-center space-x-2">
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>DEPLOYING...</span>
                                  </div>
                                ) : web3State.isConnected ? (
                                  'DEPLOY'
                                ) : (
                                  'CONNECT WALLET'
                                )}
                              </button>
                              <button className="px-3 py-2 text-sm font-medium border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-200">
                                DETAILS
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                   
                  {!loading && filteredAndSortedAgents.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/40 rounded-2xl flex items-center justify-center border border-gray-600/30">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.7-2.6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No agents found</h3>
                      <p className="text-gray-400 mb-4">Try adjusting your search criteria or filters</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setPriceRange([0, 1000]);
                        }}
                        className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
                      >
                        RESET FILTERS
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'publish' && (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Publish New Agent</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Agent Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="My Awesome Agent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe what your agent does..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Quality Control</option>
                          <option>Maintenance</option>
                          <option>Logistics</option>
                          <option>Safety</option>
                          <option>Energy Management</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          License Type
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>MIT</option>
                          <option>Commercial</option>
                          <option>Custom</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        OCI Container Image
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="registry.example.com/my-agent:v1.0.0"
                      />
                    </div>

                                         <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                           Price ($/month)
                         </label>
                         <input
                           type="number"
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="299"
                         />
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                           ≈ {(299 / injPrice).toFixed(1)} INJ at current rate
                         </p>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                           Revenue Share (%)
                         </label>
                         <input
                           type="number"
                           value="70"
                           disabled
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                         />
                       </div>
                     </div>

                                         <div className="space-y-4">
                       <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                         <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">CI/CD Pipeline Status</h4>
                         <div className="space-y-2 text-sm">
                           <div className="flex items-center">
                             <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                             <span className="text-blue-800 dark:text-blue-300">Security scan passed</span>
                           </div>
                           <div className="flex items-center">
                             <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                             <span className="text-blue-800 dark:text-blue-300">Container signed with Cosign</span>
                           </div>
                           <div className="flex items-center">
                             <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                             <span className="text-blue-800 dark:text-blue-300">Test harness pending</span>
                           </div>
                         </div>
                       </div>

                       <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                         <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Web3 Integration</h4>
                         <div className="space-y-2 text-sm">
                           <div className="flex items-center">
                             <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                             <span className="text-purple-800 dark:text-purple-300">Smart contract verified on BNB Chain</span>
                           </div>
                           <div className="flex items-center">
                             <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                             <span className="text-purple-800 dark:text-purple-300">INJ token payment integration</span>
                           </div>
                           <div className="flex items-center">
                             <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                             <span className="text-purple-800 dark:text-purple-300">Automated revenue distribution</span>
                           </div>
                         </div>
                       </div>
                     </div>

                                         <button 
                       className={`w-full py-3 rounded-lg transition-colors font-medium ${
                         web3State.isConnected 
                           ? 'bg-blue-600 text-white hover:bg-blue-700' 
                           : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                       }`}
                       disabled={!web3State.isConnected}
                     >
                       {web3State.isConnected ? 'Submit for Review (Gas: 0.001 BNB)' : 'Connect Wallet to Submit'}
                     </button>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Developer Dashboard</h2>
                  
                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {/* Revenue Analytics */}
                     <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Analytics</h3>
                       <div className="space-y-4">
                         <div className="flex justify-between">
                           <span className="text-gray-600 dark:text-gray-400">This Month (USD)</span>
                           <span className="font-semibold text-gray-900 dark:text-white">$4,287</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600 dark:text-gray-400">This Month (INJ)</span>
                           <span className="font-semibold text-blue-600 dark:text-blue-400">{(4287 / injPrice).toFixed(1)} INJ</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600 dark:text-gray-400">Total Earnings</span>
                           <span className="font-semibold text-gray-900 dark:text-white">$28,942</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600 dark:text-gray-400">Revenue Share</span>
                           <span className="font-semibold text-green-600 dark:text-green-400">70%</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600 dark:text-gray-400">Staked INJ</span>
                           <span className="font-semibold text-purple-600 dark:text-purple-400">1,245 INJ</span>
                         </div>
                       </div>
                     </div>

                    {/* Deployment Status */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deployment Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Active Deployments</span>
                          <span className="font-semibold text-gray-900 dark:text-white">23</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Avg Response Time</span>
                          <span className="font-semibold text-gray-900 dark:text-white">125ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">99.9%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* My Published Agents */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Published Agents</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-600">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Version</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Downloads</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {agents.slice(0, 3).map((agent) => (
                            <tr key={agent.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {agent.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {agent.version}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {agent.downloads}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                ${(agent.price * agent.downloads * 0.7).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Published
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                                 </div>
               )}

               {activeTab === 'defi' && (
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">DeFi Yield & Staking</h2>
                   
                   {!web3State.isConnected ? (
                     <div className="text-center py-12">
                       <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                         <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                         </svg>
                       </div>
                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h3>
                       <p className="text-gray-600 dark:text-gray-400 mb-6">Connect your wallet to access DeFi yield farming and staking features</p>
                       <button
                         onClick={connectWallet}
                         className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                       >
                         Connect Wallet
                       </button>
                     </div>
                   ) : (
                     <div className="space-y-6">
                       {/* Staking Pool */}
                       <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                         <div className="flex items-center justify-between mb-4">
                           <div>
                             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">INJ Staking Pool</h3>
                             <p className="text-sm text-gray-600 dark:text-gray-400">Earn yield by staking INJ tokens</p>
                           </div>
                           <div className="text-right">
                             <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12.5%</div>
                             <div className="text-sm text-gray-600 dark:text-gray-400">APY</div>
                           </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                           <div>
                             <div className="text-sm text-gray-600 dark:text-gray-400">Your Balance</div>
                             <div className="text-lg font-semibold text-gray-900 dark:text-white">{web3State.injBalance.toFixed(2)} INJ</div>
                           </div>
                           <div>
                             <div className="text-sm text-gray-600 dark:text-gray-400">Currently Staked</div>
                             <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">1,245.00 INJ</div>
                           </div>
                           <div>
                             <div className="text-sm text-gray-600 dark:text-gray-400">Pending Rewards</div>
                             <div className="text-lg font-semibold text-green-600 dark:text-green-400">15.67 INJ</div>
                           </div>
                         </div>

                         <div className="flex space-x-4">
                           <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                             Stake More
                           </button>
                           <button className="flex-1 py-2 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium">
                             Unstake
                           </button>
                           <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                             Claim Rewards
                           </button>
                         </div>
                       </div>

                       {/* Liquidity Mining */}
                       <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Liquidity Mining Pools</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500">
                             <div className="flex items-center justify-between mb-2">
                               <span className="font-medium text-gray-900 dark:text-white">INJ/BNB Pool</span>
                               <span className="text-green-600 dark:text-green-400 font-semibold">18.3% APY</span>
                             </div>
                             <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">TVL: $2.4M</div>
                             <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                               Add Liquidity
                             </button>
                           </div>
                           
                           <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500">
                             <div className="flex items-center justify-between mb-2">
                               <span className="font-medium text-gray-900 dark:text-white">INJ/USDT Pool</span>
                               <span className="text-green-600 dark:text-green-400 font-semibold">15.7% APY</span>
                             </div>
                             <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">TVL: $1.8M</div>
                             <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                               Add Liquidity
                             </button>
                           </div>
                         </div>
                       </div>

                       {/* Transaction History */}
                       <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                         <div className="space-y-3">
                           {web3State.transactions.map((tx) => (
                             <div key={tx.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                               <div className="flex items-center space-x-3">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                   tx.type === 'purchase' ? 'bg-blue-100 dark:bg-blue-900' :
                                   tx.type === 'revenue' ? 'bg-green-100 dark:bg-green-900' :
                                   'bg-purple-100 dark:bg-purple-900'
                                 }`}>
                                   {tx.type === 'purchase' ? '🛒' : 
                                    tx.type === 'revenue' ? '💰' : 
                                    tx.type === 'stake' ? '🏦' : '📤'}
                                 </div>
                                 <div>
                                   <div className="font-medium text-gray-900 dark:text-white">
                                     {tx.type === 'purchase' ? `Purchased ${tx.agentName}` :
                                      tx.type === 'revenue' ? `Revenue from ${tx.agentName}` :
                                      tx.type === 'stake' ? 'Staked INJ tokens' :
                                      'Unstaked INJ tokens'}
                                   </div>
                                   <div className="text-sm text-gray-500 dark:text-gray-400">
                                     {tx.timestamp.toLocaleDateString()} • {tx.hash}
                                   </div>
                                 </div>
                               </div>
                               <div className="text-right">
                                 <div className={`font-semibold ${
                                   tx.type === 'purchase' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                 }`}>
                                   {tx.type === 'purchase' ? '-' : '+'}{tx.amount} {tx.token}
                                 </div>
                                 <div className={`text-xs px-2 py-1 rounded-full ${
                                   tx.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                   tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                 }`}>
                                   {tx.status}
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>

                       {/* Smart Contract Info */}
                       <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                         <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">Smart Contract Information</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                           <div>
                             <span className="text-blue-800 dark:text-blue-300 font-medium">Marketplace Contract:</span>
                             <div className="font-mono text-blue-600 dark:text-blue-400 break-all">0x1a2b3c4d5e6f...789a</div>
                           </div>
                           <div>
                             <span className="text-blue-800 dark:text-blue-300 font-medium">INJ Token Contract:</span>
                             <div className="font-mono text-blue-600 dark:text-blue-400 break-all">0xabc123def456...789z</div>
                           </div>
                           <div>
                             <span className="text-blue-800 dark:text-blue-300 font-medium">Staking Contract:</span>
                             <div className="font-mono text-blue-600 dark:text-blue-400 break-all">0x9f8e7d6c5b4a...321x</div>
                           </div>
                           <div>
                             <span className="text-blue-800 dark:text-blue-300 font-medium">Network:</span>
                             <div className="text-blue-600 dark:text-blue-400">BNB Smart Chain (BSC)</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               )}
             </div>
           </div>
         </main>
       </div>
     </div>
   );
 } 