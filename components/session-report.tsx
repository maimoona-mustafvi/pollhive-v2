'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { mockTopics } from '@/lib/auxilio-data';

const scoreData = [
  { metric: 'Semantic', value: 82 },
  { metric: 'Depth', value: 75 },
  { metric: 'Similarity', value: 88 },
];

const topicPerformance = [
  { name: 'React', accuracy: 85, depth: 80, similarity: 88 },
  { name: 'System Design', accuracy: 62, depth: 65, similarity: 60 },
  { name: 'Databases', accuracy: 90, depth: 87, similarity: 91 },
  { name: 'APIs', accuracy: 78, depth: 75, similarity: 80 },
];

export function SessionReport() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy mb-2">Session Report</h1>
          <p className="text-muted-foreground">Review your performance and identify areas for improvement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Topics */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy mb-4">Topics Performance</h2>
            <div className="space-y-3">
              {mockTopics.map((topic) => (
                <div key={topic.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {topic.isWeak ? (
                        <AlertCircle size={16} className="text-muted-foreground" />
                      ) : (
                        <CheckCircle2 size={16} className="text-lime" />
                      )}
                      <span className="text-sm font-medium text-navy">{topic.name}</span>
                    </div>
                    <span className={`text-sm font-semibold ${topic.isWeak ? 'text-muted-foreground' : 'text-lime'}`}>
                      {topic.masteryLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        topic.masteryLevel >= 80 ? 'bg-lime' : topic.masteryLevel >= 60 ? 'bg-blue' : 'bg-muted-foreground'
                      }`}
                      style={{ width: `${topic.masteryLevel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Metrics - Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy mb-4">Overall Metrics</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e5ee" />
                <XAxis dataKey="metric" stroke="#5b6b8c" />
                <YAxis stroke="#5b6b8c" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e5ee',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#6192fc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic-by-Topic Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-navy mb-4">Performance by Topic</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-navy">Topic</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy">Semantic</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy">Depth</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy">Similarity</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy">Status</th>
                </tr>
              </thead>
              <tbody>
                {topicPerformance.map((topic, idx) => {
                  const avg = (topic.accuracy + topic.depth + topic.similarity) / 3;
                  const isStrong = avg >= 80;

                  return (
                    <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-navy">{topic.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue"
                              style={{ width: `${topic.accuracy}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{topic.accuracy}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue"
                              style={{ width: `${topic.depth}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{topic.depth}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue"
                              style={{ width: `${topic.similarity}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{topic.similarity}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {isStrong ? (
                            <>
                              <CheckCircle2 size={16} className="text-lime" />
                              <span className="text-sm font-semibold text-lime">Mastered</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={16} className="text-muted-foreground" />
                              <span className="text-sm font-semibold text-muted-foreground">Review</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-blue text-white rounded-lg font-semibold hover:bg-primary/90">
            Start New Session
          </button>
          <button className="px-6 py-3 border border-border text-navy rounded-lg font-semibold hover:bg-muted">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
