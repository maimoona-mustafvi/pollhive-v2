import { LearnerSidebar } from '@/components/learner-sidebar';
import { Bell, Lock, Eye, LogOut } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex">
      <LearnerSidebar />
      <div className="flex-1 ml-64 min-h-screen bg-canvas p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-navy mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your account and preferences</p>

          {/* Account Settings */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-navy mb-6">Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Email</label>
                <input
                  type="email"
                  value="maya@example.com"
                  disabled
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Maya Patel"
                  className="w-full px-4 py-2 border border-border rounded-lg text-navy"
                />
              </div>
              <button className="bg-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
                Save Changes
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-navy mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-blue" />
                  <div>
                    <p className="font-medium text-navy">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified about weak topics</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-blue" />
                  <div>
                    <p className="font-medium text-navy">Public Profile</p>
                    <p className="text-sm text-muted-foreground">Show your progress on leaderboard</p>
                  </div>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-navy mb-6">Security</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 rounded-lg text-left">
                <Lock size={20} className="text-blue" />
                <div>
                  <p className="font-medium text-navy">Change Password</p>
                  <p className="text-sm text-muted-foreground">Update your password regularly</p>
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-destructive/10 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy mb-6">Danger Zone</h2>
            <button className="flex items-center gap-2 text-destructive font-medium hover:opacity-80">
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
