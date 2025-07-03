# AutoDockr - Advanced Docker UI Tool

A comprehensive Docker management tool with a beautiful, modern interface for creating Docker Compose files, Dockerfiles, managing Docker commands, and advanced Docker operations.

## Features

### 🐳 Docker Compose Generator
- Multi-service support with dependency management
- Port mapping and volume configuration
- Environment variables and network settings
- Real-time preview and download functionality

### 📝 Dockerfile Generator
- Templates for Node.js, React, Python, Java, PHP, Go, and Nginx
- Multi-stage builds support
- Custom instructions and environment variables
- Production-ready configurations

### 💻 Docker Commands Reference
- 40+ categorized Docker commands
- Interactive command builder
- Copy-to-clipboard functionality
- Real-time command customization

### ⚙️ Advanced Settings
- Docker root directory migration
- File transfer operations between host and containers
- System information and management commands
- Best practices and safety warnings

### 📚 Installation Guides
- Step-by-step installation for all major operating systems
- Verification commands and troubleshooting
- Quick install scripts and manual installation options

### 📋 Command History
- Automatic command tracking
- Search and filter functionality
- Export command history
- Command categorization and statistics

## Quick Start

### Development

```bash
# Clone the repository
git clone <repository-url>
cd autodockr

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Deployment

#### Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up -d

# Access the application
open http://localhost
```

#### Using Docker

```bash
# Build the image
docker build -t autodockr .

# Run the container
docker run -d -p 80:80 --name autodockr autodockr
```

#### Development with Docker

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Access development server
open http://localhost:3000
```

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Production Setup
- **Multi-stage Docker build** for optimized images
- **Nginx** for serving static files
- **Health checks** and monitoring
- **Traefik** integration for reverse proxy

### Key Components

1. **DockerComposeGenerator** - Interactive Docker Compose file creation
2. **DockerfileGenerator** - Template-based Dockerfile generation
3. **DockerCommands** - Comprehensive command reference
4. **AdvancedSettings** - System configuration and file operations
5. **InstallationGuide** - Multi-platform installation instructions
6. **CommandHistory** - Command tracking and management

## Configuration

### Environment Variables

```bash
NODE_ENV=production          # Environment mode
VITE_APP_TITLE=AutoDockr     # Application title
```

### Nginx Configuration

The application includes a production-ready Nginx configuration with:
- Gzip compression
- Security headers
- Static asset caching
- Health check endpoints
- React Router support

### Docker Configuration

- **Production**: Multi-stage build with Nginx
- **Development**: Hot reload with volume mounting
- **Health checks**: Built-in health monitoring
- **Security**: Non-root user and minimal attack surface

## API Reference

### Docker Commands Categories

- **Basic Operations**: Pull, run, stop, remove
- **Image Management**: Build, tag, push, save
- **Container Management**: Exec, copy, restart, logs
- **Volume Management**: Create, list, remove, inspect
- **Network Management**: Create, connect, disconnect
- **System Commands**: Info, prune, events, stats
- **Backup & Export**: Save, load, export, import
- **Monitoring & Logs**: Stats, logs, inspect, top

### File Operations

- Host to container file transfer
- Container to host file transfer
- Directory operations
- Permission management
- Tar-based bulk operations

## Security Considerations

- All Docker commands are generated client-side
- No direct Docker daemon access from the web interface
- Security headers implemented in Nginx
- Content Security Policy configured
- Input validation and sanitization

## Creator

**Sainudeen Safar** - DevOps Engineer  
- RHCE (Red Hat Certified Engineer)
- CKA (Certified Kubernetes Administrator)
- LinkedIn: [linkedin.com/in/sainudeensafar](https://linkedin.com/in/sainudeensafar)
- Email: sainusainu514@gmail.com

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the Docker documentation links provided in the app

## Roadmap

- [ ] Kubernetes YAML generation
- [ ] Docker Swarm support
- [ ] Container monitoring dashboard
- [ ] Multi-registry support
- [ ] Backup and restore functionality
- [ ] Team collaboration features