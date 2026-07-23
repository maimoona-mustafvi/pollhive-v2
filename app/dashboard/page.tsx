import { LearnerSidebar } from '@/components/learner-sidebar';
import { DashboardStats } from '@/components/dashboard-stats';
import { ContentCards } from '@/components/content-cards';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex">
      <LearnerSidebar />
      <div className="flex-1 ml-64 min-h-screen bg-canvas p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-navy mb-2">Welcome back, Maya</h1>
              <p className="text-muted-foreground">Keep sharpening your interview skills</p>
            </div>
            <Link
              href="/practice"
              className="flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              <span>Start New Session</span>
            </Link>
          </div>

          {/* Stats */}
          <DashboardStats />

          {/* Content Cards */}
          <ContentCards />
        </div>
      </div>
    </div>
  );
}
