import React, { useState } from 'react';
import { FileCode, Copy, Download, Plus, Trash2, Settings } from 'lucide-react';

interface DockerfileGeneratorProps {
  addToHistory: (command: string) => void;
}

const DockerfileGenerator: React.FC<DockerfileGeneratorProps> = ({ addToHistory }) => {
  const [projectType, setProjectType] = useState('node');
  const [baseImage, setBaseImage] = useState('node:18-alpine');
  const [workdir, setWorkdir] = useState('/app');
  const [port, setPort] = useState('3000');
  const [startCommand, setStartCommand] = useState('npm start');
  const [buildCommands, setBuildCommands] = useState<string[]>(['npm install']);
  const [copyCommands, setCopyCommands] = useState<{source: string, dest: string}[]>([
    { source: 'package*.json', dest: './' },
    { source: '.', dest: './' }
  ]);
  const [environmentVars, setEnvironmentVars] = useState<{key: string, value: string}[]>([]);
  const [runCommands, setRunCommands] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState('');

  const projectTemplates = {
    node: {
      baseImage: 'node:18-alpine',
      workdir: '/app',
      port: '3000',
      startCommand: 'npm start',
      buildCommands: ['npm install'],
      copyCommands: [
        { source: 'package*.json', dest: './' },
        { source: '.', dest: './' }
      ],
      runCommands: ['apk add --no-cache dumb-init'],
      environmentVars: [{ key: 'NODE_ENV', value: 'production' }]
    },
    react: {
      baseImage: 'node:18-alpine',
      workdir: '/app',
      port: '3000',
      startCommand: 'npm start',
      buildCommands: ['npm install', 'npm run build'],
      copyCommands: [
        { source: 'package*.json', dest: './' },
        { source: '.', dest: './' }
      ],
      runCommands: ['apk add --no-cache dumb-init'],
      environmentVars: [
        { key: 'NODE_ENV', value: 'production' },
        { key: 'GENERATE_SOURCEMAP', value: 'false' }
      ]
    },
    'react-nginx': {
      baseImage: 'node:18-alpine as build',
      workdir: '/app',
      port: '80',
      startCommand: 'nginx -g "daemon off;"',
      buildCommands: ['npm install', 'npm run build'],
      copyCommands: [
        { source: 'package*.json', dest: './' },
        { source: '.', dest: './' }
      ],
      runCommands: [
        'apk add --no-cache nginx',
        'FROM nginx:alpine',
        'COPY --from=build /app/build /usr/share/nginx/html',
        'COPY nginx.conf /etc/nginx/nginx.conf'
      ],
      environmentVars: []
    },
    python: {
      baseImage: 'python:3.11-slim',
      workdir: '/app',
      port: '8000',
      startCommand: 'python app.py',
      buildCommands: ['pip install --no-cache-dir -r requirements.txt'],
      copyCommands: [
        { source: 'requirements.txt', dest: './' },
        { source: '.', dest: './' }
      ],
      runCommands: ['apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*'],
      environmentVars: [{ key: 'PYTHONUNBUFFERED', value: '1' }]
    },
    java: {
      baseImage: 'openjdk:17-jdk-slim',
      workdir: '/app',
      port: '8080',
      startCommand: 'java -jar app.jar',
      buildCommands: ['./mvnw clean package -DskipTests'],
      copyCommands: [
        { source: 'pom.xml', dest: './' },
        { source: 'src', dest: './src' },
        { source: 'target/*.jar', dest: 'app.jar' }
      ],
      runCommands: ['apt-get update && apt-get install -y --no-install-recommends maven && rm -rf /var/lib/apt/lists/*'],
      environmentVars: [{ key: 'JAVA_OPTS', value: '-Xmx512m' }]
    },
    php: {
      baseImage: 'php:8.2-fpm',
      workdir: '/var/www/html',
      port: '80',
      startCommand: 'php-fpm',
      buildCommands: ['composer install --no-dev --optimize-autoloader'],
      copyCommands: [
        { source: 'composer.json', dest: './' },
        { source: '.', dest: './' }
      ],
      runCommands: ['apt-get update && apt-get install -y --no-install-recommends zip unzip && rm -rf /var/lib/apt/lists/*'],
      environmentVars: [{ key: 'PHP_FPM_LISTEN', value: '0.0.0.0:9000' }]
    },
    nginx: {
      baseImage: 'nginx:alpine',
      workdir: '/usr/share/nginx/html',
      port: '80',
      startCommand: 'nginx -g "daemon off;"',
      buildCommands: [],
      copyCommands: [
        { source: 'dist/', dest: './' },
        { source: 'nginx.conf', dest: '/etc/nginx/nginx.conf' }
      ],
      runCommands: [],
      environmentVars: []
    },
    go: {
      baseImage: 'golang:1.21-alpine',
      workdir: '/app',
      port: '8080',
      startCommand: './main',
      buildCommands: ['go mod download', 'go build -o main .'],
      copyCommands: [
        { source: 'go.mod', dest: './' },
        { source: 'go.sum', dest: './' },
        { source: '.', dest: './' }
      ],
      runCommands: ['apk add --no-cache git'],
      environmentVars: [{ key: 'CGO_ENABLED', value: '0' }]
    }
  };

  const handleTemplateChange = (template: string) => {
    setProjectType(template);
    const config = projectTemplates[template as keyof typeof projectTemplates];
    if (config) {
      setBaseImage(config.baseImage);
      setWorkdir(config.workdir);
      setPort(config.port);
      setStartCommand(config.startCommand);
      setBuildCommands(config.buildCommands);
      setCopyCommands(config.copyCommands);
      setRunCommands(config.runCommands);
      setEnvironmentVars(config.environmentVars);
    }
  };

  const addBuildCommand = () => {
    setBuildCommands([...buildCommands, '']);
  };

  const updateBuildCommand = (index: number, value: string) => {
    const updated = [...buildCommands];
    updated[index] = value;
    setBuildCommands(updated);
  };

  const removeBuildCommand = (index: number) => {
    setBuildCommands(buildCommands.filter((_, i) => i !== index));
  };

  const addCopyCommand = () => {
    setCopyCommands([...copyCommands, { source: '', dest: '' }]);
  };

  const updateCopyCommand = (index: number, field: 'source' | 'dest', value: string) => {
    const updated = [...copyCommands];
    updated[index][field] = value;
    setCopyCommands(updated);
  };

  const removeCopyCommand = (index: number) => {
    setCopyCommands(copyCommands.filter((_, i) => i !== index));
  };

  const addRunCommand = () => {
    setRunCommands([...runCommands, '']);
  };

  const updateRunCommand = (index: number, value: string) => {
    const updated = [...runCommands];
    updated[index] = value;
    setRunCommands(updated);
  };

  const removeRunCommand = (index: number) => {
    setRunCommands(runCommands.filter((_, i) => i !== index));
  };

  const addEnvironmentVar = () => {
    setEnvironmentVars([...environmentVars, { key: '', value: '' }]);
  };

  const updateEnvironmentVar = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...environmentVars];
    updated[index][field] = value;
    setEnvironmentVars(updated);
  };

  const removeEnvironmentVar = (index: number) => {
    setEnvironmentVars(environmentVars.filter((_, i) => i !== index));
  };

  const generateDockerfile = () => {
    let dockerfile = `# Generated Dockerfile for ${projectType.toUpperCase()} application
# Created by Docker Advanced UI

FROM ${baseImage}

WORKDIR ${workdir}

`;

    // Add RUN commands first
    if (runCommands.length > 0) {
      runCommands.forEach(cmd => {
        if (cmd.trim()) {
          dockerfile += `RUN ${cmd}\n`;
        }
      });
      dockerfile += '\n';
    }

    // Add COPY commands
    copyCommands.forEach(copy => {
      if (copy.source && copy.dest) {
        dockerfile += `COPY ${copy.source} ${copy.dest}\n`;
      }
    });

    if (copyCommands.length > 0) {
      dockerfile += '\n';
    }

    // Add build commands
    if (buildCommands.length > 0) {
      buildCommands.forEach(cmd => {
        if (cmd.trim()) {
          dockerfile += `RUN ${cmd}\n`;
        }
      });
      dockerfile += '\n';
    }

    // Add environment variables
    if (environmentVars.length > 0) {
      environmentVars.forEach(env => {
        if (env.key && env.value) {
          dockerfile += `ENV ${env.key}=${env.value}\n`;
        }
      });
      dockerfile += '\n';
    }

    // Add port exposure
    if (port) {
      dockerfile += `EXPOSE ${port}\n\n`;
    }

    // Add custom instructions
    if (customInstructions.trim()) {
      dockerfile += `# Custom instructions\n${customInstructions}\n\n`;
    }

    // Add CMD
    dockerfile += `CMD ["${startCommand.split(' ')[0]}"`;
    const args = startCommand.split(' ').slice(1);
    if (args.length > 0) {
      dockerfile += `, "${args.join('", "')}"`;
    }
    dockerfile += `]\n`;

    return dockerfile;
  };

  const generateDockerCompose = () => {
    return `# Docker Compose for ${projectType.toUpperCase()} application
# Generated by Docker Advanced UI

version: '3.8'

services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    ${environmentVars.length > 0 ? `environment:
${environmentVars.map(env => `      - ${env.key}=${env.value}`).join('\n')}` : ''}
    restart: unless-stopped
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
`;
  };

  const dockerfile = generateDockerfile();
  const dockerCompose = generateDockerCompose();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    addToHistory(`# ${type} copied to clipboard`);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToHistory(`# ${filename} downloaded`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dockerfile Generator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Project Template */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Template</h3>
            <select
              value={projectType}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="node">Node.js</option>
              <option value="react">React (Development)</option>
              <option value="react-nginx">React (Production with Nginx)</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="php">PHP</option>
              <option value="nginx">Nginx</option>
              <option value="go">Go</option>
            </select>
          </div>

          {/* Basic Configuration */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Image</label>
                <input
                  type="text"
                  value={baseImage}
                  onChange={(e) => setBaseImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., node:18-alpine"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Directory</label>
                <input
                  type="text"
                  value={workdir}
                  onChange={(e) => setWorkdir(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., /app"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exposed Port</label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 3000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Command</label>
                <input
                  type="text"
                  value={startCommand}
                  onChange={(e) => setStartCommand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., npm start"
                />
              </div>
            </div>
          </div>

          {/* RUN Commands */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">RUN Commands</h3>
              <button
                onClick={addRunCommand}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
            {runCommands.map((cmd, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={cmd}
                  onChange={(e) => updateRunCommand(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., apt-get update && apt-get install -y git"
                />
                <button
                  onClick={() => removeRunCommand(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* COPY Commands */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">COPY Commands</h3>
              <button
                onClick={addCopyCommand}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
            {copyCommands.map((copy, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={copy.source}
                  onChange={(e) => updateCopyCommand(index, 'source', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Source path"
                />
                <span className="text-gray-500">→</span>
                <input
                  type="text"
                  value={copy.dest}
                  onChange={(e) => updateCopyCommand(index, 'dest', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Destination path"
                />
                <button
                  onClick={() => removeCopyCommand(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Build Commands */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Build Commands</h3>
              <button
                onClick={addBuildCommand}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
            {buildCommands.map((cmd, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={cmd}
                  onChange={(e) => updateBuildCommand(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., npm install"
                />
                <button
                  onClick={() => removeBuildCommand(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Environment Variables */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Environment Variables</h3>
              <button
                onClick={addEnvironmentVar}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
            {environmentVars.map((env, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={env.key}
                  onChange={(e) => updateEnvironmentVar(index, 'key', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Variable name"
                />
                <span className="text-gray-500">=</span>
                <input
                  type="text"
                  value={env.value}
                  onChange={(e) => updateEnvironmentVar(index, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Variable value"
                />
                <button
                  onClick={() => removeEnvironmentVar(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Custom Instructions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Instructions</h3>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Add any custom Dockerfile instructions here..."
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Dockerfile Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Dockerfile</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(dockerfile, 'Dockerfile')}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors flex items-center space-x-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => downloadFile(dockerfile, 'Dockerfile')}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
              {dockerfile}
            </pre>
          </div>

          {/* Docker Compose Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Docker Compose</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(dockerCompose, 'Docker Compose')}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors flex items-center space-x-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => downloadFile(dockerCompose, 'docker-compose.yml')}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
              {dockerCompose}
            </pre>
          </div>

          {/* Quick Commands */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Quick Commands</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded text-blue-800">docker build -t {projectType}-app .</code>
                <span className="text-blue-600">Build the image</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded text-blue-800">docker run -p {port}:{port} {projectType}-app</code>
                <span className="text-blue-600">Run the container</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded text-blue-800">docker-compose up --build</code>
                <span className="text-blue-600">Build and run with compose</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerfileGenerator;