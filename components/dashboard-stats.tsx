import { TrendingUp } from 'lucide-react';
import { mockSessionStats } from '@/lib/auxilio-data';

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-muted-foreground text-sm font-medium mb-2">Sessions Completed</p>
        <div className="flex items-end justify-between">
          <p className="text-4xl font-bold text-navy">{mockSessionStats.sessionsCompleted}</p>
          <div className="flex items-center gap-1 bg-lime/20 text-accent px-3 py-1 rounded-lg">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Active</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-muted-foreground text-sm font-medium mb-2">Average Score</p>
        <div className="flex items-end justify-between">
          <p className="text-4xl font-bold text-navy">{mockSessionStats.averageScore}%</p>
          <div className="flex items-center gap-1 bg-lime/20 text-accent px-3 py-1 rounded-lg">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Improved</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-muted-foreground text-sm font-medium mb-2">Weak Topics Identified</p>
        <div className="flex items-end justify-between">
          <p className="text-4xl font-bold text-navy">{mockSessionStats.weakTopicsIdentified}</p>
          <div className="flex items-center gap-1 bg-lime/20 text-accent px-3 py-1 rounded-lg">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Tracked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
