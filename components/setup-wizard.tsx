'use client';

import { useState } from 'react';
import { Library, Upload, Loader2, CheckCircle2, X } from 'lucide-react';

type WizardMode = 'mode-selection' | 'question-bank' | 'custom-content';

export function SetupWizard() {
  const [mode, setMode] = useState<WizardMode>('mode-selection');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState(50);
  const [sessionLength, setSessionLength] = useState(10);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const fileName = file.name;
      setUploadedFiles((prev) => [...prev, fileName]);
      setProcessingFile(fileName);
      setTimeout(() => setProcessingFile(null), 2000);
    });
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== fileName));
  };

  if (mode === 'mode-selection') {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl font-bold text-navy mb-2 text-center">Start Your Interview</h1>
          <p className="text-muted-foreground text-center mb-12">Choose how you want to practice</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question Bank Mode */}
            <button
              onClick={() => setMode('question-bank')}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-blue group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-canvas rounded-lg group-hover:bg-blue/10 transition-colors">
                  <Library size={48} className="text-blue" />
                </div>
                <h2 className="text-2xl font-bold text-navy">Question Bank Mode</h2>
                <p className="text-muted-foreground text-sm">Use curated questions by topic and difficulty</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">Easy</span>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">Medium</span>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">Hard</span>
                </div>
              </div>
            </button>

            {/* Custom Content Mode */}
            <button
              onClick={() => setMode('custom-content')}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-blue group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-canvas rounded-lg group-hover:bg-blue/10 transition-colors">
                  <Upload size={48} className="text-blue" />
                </div>
                <h2 className="text-2xl font-bold text-navy">Custom Content Mode</h2>
                <p className="text-muted-foreground text-sm">Upload your own notes, slides, or documents</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">PDF</span>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">DOCX</span>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">Text</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'question-bank') {
    return (
      <div className="min-h-screen bg-canvas p-6">
        <button
          onClick={() => setMode('mode-selection')}
          className="mb-6 text-blue hover:text-blue/80 font-medium"
        >
          ← Back
        </button>

        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-navy mb-8">Question Bank Setup</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-navy mb-3">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue"
              >
                <option value="">Select a subject</option>
                <option value="react">React & Frontend</option>
                <option value="systemdesign">System Design</option>
                <option value="databases">Databases</option>
                <option value="api">API Design</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-semibold text-navy">Difficulty Level</label>
                <span className="text-sm text-muted-foreground">
                  {difficulty === 50 ? 'Mixed' : difficulty < 50 ? 'Easier' : 'Harder'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full accent-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-3">Session Length</label>
              <select
                value={sessionLength}
                onChange={(e) => setSessionLength(Number(e.target.value))}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue"
              >
                <option value={5}>5 questions</option>
                <option value={10}>10 questions</option>
                <option value={15}>15 questions</option>
                <option value={20}>20 questions</option>
              </select>
            </div>

            <button className="w-full bg-blue text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-8">
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas p-6">
      <button
        onClick={() => setMode('mode-selection')}
        className="mb-6 text-blue hover:text-blue/80 font-medium"
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-navy mb-2">Upload Your Content</h1>
          <p className="text-muted-foreground mb-8">Support PDF, DOCX, and text files. We&apos;ll parse and index them.</p>

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-8 hover:border-blue transition-colors cursor-pointer bg-muted/30">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.docx,.txt"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload size={32} className="mx-auto mb-3 text-blue" />
              <p className="font-semibold text-navy">Click to upload or drag files here</p>
              <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT files accepted</p>
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-navy mb-3">Uploaded Files</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {processingFile === file ? (
                        <Loader2 size={16} className="animate-spin text-blue" />
                      ) : (
                        <CheckCircle2 size={16} className="text-lime" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-navy">{file}</p>
                        <p className="text-xs text-muted-foreground">
                          {processingFile === file ? 'Processing...' : 'Indexed'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file)}
                      className="p-1 hover:bg-muted-foreground/10 rounded"
                    >
                      <X size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topic Coverage Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-navy mb-3">Topics Detected</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Hooks', 'State Management', 'Performance'].map((topic) => (
                  <span key={topic} className="px-3 py-1 bg-blue/10 text-blue text-sm rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-blue text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Start Interview with {uploadedFiles.length > 0 ? uploadedFiles.length : 'Uploaded'} File
            {uploadedFiles.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
