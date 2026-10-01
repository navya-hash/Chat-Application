import React, { useState, useEffect } from "react";
import { svgToBase64 } from "../utils/avatarHelper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import api from "../utils/AxiosSet";
import { updateProfileRoute } from "../utils/APIRoutes";

const SettingsPane = ({ currentUser, onBack, onUpdateUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile state representation
  const [displayName, setDisplayName] = useState(currentUser?.username || "User");
  const [jobTitle, setJobTitle] = useState(currentUser?.jobTitle || "Team Member");
  const [bio, setBio] = useState(currentUser?.bio || "VibeChat member");

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.username || "");
      setJobTitle(currentUser.jobTitle || "Team Member");
      setBio(currentUser.bio || "VibeChat member");
    }
  }, [currentUser]);

  // Notifications State (persisted to localStorage)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("vibeChat_notifications");
    return saved
      ? JSON.parse(saved)
      : { email: true, desktop: true, sound: false };
  });

  // Appearance State (persisted to localStorage)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("vibeChat_theme") || "dark";
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("vibeChat_accent") || "primary";
  });

  // Apply Theme Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    localStorage.setItem("vibeChat_theme", theme);
  }, [theme]);

  // Persist notifications settings
  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("vibeChat_notifications", JSON.stringify(updated));
    toast.success("Notification settings updated.");
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.post(updateProfileRoute, {
        username: displayName,
        jobTitle,
        bio,
      });

      if (data.status) {
        toast.success(data.message || "Profile updated successfully!");
        if (onUpdateUser && data.user) {
          onUpdateUser(data.user);
        }
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto h-full flex flex-col gap-stack-lg relative z-10 w-full p-4">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-stack-sm">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center cursor-pointer mr-2"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Settings</h2>
        </div>
        <div className="flex items-center gap-3">
          <Logout />
          <button 
            onClick={onBack}
            className="px-gutter py-stack-sm rounded-xl border border-outline-variant/20 font-label-md text-label-md text-on-surface-variant hover:bg-white/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-gutter py-stack-sm rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-label-md text-label-md shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:brightness-110 transition-all cursor-pointer font-semibold"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-stack-lg min-h-0">
        {/* Categories Sidebar */}
        <nav className="w-64 flex flex-col gap-unit">
          <button 
            className={`flex items-center gap-stack-md px-gutter py-stack-md rounded-xl transition-all text-left cursor-pointer ${
              activeTab === "profile" 
                ? "bg-primary/10 text-primary" 
                : "text-on-surface-variant hover:bg-white/5"
            }`} 
            onClick={() => setActiveTab("profile")}
          >
            <span className={`material-symbols-outlined ${activeTab === "profile" ? "icon-fill" : ""}`}>person</span>
            <span className="font-title-md text-title-md">Profile</span>
          </button>
          <button 
            className={`flex items-center gap-stack-md px-gutter py-stack-md rounded-xl transition-all text-left cursor-pointer ${
              activeTab === "notifications" 
                ? "bg-primary/10 text-primary" 
                : "text-on-surface-variant hover:bg-white/5"
            }`} 
            onClick={() => setActiveTab("notifications")}
          >
            <span className={`material-symbols-outlined ${activeTab === "notifications" ? "icon-fill" : ""}`}>notifications</span>
            <span className="font-title-md text-title-md">Notifications</span>
          </button>
          <button 
            className={`flex items-center gap-stack-md px-gutter py-stack-md rounded-xl transition-all text-left cursor-pointer ${
              activeTab === "appearance" 
                ? "bg-primary/10 text-primary" 
                : "text-on-surface-variant hover:bg-white/5"
            }`} 
            onClick={() => setActiveTab("appearance")}
          >
            <span className={`material-symbols-outlined ${activeTab === "appearance" ? "icon-fill" : ""}`}>palette</span>
            <span className="font-title-md text-title-md">Appearance</span>
          </button>
          <button 
            className={`flex items-center gap-stack-md px-gutter py-stack-md rounded-xl transition-all text-left cursor-pointer ${
              activeTab === "privacy" 
                ? "bg-primary/10 text-primary" 
                : "text-on-surface-variant hover:bg-white/5"
            }`} 
            onClick={() => setActiveTab("privacy")}
          >
            <span className={`material-symbols-outlined ${activeTab === "privacy" ? "icon-fill" : ""}`}>lock</span>
            <span className="font-title-md text-title-md">Privacy</span>
          </button>
          <button 
            className={`flex items-center gap-stack-md px-gutter py-stack-md rounded-xl transition-all text-left cursor-pointer ${
              activeTab === "security" 
                ? "bg-primary/10 text-primary" 
                : "text-on-surface-variant hover:bg-white/5"
            }`} 
            onClick={() => setActiveTab("security")}
          >
            <span className={`material-symbols-outlined ${activeTab === "security" ? "icon-fill" : ""}`}>verified_user</span>
            <span className="font-title-md text-title-md">Security</span>
          </button>
        </nav>

        {/* Settings Pane Content */}
        <div className="flex-1 glass-panel rounded-3xl p-stack-lg border border-outline-variant/10 custom-scrollbar overflow-y-auto bg-surface-container-lowest/20">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <section className="space-y-stack-lg">
              <div className="flex items-center gap-stack-lg pb-stack-lg border-b border-outline-variant/10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl transition-transform group-hover:scale-[1.02] flex items-center justify-center bg-surface-container">
                    {currentUser?.AvatarImage ? (
                      <img 
                        className="w-full h-full object-cover" 
                        src={svgToBase64(currentUser.AvatarImage)} 
                        alt={currentUser.username} 
                      />
                    ) : (
                      <span className="text-4xl font-bold text-outline uppercase">{currentUser?.username?.[0] || "?"}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => navigate("/setAvatar")}
                    className="absolute -bottom-2 -right-2 bg-primary text-on-primary-container p-2 rounded-xl shadow-xl hover:scale-115 transition-transform flex items-center justify-center cursor-pointer"
                    title="Change Avatar"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
                <div className="space-y-unit">
                  <h3 className="font-headline-lg text-headline-lg text-on-surface font-semibold">{displayName}</h3>
                  <p className="font-body-md text-on-surface-variant">{jobTitle}</p>
                  <p className="font-body-md text-on-surface-variant">{currentUser?.email || "No email linked"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="space-y-unit">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-unit">Display Name</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-gutter py-stack-sm text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-unit">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-unit">Job Title</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-gutter py-stack-sm text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" 
                    type="text" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-unit">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-unit">Bio</label>
                  <textarea 
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-gutter py-stack-sm text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-on-surface" 
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <section className="space-y-stack-md">
              <h3 className="font-title-md text-title-md text-on-surface border-b border-outline-variant/10 pb-stack-sm font-semibold">Notification Preferences</h3>
              <div className="space-y-stack-sm">
                
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-gutter hover:bg-white/5 rounded-2xl transition-all group">
                  <div className="flex items-center gap-stack-md">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface">Email Notifications</p>
                      <p className="font-body-md text-on-surface-variant text-sm">Receive summary of missed messages</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.email} 
                      onChange={() => handleToggleNotification("email")} 
                      className="sr-only" 
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-primary-container' : 'bg-surface-container-highest'}`}>
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.email ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </div>
                  </label>
                </div>

                {/* Desktop Alerts */}
                <div className="flex items-center justify-between p-gutter hover:bg-white/5 rounded-2xl transition-all group">
                  <div className="flex items-center gap-stack-md">
                    <div className="p-3 bg-secondary-container/40 rounded-xl text-secondary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">devices</span>
                    </div>
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface">Desktop Alerts</p>
                      <p className="font-body-md text-on-surface-variant text-sm">Show native desktop notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.desktop} 
                      onChange={() => handleToggleNotification("desktop")} 
                      className="sr-only" 
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${notifications.desktop ? 'bg-primary-container' : 'bg-surface-container-highest'}`}>
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.desktop ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </div>
                  </label>
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-gutter hover:bg-white/5 rounded-2xl transition-all group">
                  <div className="flex items-center gap-stack-md">
                    <div className="p-3 bg-tertiary-container/40 rounded-xl text-tertiary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">campaign</span>
                    </div>
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface">Sound Effects</p>
                      <p className="font-body-md text-on-surface-variant text-sm">Play sounds for incoming messages</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.sound} 
                      onChange={() => handleToggleNotification("sound")} 
                      className="sr-only" 
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${notifications.sound ? 'bg-primary-container' : 'bg-surface-container-highest'}`}>
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.sound ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </div>
                  </label>
                </div>

              </div>
            </section>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <section className="space-y-stack-lg">
              <h3 className="font-title-md text-title-md text-on-surface border-b border-outline-variant/10 pb-stack-sm font-semibold">Interface Theme</h3>
              <div className="grid grid-cols-3 gap-stack-md">
                
                {/* Light Mode */}
                <div 
                  className={`theme-card cursor-pointer group space-y-stack-sm p-1 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setTheme("light")}
                >
                  <div className="aspect-[4/3] bg-white rounded-xl flex flex-col p-2 overflow-hidden shadow-md">
                    <div className="w-full h-3 bg-slate-100 rounded-sm mb-unit"></div>
                    <div className="flex gap-unit h-full">
                      <div className="w-6 h-full bg-slate-100 rounded-sm"></div>
                      <div className="flex-1 space-y-unit">
                        <div className="w-full h-2 bg-slate-50 rounded-sm"></div>
                        <div className="w-2/3 h-2 bg-slate-50 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <p className={`font-label-md text-label-md text-center ${theme === 'light' ? 'text-primary' : 'text-on-surface-variant'}`}>Light</p>
                </div>

                {/* Dark Mode */}
                <div 
                  className={`theme-card cursor-pointer group space-y-stack-sm p-1 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setTheme("dark")}
                >
                  <div className="aspect-[4/3] bg-surface rounded-xl flex flex-col p-2 overflow-hidden shadow-md">
                    <div className="w-full h-3 bg-surface-container-high rounded-sm mb-unit"></div>
                    <div className="flex gap-unit h-full">
                      <div className="w-6 h-full bg-surface-container-low rounded-sm"></div>
                      <div className="flex-1 space-y-unit">
                        <div className="w-full h-2 bg-surface-container-high rounded-sm"></div>
                        <div className="w-2/3 h-2 bg-primary/20 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <p className={`font-label-md text-label-md text-center ${theme === 'dark' ? 'text-primary' : 'text-on-surface-variant'}`}>Dark</p>
                </div>

                {/* System Mode */}
                <div 
                  className={`theme-card cursor-pointer group space-y-stack-sm p-1 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setTheme("system")}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-white to-surface rounded-xl flex flex-col p-2 overflow-hidden shadow-md">
                    <div className="w-full h-3 bg-slate-300 rounded-sm mb-unit"></div>
                    <div className="flex gap-unit h-full">
                      <div className="w-6 h-full bg-slate-400/20 rounded-sm"></div>
                      <div className="flex-1 space-y-unit">
                        <div className="w-full h-2 bg-slate-400/10 rounded-sm"></div>
                        <div className="w-2/3 h-2 bg-slate-400/10 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <p className={`font-label-md text-label-md text-center ${theme === 'system' ? 'text-primary' : 'text-on-surface-variant'}`}>System</p>
                </div>

              </div>

              <div className="space-y-stack-sm pt-4">
                <label className="font-label-md text-label-md text-on-surface-variant block">Accent Color</label>
                <div className="flex gap-stack-md">
                  <button 
                    onClick={() => { setAccentColor("primary"); localStorage.setItem("vibeChat_accent", "primary"); }}
                    className={`w-8 h-8 rounded-full bg-primary transition-all cursor-pointer ${accentColor === "primary" ? "ring-2 ring-primary ring-offset-4 ring-offset-background" : "hover:scale-110"}`}
                  ></button>
                  <button 
                    onClick={() => { setAccentColor("red"); localStorage.setItem("vibeChat_accent", "red"); }}
                    className={`w-8 h-8 rounded-full bg-error transition-all cursor-pointer ${accentColor === "red" ? "ring-2 ring-error ring-offset-4 ring-offset-background" : "hover:scale-110"}`}
                  ></button>
                  <button 
                    onClick={() => { setAccentColor("slate"); localStorage.setItem("vibeChat_accent", "slate"); }}
                    className={`w-8 h-8 rounded-full bg-secondary transition-all cursor-pointer ${accentColor === "slate" ? "ring-2 ring-secondary ring-offset-4 ring-offset-background" : "hover:scale-110"}`}
                  ></button>
                </div>
              </div>
            </section>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <section className="space-y-stack-md">
              <h3 className="font-title-md text-title-md text-on-surface border-b border-outline-variant/10 pb-stack-sm font-semibold">Privacy Controls</h3>
              <div className="space-y-stack-md">
                <div className="p-gutter bg-surface-container-low rounded-2xl border border-outline-variant/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface">Data Sharing</p>
                      <p className="font-body-md text-on-surface-variant text-sm">Anonymously share usage metrics to help us improve.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-12 h-6 bg-primary-container rounded-full relative">
                        <div className="absolute top-1 bg-white w-4 h-4 rounded-full translate-x-7"></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-gutter bg-surface-container-low rounded-2xl border border-outline-variant/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface">Visible to Everyone</p>
                      <p className="font-body-md text-on-surface-variant text-sm">Allow users outside your workspace to find your profile.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-12 h-6 bg-primary-container rounded-full relative">
                        <div className="absolute top-1 bg-white w-4 h-4 rounded-full translate-x-7"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <section className="space-y-stack-md">
              <h3 className="font-title-md text-title-md text-on-surface border-b border-outline-variant/10 pb-stack-sm font-semibold">Security & Access</h3>
              <div className="grid grid-cols-1 gap-stack-md">
                <div className="flex items-center justify-between p-gutter bg-surface-container-low rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-stack-md">
                    <span className="material-symbols-outlined text-primary text-2xl">key</span>
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface">Two-Factor Authentication</p>
                      <p className="font-body-md text-on-surface-variant text-sm">Enabled via Authenticator App</p>
                    </div>
                  </div>
                  <button className="text-primary font-label-md text-label-md hover:underline cursor-pointer">Manage</button>
                </div>

                <div className="flex items-center justify-between p-gutter bg-surface-container-low rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-stack-md">
                    <span className="material-symbols-outlined text-primary text-2xl">history</span>
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface">Login History</p>
                      <p className="font-body-md text-on-surface-variant text-sm">Last active: San Francisco, CA (10m ago)</p>
                    </div>
                  </div>
                  <button className="text-primary font-label-md text-label-md hover:underline cursor-pointer">View All</button>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPane;
