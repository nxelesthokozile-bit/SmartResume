import React, { useState } from 'react';
import { ResumeData, ATSAnalysisResult } from '../types';
import { analyzeATSCompatibility } from '../services/gemini';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { AlertCircle, CheckCircle, Search, FileText, Loader2, Target } from 'lucide-react';

interface Props {
  resumeData: ResumeData;
}

export const ATSAnalysis: React.FC<Props> = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeATSCompatibility(resumeData, jobDescription);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreData = analysis ? [{ name: 'Score', value: analysis.score, fill: analysis.score > 75 ? '#22c55e' : analysis.score > 50 ? '#eab308' : '#ef4444' }] : [];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-blue-900 bg-blue-950 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target size={22} className="text-red-500" /> ATS Compatibility Checker
        </h2>
        <p className="text-blue-200 text-sm mt-1">Paste a job description to see how well your resume matches.</p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Description</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm h-32 bg-gray-50 focus:bg-white transition-colors"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !jobDescription.trim()}
            className="mt-4 w-full bg-red-600 text-white py-2.5 rounded font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Analyze Match'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm rounded mb-4 border border-red-100">
            {error}
          </div>
        )}

        {analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="w-32 h-32 relative flex-shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="80%" outerRadius="100%" barSize={10} data={scoreData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-gray-900">{analysis.score}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Score</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Analysis Summary</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.summaryFeedback}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                <h4 className="font-bold text-red-800 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
                  <AlertCircle size={16} /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="bg-white text-red-700 px-2.5 py-1 rounded text-xs font-semibold border border-red-200 shadow-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
                  <FileText size={16} /> Improvement Suggestions
                </h4>
                <ul className="space-y-3">
                  {analysis.suggestions.map((sugg, idx) => (
                    <li key={idx} className="text-sm text-blue-900 flex gap-3 items-start">
                      <span className="block w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="leading-relaxed">{sugg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};