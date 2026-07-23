import { LearnerSidebar } from '@/components/learner-sidebar';

export default function MyContentPage() {
  return (
    <div className="flex">
      <LearnerSidebar />
      <div className="flex-1 ml-64 min-h-screen bg-canvas p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-navy mb-2">My Content</h1>
          <p className="text-muted-foreground mb-8">Manage your uploaded study materials and documents</p>
          
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">📁</div>
            <h2 className="text-2xl font-bold text-navy mb-2">No content yet</h2>
            <p className="text-muted-foreground mb-6">Upload your first document to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
}
