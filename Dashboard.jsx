import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import { 
  BookOpen, User, Settings, GraduationCap, 
  CheckCircle, ArrowRight, Users, Mail, Bell, Lock, Play, Search,
  LayoutDashboard, FileText, Activity, ShieldCheck, Briefcase, Globe, Video,
  TrendingUp, Zap, Award
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState(null);
  
  const role = localStorage.getItem('role') || 'student';
  const userName = localStorage.getItem('userName') || 'Friend';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const openInfoModal = (title, description, icon) => {
    setModalInfo({ title, description, icon });
  };

  const closeInfoModal = () => {
    setModalInfo(null);
  };

  // Dynamic Stats based on Role - with glossy gradient borders
  const getRoleStats = () => {
    switch(role) {
      case 'admin':
        return [
          { label: 'Total Students', value: '1,284', icon: <Users size={22} />, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', info: "Current active enrollments across all departments.", bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)' },
          { label: 'Revenue', value: '$12.4k', icon: <TrendingUp size={22} />, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)', info: "Net revenue generated this billing cycle.", bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
          { label: 'Server Status', value: '99.9%', icon: <Zap size={22} />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', info: "Real-time infrastructure health and uptime.", bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
        ];
      case 'teacher':
        return [
          { label: 'Enrollment', value: '156', icon: <Users size={22} />, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', info: "Students currently enrolled in your active courses.", bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' },
          { label: 'Grading', value: '28', icon: <FileText size={22} />, color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)', info: "Pending assignments requiring immediate review.", bg: 'linear-gradient(135deg, #fff1f2, #ffe4e6)' },
          { label: 'Feedback', value: '4.9/5', icon: <Activity size={22} />, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', info: "Average student satisfaction score.", bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
        ];
      default: // student
        return [
          { label: 'In Progress', value: '3', icon: <BookOpen size={22} />, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', info: "Courses you have started but not yet completed.", bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)' },
          { label: 'Completed', value: '12', icon: <CheckCircle size={22} />, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)', info: "Total certifications and courses finished.", bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
          { label: 'Badges', value: '8', icon: <Award size={22} />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', info: "Achievements earned for exceptional performance.", bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
        ];
    }
  };

  const getRoleIcon = () => {
    if (role === 'admin') return <ShieldCheck size={16} />;
    if (role === 'teacher') return <Briefcase size={16} />;
    return <User size={16} />;
  };

  const tabs = [
    { id: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'Courses', icon: <BookOpen size={18} /> },
    { id: 'Videos', icon: <Video size={18} /> },
    { id: 'Settings', icon: <Settings size={18} /> }
  ];

  const videoLibrary = [
    { id: 'v1', title: 'Intro to Mathematics', duration: '15:20', category: 'Basics', color: '#3b82f6', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
    { id: 'v2', title: 'English Grammar 101', duration: '12:45', category: 'Language', color: '#6366f1', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
    { id: 'v3', title: 'World Geography', duration: '20:10', category: 'Social', color: '#10b981', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
    { id: 'v4', title: 'Creative Art Workshop', duration: '08:30', category: 'Arts', color: '#f59e0b', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
  ];

  const filteredVideos = videoLibrary.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 min-h-screen">
        <div className="flex flex-col gap-6">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="p-1.5 bg-indigo-50 rounded-lg">{getRoleIcon()}</div>
                <span className="text-xs font-bold uppercase tracking-[0.15em]">{role} Workspace</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeTab}
              </h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-white p-1.5 rounded-2xl shadow-lg border border-slate-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedVideo(null);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {tab.icon}
                  {tab.id}
                </button>
              ))}
            </div>
          </header>

          {/* Content Area */}
          <main aria-live="polite">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm min-h-[500px]"
            >
              {activeTab === 'Overview' && (
                <div className="space-y-8">
                  {/* Stats Cards - Fixed alignment with glossy gradient borders */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {getRoleStats().map((stat, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ scale: 1.03, boxShadow: '0 12px 24px -4px rgba(0,0,0,0.12)' }}
                        onClick={() => openInfoModal(stat.label, stat.info, stat.icon)}
                        className="rounded-2xl p-5 cursor-pointer transition-all relative group overflow-hidden"
                        style={{
                          border: `2px solid transparent`,
                          backgroundClip: 'padding-box',
                          boxShadow: `inset 0 0 0 2px ${stat.color}20, 0 4px 12px -2px ${stat.color}15`,
                        }}
                      >
                        {/* Glossy gradient border overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '1rem',
                          padding: '2px',
                          background: stat.gradient,
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                          opacity: 0.6,
                          transition: 'opacity 0.2s',
                        }} className="group-hover:opacity-100" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 rounded-xl" style={{ background: stat.bg, color: stat.color }}>
                              {stat.icon}
                            </div>
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Welcome Banner - Fixed awkward text */}
                  <div className="rounded-2xl p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)' }}>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-extrabold mb-2">Hey {userName}, ready to learn?</h3>
                      <p className="text-indigo-200 mb-6 max-w-md text-base leading-relaxed">You have 4 new messages and 2 schedule updates this week. Keep up the great work!</p>
                      <motion.button 
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => window.location.href = '/courses'}
                        className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                      >
                        View My Courses <ArrowRight size={16} />
                      </motion.button>
                    </div>
                    <GraduationCap className="absolute -right-8 -bottom-8 text-indigo-400 w-48 h-48 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                  </div>
                </div>
              )}

              {activeTab === 'Videos' && (
                <AnimatePresence mode="wait">
                  {selectedVideo ? (
                    <motion.div 
                      key="player-view"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <button 
                        onClick={() => setSelectedVideo(null)}
                        className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-5 py-2.5 rounded-xl transition-all border border-indigo-200"
                      >
                        <ArrowRight className="rotate-180" size={14} /> Back to Library
                      </button>
                      <VideoPlayer video={selectedVideo} />
                      <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{selectedVideo.category}</span>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{selectedVideo.title}</h3>
                        <p className="text-slate-500 mt-3 leading-relaxed">Enjoy this lesson on {selectedVideo.title}. Remember to take notes!</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="grid-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-5"
                    >
                      {/* Search bar */}
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search videos..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent border-none outline-none text-sm flex-1 text-slate-700 placeholder-slate-400"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredVideos.length === 0 ? (
                          <div className="col-span-2 text-center py-12 text-slate-400">
                            <p className="text-lg font-medium">No videos found</p>
                          </div>
                        ) : (
                          filteredVideos.map((video, i) => (
                          <motion.div 
                            key={video.id}
                            whileHover={{ y: -6 }}
                            onClick={() => setSelectedVideo(video)}
                            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 group cursor-pointer transition-all bg-white hover:shadow-lg hover:border-indigo-300"
                          >
                            {/* Video thumbnail area - fixed overlap issue */}
                            <div className="relative aspect-video flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${video.color}15, ${video.color}30)` }}>
                              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg z-10 scale-100 group-hover:scale-110 transition-transform duration-300 border-2 border-white/50" style={{ background: video.color }}>
                                <Play size={20} fill="currentColor" />
                              </div>
                              {/* Duration badge - properly positioned */}
                              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm">
                                {video.duration}
                              </div>
                            </div>
                            {/* Video info - clean separation */}
                            <div className="p-5">
                              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: video.color }}>{video.category}</span>
                              <h4 className="text-lg font-bold text-slate-900 mt-1.5">{video.title}</h4>
                            </div>
                          </motion.div>
                        ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {activeTab === 'Courses' && (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md border border-slate-200 mb-6" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}>
                    <BookOpen size={40} className="text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 text-center">No courses joined yet</h3>
                  <p className="text-slate-600 mt-3 text-base text-center max-w-sm leading-relaxed">
                    Your dashboard is looking a bit quiet. Explore our catalog to find your next favorite subject!
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.04 }}
                    onClick={() => window.location.href = '/courses'}
                    className="mt-8 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    Explore Catalog
                  </motion.button>
                </div>
              )}

              {activeTab === 'Settings' && (
                <div className="max-w-3xl space-y-10">
                  <section className="space-y-5">
                    <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                      <Mail className="text-indigo-500" size={20} />
                      <h3 className="text-lg font-bold text-slate-900">Account Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Display Name</label>
                        <input type="text" placeholder={localStorage.getItem('userName')} className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium transition-all text-sm" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                        <input type="email" placeholder="user@eduhub.com" className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium transition-all text-sm" />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-5">
                    <div className="flex items-center gap-3 border-l-4 border-violet-500 pl-4">
                      <Lock className="text-violet-500" size={20} />
                      <h3 className="text-lg font-bold text-slate-900">Security</h3>
                    </div>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md text-sm">
                      Change Password
                    </button>
                  </section>

                  <section className="space-y-5">
                    <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
                      <Bell className="text-emerald-500" size={20} />
                      <h3 className="text-lg font-bold text-slate-900">Preferences</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Email Notifications', desc: 'Get weekly progress reports via email', icon: <Globe size={16}/> },
                        { label: 'System Sounds', desc: 'Play sounds for new messages', icon: <Bell size={16}/> }
                      ].map((pref, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 transition-all hover:bg-white hover:shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400">{pref.icon}</div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{pref.label}</p>
                              <p className="text-xs text-slate-500">{pref.desc}</p>
                            </div>
                          </div>
                          <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer flex-shrink-0"><div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"></div></div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          </main>

          {/* Info Modal */}
          <AnimatePresence>
            {modalInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={closeInfoModal}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-slate-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">{modalInfo.icon}</div>
                    <h3 className="text-lg font-bold text-slate-900">{modalInfo.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{modalInfo.description}</p>
                  <button
                    onClick={closeInfoModal}
                    className="mt-5 w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
                  >
                    Got it
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
};

export default Dashboard;