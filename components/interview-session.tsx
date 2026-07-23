'use client';

import { useState } from 'react';
import { Mic, MicOff, ArrowRight, AlertCircle } from 'lucide-react';
import { mockSessionQuestions } from '@/lib/auxilio-data';

type SessionPhase = 'question' | 'submitted' | 'results';

export function InterviewSession() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<SessionPhase>('question');
  const [isRecording, setIsRecording] = useState(false);
  const [scores, setScores] = useState({ semantic: 0, depth: 0, similarity: 0 });
  const [isFlagged, setIsFlagged] = useState(false);

  const question = mockSessionQuestions[currentQuestion];

  const handleSubmitAnswer = () => {
    // Simulate scoring
    const semantic = 72 + Math.random() * 20;
    const depth = 68 + Math.random() * 25;
    const similarity = 75 + Math.random() * 20;
    const flagged = depth < 70 || semantic < 70;

    setScores({
      semantic: Math.round(semantic),
      depth: Math.round(depth),
      similarity: Math.round(similarity),
    });
    setIsFlagged(flagged);
    setPhase('submitted');

    setTimeout(() => {
      if (currentQuestion < mockSessionQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
        setPhase('question');
      } else {
        setPhase('results');
      }
    }, 3000);
  };

  if (phase === 'results') {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Interview Complete!</h1>
          <p className="text-muted-foreground mb-6">
            You&apos;ve completed all {mockSessionQuestions.length} questions. View your detailed report to see areas for improvement.
          </p>
          <button className="bg-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90">
            View Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-navy text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">Question {question.number} of {question.totalQuestions}</p>
              <h1 className="text-xl font-semibold">{question.topic}</h1>
            </div>
            <span className="px-3 py-1 bg-blue/30 text-blue rounded-full text-sm font-medium">
              {Math.round(((question.number - 1) / question.totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1">
            <div
              className="bg-lime h-1 rounded-full transition-all"
              style={{ width: `${((question.number - 1) / question.totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-navy mb-8">{question.question}</h2>

          {phase === 'submitted' ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-navy">Your Answer</span>
                </div>
                <div className="bg-muted p-4 rounded-lg text-sm text-foreground line-clamp-3">
                  {answer}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-navy">Answer Metrics</h3>

                {/* Semantic Score */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-navy">Semantic Accuracy</span>
                    <span className={`text-sm font-semibold ${scores.semantic >= 70 ? 'text-blue' : 'text-muted-foreground'}`}>
                      {scores.semantic}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${scores.semantic >= 70 ? 'bg-blue' : 'bg-muted-foreground'}`}
                      style={{ width: `${scores.semantic}%` }}
                    />
                  </div>
                </div>

                {/* Depth Score */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-navy">Depth</span>
                    <span className={`text-sm font-semibold ${scores.depth >= 70 ? 'text-blue' : 'text-muted-foreground'}`}>
                      {scores.depth}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${scores.depth >= 70 ? 'bg-blue' : 'bg-muted-foreground'}`}
                      style={{ width: `${scores.depth}%` }}
                    />
                  </div>
                </div>

                {/* Similarity Score */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-navy">Similarity to Reference</span>
                    <span className={`text-sm font-semibold ${scores.similarity >= 70 ? 'text-blue' : 'text-muted-foreground'}`}>
                      {scores.similarity}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${scores.similarity >= 70 ? 'bg-blue' : 'bg-muted-foreground'}`}
                      style={{ width: `${scores.similarity}%` }}
                    />
                  </div>
                </div>
              </div>

              {isFlagged && (
                <div className="bg-lime/10 border border-lime/30 rounded-lg p-4 flex gap-3">
                  <AlertCircle size={20} className="text-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-navy">Follow-up Question on This Topic</p>
                    <p className="text-sm text-muted-foreground">
                      Your next question is intentionally related to strengthen your understanding.
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground">
                Moving to next question...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type or speak your answer here..."
                className="w-full px-4 py-4 border border-border rounded-lg focus:ring-2 focus:ring-blue resize-none"
                rows={6}
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRecording
                      ? 'bg-destructive text-white hover:bg-destructive/90'
                      : 'bg-muted text-navy hover:bg-muted/80'
                  }`}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  {isRecording ? 'Stop' : 'Record'}
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
                >
                  Submit Answer
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
