'use client';

import { FileText, Presentation, BookMarked, Play } from 'lucide-react';
import { mockContentItems } from '@/lib/auxilio-data';

function getMasteryColor(level: number) {
  if (level >= 80) return 'text-lime';
  if (level >= 60) return 'text-blue';
  return 'text-muted-foreground';
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'slides':
      return <Presentation size={32} className="text-blue" />;
    case 'document':
      return <FileText size={32} className="text-blue" />;
    case 'notes':
      return <BookMarked size={32} className="text-blue" />;
    default:
      return <FileText size={32} className="text-blue" />;
  }
}

export function ContentCards() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Your Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockContentItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">{getTypeIcon(item.type)}</div>

            <h3 className="font-semibold text-navy mb-2 line-clamp-2">{item.title}</h3>

            <div className="flex flex-wrap gap-1 mb-4">
              {item.topics.slice(0, 2).map((topic) => (
                <span key={topic} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                  {topic}
                </span>
              ))}
              {item.topics.length > 2 && (
                <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                  +{item.topics.length - 2}
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Mastery</span>
                <span className={`text-sm font-semibold ${getMasteryColor(item.masteryLevel)}`}>
                  {item.masteryLevel}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.masteryLevel >= 80
                      ? 'bg-lime'
                      : item.masteryLevel >= 60
                        ? 'bg-blue'
                        : 'bg-muted-foreground'
                  }`}
                  style={{ width: `${item.masteryLevel}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{item.lastPracticed}</span>
              {item.improved && <span className="text-lime text-xs font-semibold">✓ Improved</span>}
            </div>

            <button className="w-full mt-4 bg-blue text-white py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Play size={16} />
              <span className="text-sm font-medium">Practice</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
