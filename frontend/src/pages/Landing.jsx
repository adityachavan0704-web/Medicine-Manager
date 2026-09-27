import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pill, ArrowRight, Database, Bell, BarChart3, GitBranch, Zap, Shield, Layers, Clock, Moon, Sun } from 'lucide-react';

const Landing = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const features = [
    {
      icon: Layers,
      title: "MinHeap - FEFO Priority",
      description: "Custom MinHeap implementation for First-Expiry-First-Out medicine recommendations. O(log n) operations ensure efficient expiry management.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Database,
      title: "HashMap - Fast Lookups",
      description: "Custom HashMap with O(1) average-case medicine lookups. Implements open addressing with linear probing for collision resolution.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Bell,
      title: "AlertQueue - FIFO Alerts",
      description: "Queue-based alert system for chronological notification management. Ensures critical expiry warnings are processed in order.",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: GitBranch,
      title: "LinkedList - History Tracking",
      description: "Doubly LinkedList for efficient chronological history tracking. Enables O(1) insertions and sequential traversal.",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  const highlights = [
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Live dashboard with inventory insights and trends",
    },
    {
      icon: Shield,
      title: "Role-based Access",
      description: "Secure authentication with admin, pharmacist, and viewer roles",
    },
    {
      icon: BarChart3,
      title: "Data Visualization",
      description: "Interactive visualizations of custom data structures in action",
    },
    {
      icon: Clock,
      title: "Expiry Monitoring",
      description: "Automated alerts for medicines approaching expiration",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-medical-600 to-medical-700 rounded-3xl mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <Pill className="w-12 h-12 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Smart<span className="text-medical-600 dark:text-medical-400">Med</span>Guard
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
            Production-Ready Medicine Inventory Management
          </p>
          
          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            A production-ready medicine inventory management system demonstrating 
            <span className="font-semibold text-medical-600 dark:text-medical-400"> custom data structures</span> in a 
            real-world healthcare context. Built for competitive programming enthusiasts 
            who want to see their algorithms in action.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Data Structures Showcase */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Custom Data Structures in Action
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Four fundamental data structures implemented from scratch, powering a real-world application
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-medical-400 dark:hover:border-medical-500 transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Comprehensive Feature Set
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Everything you need for professional medicine inventory management
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 text-center transform hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-medical-50 dark:bg-medical-900/20 rounded-lg mb-4">
                  <highlight.icon className="w-6 h-6 text-medical-600 dark:text-medical-400" />
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {highlight.title}
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Badge */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Built with Modern Technologies
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Vite', 'JWT Auth'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-300 rounded-lg font-medium text-sm border border-medical-200 dark:border-medical-700"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ready to explore data structures in a real-world application?
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 font-semibold transition-colors"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>© 2024 SmartMedGuard. Demonstrating competitive programming concepts in production.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
