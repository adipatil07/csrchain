"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Globe, Users, TrendingUp, FileCheck, Award, Lock, Zap, CheckCircle, ArrowRight, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        if (isVisible) {
          setVisibleElements(prev => new Set([...prev, el.id]));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Shield className="w-12 h-12 text-blue-400" />,
      title: "Blockchain Security",
      description: "Immutable, transparent records of all CSR transactions and fund flows on blockchain",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Globe className="w-12 h-12 text-emerald-400" />,
      title: "Global Transparency",
      description: "Real-time tracking of projects, milestones, and fund utilization for all stakeholders",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      icon: <Users className="w-12 h-12 text-purple-400" />,
      title: "Multi-Stakeholder",
      description: "Unified platform connecting NGOs, CSR companies, volunteers, and regulators",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-orange-400" />,
      title: "Impact Analytics",
      description: "Comprehensive dashboards and reports measuring social impact and compliance",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      icon: <FileCheck className="w-12 h-12 text-indigo-400" />,
      title: "Smart Escrow",
      description: "Milestone-based automated fund release through smart contracts",
      gradient: "from-indigo-500/20 to-blue-500/20"
    },
    {
      icon: <Award className="w-12 h-12 text-pink-400" />,
      title: "Verified Certificates",
      description: "Blockchain-based proof of participation and contribution for volunteers",
      gradient: "from-pink-500/20 to-rose-500/20"
    }
  ];

  const roles = [
    {
      title: "NGOs",
      description: "Create projects, submit milestones, receive funds, coordinate volunteers",
      icon: <Globe className="w-8 h-8" />,
      color: "from-blue-600 to-blue-800",
      hoverColor: "hover:from-blue-500 hover:to-blue-700"
    },
    {
      title: "CSR Companies",
      description: "Review proposals, allocate budgets, track compliance, approve fund releases",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-emerald-600 to-emerald-800",
      hoverColor: "hover:from-emerald-500 hover:to-emerald-700"
    },
    {
      title: "Volunteers",
      description: "Join projects, mark attendance, earn blockchain-verified certificates",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-500 hover:to-purple-700"
    },
    {
      title: "Auditors/Regulators",
      description: "Verify fund flows, generate compliance reports, ensure transparency",
      icon: <Shield className="w-8 h-8" />,
      color: "from-orange-600 to-orange-800",
      hoverColor: "hover:from-orange-500 hover:to-orange-700"
    }
  ];

  const benefits = [
    "End-to-end transparency in CSR fund utilization",
    "Automated compliance and audit trail generation",
    "Reduced fraud and misappropriation risks",
    "Real-time project monitoring and reporting",
    "Verifiable volunteer contributions",
    "Simplified CSR mandate fulfillment"
  ];

  const stats = [
    { number: "100%", label: "Transparent", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "Zero", label: "Fund Leakage", icon: <Lock className="w-6 h-6" /> },
    { number: "Real-Time", label: "Tracking", icon: <Zap className="w-6 h-6" /> },
    { number: "Blockchain", label: "Verified", icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        .glass-effect {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .glow-text {
          text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
        }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <Shield className="w-8 h-8 text-blue-500 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse-glow"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CSR Chain
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors relative group">
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="#roles" className="text-gray-300 hover:text-blue-400 transition-colors relative group">
                User Roles
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="#benefits" className="text-gray-300 hover:text-blue-400 transition-colors relative group">
                Benefits
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-blue-900/50 transition-all">
                Login
              </Button></Link>
              <Link href="/signup"><Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/50">
                Sign Up
              </Button></Link>
            </div>

            <button 
              className="md:hidden text-gray-300 hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 glass-effect rounded-lg mt-2 animate-slide-up">
              <a href="#features" className="block text-gray-300 hover:text-blue-400 px-4 py-2">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-blue-400 px-4 py-2">How It Works</a>
              <a href="#roles" className="block text-gray-300 hover:text-blue-400 px-4 py-2">User Roles</a>
              <a href="#benefits" className="block text-gray-300 hover:text-blue-400 px-4 py-2">Benefits</a>
              <div className="flex flex-col space-y-2 pt-4 px-4">
                <Button variant="ghost" className="w-full text-gray-300 hover:bg-blue-900/50">Login</Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">Sign Up</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-blue-900/50 text-blue-300 border-blue-500/50 animate-slide-up px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Powered by Blockchain Technology
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up glow-text" style={{ animationDelay: '0.1s' }}>
            Transforming CSR Through
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Transparency & Trust
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            A unified blockchain-powered platform connecting NGOs, CSR companies, volunteers, and regulators for transparent, accountable, and impactful social responsibility initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-lg px-8 shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-blue-500 text-blue-400 hover:bg-blue-900/30 transition-all transform hover:scale-105">
              Watch Demo
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-12">
            <ChevronDown className="w-8 h-8 mx-auto text-blue-400" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="glass-effect rounded-xl p-6 card-hover animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex justify-center mb-3 text-blue-400">{stat.icon}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll" id="features-header">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Platform Features</h2>
            <p className="text-xl text-gray-400">Built for transparency, security, and impact</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card 
                key={idx} 
                className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border-gray-800 hover:border-blue-500/50 card-hover animate-on-scroll`}
                id={`feature-${idx}`}
              >
                <CardHeader>
                  <div className="mb-4 transform transition-transform hover:scale-110 hover:rotate-6">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">How It Works</h2>
            <p className="text-xl text-gray-400">Simple, transparent, and automated workflow</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "NGO Creates Project", desc: "Submit proposals with milestones and budget", color: "from-blue-500 to-cyan-500" },
              { step: "2", title: "CSR Approves & Funds", desc: "Review and create blockchain escrow", color: "from-emerald-500 to-teal-500" },
              { step: "3", title: "Milestone Execution", desc: "NGOs submit proof, volunteers participate", color: "from-purple-500 to-pink-500" },
              { step: "4", title: "Automated Release", desc: "Smart contracts release funds on verification", color: "from-orange-500 to-red-500" }
            ].map((item, idx) => (
              <div key={idx} className="text-center relative animate-on-scroll" id={`workflow-${idx}`}>
                <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-2xl animate-pulse-glow transform hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}
                <h3 className="text-lg font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section id="roles" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Built for Every Stakeholder</h2>
            <p className="text-xl text-gray-400">Dedicated dashboards for each user role</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role, idx) => (
              <Card 
                key={idx} 
                className={`bg-gradient-to-br ${role.color} border-none card-hover ${role.hoverColor} transition-all animate-on-scroll`}
                id={`role-${idx}`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      {role.icon}
                    </div>
                    <CardTitle className="text-2xl text-white">{role.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll" id="benefits-text">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">Why Choose CSR Chain?</h2>
              <p className="text-lg text-gray-400 mb-8">
                Our blockchain-powered platform eliminates opacity and builds trust among all stakeholders in the CSR ecosystem.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start space-x-3 p-4 glass-effect rounded-lg transform hover:scale-105 transition-transform"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Lock className="w-10 h-10" />, title: "Secure", desc: "Military-grade blockchain encryption", color: "from-blue-600 to-blue-800" },
                { icon: <Zap className="w-10 h-10" />, title: "Fast", desc: "Real-time transaction processing", color: "from-emerald-600 to-emerald-800" },
                { icon: <Globe className="w-10 h-10" />, title: "Global", desc: "Accessible from anywhere", color: "from-purple-600 to-purple-800" },
                { icon: <TrendingUp className="w-10 h-10" />, title: "Scalable", desc: "Handles unlimited projects", color: "from-orange-600 to-orange-800" }
              ].map((item, idx) => (
                <Card 
                  key={idx} 
                  className={`bg-gradient-to-br ${item.color} border-none text-white card-hover animate-on-scroll`}
                  id={`benefit-card-${idx}`}
                >
                  <CardHeader>
                    <div className="mb-2 transform hover:scale-110 transition-transform">{item.icon}</div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-200">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-blue-900/50 animate-gradient"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            Ready to Transform Your CSR Initiatives?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the future of transparent and accountable social responsibility
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-8 shadow-2xl transform hover:scale-105 transition-all">
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8 transform hover:scale-105 transition-all">
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CSR Chain
                </span>
              </div>
              <p className="text-sm text-gray-400">Blockchain-powered transparency for Corporate Social Responsibility</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 CSR Chain. All rights reserved. Built with Next.js & Blockchain.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}