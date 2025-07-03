import React from 'react';
import { User, Linkedin, Mail, MapPin, Briefcase, Code, Award, ExternalLink, Shield, Star } from 'lucide-react';

const CreatorPage: React.FC = () => {
  const skills = [
    'Docker & Containerization',
    'Kubernetes',
    'AWS/Azure/GCP',
    'CI/CD Pipelines',
    'Infrastructure as Code',
    'Monitoring & Logging',
    'Linux Administration',
    'Automation & Scripting'
  ];

  const certifications = [
    {
      name: 'Red Hat Certified Engineer (RHCE)',
      icon: '🎓',
      description: 'Advanced Linux system administration and automation',
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      icon: '☸️',
      description: 'Kubernetes cluster administration and management',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  ];

  const achievements = [
    'Built enterprise-scale containerization solutions',
    'Automated deployment pipelines reducing deployment time by 80%',
    'Designed and implemented multi-cloud infrastructure',
    'Led DevOps transformation initiatives',
    'Created AutoDockr tool for simplified container management'
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
                <img 
                  src="/src/assets/profile-photo.jpg" 
                  alt="Sainudeen Safar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image doesn't load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <User className="h-16 w-16 text-white/70 hidden" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">Sainudeen Safar</h1>
              <p className="text-xl text-blue-100 mb-2">DevOps Engineer</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="bg-red-500/20 text-red-100 px-3 py-1 rounded-full text-sm font-medium border border-red-400/30">
                  RHCE Certified
                </span>
                <span className="bg-blue-500/20 text-blue-100 px-3 py-1 rounded-full text-sm font-medium border border-blue-400/30">
                  CKA Certified
                </span>
              </div>
              <p className="text-blue-50 leading-relaxed">
                Passionate DevOps engineer specializing in containerization, cloud infrastructure, 
                and automation. Creator of AutoDockr - a comprehensive tool for Docker 
                management and container orchestration.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                <a
                  href="https://linkedin.com/in/sainudeensafar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                
                <a
                  href="mailto:sainusainu514@gmail.com"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">About Me</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                As a certified DevOps engineer with extensive experience in containerization and cloud 
                infrastructure, I'm passionate about creating tools that simplify complex 
                deployment processes and improve developer productivity.
              </p>
              
              <p>
                I specialize in building scalable, automated solutions using Docker, Kubernetes, 
                and various cloud platforms. My focus is on creating robust CI/CD pipelines 
                and infrastructure that enables teams to deploy with confidence.
              </p>
              
              <p>
                AutoDockr was born from my experience working with development 
                teams who needed a more intuitive way to manage Docker containers and compose 
                configurations without diving deep into command-line interfaces.
              </p>
            </div>

            <div className="mt-6 flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Available Worldwide (Remote)</span>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Code className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Core Skills</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-800 font-medium">{skill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Professional Certifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${cert.color}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{cert.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{cert.name}</h3>
                      <p className="text-sm opacity-90">{cert.description}</p>
                      <div className="mt-3 flex items-center space-x-2">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-medium">Industry Recognized</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
              <p className="text-purple-800 text-sm">
                <strong>Certification Focus:</strong> These certifications demonstrate expertise in enterprise-level 
                Linux administration, automation, and Kubernetes cluster management - core skills essential 
                for modern DevOps practices.
              </p>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-yellow-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Key Achievements</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 leading-relaxed">{achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AutoDockr Project */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">AutoDockr Project</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-900 mb-3">Project Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  AutoDockr is a comprehensive web-based tool designed to simplify 
                  Docker container management. It provides an intuitive interface for creating 
                  Docker Compose files, generating Dockerfiles, and managing Docker commands 
                  without requiring deep command-line knowledge.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-blue-900 mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Interactive Docker Compose generator</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Multi-language Dockerfile templates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Comprehensive Docker command reference</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Advanced Docker configuration tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Installation guides for all platforms</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Technology Stack:</strong> React, TypeScript, Tailwind CSS, Docker, Nginx
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get In Touch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-700 mb-4">
                  I'm always interested in discussing DevOps challenges, containerization 
                  strategies, and innovative automation solutions. Feel free to reach out 
                  for collaboration opportunities or technical discussions.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <a
                      href="https://linkedin.com/in/sainudeensafar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      linkedin.com/in/sainudeensafar
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <a
                      href="mailto:sainusainu514@gmail.com"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      sainusainu514@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'DevOps', 'Automation', 'RHCE', 'CKA'].map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;