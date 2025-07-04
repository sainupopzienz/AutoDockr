import React, { useState, useEffect } from 'react';
import { FileCode, Copy, Download, Plus, Trash2, Settings } from 'lucide-react';

interface DockerfileGeneratorProps {
  addToHistory: (command: string) => void;
}

const DockerfileGenerator: React.FC<DockerfileGeneratorProps> = ({ addToHistory }) => {
  const [projectType, setProjectType] = useState('node');
  const [baseImage, setBaseImage] = useState('');
  const [workdir, setWorkdir] = useState('');
  const [port, setPort] = useState('');
  const [startCommand, setStartCommand] = useState('');
  const [buildCommands, setBuildCommands] = useState<string[]>([]);
  const [copyCommands, setCopyCommands] = useState<{ source: string, dest: string }[]>([]);
  const [environmentVars, setEnvironmentVars] = useState<{ key: string, value: string }[]>([]);
  const [runCommands, setRunCommands] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState('');
  const [multiStagePostBuild, setMultiStagePostBuild] = useState<string[]>([]);

  const projectTemplates: any = {
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
      //startCommand: 'nginx -g "daemon off;"',
      buildCommands: ['npm install', 'npm run build'],
      copyCommands: [
        { source: 'package*.json', dest: './' },
        { source: '.', dest: './' }
      ],
      runCommands: [],
      environmentVars: [],
      multiStagePostBuild: [
        'FROM nginx:1.21-alpine AS production',
        'RUN rm -rf /usr/share/nginx/html/*',
        'COPY --from=build /app/dist /usr/share/nginx/html',
        'COPY nginx.conf /etc/nginx/nginx.conf',
        'EXPOSE 80',
        'CMD ["nginx", "-g", "daemon off;"]'
      ]
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

  useEffect(() => {
    const cfg = projectTemplates[projectType];
    if (cfg) {
      setBaseImage(cfg.baseImage);
      setWorkdir(cfg.workdir);
      setPort(cfg.port);
      setStartCommand(cfg.startCommand);
      setBuildCommands(cfg.buildCommands || []);
      setCopyCommands(cfg.copyCommands || []);
      setRunCommands(cfg.runCommands || []);
      setEnvironmentVars(cfg.environmentVars || []);
      setMultiStagePostBuild(cfg.multiStagePostBuild || []);
    }
  }, [projectType]);

  const generateDockerfile = () => {
    let df = `# Generated Dockerfile for ${projectType.toUpperCase()} application\n# Created by Docker Advanced UI\n\n`;

    df += `FROM ${baseImage}\n\nWORKDIR ${workdir}\n\n`;

    runCommands.forEach((cmd) => {
      if (cmd.trim()) {
        df += `RUN ${cmd}\n`;
      }
    });
    if (runCommands.length) df += '\n';

    copyCommands.forEach((c) => {
      df += `COPY ${c.source} ${c.dest}\n`;
    });
    if (copyCommands.length) df += '\n';

    buildCommands.forEach((cmd) => {
      if (cmd.trim()) {
        df += `RUN ${cmd}\n`;
      }
    });
    if (buildCommands.length) df += '\n';

    environmentVars.forEach((env) => {
      if (env.key && env.value) {
        df += `ENV ${env.key}=${env.value}\n`;
      }
    });
    if (environmentVars.length) df += '\n';

    if (port) {
      df += `EXPOSE ${port}\n\n`;
    }

    if (customInstructions.trim()) {
      df += `# Custom instructions\n${customInstructions}\n\n`;
    }

    if (multiStagePostBuild.length) {
      // Append multi-stage instructions (which include CMD)
      df += multiStagePostBuild.join('\n') + '\n';
    } else if (startCommand.trim()) {
      // Single-stage: add CMD here
      df += `CMD ["${startCommand.split(' ')[0]}"`;
      startCommand.split(' ').slice(1).forEach((arg) => {
        df += `, "${arg}"`;
      });
      df += `]\n`;
    }

    return df;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dockerfile Generator UI</h2>
      <select
        value={projectType}
        onChange={(e) => setProjectType(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        {Object.keys(projectTemplates).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
        {generateDockerfile()}
      </pre>
    </div>
  );
};

export default DockerfileGenerator;
