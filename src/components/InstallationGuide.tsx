import React, { useState } from 'react';
import { Download, Copy, Terminal, CheckCircle, AlertCircle } from 'lucide-react';

interface InstallationGuideProps {
  addToHistory: (command: string) => void;
}

const InstallationGuide: React.FC<InstallationGuideProps> = ({ addToHistory }) => {
  const [selectedOS, setSelectedOS] = useState('ubuntu');

  const installationCommands = {
    ubuntu: {
      name: 'Ubuntu/Debian',
      icon: '🐧',
      commands: [
        {
          step: 'Update package index',
          command: 'sudo apt-get update',
          description: 'Update the package index to ensure we have the latest information'
        },
        {
          step: 'Install required packages',
          command: 'sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release',
          description: 'Install packages to allow apt to use a repository over HTTPS'
        },
        {
          step: 'Add Docker GPG key',
          command: 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg',
          description: 'Add Docker official GPG key'
        },
        {
          step: 'Add Docker repository',
          command: 'echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null',
          description: 'Set up the stable repository'
        },
        {
          step: 'Update package index again',
          command: 'sudo apt-get update',
          description: 'Update the package index with Docker packages'
        },
        {
          step: 'Install Docker Engine',
          command: 'sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin',
          description: 'Install Docker Engine, CLI, and Docker Compose'
        },
        {
          step: 'Add user to docker group',
          command: 'sudo usermod -aG docker $USER',
          description: 'Add your user to the docker group to run Docker without sudo'
        },
        {
          step: 'Start and enable Docker',
          command: 'sudo systemctl start docker && sudo systemctl enable docker',
          description: 'Start Docker service and enable it to start on boot'
        }
      ],
      postInstall: [
        'Log out and log back in for group changes to take effect',
        'Or run: newgrp docker',
        'Verify installation: docker run hello-world'
      ]
    },
    centos: {
      name: 'CentOS/RHEL/Fedora',
      icon: '🎩',
      commands: [
        {
          step: 'Update system packages',
          command: 'sudo yum update -y',
          description: 'Update all system packages'
        },
        {
          step: 'Install required packages',
          command: 'sudo yum install -y yum-utils device-mapper-persistent-data lvm2',
          description: 'Install required packages for Docker'
        },
        {
          step: 'Add Docker repository',
          command: 'sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo',
          description: 'Add Docker CE repository'
        },
        {
          step: 'Install Docker Engine',
          command: 'sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin',
          description: 'Install Docker Engine and Docker Compose'
        },
        {
          step: 'Start and enable Docker',
          command: 'sudo systemctl start docker && sudo systemctl enable docker',
          description: 'Start Docker service and enable it to start on boot'
        },
        {
          step: 'Add user to docker group',
          command: 'sudo usermod -aG docker $USER',
          description: 'Add your user to the docker group'
        }
      ],
      postInstall: [
        'Log out and log back in for group changes to take effect',
        'Or run: newgrp docker',
        'Verify installation: docker run hello-world'
      ]
    },
    macos: {
      name: 'macOS',
      icon: '🍎',
      commands: [
        {
          step: 'Install Homebrew (if not installed)',
          command: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
          description: 'Install Homebrew package manager'
        },
        {
          step: 'Install Docker Desktop',
          command: 'brew install --cask docker',
          description: 'Install Docker Desktop for Mac'
        },
        {
          step: 'Start Docker Desktop',
          command: 'open -a Docker',
          description: 'Launch Docker Desktop application'
        }
      ],
      postInstall: [
        'Wait for Docker Desktop to finish starting',
        'Docker Desktop includes Docker Engine, CLI, and Docker Compose',
        'Verify installation: docker run hello-world'
      ]
    },
    windows: {
      name: 'Windows',
      icon: '🪟',
      commands: [
        {
          step: 'Download Docker Desktop',
          command: 'Visit https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe',
          description: 'Download Docker Desktop installer for Windows'
        },
        {
          step: 'Run the installer',
          command: 'Double-click Docker Desktop Installer.exe',
          description: 'Run the installer as administrator'
        },
        {
          step: 'Enable WSL 2 (if prompted)',
          command: 'wsl --install',
          description: 'Install Windows Subsystem for Linux 2'
        },
        {
          step: 'Restart your computer',
          command: 'Restart required after installation',
          description: 'Restart to complete the installation'
        }
      ],
      postInstall: [
        'Launch Docker Desktop from Start menu',
        'Accept the license agreement',
        'Docker Desktop includes Docker Engine, CLI, and Docker Compose',
        'Verify installation: docker run hello-world'
      ]
    },
    script: {
      name: 'Quick Install Script',
      icon: '⚡',
      commands: [
        {
          step: 'Universal Docker install script',
          command: 'curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh',
          description: 'Official Docker installation script (Linux only)'
        },
        {
          step: 'Add user to docker group',
          command: 'sudo usermod -aG docker $USER',
          description: 'Add your user to the docker group'
        },
        {
          step: 'Install Docker Compose',
          command: 'sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose',
          description: 'Install Docker Compose separately'
        }
      ],
      postInstall: [
        'Log out and log back in for group changes to take effect',
        'Or run: newgrp docker',
        'Verify installation: docker run hello-world'
      ]
    }
  };

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    addToHistory(command);
  };

  const copyAllCommands = () => {
    const commands = installationCommands[selectedOS as keyof typeof installationCommands].commands
      .map(cmd => cmd.command)
      .join('\n');
    navigator.clipboard.writeText(commands);
    addToHistory(`# All ${selectedOS} installation commands copied`);
  };

  const currentOS = installationCommands[selectedOS as keyof typeof installationCommands];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Docker Installation Guide</h2>
        <button
          onClick={copyAllCommands}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Copy className="h-4 w-4" />
          <span>Copy All Commands</span>
        </button>
      </div>

      {/* OS Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Your Operating System</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(installationCommands).map(([key, os]) => (
            <button
              key={key}
              onClick={() => setSelectedOS(key)}
              className={`p-4 rounded-lg border transition-all ${
                selectedOS === key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{os.icon}</div>
              <div className="text-sm font-medium">{os.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Installation Steps */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {currentOS.icon} {currentOS.name} Installation
          </h3>
          
          <div className="space-y-4">
            {currentOS.commands.map((cmd, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-gray-900">{cmd.step}</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cmd.command)}
                    className="text-gray-500 hover:text-blue-600 p-1"
                    title="Copy command"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{cmd.description}</p>
                
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                  {cmd.command}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post-Installation & Verification */}
        <div className="space-y-6">
          {/* Post-Installation Steps */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Post-Installation Steps
            </h3>
            <ul className="space-y-2">
              {currentOS.postInstall.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-green-800">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification Commands */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Terminal className="h-5 w-5 mr-2" />
              Verify Installation
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Check Docker version</span>
                  <button
                    onClick={() => copyToClipboard('docker --version')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <code className="bg-gray-900 text-green-400 p-2 rounded text-sm block">
                  docker --version
                </code>
              </div>
              
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Check Docker Compose version</span>
                  <button
                    onClick={() => copyToClipboard('docker compose version')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <code className="bg-gray-900 text-green-400 p-2 rounded text-sm block">
                  docker compose version
                </code>
              </div>
              
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Test Docker installation</span>
                  <button
                    onClick={() => copyToClipboard('docker run hello-world')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <code className="bg-gray-900 text-green-400 p-2 rounded text-sm block">
                  docker run hello-world
                </code>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Troubleshooting
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <p className="font-medium text-yellow-800 mb-1">Permission denied error?</p>
                <p className="text-yellow-700">Make sure you're in the docker group and have logged out/in.</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg">
                <p className="font-medium text-yellow-800 mb-1">Docker daemon not running?</p>
                <p className="text-yellow-700">
                  Start Docker service: <code>sudo systemctl start docker</code>
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-lg">
                <p className="font-medium text-yellow-800 mb-1">WSL 2 issues on Windows?</p>
                <p className="text-yellow-700">
                  Enable WSL 2 and virtualization in BIOS if needed.
                </p>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Useful Links</h3>
            <div className="space-y-2">
              <a
                href="https://docs.docker.com/get-started/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                📖 Docker Documentation
              </a>
              <a
                href="https://docs.docker.com/compose/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                🐳 Docker Compose Documentation
              </a>
              <a
                href="https://hub.docker.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                🏪 Docker Hub
              </a>
              <a
                href="https://docs.docker.com/engine/reference/commandline/cli/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                💻 Docker CLI Reference
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationGuide;