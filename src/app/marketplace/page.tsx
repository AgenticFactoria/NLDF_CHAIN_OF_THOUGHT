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

export default function AgentMarketplace() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<MarketplaceStats>({
    totalAgents: 147,
    totalRevenue: 89420,
    avgTimeToMarket: 31,
    securityIncidents: 0,
    successfulDeployments: 1247
  });
  const [activeTab, setActiveTab] = useState<'browse' | 'publish' | 'dashboard'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mock data for demonstration
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        id: 'agent-001',
        name: 'Quality Inspector Pro',
        version: '2.1.4',
        description: 'Advanced computer vision agent for automated quality control in manufacturing lines',
        author: 'TechCorp Industries',
        category: 'Quality Control',
        price: 299,
        revenueShare: 70,
        downloads: 1247,
        rating: 4.8,
        status: 'published',
        lastUpdated: new Date('2024-01-15'),
        capabilities: ['Computer Vision', 'Defect Detection', 'Real-time Analysis'],
        licenseType: 'Commercial'
      },
      {
        id: 'agent-002',
        name: 'Predictive Maintenance AI',
        version: '1.8.2',
        description: 'Machine learning agent that predicts equipment failures before they occur',
        author: 'AI Solutions Ltd',
        category: 'Maintenance',
        price: 499,
        revenueShare: 70,
        downloads: 892,
        rating: 4.6,
        status: 'published',
        lastUpdated: new Date('2024-01-10'),
        capabilities: ['Machine Learning', 'IoT Integration', 'Anomaly Detection'],
        licenseType: 'Commercial'
      },
      {
        id: 'agent-003',
        name: 'Supply Chain Optimizer',
        version: '3.0.1',
        description: 'Intelligent agent for optimizing supply chain logistics and inventory management',
        author: 'LogiTech Corp',
        category: 'Logistics',
        price: 799,
        revenueShare: 70,
        downloads: 634,
        rating: 4.9,
        status: 'published',
        lastUpdated: new Date('2024-01-12'),
        capabilities: ['Route Optimization', 'Inventory Management', 'Cost Analysis'],
        licenseType: 'Commercial'
      }
    ];
    setAgents(mockAgents);
  }, []);

  const categories = ['all', 'Quality Control', 'Maintenance', 'Logistics', 'Safety', 'Energy Management'];

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        {/* Header */}
        <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Monitoring</span>
                </Link>
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
                  Agentic Factoria — Agent Marketplace
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalAgents}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Agents</div>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">${stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.avgTimeToMarket}h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg TTM</div>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.securityIncidents}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Security Incidents</div>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.successfulDeployments}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Deployments</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'browse', label: 'Browse Agents', icon: '🔍' },
                  { id: 'publish', label: 'Publish Agent', icon: '📤' },
                  { id: 'dashboard', label: 'Developer Dashboard', icon: '📊' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
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
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search agents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Agent Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map((agent) => (
                      <div key={agent.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">v{agent.version} by {agent.author}</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                            {agent.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{agent.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {agent.capabilities.slice(0, 3).map((capability) => (
                            <span key={capability} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                              {capability}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          {renderStarRating(agent.rating)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">{agent.downloads} downloads</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">${agent.price}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">/month</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                              Deploy
                            </button>
                            <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Submit for Review
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
                          <span className="text-gray-600 dark:text-gray-400">This Month</span>
                          <span className="font-semibold text-gray-900 dark:text-white">$4,287</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Earnings</span>
                          <span className="font-semibold text-gray-900 dark:text-white">$28,942</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Revenue Share</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">70%</span>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 