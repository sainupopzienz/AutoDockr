import React, { useState } from 'react';
import { Plus, Trash2, Copy, Download, Play, Settings, FolderOpen } from 'lucide-react';

interface Service {
  name: string;
  image: string;
  ports: { host: string; container: string }[];
  volumes: { host: string; container: string }[];
  environment: { key: string; value: string }[];
  restart: string;
  dependsOn: string[];
  networks: string[];
  command: string;
  buildContext?: string;
  dockerfile?: string;
}

interface DockerComposeGeneratorProps {
  addToHistory: (command: string) => void;
}

const DockerComposeGenerator: React.FC<DockerComposeGeneratorProps> = ({ addToHistory }) => {
  const [services, setServices] = useState<Service[]>([
    {
      name: 'web',
      image: 'nginx:latest',
      ports: [{ host: '80', container: '80' }],
      volumes: [],
      environment: [],
      restart: 'unless-stopped',
      dependsOn: [],
      networks: ['default'],
      command: ''
    }
  ]);
  
  const [networkType, setNetworkType] = useState<'bridge' | 'host'>('bridge');
  const [customNetworks, setCustomNetworks] = useState<string[]>([]);
  const [useMultiStage, setUseMultiStage] = useState(false);
  const [securityOptions, setSecurityOptions] = useState({
    nonRootUser: true,
    readOnlyRootfs: false,
    noNewPrivileges: true,
    capDrop: ['ALL'],
    capAdd: [] as string[]
  });

  const addService = () => {
    const newService: Service = {
      name: `service-${services.length + 1}`,
      image: '',
      ports: [],
      volumes: [],
      environment: [],
      restart: 'unless-stopped',
      dependsOn: [],
      networks: ['default'],
      command: ''
    };
    setServices([...services, newService]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof Service, value: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const addPort = (serviceIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].ports.push({ host: '', container: '' });
    setServices(updatedServices);
  };

  const updatePort = (serviceIndex: number, portIndex: number, field: 'host' | 'container', value: string) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].ports[portIndex][field] = value;
    setServices(updatedServices);
  };

  const removePort = (serviceIndex: number, portIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].ports.splice(portIndex, 1);
    setServices(updatedServices);
  };

  const addVolume = (serviceIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].volumes.push({ host: '', container: '' });
    setServices(updatedServices);
  };

  const updateVolume = (serviceIndex: number, volumeIndex: number, field: 'host' | 'container', value: string) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].volumes[volumeIndex][field] = value;
    setServices(updatedServices);
  };

  const removeVolume = (serviceIndex: number, volumeIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].volumes.splice(volumeIndex, 1);
    setServices(updatedServices);
  };

  const addEnvironment = (serviceIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].environment.push({ key: '', value: '' });
    setServices(updatedServices);
  };

  const updateEnvironment = (serviceIndex: number, envIndex: number, field: 'key' | 'value', value: string) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].environment[envIndex][field] = value;
    setServices(updatedServices);
  };

  const removeEnvironment = (serviceIndex: number, envIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].environment.splice(envIndex, 1);
    setServices(updatedServices);
  };

  const updateDependsOn = (serviceIndex: number, dependencies: string[]) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].dependsOn = dependencies;
    setServices(updatedServices);
  };

  const addCustomNetwork = () => {
    const networkName = prompt('Enter network name:');
    if (networkName && !customNetworks.includes(networkName)) {
      setCustomNetworks([...customNetworks, networkName]);
    }
  };

  const removeCustomNetwork = (networkName: string) => {
    setCustomNetworks(customNetworks.filter(n => n !== networkName));
  };

  const generateDockerCompose = () => {
    const compose = {
      version: '3.8',
      services: {} as any,
      networks: {} as any
    };

    // Add services
    services.forEach(service => {
      const serviceConfig: any = {};

      // Build or Image configuration
      if (service.buildContext) {
        serviceConfig.build = {
          context: service.buildContext
        };
        if (service.dockerfile) {
          serviceConfig.build.dockerfile = service.dockerfile;
        }
        if (useMultiStage) {
          serviceConfig.build.target = 'production';
        }
      } else {
        serviceConfig.image = service.image;
      }

      serviceConfig.restart = service.restart;

      if (service.ports.length > 0) {
        serviceConfig.ports = service.ports
          .filter(p => p.host && p.container)
          .map(p => `${p.host}:${p.container}`);
      }

      if (service.volumes.length > 0) {
        serviceConfig.volumes = service.volumes
          .filter(v => v.host && v.container)
          .map(v => `${v.host}:${v.container}`);
      }

      if (service.environment.length > 0) {
        serviceConfig.environment = service.environment
          .filter(e => e.key && e.value)
          .reduce((acc, e) => ({ ...acc, [e.key]: e.value }), {});
      }

      if (service.dependsOn.length > 0) {
        serviceConfig.depends_on = service.dependsOn;
      }

      if (service.networks.length > 0 && service.networks[0] !== 'default') {
        serviceConfig.networks = service.networks;
      }

      if (service.command) {
        serviceConfig.command = service.command;
      }

      // Security configurations
      if (securityOptions.nonRootUser) {
        serviceConfig.user = '1001:1001';
      }

      if (securityOptions.readOnlyRootfs) {
        serviceConfig.read_only = true;
        serviceConfig.tmpfs = ['/tmp', '/var/tmp'];
      }

      if (securityOptions.noNewPrivileges) {
        serviceConfig.security_opt = ['no-new-privileges:true'];
      }

      if (securityOptions.capDrop.length > 0 || securityOptions.capAdd.length > 0) {
        serviceConfig.cap_drop = securityOptions.capDrop;
        if (securityOptions.capAdd.length > 0) {
          serviceConfig.cap_add = securityOptions.capAdd;
        }
      }

      // Health check
      serviceConfig.healthcheck = {
        test: ['CMD', 'curl', '-f', 'http://localhost/health', '||', 'exit', '1'],
        interval: '30s',
        timeout: '10s',
        retries: 3,
        start_period: '40s'
      };

      compose.services[service.name] = serviceConfig;
    });

    // Add networks
    if (networkType === 'bridge') {
      compose.networks.default = {
        driver: 'bridge'
      };
    } else {
      compose.networks.default = {
        driver: 'host'
      };
    }

    customNetworks.forEach(network => {
      compose.networks[network] = {
        driver: 'bridge'
      };
    });

    return `# Docker Compose Configuration
# Generated by AutoDockr - Advanced Docker UI
# Security-hardened configuration with multi-stage build support
version: '3.8'

services:
${Object.entries(compose.services).map(([name, config]) => {
  return `  ${name}:
${Object.entries(config as any).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `    ${key}:
${value.map(v => `      - ${v}`).join('\n')}`;
    } else if (typeof value === 'object') {
      return `    ${key}:
${Object.entries(value).map(([k, v]) => `      ${k}: ${v}`).join('\n')}`;
    } else {
      return `    ${key}: ${value}`;
    }
  }).join('\n')}`;
}).join('\n\n')}

networks:
${Object.entries(compose.networks).map(([name, config]) => {
  return `  ${name}:
${Object.entries(config as any).map(([key, value]) => `    ${key}: ${value}`).join('\n')}`;
}).join('\n')}`;
  };

  const generateSecureDockerfile = () => {
    return `# Multi-stage secure Dockerfile
# Generated by AutoDockr

# Build stage
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nextjs -u 1001

# Install security updates
RUN apk update && apk upgrade && \\
    apk add --no-cache curl && \\
    rm -rf /var/cache/apk/*

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=nextjs:nodejs nginx.conf /etc/nginx/nginx.conf

# Set proper permissions
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \\
    chown -R nextjs:nodejs /var/cache/nginx && \\
    chown -R nextjs:nodejs /var/log/nginx && \\
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Create required directories
RUN mkdir -p /var/cache/nginx/client_temp && \\
    chown -R nextjs:nodejs /var/cache/nginx

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToHistory(`# Docker Compose copied to clipboard`);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToHistory(`# Docker Compose downloaded as ${filename}`);
  };

  const dockerComposeYaml = generateDockerCompose();
  const secureDockerfile = generateSecureDockerfile();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Docker Compose Generator</h2>
        <div className="flex space-x-3">
          <button
            onClick={addService}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Security Configuration */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-3">🔒 Security Configuration</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={securityOptions.nonRootUser}
                  onChange={(e) => setSecurityOptions({...securityOptions, nonRootUser: e.target.checked})}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-red-800">Run as non-root user (UID 1001)</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={securityOptions.readOnlyRootfs}
                  onChange={(e) => setSecurityOptions({...securityOptions, readOnlyRootfs: e.target.checked})}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-red-800">Read-only root filesystem</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={securityOptions.noNewPrivileges}
                  onChange={(e) => setSecurityOptions({...securityOptions, noNewPrivileges: e.target.checked})}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-red-800">No new privileges</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useMultiStage}
                  onChange={(e) => setUseMultiStage(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-red-800">Enable multi-stage builds</span>
              </label>
            </div>
          </div>

          {/* Network Configuration */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Network Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Network Type</label>
                <select
                  value={networkType}
                  onChange={(e) => setNetworkType(e.target.value as 'bridge' | 'host')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bridge">Bridge</option>
                  <option value="host">Host</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Custom Networks</label>
                  <button
                    onClick={addCustomNetwork}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Network</span>
                  </button>
                </div>
                {customNetworks.map((network, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <span className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm">
                      {network}
                    </span>
                    <button
                      onClick={() => removeCustomNetwork(network)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services Configuration */}
          <div className="space-y-4">
            {services.map((service, serviceIndex) => (
              <div key={serviceIndex} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Service {serviceIndex + 1}</h3>
                  <button
                    onClick={() => removeService(serviceIndex)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(serviceIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., web, database, redis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Docker Image</label>
                    <input
                      type="text"
                      value={service.image}
                      onChange={(e) => updateService(serviceIndex, 'image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., nginx:latest, postgres:13"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Build Context (Optional)</label>
                    <input
                      type="text"
                      value={service.buildContext || ''}
                      onChange={(e) => updateService(serviceIndex, 'buildContext', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., ., ./backend"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dockerfile Path (Optional)</label>
                    <input
                      type="text"
                      value={service.dockerfile || ''}
                      onChange={(e) => updateService(serviceIndex, 'dockerfile', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Dockerfile, Dockerfile.prod"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restart Policy</label>
                    <select
                      value={service.restart}
                      onChange={(e) => updateService(serviceIndex, 'restart', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="no">No</option>
                      <option value="always">Always</option>
                      <option value="unless-stopped">Unless Stopped</option>
                      <option value="on-failure">On Failure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Command (Optional)</label>
                    <input
                      type="text"
                      value={service.command}
                      onChange={(e) => updateService(serviceIndex, 'command', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., npm start, python app.py"
                    />
                  </div>
                </div>

                {/* Depends On */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Depends On</label>
                  <div className="space-y-2">
                    {services.map((otherService, otherIndex) => {
                      if (otherIndex === serviceIndex) return null;
                      return (
                        <label key={otherIndex} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={service.dependsOn.includes(otherService.name)}
                            onChange={(e) => {
                              const newDependencies = e.target.checked
                                ? [...service.dependsOn, otherService.name]
                                : service.dependsOn.filter(dep => dep !== otherService.name);
                              updateDependsOn(serviceIndex, newDependencies);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{otherService.name}</span>
                        </label>
                      );
                    })}
                    {services.length <= 1 && (
                      <p className="text-sm text-gray-500">Add more services to configure dependencies</p>
                    )}
                  </div>
                </div>

                {/* Ports */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Ports</label>
                    <button
                      onClick={() => addPort(serviceIndex)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Port</span>
                    </button>
                  </div>
                  {service.ports.map((port, portIndex) => (
                    <div key={portIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={port.host}
                        onChange={(e) => updatePort(serviceIndex, portIndex, 'host', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Host port"
                      />
                      <span className="text-gray-500">:</span>
                      <input
                        type="text"
                        value={port.container}
                        onChange={(e) => updatePort(serviceIndex, portIndex, 'container', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Container port"
                      />
                      <button
                        onClick={() => removePort(serviceIndex, portIndex)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Volumes */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Volumes</label>
                    <button
                      onClick={() => addVolume(serviceIndex)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Volume</span>
                    </button>
                  </div>
                  {service.volumes.map((volume, volumeIndex) => (
                    <div key={volumeIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={volume.host}
                        onChange={(e) => updateVolume(serviceIndex, volumeIndex, 'host', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Host path"
                      />
                      <span className="text-gray-500">:</span>
                      <input
                        type="text"
                        value={volume.container}
                        onChange={(e) => updateVolume(serviceIndex, volumeIndex, 'container', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Container path"
                      />
                      <button
                        onClick={() => removeVolume(serviceIndex, volumeIndex)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Environment Variables */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Environment Variables</label>
                    <button
                      onClick={() => addEnvironment(serviceIndex)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Environment</span>
                    </button>
                  </div>
                  {service.environment.map((env, envIndex) => (
                    <div key={envIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={env.key}
                        onChange={(e) => updateEnvironment(serviceIndex, envIndex, 'key', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Variable name"
                      />
                      <span className="text-gray-500">=</span>
                      <input
                        type="text"
                        value={env.value}
                        onChange={(e) => updateEnvironment(serviceIndex, envIndex, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Variable value"
                      />
                      <button
                        onClick={() => removeEnvironment(serviceIndex, envIndex)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Docker Compose Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Docker Compose</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(dockerComposeYaml)}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors flex items-center space-x-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => downloadFile(dockerComposeYaml, 'docker-compose.yml')}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
              {dockerComposeYaml}
            </pre>
          </div>

          {/* Secure Dockerfile Preview */}
          {useMultiStage && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-900">🔒 Secure Multi-Stage Dockerfile</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(secureDockerfile)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => downloadFile(secureDockerfile, 'Dockerfile.secure')}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
                {secureDockerfile}
              </pre>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Quick Commands:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded text-blue-800">docker-compose up -d</code>
                <span className="text-blue-600">Start services in detached mode</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded text-blue-800">docker-compose down</code>
                <span className="text-blue-600">Stop and remove services</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded text-blue-800">docker-compose logs -f</code>
                <span className="text-blue-600">View logs</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded text-blue-800">docker-compose build --no-cache</code>
                <span className="text-blue-600">Rebuild images</span>
              </div>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">🛡️ Security Best Practices</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Always run containers as non-root users</li>
              <li>• Use read-only root filesystems when possible</li>
              <li>• Drop unnecessary capabilities</li>
              <li>• Enable health checks for monitoring</li>
              <li>• Use multi-stage builds to reduce attack surface</li>
              <li>• Regularly update base images</li>
              <li>• Scan images for vulnerabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerComposeGenerator;