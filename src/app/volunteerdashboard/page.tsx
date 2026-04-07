"use client";

import React, { useState } from 'react';
import { Calendar, Clock, Award, MapPin, Users, Bell, User, QrCode, FileText, Star, TrendingUp, CheckCircle, XCircle, AlertCircle, Search, Filter, Download, ExternalLink } from 'lucide-react';

const VolunteerPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats = [
    { label: 'Hours Contributed', value: '156', trend: '+12%', icon: Clock, color: 'from-blue-500 to-cyan-500' },
    { label: 'Projects Completed', value: '8', trend: '+2', icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
    { label: 'Certificates Earned', value: '5', trend: 'New', icon: Award, color: 'from-orange-500 to-red-500' },
    { label: 'Volunteer Rating', value: '4.8', trend: '★', icon: Star, color: 'from-green-500 to-teal-500' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Community Clean-Up Drive', ngo: 'Green Earth Foundation', date: '2025-11-18', time: '09:00 AM', location: 'Mumbai Central Park', status: 'Accepted', hours: 4 },
    { id: 2, title: 'Teaching Session for Underprivileged', ngo: 'Education First NGO', date: '2025-11-20', time: '02:00 PM', location: 'Dharavi Community Center', status: 'Accepted', hours: 3 },
    { id: 3, title: 'Food Distribution Program', ngo: 'Hope Foundation', date: '2025-11-22', time: '11:00 AM', location: 'Andheri West', status: 'Applied', hours: 5 }
  ];

  const projects = [
    { id: 1, title: 'Beach Cleanup Initiative', ngo: 'Coastal Care', location: 'Juhu Beach', skills: ['Physical Work', 'Team Work'], volunteers: 45, maxVolunteers: 50, date: '2025-11-25', status: 'Open' },
    { id: 2, title: 'Digital Literacy Workshop', ngo: 'Tech for All', location: 'Powai', skills: ['Teaching', 'Technology'], volunteers: 12, maxVolunteers: 15, date: '2025-11-28', status: 'Open' },
    { id: 3, title: 'Blood Donation Camp', ngo: 'Life Savers', location: 'Bandra', skills: ['Healthcare', 'Organization'], volunteers: 20, maxVolunteers: 20, date: '2025-11-30', status: 'Full' }
  ];

  const certificates = [
    { id: 1, title: 'Community Service Excellence', project: 'Environmental Conservation', issueDate: '2025-10-15', hours: 24, hash: '0x7a8f3b...9e2c', verified: true },
    { id: 2, title: 'Youth Mentorship Program', project: 'Education Initiative', issueDate: '2025-09-22', hours: 18, hash: '0x4d1e9c...7f3a', verified: true },
    { id: 3, title: 'Healthcare Support Volunteer', project: 'Medical Camp', issueDate: '2025-08-10', hours: 12, hash: '0x2b5a8d...4e1c', verified: true }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-600">{stat.trend}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">View All</button>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{event.ngo}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">{event.hours} hours</span>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'Completed', project: 'Food Distribution', date: '2 days ago', icon: CheckCircle, color: 'text-green-500' },
              { action: 'Joined', project: 'Beach Cleanup', date: '5 days ago', icon: Users, color: 'text-blue-500' },
              { action: 'Certificate Issued', project: 'Teaching Program', date: '1 week ago', icon: Award, color: 'text-purple-500' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}: {activity.project}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Your Impact</h2>
          <p className="text-blue-100 mb-4 text-sm">You're making a difference in your community!</p>
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Lives Impacted</span>
                <span className="text-2xl font-bold">234</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Next Badge</span>
                <span className="text-sm font-semibold">45 hours to go</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectExplorer = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Locations</option>
            <option>Mumbai</option>
            <option>Pune</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Skills</option>
            <option>Teaching</option>
            <option>Healthcare</option>
            <option>Physical Work</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">{project.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{project.ngo}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.date}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{project.volunteers}/{project.maxVolunteers} volunteers</span>
                  <span>{Math.round((project.volunteers / project.maxVolunteers) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full h-2"
                    style={{ width: `${(project.volunteers / project.maxVolunteers) * 100}%` }}
                  ></div>
                </div>
              </div>
              <button 
                disabled={project.status === 'Full'}
                className={`w-full py-2 rounded-lg font-semibold transition-all ${
                  project.status === 'Full' 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
                }`}
              >
                {project.status === 'Full' ? 'Project Full' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-sm p-8 text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-2xl mb-4">
              <QrCode className="w-20 h-20 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Scan to Check-In</h2>
            <p className="text-blue-100 mb-6">Show this QR code to event organizers</p>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Generate QR Code
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Location-Based Check-In</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">Enable location services to check-in automatically when you arrive at the event venue.</p>
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                Enable Location Check-In
              </button>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Active Events Nearby</h3>
              <div className="space-y-2">
                {upcomingEvents.slice(0, 2).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700">
                      Check-In
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Event</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-In</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-Out</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hours</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { event: 'Community Clean-Up', date: '2025-11-10', checkIn: '09:05 AM', checkOut: '01:15 PM', hours: 4.2, verified: true },
                { event: 'Teaching Session', date: '2025-11-05', checkIn: '02:00 PM', checkOut: '05:00 PM', hours: 3.0, verified: true },
                { event: 'Food Distribution', date: '2025-10-28', checkIn: '11:00 AM', checkOut: '04:30 PM', hours: 5.5, verified: true }
              ].map((record, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{record.event}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{record.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{record.checkIn}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{record.checkOut}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-800">{record.hours}h</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Certificate Wallet</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Total Certificates:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">{certificates.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                  <Award className="w-8 h-8 text-white" />
                </div>
                {cert.verified && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{cert.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{cert.project}</p>
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-medium text-gray-800">{cert.issueDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Hours Logged:</span>
                  <span className="font-medium text-gray-800">{cert.hours}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Blockchain Hash:</span>
                  <span className="font-mono text-xs text-blue-600">{cert.hash}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <Award className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">NFT Certificates</h3>
            <p className="text-purple-100 text-sm">All certificates are blockchain-verified and can be shared as NFTs</p>
          </div>
          <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mb-4 text-white text-3xl font-bold">
              AU
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Admin User</h2>
            <p className="text-sm text-gray-500 mb-4">admin@hope.org</p>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-5 h-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-sm font-semibold text-gray-700">4.8</span>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
                Edit Profile
              </button>
              <button className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                View Public Profile
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: 'Admin User' },
                { label: 'Email', value: 'admin@hope.org' },
                { label: 'Phone', value: '+91 98765 43210' },
                { label: 'Location', value: 'Mumbai, Maharashtra' },
                { label: 'Date of Birth', value: 'January 15, 1995' },
                { label: 'Blood Group', value: 'O+' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="text-sm text-gray-600 mb-1 block">{field.label}</label>
                  <p className="font-medium text-gray-800">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Skills & Interests</h3>
            <div className="flex flex-wrap gap-2">
              {['Teaching', 'Healthcare', 'Environmental Conservation', 'Community Service', 'Event Management', 'Digital Literacy'].map((skill, idx) => (
                <span key={idx} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Badges Earned</h3>
              <span className="text-sm text-gray-600">6 badges</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {['🌟', '🏆', '💪', '📚', '🌱', '❤️'].map((badge, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-3xl mb-2 mx-auto">
                    {badge}
                  </div>
                  <p className="text-xs text-gray-600">Badge {idx + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">Mark all as read</button>
        </div>

        <div className="space-y-3">
          {[
            { type: 'success', icon: CheckCircle, title: 'Certificate Issued', message: 'Your certificate for "Community Clean-Up Drive" has been issued', time: '2 hours ago', unread: true },
            { type: 'info', icon: Bell, title: 'Event Reminder', message: 'Your event "Teaching Session" starts tomorrow at 2:00 PM', time: '5 hours ago', unread: true },
            { type: 'success', icon: Users, title: 'Application Accepted', message: 'You have been accepted for "Food Distribution Program"', time: '1 day ago', unread: false },
            { type: 'warning', icon: AlertCircle, title: 'Event Update', message: 'Location changed for "Beach Cleanup Initiative"', time: '2 days ago', unread: false },
            { type: 'info', icon: Award, title: 'New Badge Earned', message: 'Congratulations! You earned the "Community Hero" badge', time: '3 days ago', unread: false }
          ].map((notif, idx) => (
            <div key={idx} className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
              notif.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`p-2 rounded-lg ${
                notif.type === 'success' ? 'bg-green-100' :
                notif.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <notif.icon className={`w-5 h-5 ${
                  notif.type === 'success' ? 'text-green-600' :
                  notif.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                  {notif.unread && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                </div>
                <p className="text-sm text-gray-600 mb-1">{notif.message}</p>
                <span className="text-xs text-gray-500">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { label: 'Event Reminders', description: 'Get notified about upcoming events', enabled: true },
            { label: 'Certificate Updates', description: 'Notifications when certificates are issued', enabled: true },
            { label: 'Application Status', description: 'Updates on your project applications', enabled: true },
            { label: 'Weekly Summary', description: 'Weekly digest of your volunteer activities', enabled: false }
          ].map((pref, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{pref.label}</p>
                <p className="text-sm text-gray-500">{pref.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={pref.enabled} readOnly className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center font-bold text-2xl">
                H
              </div>
              <div>
                <h1 className="text-xl font-bold">Hope Foundation</h1>
                <p className="text-blue-100 text-sm">Volunteer Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
                />
              </div>
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'projects', label: 'Project Explorer', icon: Search },
              { id: 'attendance', label: 'Attendance', icon: QrCode },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'projects' && renderProjectExplorer()}
        {activeTab === 'attendance' && renderAttendance()}
        {activeTab === 'certificates' && renderCertificates()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'notifications' && renderNotifications()}
      </div>
    </div>
  );
};

export default VolunteerPanel;