import React, { useState } from 'react';
import { History, Copy, Trash2, Search, Download, Filter } from 'lucide-react';

interface CommandHistoryProps {
  savedCommands: string[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ savedCommands }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredCommands = savedCommands.filter(command => {
    const matchesSearch = command.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'docker' && command.includes('docker')) ||
      (filterType === 'compose' && command.includes('compose')) ||
      (filterType === 'comments' && command.startsWith('#'));
    return matchesSearch && matchesFilter;
  });

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const downloadHistory = () => {
    const content = savedCommands.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docker-commands-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCommandType = (command: string) => {
    if (command.startsWith('#')) return 'comment';
    if (command.includes('docker-compose') || command.includes('docker compose')) return 'compose';
    if (command.includes('docker')) return 'docker';
    return 'other';
  };

  const getCommandIcon = (type: string) => {
    switch (type) {
      case 'docker':
        return '🐳';
      case 'compose':
        return '🐙';
      case 'comment':
        return '💬';
      default:
        return '⚡';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Command History</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={downloadHistory}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download History</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Commands</option>
            <option value="docker">Docker Commands</option>
            <option value="compose">Docker Compose</option>
            <option value="comments">Comments</option>
          </select>
        </div>
      </div>

      {/* Commands List */}
      <div className="space-y-3">
        {filteredCommands.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {savedCommands.length === 0 
                ? 'No commands in history yet. Start using the other tools to build your command history!'
                : 'No commands found matching your search criteria.'
              }
            </p>
          </div>
        ) : (
          filteredCommands.map((command, index) => {
            const commandType = getCommandType(command);
            const icon = getCommandIcon(commandType);
            
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-lg">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                        {command}
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          commandType === 'docker' ? 'bg-blue-100 text-blue-800' :
                          commandType === 'compose' ? 'bg-purple-100 text-purple-800' :
                          commandType === 'comment' ? 'bg-gray-100 text-gray-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {commandType}
                        </span>
                        <span className="text-xs text-gray-500">
                          Position: {savedCommands.length - savedCommands.indexOf(command)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => copyToClipboard(command)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy command"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Statistics */}
      {savedCommands.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {savedCommands.length}
            </div>
            <div className="text-sm text-blue-700">Total Commands</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {savedCommands.filter(cmd => cmd.includes('docker') && !cmd.includes('compose')).length}
            </div>
            <div className="text-sm text-green-700">Docker Commands</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {savedCommands.filter(cmd => cmd.includes('compose')).length}
            </div>
            <div className="text-sm text-purple-700">Compose Commands</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {savedCommands.filter(cmd => cmd.startsWith('#')).length}
            </div>
            <div className="text-sm text-gray-700">Comments</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandHistory;