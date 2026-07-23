import { LearnerSidebar } from '@/components/learner-sidebar';
import { Calendar, BarChart3 } from 'lucide-react';

export default function HistoryPage() {
  const sessions = [
    { id: 1, date: 'Today', topic: 'React Hooks', score: 84, duration: '15 min' },
    { id: 2, date: 'Yesterday', topic: 'System Design', score: 72, duration: '20 min' },
    { id: 3, date: '2 days ago', topic: 'Databases', score: 88, duration: '18 min' },
  ];

  return (
    <div className="flex">
      <LearnerSidebar />
      <div className="flex-1 ml-64 min-h-screen bg-canvas p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-navy mb-2">Session History</h1>
          <p className="text-muted-foreground mb-8">Review your past practice sessions</p>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-navy">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-navy">Topic</th>
                  <th className="text-left py-4 px-6 font-semibold text-navy">Score</th>
                  <th className="text-left py-4 px-6 font-semibold text-navy">Duration</th>
                  <th className="text-left py-4 px-6 font-semibold text-navy">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span className="text-sm text-navy">{session.date}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-navy font-medium">{session.topic}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue"
                            style={{ width: `${session.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-navy">{session.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{session.duration}</td>
                    <td className="py-4 px-6">
                      <button className="text-blue hover:underline text-sm font-medium">View Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
