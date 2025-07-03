import React, { useState } from 'react';
import { 
  Container, 
  Settings, 
  Terminal, 
  FileCode, 
  Download, 
  History,
  Plus,
  Trash2,
  Copy,
  Play,
  Save,
  Cog,
  User,
  Shield
} from 'lucide-react';
import DockerComposeGenerator from './components/DockerComposeGenerator';
import DockerCommands from './components/DockerCommands';
import DockerfileGenerator from './components/DockerfileGenerator';
import InstallationGuide from './components/InstallationGuide';
import CommandHistory from './components/CommandHistory';
import AdvancedSettings from './components/AdvancedSettings';
import CreatorPage from './components/CreatorPage';
import SecurityGuide from './components/SecurityGuide';

function App() {
  const [activeTab, setActiveTab] = useState('compose');
  const [savedCommands, setSavedCommands] = useState<string[]>([]);

  const tabs = [
    { id: 'compose', label: 'Docker Compose', icon: Settings },
    { id: 'commands', label: 'Docker Commands', icon: Terminal },
    { id: 'dockerfile', label: 'Dockerfile Generator', icon: FileCode },
    { id: 'security', label: 'Security Guide', icon: Shield },
    { id: 'advanced', label: 'Advanced Settings', icon: Cog },
    { id: 'install', label: 'Installation', icon: Download },
    { id: 'history', label: 'Command History', icon: History },
    { id: 'creator', label: 'Creator', icon: User },
  ];

  const addToHistory = (command: string) => {
    setSavedCommands(prev => {
      const newCommands = [command, ...prev.filter(cmd => cmd !== command)];
      return newCommands.slice(0, 50); // Keep only last 50 commands
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Container className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AutoDockr</h1>
            </div>
            <div className="text-sm text-gray-500">
              Advanced Docker Management Tool
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          {activeTab === 'compose' && <DockerComposeGenerator addToHistory={addToHistory} />}
          {activeTab === 'commands' && <DockerCommands addToHistory={addToHistory} />}
          {activeTab === 'dockerfile' && <DockerfileGenerator addToHistory={addToHistory} />}
          {activeTab === 'security' && <SecurityGuide addToHistory={addToHistory} />}
          {activeTab === 'advanced' && <AdvancedSettings addToHistory={addToHistory} />}
          {activeTab === 'install' && <InstallationGuide addToHistory={addToHistory} />}
          {activeTab === 'history' && <CommandHistory savedCommands={savedCommands} />}
          {activeTab === 'creator' && <CreatorPage />}
        </div>
      </div>
    </div>
  );
}

export default App;