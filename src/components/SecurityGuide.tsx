import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Copy, Download, Eye, FileText } from 'lucide-react';

interface SecurityGuideProps {
  addToHistory: (command: string) => void;
}

const SecurityGuide: React.FC<SecurityGuideProps> = ({ addToHistory }) => {
  const [selectedTopic, setSelectedTopic] = useState('overview');

  const securityTopics = [
    { id: 'overview', name: 'Security Overview', icon: Shield },
    { id: 'images', name: 'Image Security', icon: FileText },
    { id: 'containers', name: 'Container Security', icon: Lock },
    { id: 'networks', name: 'Network Security', icon: Eye },
    { id: 'scanning', name: 'Vulnerability Scanning', icon: AlertTriangle },
    { id: 'best-practices', name: 'Best Practices', icon: CheckCircle }
  ];

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    addToHistory(command);
  };

  const secureDockerfile = `# Secure Multi-Stage Dockerfile
# Base image with minimal attack surface
FROM node:18-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nextjs:nodejs . .

# Build application
RUN npm run build

# Production stage with minimal base image
FROM gcr.io/distroless/nodejs18-debian11 AS production

# Copy non-root user from builder
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist /app
COPY --from=builder --chown=nextjs:nodejs /app/node_modules /app/node_modules

# Switch to non-root user
USER nextjs

# Set working directory
WORKDIR /app

# Expose port (non-privileged)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD ["node", "healthcheck.js"]

# Start application
CMD ["node", "server.js"]`;

  const secureDockerCompose = `# Secure Docker Compose Configuration
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.secure
    container_name: secure-app
    restart: unless-stopped
    
    # Security configurations
    user: "1001:1001"
    read_only: true
    security_opt:
      - no-new-privileges:true
      - apparmor:docker-default
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    
    # Resource limits
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
        reservations:
          memory: 256M
          cpus: '0.5'
    
    # Temporary filesystems for read-only containers
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
      - /var/tmp:noexec,nosuid,size=50m
    
    # Environment variables
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
    
    # Port mapping (non-privileged ports)
    ports:
      - "3000:3000"
    
    # Health check
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    # Networks
    networks:
      - app-network
    
    # Logging configuration
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Database with security hardening
  database:
    image: postgres:15-alpine
    container_name: secure-db
    restart: unless-stopped
    
    # Security configurations
    user: "999:999"
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - SETUID
      - SETGID
      - DAC_OVERRIDE
    
    # Temporary filesystems
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
      - /var/run/postgresql:noexec,nosuid,size=100m
    
    # Environment variables
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    
    # Secrets
    secrets:
      - db_password
    
    # Volumes
    volumes:
      - db_data:/var/lib/postgresql/data
    
    # Networks
    networks:
      - app-network
    
    # Health check
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 30s
      timeout: 10s
      retries: 3

# Secure network configuration
networks:
  app-network:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: secure-bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
          gateway: 172.20.0.1

# Volumes
volumes:
  db_data:
    driver: local

# Secrets
secrets:
  db_password:
    file: ./secrets/db_password.txt`;

  const securityChecklist = [
    {
      category: 'Image Security',
      items: [
        'Use minimal base images (Alpine, Distroless)',
        'Scan images for vulnerabilities regularly',
        'Keep base images updated',
        'Use multi-stage builds to reduce attack surface',
        'Remove unnecessary packages and files',
        'Use specific image tags, avoid "latest"',
        'Sign images with Docker Content Trust'
      ]
    },
    {
      category: 'Container Runtime Security',
      items: [
        'Run containers as non-root users',
        'Use read-only root filesystems',
        'Drop all capabilities and add only necessary ones',
        'Enable security profiles (AppArmor/SELinux)',
        'Set resource limits (memory, CPU, PIDs)',
        'Use tmpfs for temporary data',
        'Enable no-new-privileges flag'
      ]
    },
    {
      category: 'Network Security',
      items: [
        'Use custom networks instead of default bridge',
        'Implement network segmentation',
        'Use secrets for sensitive data',
        'Enable TLS for inter-service communication',
        'Restrict port exposure',
        'Use firewall rules',
        'Monitor network traffic'
      ]
    },
    {
      category: 'Host Security',
      items: [
        'Keep Docker daemon updated',
        'Configure Docker daemon securely',
        'Use Docker Bench for Security',
        'Enable audit logging',
        'Restrict Docker socket access',
        'Use rootless Docker when possible',
        'Regular security updates'
      ]
    }
  ];

  const vulnerabilityCommands = [
    {
      title: 'Scan Image with Docker Scout',
      command: 'docker scout cves myapp:latest',
      description: 'Scan image for CVEs using Docker Scout'
    },
    {
      title: 'Scan with Trivy',
      command: 'trivy image myapp:latest',
      description: 'Comprehensive vulnerability scanning with Trivy'
    },
    {
      title: 'Scan with Snyk',
      command: 'snyk container test myapp:latest',
      description: 'Scan container image with Snyk'
    },
    {
      title: 'Docker Bench Security',
      command: 'docker run --rm --net host --pid host --userns host --cap-add audit_control -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST -v /etc:/etc:ro -v /usr/bin/containerd:/usr/bin/containerd:ro -v /usr/bin/runc:/usr/bin/runc:ro -v /usr/lib/systemd:/usr/lib/systemd:ro -v /var/lib:/var/lib:ro -v /var/run/docker.sock:/var/run/docker.sock:ro --label docker_bench_security docker/docker-bench-security',
      description: 'Run Docker Bench for Security audit'
    }
  ];

  const renderContent = () => {
    switch (selectedTopic) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Docker Security Overview</h3>
              <p className="text-blue-800 mb-4">
                Docker security involves multiple layers of protection, from the host system to the container runtime. 
                A comprehensive security strategy addresses image security, container runtime security, network security, 
                and host security.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Security Principles</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Principle of least privilege</li>
                    <li>• Defense in depth</li>
                    <li>• Minimal attack surface</li>
                    <li>• Regular security updates</li>
                    <li>• Continuous monitoring</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Security Layers</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Host operating system</li>
                    <li>• Docker daemon</li>
                    <li>• Container images</li>
                    <li>• Container runtime</li>
                    <li>• Application code</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'images':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Image Security Best Practices</h3>
              
              <div className="mb-6">
                <h4 className="font-semibold text-green-800 mb-3">Secure Dockerfile Example</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{secureDockerfile}</pre>
                </div>
                <button
                  onClick={() => copyToClipboard(secureDockerfile)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Secure Dockerfile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Base Image Selection</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Use official images from trusted sources</li>
                    <li>• Prefer minimal images (Alpine, Distroless)</li>
                    <li>• Use specific version tags</li>
                    <li>• Regularly update base images</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Build Security</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Use multi-stage builds</li>
                    <li>• Remove build dependencies</li>
                    <li>• Minimize layers</li>
                    <li>• Use .dockerignore</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'containers':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4">Container Runtime Security</h3>
              
              <div className="mb-6">
                <h4 className="font-semibold text-red-800 mb-3">Secure Docker Compose Configuration</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
                  <pre>{secureDockerCompose}</pre>
                </div>
                <button
                  onClick={() => copyToClipboard(secureDockerCompose)}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Secure Docker Compose</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">User Security</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Run as non-root user</li>
                    <li>• Use specific UID/GID</li>
                    <li>• Avoid privileged containers</li>
                    <li>• Use user namespaces</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Filesystem Security</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Use read-only root filesystem</li>
                    <li>• Mount tmpfs for temporary data</li>
                    <li>• Set proper file permissions</li>
                    <li>• Use volumes for persistent data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'scanning':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-900 mb-4">Vulnerability Scanning</h3>
              
              <div className="space-y-4">
                {vulnerabilityCommands.map((cmd, index) => (
                  <div key={index} className="bg-white border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-yellow-800">{cmd.title}</h4>
                      <button
                        onClick={() => copyToClipboard(cmd.command)}
                        className="text-yellow-600 hover:text-yellow-700 p-1"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-yellow-700 mb-2">{cmd.description}</p>
                    <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm overflow-x-auto">
                      {cmd.command}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'best-practices':
        return (
          <div className="space-y-6">
            {securityChecklist.map((section, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Docker Security Guide</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Security Topics</h3>
            <nav className="space-y-2">
              {securityTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedTopic === topic.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{topic.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SecurityGuide;