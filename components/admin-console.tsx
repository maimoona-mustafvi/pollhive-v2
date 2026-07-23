'use client';

import { TrendingUp, CheckCircle2, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockAdminAnalytics, mockPendingQuestions } from '@/lib/auxilio-data';

export function AdminConsole() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-navy text-white p-6 mb-8">
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="text-white/70">Platform analytics and content management</p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Active Users */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-2">Active Users</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-navy">{mockAdminAnalytics.activeUsers}</p>
              <div className="flex items-center gap-1 text-lime">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">+12%</span>
              </div>
            </div>
          </div>

          {/* Sessions Today */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-2">Sessions Today</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-navy">{mockAdminAnalytics.sessionsToday}</p>
              <div className="flex items-center gap-1 text-lime">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">+8%</span>
              </div>
            </div>
          </div>

          {/* Avg Score */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-2">Avg Score</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-navy">74%</p>
              <div className="flex items-center gap-1 text-lime">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">+3%</span>
              </div>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-2">Pending Reviews</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-navy">{mockAdminAnalytics.pendingQuestions}</p>
              <div className="px-2 py-1 bg-blue/10 text-blue rounded text-xs font-medium">Action</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Average Score by Topic */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy mb-4">Average Score by Topic</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockAdminAnalytics.avgScoreByTopic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e5ee" />
                <XAxis dataKey="topic" stroke="#5b6b8c" />
                <YAxis stroke="#5b6b8c" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e5ee',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="score" fill="#6192fc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Questions</p>
                <p className="text-2xl font-bold text-navy">847</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Platform Uptime</p>
                <p className="text-2xl font-bold text-lime">99.9%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
                <p className="text-2xl font-bold text-navy">245ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Bank Manager - Moderation Queue */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-navy">AI Question Review Queue</h2>
            <p className="text-sm text-muted-foreground">Approve or reject AI-generated questions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-6 font-semibold text-navy">Question</th>
                  <th className="text-left py-3 px-6 font-semibold text-navy">Topic</th>
                  <th className="text-left py-3 px-6 font-semibold text-navy">Generated</th>
                  <th className="text-left py-3 px-6 font-semibold text-navy">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-navy">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPendingQuestions.map((q) => (
                  <tr key={q.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-navy line-clamp-2">{q.text}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                        {q.topic}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{q.generatedBy}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue/10 text-blue text-sm font-medium rounded-full">
                        Pending
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Approve">
                          <CheckCircle2 size={18} className="text-lime" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Reject">
                          <AlertCircle size={18} className="text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                          <Edit2 size={18} className="text-blue" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border bg-muted/30 text-center text-sm text-muted-foreground">
            Showing {mockPendingQuestions.length} of {mockAdminAnalytics.pendingQuestions} pending questions
          </div>
        </div>
      </div>
    </div>
  );
}
