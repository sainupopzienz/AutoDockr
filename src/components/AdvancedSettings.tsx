import React, { useState } from 'react';
import { Settings, Copy, FolderOpen, HardDrive, Database, Terminal, AlertTriangle } from 'lucide-react';

interface AdvancedSettingsProps {
  addToHistory: (command: string) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ addToHistory }) => {
  const [currentDockerRoot, setCurrentDockerRoot] = useState('/var/lib/docker');
  const [newDockerRoot, setNewDockerRoot] = useState('/new/docker/path');
  const [sourceFile, setSourceFile] = useState('');
  const [destinationFile, setDestinationFile] = useState('');
  const [containerName, setContainerName] = useState('mycontainer');

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    addToHistory(command);
  };

  const dockerRootCommands = [
    {
      step: 'Stop Docker service',
      command: 'sudo systemctl stop docker',
      description: 'Stop the Docker daemon before making changes'
    },
    {
      step: 'Create new Docker directory',
      command: `sudo mkdir -p ${newDockerRoot}`,
      description: 'Create the new directory for Docker data'
    },
    {
      step: 'Copy existing Docker data',
      command: `sudo rsync -aP ${currentDockerRoot}/ ${newDockerRoot}/`,
      description: 'Copy all existing Docker data to the new location'
    },
    {
      step: 'Create daemon.json configuration',
      command: `sudo tee /etc/docker/daemon.json <<EOF
{
  "data-root": "${newDockerRoot}"
}
EOF`,
      description: 'Configure Docker to use the new data directory'
    },
    {
      step: 'Start Docker service',
      command: 'sudo systemctl start docker',
      description: 'Start Docker with the new configuration'
    },
    {
      step: 'Verify new location',
      command: 'docker info | grep "Docker Root Dir"',
      description: 'Verify that Docker is using the new root directory'
    },
    {
      step: 'Remove old Docker directory (optional)',
      command: `sudo rm -rf ${currentDockerRoot}`,
      description: 'Remove the old Docker directory after verification'
    }
  ];

  const fileTransferCommands = [
    {
      category: 'Copy from Host to Container',
      commands: [
        {
          title: 'Copy single file',
          command: `docker cp ${sourceFile || './local-file.txt'} ${containerName}:${destinationFile || '/app/file.txt'}`,
          description: 'Copy a file from host to container'
        },
        {
          title: 'Copy directory',
          command: `docker cp ${sourceFile || './local-directory'} ${containerName}:${destinationFile || '/app/directory'}`,
          description: 'Copy an entire directory from host to container'
        },
        {
          title: 'Copy with permissions preserved',
          command: `docker cp -a ${sourceFile || './local-file.txt'} ${containerName}:${destinationFile || '/app/file.txt'}`,
          description: 'Copy file preserving original permissions and ownership'
        }
      ]
    },
    {
      category: 'Copy from Container to Host',
      commands: [
        {
          title: 'Copy single file',
          command: `docker cp ${containerName}:${sourceFile || '/app/file.txt'} ${destinationFile || './local-file.txt'}`,
          description: 'Copy a file from container to host'
        },
        {
          title: 'Copy directory',
          command: `docker cp ${containerName}:${sourceFile || '/app/logs'} ${destinationFile || './logs'}`,
          description: 'Copy an entire directory from container to host'
        },
        {
          title: 'Copy to current directory',
          command: `docker cp ${containerName}:${sourceFile || '/app/config.json'} .`,
          description: 'Copy file from container to current directory'
        }
      ]
    },
    {
      category: 'Advanced File Operations',
      commands: [
        {
          title: 'Copy with tar (large files)',
          command: `docker exec ${containerName} tar -czf - ${sourceFile || '/app/data'} | tar -xzf - -C ${destinationFile || './backup'}`,
          description: 'Use tar for efficient transfer of large files/directories'
        },
        {
          title: 'Copy from stopped container',
          command: `docker cp ${containerName}:${sourceFile || '/app/logs'} ${destinationFile || './logs'}`,
          description: 'Copy files even when container is stopped'
        },
        {
          title: 'Copy with ownership change',
          command: `docker cp ${sourceFile || './file.txt'} ${containerName}:${destinationFile || '/tmp/file.txt'} && docker exec ${containerName} chown root:root ${destinationFile || '/tmp/file.txt'}`,
          description: 'Copy file and change ownership inside container'
        }
      ]
    }
  ];

  const systemCommands = [
    {
      category: 'Docker System Information',
      commands: [
        {
          title: 'Docker system info',
          command: 'docker system info',
          description: 'Display system-wide information about Docker'
        },
        {
          title: 'Docker version details',
          command: 'docker version',
          description: 'Show Docker version information'
        },
        {
          title: 'Docker disk usage',
          command: 'docker system df',
          description: 'Show Docker disk usage'
        },
        {
          title: 'Docker events (live)',
          command: 'docker system events',
          description: 'Get real-time events from the Docker daemon'
        }
      ]
    },
    {
      category: 'Docker Root Directory Management',
      commands: [
        {
          title: 'Check current Docker root',
          command: 'docker info | grep "Docker Root Dir"',
          description: 'Display current Docker root directory'
        },
        {
          title: 'Check Docker daemon configuration',
          command: 'sudo cat /etc/docker/daemon.json',
          description: 'View Docker daemon configuration file'
        },
        {
          title: 'List Docker directories',
          command: 'sudo ls -la /var/lib/docker/',
          description: 'List contents of Docker root directory'
        },
        {
          title: 'Check Docker service status',
          command: 'sudo systemctl status docker',
          description: 'Check Docker service status'
        }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Docker Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Docker Root Directory Change */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <HardDrive className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Change Docker Root Directory</h3>
          </div>
          
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Warning</p>
                <p className="text-sm text-yellow-700">
                  Changing Docker root directory will move all your containers, images, and volumes. 
                  Make sure you have enough space and backup your data.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Docker Root</label>
              <input
                type="text"
                value={currentDockerRoot}
                onChange={(e) => setCurrentDockerRoot(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="/var/lib/docker"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Docker Root</label>
              <input
                type="text"
                value={newDockerRoot}
                onChange={(e) => setNewDockerRoot(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="/new/docker/path"
              />
            </div>
          </div>

          <div className="space-y-3">
            {dockerRootCommands.map((cmd, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <h4 className="font-medium text-gray-900">{cmd.step}</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cmd.command)}
                    className="text-gray-500 hover:text-blue-600 p-1"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{cmd.description}</p>
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm overflow-x-auto">
                  {cmd.command}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Transfer Operations */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FolderOpen className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Docker File Transfer</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Container Name</label>
              <input
                type="text"
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="mycontainer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Path</label>
              <input
                type="text"
                value={sourceFile}
                onChange={(e) => setSourceFile(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="./local-file.txt or /app/file.txt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination Path</label>
              <input
                type="text"
                value={destinationFile}
                onChange={(e) => setDestinationFile(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="/app/file.txt or ./local-file.txt"
              />
            </div>
          </div>

          <div className="space-y-6">
            {fileTransferCommands.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
                <div className="space-y-3">
                  {category.commands.map((cmd, cmdIndex) => (
                    <div key={cmdIndex} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{cmd.title}</h5>
                        <button
                          onClick={() => copyToClipboard(cmd.command)}
                          className="text-gray-500 hover:text-green-600 p-1"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{cmd.description}</p>
                      <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm overflow-x-auto">
                        {cmd.command}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Commands */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 text-purple-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">System Commands</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {systemCommands.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
              <div className="space-y-3">
                {category.commands.map((cmd, cmdIndex) => (
                  <div key={cmdIndex} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{cmd.title}</h5>
                      <button
                        onClick={() => copyToClipboard(cmd.command)}
                        className="text-gray-500 hover:text-purple-600 p-1"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{cmd.description}</p>
                    <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm overflow-x-auto">
                      {cmd.command}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Docker Root Directory</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Always stop Docker before changing root directory</li>
              <li>• Ensure sufficient disk space in new location</li>
              <li>• Backup your data before migration</li>
              <li>• Test the new setup before removing old data</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">File Transfer</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use absolute paths for clarity</li>
              <li>• Consider file permissions when copying</li>
              <li>• Use tar for large file transfers</li>
              <li>• Test with small files first</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;