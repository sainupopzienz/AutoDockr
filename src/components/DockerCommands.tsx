import React, { useState } from 'react';
import { Terminal, Copy, Play, Search, Filter, Download, Upload, Database, Activity, Eye, Trash2, Network } from 'lucide-react';

interface DockerCommandsProps {
  addToHistory: (command: string) => void;
}

const DockerCommands: React.FC<DockerCommandsProps> = ({ addToHistory }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customImageName, setCustomImageName] = useState('myapp');
  const [customImageTag, setCustomImageTag] = useState('latest');
  const [containerName, setContainerName] = useState('mycontainer');
  const [networkName, setNetworkName] = useState('mynetwork');
  const [registryUrl, setRegistryUrl] = useState('docker.io');

  const categories = [
    { id: 'all', name: 'All Commands' },
    { id: 'basic', name: 'Basic Operations' },
    { id: 'images', name: 'Image Management' },
    { id: 'containers', name: 'Container Management' },
    { id: 'volumes', name: 'Volume Management' },
    { id: 'networks', name: 'Network Management' },
    { id: 'system', name: 'System Commands' },
    { id: 'backup', name: 'Backup & Export' },
    { id: 'monitoring', name: 'Monitoring & Logs' },
    { id: 'security', name: 'Security & Scanning' }
  ];

  const dockerCommands = [
    // Basic Operations
    {
      category: 'basic',
      title: 'Pull Docker Image',
      command: `docker pull ${customImageName}:${customImageTag}`,
      description: 'Download a Docker image from Docker Hub or registry',
      example: 'docker pull ubuntu:20.04'
    },
    {
      category: 'basic',
      title: 'Run Container',
      command: `docker run -d --name ${containerName} -p 8080:80 ${customImageName}:${customImageTag}`,
      description: 'Run a container in detached mode with port mapping',
      example: 'docker run -d --name webapp -p 3000:3000 node:16'
    },
    {
      category: 'basic',
      title: 'List Running Containers',
      command: 'docker ps',
      description: 'Show all running containers',
      example: 'docker ps -a (show all containers including stopped)'
    },
    {
      category: 'basic',
      title: 'Stop Container',
      command: `docker stop ${containerName}`,
      description: 'Stop a running container',
      example: 'docker stop webapp'
    },
    {
      category: 'basic',
      title: 'Remove Container',
      command: `docker rm ${containerName}`,
      description: 'Remove a stopped container',
      example: 'docker rm webapp'
    },

    // Image Management
    {
      category: 'images',
      title: 'List Images',
      command: 'docker images',
      description: 'List all Docker images on the system',
      example: 'docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}"'
    },
    {
      category: 'images',
      title: 'Build Image',
      command: `docker build -t ${customImageName}:${customImageTag} .`,
      description: 'Build a Docker image from a Dockerfile',
      example: 'docker build -t webapp:v1.0 --no-cache .'
    },
    {
      category: 'images',
      title: 'Remove Image',
      command: `docker rmi ${customImageName}:${customImageTag}`,
      description: 'Remove a Docker image',
      example: 'docker rmi $(docker images -q) (remove all images)'
    },
    {
      category: 'images',
      title: 'Tag Image',
      command: `docker tag ${customImageName}:${customImageTag} ${registryUrl}/${customImageName}:${customImageTag}`,
      description: 'Create a tag for an existing image',
      example: 'docker tag myapp:latest myregistry.com/myapp:v1.0'
    },
    {
      category: 'images',
      title: 'Push Image',
      command: `docker push ${registryUrl}/${customImageName}:${customImageTag}`,
      description: 'Push an image to Docker registry',
      example: 'docker push myregistry.com/myapp:v1.0'
    },
    {
      category: 'images',
      title: 'Pull from Custom Registry',
      command: `docker pull ${registryUrl}/${customImageName}:${customImageTag}`,
      description: 'Pull image from custom registry',
      example: 'docker pull myregistry.com/myapp:latest'
    },
    {
      category: 'images',
      title: 'Multi-arch Build',
      command: `docker buildx build --platform linux/amd64,linux/arm64 -t ${customImageName}:${customImageTag} --push .`,
      description: 'Build multi-architecture image',
      example: 'docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest --push .'
    },

    // Container Management
    {
      category: 'containers',
      title: 'Execute Command in Container',
      command: `docker exec -it ${containerName} /bin/bash`,
      description: 'Execute an interactive command in a running container',
      example: 'docker exec -it webapp sh'
    },
    {
      category: 'containers',
      title: 'Copy Files to Container',
      command: `docker cp ./file.txt ${containerName}:/app/file.txt`,
      description: 'Copy files from host to container',
      example: 'docker cp ./config.json webapp:/app/config.json'
    },
    {
      category: 'containers',
      title: 'Copy Files from Container',
      command: `docker cp ${containerName}:/app/logs ./logs`,
      description: 'Copy files from container to host',
      example: 'docker cp webapp:/var/log/app.log ./app.log'
    },
    {
      category: 'containers',
      title: 'Restart Container',
      command: `docker restart ${containerName}`,
      description: 'Restart a container',
      example: 'docker restart webapp'
    },
    {
      category: 'containers',
      title: 'Pause Container',
      command: `docker pause ${containerName}`,
      description: 'Pause all processes in a container',
      example: 'docker pause webapp'
    },
    {
      category: 'containers',
      title: 'Unpause Container',
      command: `docker unpause ${containerName}`,
      description: 'Unpause all processes in a container',
      example: 'docker unpause webapp'
    },
    {
      category: 'containers',
      title: 'Run with Security Options',
      command: `docker run -d --name ${containerName} --user 1001:1001 --read-only --tmpfs /tmp --security-opt no-new-privileges:true ${customImageName}:${customImageTag}`,
      description: 'Run container with security hardening',
      example: 'docker run -d --name secure-app --user 1001:1001 --read-only nginx:alpine'
    },

    // Volume Management
    {
      category: 'volumes',
      title: 'List Volumes',
      command: 'docker volume ls',
      description: 'List all Docker volumes',
      example: 'docker volume ls -f dangling=true'
    },
    {
      category: 'volumes',
      title: 'Create Volume',
      command: 'docker volume create myvolume',
      description: 'Create a new Docker volume',
      example: 'docker volume create --driver local database-volume'
    },
    {
      category: 'volumes',
      title: 'Remove Volume',
      command: 'docker volume rm myvolume',
      description: 'Remove a Docker volume',
      example: 'docker volume rm database-volume'
    },
    {
      category: 'volumes',
      title: 'Inspect Volume',
      command: 'docker volume inspect myvolume',
      description: 'Display detailed information about a volume',
      example: 'docker volume inspect database-volume'
    },

    // Network Management
    {
      category: 'networks',
      title: 'List Networks',
      command: 'docker network ls',
      description: 'List all Docker networks',
      example: 'docker network ls --format "table {{.Name}}\\t{{.Driver}}\\t{{.Scope}}"'
    },
    {
      category: 'networks',
      title: 'Create Network',
      command: `docker network create ${networkName}`,
      description: 'Create a new Docker network',
      example: 'docker network create --driver bridge app-network'
    },
    {
      category: 'networks',
      title: 'Remove Network',
      command: `docker network rm ${networkName}`,
      description: 'Remove a Docker network',
      example: 'docker network rm app-network'
    },
    {
      category: 'networks',
      title: 'Connect Container to Network',
      command: `docker network connect ${networkName} ${containerName}`,
      description: 'Connect a container to a network',
      example: 'docker network connect app-network webapp'
    },
    {
      category: 'networks',
      title: 'Disconnect Container from Network',
      command: `docker network disconnect ${networkName} ${containerName}`,
      description: 'Disconnect a container from a network',
      example: 'docker network disconnect app-network webapp'
    },
    {
      category: 'networks',
      title: 'Inspect Network',
      command: `docker network inspect ${networkName}`,
      description: 'Display detailed information about a network',
      example: 'docker network inspect bridge'
    },
    {
      category: 'networks',
      title: 'Create Custom Bridge Network',
      command: `docker network create --driver bridge --subnet=172.20.0.0/16 --ip-range=172.20.240.0/20 ${networkName}`,
      description: 'Create a custom bridge network with specific subnet',
      example: 'docker network create --driver bridge --subnet=172.20.0.0/16 custom-bridge'
    },

    // System Commands
    {
      category: 'system',
      title: 'System Information',
      command: 'docker system info',
      description: 'Display system-wide information',
      example: 'docker system df (show disk usage)'
    },
    {
      category: 'system',
      title: 'Prune System',
      command: 'docker system prune -a',
      description: 'Remove all unused containers, networks, images',
      example: 'docker system prune -a --volumes'
    },
    {
      category: 'system',
      title: 'Prune Images',
      command: 'docker image prune -a',
      description: 'Remove all unused images',
      example: 'docker image prune -a --filter "until=24h"'
    },
    {
      category: 'system',
      title: 'Prune Containers',
      command: 'docker container prune',
      description: 'Remove all stopped containers',
      example: 'docker container prune --filter "until=24h"'
    },

    // Backup & Export
    {
      category: 'backup',
      title: 'Save Image to TAR',
      command: `docker save ${customImageName}:${customImageTag} | gzip > ${customImageName}_${customImageTag}.tar.gz`,
      description: 'Save Docker image to compressed TAR file',
      example: 'docker save nginx:latest | gzip > nginx_latest.tar.gz'
    },
    {
      category: 'backup',
      title: 'Load Image from TAR',
      command: `docker load < ${customImageName}_${customImageTag}.tar.gz`,
      description: 'Load Docker image from TAR file',
      example: 'docker load < nginx_latest.tar.gz'
    },
    {
      category: 'backup',
      title: 'Export Container',
      command: `docker export ${containerName} > ${containerName}_backup.tar`,
      description: 'Export container filesystem as TAR archive',
      example: 'docker export webapp > webapp_backup.tar'
    },
    {
      category: 'backup',
      title: 'Import Container',
      command: `docker import ${containerName}_backup.tar ${customImageName}:imported`,
      description: 'Import container from TAR archive',
      example: 'docker import webapp_backup.tar myapp:imported'
    },
    {
      category: 'backup',
      title: 'Commit Container',
      command: `docker commit ${containerName} ${customImageName}:committed`,
      description: 'Create image from container changes',
      example: 'docker commit webapp myapp:v2.0'
    },

    // Monitoring & Logs
    {
      category: 'monitoring',
      title: 'Container Statistics',
      command: 'docker stats',
      description: 'Display live resource usage statistics',
      example: 'docker stats --no-stream'
    },
    {
      category: 'monitoring',
      title: 'Container Logs',
      command: `docker logs ${containerName}`,
      description: 'Fetch logs from a container',
      example: 'docker logs -f --tail 100 webapp'
    },
    {
      category: 'monitoring',
      title: 'Inspect Container',
      command: `docker inspect ${containerName}`,
      description: 'Display detailed information about a container',
      example: 'docker inspect webapp --format "{{.State.Status}}"'
    },
    {
      category: 'monitoring',
      title: 'Container Processes',
      command: `docker top ${containerName}`,
      description: 'Display running processes in a container',
      example: 'docker top webapp'
    },
    {
      category: 'monitoring',
      title: 'Container Port Mapping',
      command: `docker port ${containerName}`,
      description: 'Display port mappings for a container',
      example: 'docker port webapp'
    },

    // Security & Scanning
    {
      category: 'security',
      title: 'Scan Image for Vulnerabilities',
      command: `docker scan ${customImageName}:${customImageTag}`,
      description: 'Scan image for security vulnerabilities',
      example: 'docker scan nginx:latest'
    },
    {
      category: 'security',
      title: 'Run Container with Security Context',
      command: `docker run -d --name ${containerName} --security-opt apparmor:docker-default --security-opt no-new-privileges:true ${customImageName}:${customImageTag}`,
      description: 'Run container with AppArmor and security options',
      example: 'docker run -d --name secure-nginx --security-opt apparmor:docker-default nginx:alpine'
    },
    {
      category: 'security',
      title: 'Run with Capabilities Dropped',
      command: `docker run -d --name ${containerName} --cap-drop=ALL --cap-add=NET_BIND_SERVICE ${customImageName}:${customImageTag}`,
      description: 'Run container with minimal capabilities',
      example: 'docker run -d --name minimal-nginx --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx:alpine'
    },
    {
      category: 'security',
      title: 'Check Image History',
      command: `docker history ${customImageName}:${customImageTag}`,
      description: 'Show the history of an image',
      example: 'docker history nginx:latest'
    },
    {
      category: 'security',
      title: 'Run with Resource Limits',
      command: `docker run -d --name ${containerName} --memory="512m" --cpus="1.0" --pids-limit=100 ${customImageName}:${customImageTag}`,
      description: 'Run container with resource constraints',
      example: 'docker run -d --name limited-app --memory="256m" --cpus="0.5" nginx:alpine'
    }
  ];

  const filteredCommands = dockerCommands.filter(cmd => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesSearch = cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    addToHistory(command);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Docker Commands Reference</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Command Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Name</label>
            <input
              type="text"
              value={customImageName}
              onChange={(e) => setCustomImageName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., myapp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Tag</label>
            <input
              type="text"
              value={customImageTag}
              onChange={(e) => setCustomImageTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., latest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Container Name</label>
            <input
              type="text"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., mycontainer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Network Name</label>
            <input
              type="text"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., mynetwork"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registry URL</label>
            <input
              type="text"
              value={registryUrl}
              onChange={(e) => setRegistryUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., docker.io"
            />
          </div>
        </div>
      </div>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCommands.map((cmd, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{cmd.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{cmd.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(cmd.command)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copy command"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm overflow-x-auto">
              {cmd.command}
            </div>
            
            {cmd.example && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Example:</strong> <code className="bg-white px-1 py-0.5 rounded">{cmd.example}</code>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCommands.length === 0 && (
        <div className="text-center py-12">
          <Terminal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No commands found matching your search criteria.</p>
        </div>
      )}

      {/* Security Best Practices */}
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-900 mb-3">🔒 Docker Security Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Container Security</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Run containers as non-root users</li>
              <li>• Use read-only root filesystems</li>
              <li>• Drop unnecessary capabilities</li>
              <li>• Enable AppArmor/SELinux profiles</li>
              <li>• Set resource limits (memory, CPU, PIDs)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Image Security</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Scan images for vulnerabilities</li>
              <li>• Use minimal base images (Alpine, Distroless)</li>
              <li>• Keep images updated</li>
              <li>• Use multi-stage builds</li>
              <li>• Sign images with Docker Content Trust</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Docker Installation Commands */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Docker Installation</h3>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-blue-700 mb-2"><strong>Ubuntu/Debian:</strong></p>
            <code className="bg-gray-900 text-green-400 p-2 rounded text-sm block">
              curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
            </code>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-blue-700 mb-2"><strong>CentOS/RHEL:</strong></p>
            <code className="bg-gray-900 text-green-400 p-2 rounded text-sm block">
              sudo yum install -y docker && sudo systemctl start docker && sudo systemctl enable docker
            </code>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-blue-700 mb-2"><strong>macOS:</strong></p>
            <code className="bg-gray-900 text-green-400 p-2 rounded text-sm block">
              brew install --cask docker
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerCommands;