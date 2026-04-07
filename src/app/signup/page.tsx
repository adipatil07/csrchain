"use client";

import React, { useState } from 'react';
import { Building2, Users, Heart, Mail, Lock, User, Phone, MapPin, FileText, Upload, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const UnifiedSignup = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    ngoName: '',
    registrationNumber: '',
    address: '',
    focusAreas: [],
    description: '',
    companyName: '',
    cinNumber: '',
    csrBudget: '',
    industry: '',
    fullName: '',
    skills: [],
    availability: ''
  });

  const roles = [
    {
      id: 'ngo',
      title: 'NGO',
      icon: Heart,
      description: 'Register your organization to create and manage CSR projects',
      color: 'from-[#2563eb] to-[#1e40af]'
    },
    {
      id: 'company',
      title: 'CSR Company',
      icon: Building2,
      description: 'Fund and monitor CSR initiatives for compliance',
      color: 'from-[#06b6d4] to-[#0891b2]'
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      icon: Users,
      description: 'Participate in verified CSR activities and earn certificates',
      color: 'from-[#8b5cf6] to-[#7c3aed]'
    }
  ];

  const focusAreaOptions = ['Education', 'Healthcare', 'Environment', 'Rural Development', 'Women Empowerment', 'Skill Development'];
  const skillOptions = ['Teaching', 'Healthcare', 'Construction', 'Technology', 'Administration', 'Marketing'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { role: selectedRole, ...formData });
  };

  return (
    <div className="min-h-screen bg-[#0f1c3f] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a2847] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1e90ff] to-[#0066cc] rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CSR Platform</h1>
              <p className="text-[#7e9bc9] text-sm">Blockchain-Powered Transparency</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Join the Future of CSR Management</h2>
              <p className="text-[#7e9bc9] text-lg">
                Connect NGOs, Volunteers, and Corporate Social Responsibility initiatives through blockchain-verified transparency.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Blockchain Verified</h3>
                  <p className="text-[#7e9bc9] text-sm">All transactions and milestones recorded on-chain for complete transparency</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Smart Fund Management</h3>
                  <p className="text-[#7e9bc9] text-sm">Automated escrow and milestone-based fund disbursement</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Verified Impact</h3>
                  <p className="text-[#7e9bc9] text-sm">Track real-time project progress and beneficiary impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[#7e9bc9] text-sm">
          © 2025 CSR Platform. All rights reserved.
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-auto">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1a2847] mb-2">Create Your Account</h2>
              <p className="text-[#64748b]">Select your role and fill in the required details</p>
            </div>

            <div className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#1a2847] mb-4">Select Your Role *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roles.map(role => (
                    <label
                      key={role.id}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        selectedRole === role.id
                          ? 'border-[#0ea5e9] bg-[#f0f9ff]'
                          : 'border-[#e5e7eb] hover:border-[#cbd5e1] bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={selectedRole === role.id}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-3`}>
                          <role.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-[#1a2847] mb-1">{role.title}</h3>
                        <p className="text-xs text-[#64748b]">{role.description}</p>
                      </div>
                      {selectedRole === role.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {selectedRole && (
                <>
                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a2847] mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1a2847] mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a2847] mb-2">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1a2847]"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1a2847] mb-2">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1a2847]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* NGO Specific Fields */}
                  {selectedRole === 'ngo' && (
                    <>
                      <div className="pt-4 border-t border-[#e5e7eb]">
                        <h3 className="text-lg font-semibold text-[#1a2847] mb-4">NGO Details</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1a2847] mb-2">NGO Name *</label>
                          <input
                            type="text"
                            name="ngoName"
                            value={formData.ngoName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                            placeholder="Hope Foundation"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#1a2847] mb-2">Registration Number *</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                            <input
                              type="text"
                              name="registrationNumber"
                              value={formData.registrationNumber}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                              placeholder="NGO/2024/12345"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a2847] mb-2">Address *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-[#64748b]" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847] resize-none"
                            placeholder="Complete registered address"
                          ></textarea>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a2847] mb-2">Focus Areas * (Select all that apply)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {focusAreaOptions.map(area => (
                            <label key={area} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.focusAreas.includes(area)}
                                onChange={() => handleCheckboxChange('focusAreas', area)}
                                className="w-4 h-4 text-[#0ea5e9] border-[#cbd5e1] rounded focus:ring-[#0ea5e9]"
                              />
                              <span className="text-sm text-[#1a2847]">{area}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a2847] mb-2">Organization Description *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847] resize-none"
                          placeholder="Brief description of your NGO's mission and activities..."
                        ></textarea>
                      </div>
                    </>
                  )}

                  {/* CSR Company Specific Fields */}
                  {selectedRole === 'company' && (
                    <>
                      <div className="pt-4 border-t border-[#e5e7eb]">
                        <h3 className="text-lg font-semibold text-[#1a2847] mb-4">Company Details</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1a2847] mb-2">Company Name *</label>
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                            placeholder="Tech Corp Pvt Ltd"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#1a2847] mb-2">CIN Number *</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                            <input
                              type="text"
                              name="cinNumber"
                              value={formData.cinNumber}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                              placeholder="U12345MH2020PTC123456"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1a2847] mb-2">Annual CSR Budget *</label>
                          <input
                            type="text"
                            name="csrBudget"
                            value={formData.csrBudget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                            placeholder="₹ 2,50,00,000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#1a2847] mb-2">Industry Sector *</label>
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                          >
                            <option value="">Select Industry</option>
                            <option value="IT">Information Technology</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Finance">Finance & Banking</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a2847] mb-2">Registered Office Address *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-[#64748b]" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847] resize-none"
                            placeholder="Complete registered address"
                          ></textarea>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Volunteer Specific Fields */}
                  {selectedRole === 'volunteer' && (
                    <>
                      <div className="pt-4 border-t border-[#e5e7eb]">
                        <h3 className="text-lg font-semibold text-[#1a2847] mb-4">Volunteer Details</h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a2847] mb-2">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a2847] mb-2">Skills * (Select all that apply)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {skillOptions.map(skill => (
                            <label key={skill} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.skills.includes(skill)}
                                onChange={() => handleCheckboxChange('skills', skill)}
                                className="w-4 h-4 text-[#0ea5e9] border-[#cbd5e1] rounded focus:ring-[#0ea5e9]"
                              />
                              <span className="text-sm text-[#1a2847]">{skill}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a2847] mb-2">Availability *</label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                        >
                          <option value="">Select Availability</option>
                          <option value="Weekends">Weekends Only</option>
                          <option value="Weekdays">Weekdays Only</option>
                          <option value="Flexible">Flexible</option>
                          <option value="Full-time">Full-time</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a2847] mb-2">Location/City *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#1a2847]"
                            placeholder="Mumbai, Maharashtra"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Terms and Submit */}
                  <div className="pt-4 border-t border-[#e5e7eb]">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#0ea5e9] border-[#cbd5e1] rounded focus:ring-[#0ea5e9] mt-1"
                      />
                      <span className="text-sm text-[#64748b]">
                        I agree to the <button type="button" className="text-[#0ea5e9] hover:underline">Terms of Service</button> and <button type="button" className="text-[#0ea5e9] hover:underline">Privacy Policy</button>
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white font-semibold rounded-lg transition-all shadow-lg"
                  >
                    Create Account
                  </button>
                </>
              )}

              {!selectedRole && (
                <div className="text-center py-8 text-[#64748b]">
                  Please select a role to continue
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#64748b]">
                Already have an account?{' '}
                <Link href="/login"><button className="text-[#0ea5e9] hover:underline font-semibold">
                  Sign In
                </button></Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSignup;