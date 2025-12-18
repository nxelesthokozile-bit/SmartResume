import React, { useState } from 'react';
import { ResumeData, TemplateType } from './types';
import { Editor } from './components/Editor';
import { ResumeTemplate } from './components/ResumeTemplates';
import { ATSAnalysis } from './components/ATSAnalysis';
import { Download, FileText, Layout, Sparkles, Printer } from 'lucide-react';

const INITIAL_DATA: ResumeData = {
  fullName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '(555) 123-4567',
  location: 'New York, NY',
  linkedin: 'linkedin.com/in/alexmorgan',
  jobTitle: 'Senior Product Designer',
  summary: 'Creative and detail-oriented Product Designer with 5+ years of experience in building user-centric digital products. Proficient in UI/UX design, prototyping, and design systems.',
  workExperience: [
    {
      id: '1',
      role: 'Product Designer',
      company: 'TechFlow Solutions',
      startDate: '2021',
      endDate: 'Present',
      description: 'Led the redesign of the core mobile application, resulting in a 25% increase in user retention. Collaborated with cross-functional teams to define product strategy and roadmap.'
    },
    {
      id: '2',
      role: 'UX Researcher',
      company: 'Creative Studio',
      startDate: '2019',
      endDate: '2021',
      description: 'Conducted user research and usability testing to inform design decisions. Created wireframes and high-fidelity mockups for web and mobile interfaces.'
    }
  ],
  education: [
    {
      id: '1',
      school: 'Parsons School of Design',
      degree: 'BFA in Communication Design',
      graduationDate: '2019'
    }
  ],
  skills: [
    { id: '1', name: 'Figma', level: 'Expert' },
    { id: '2', name: 'React', level: 'Intermediate' },
    { id: '3', name: 'User Research', level: 'Expert' },
    { id: '4', name: 'Prototyping', level: 'Expert' }
  ]
};

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [template, setTemplate] = useState<TemplateType>(TemplateType.CLASSIC);
  const [activeTab, setActiveTab] = useState<'editor' | 'analysis'>('editor');

  const handlePrint = () => {
    window.print();
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "resume_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-blue-950 text-white px-6 py-4 shadow-lg z-10 no-print border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-900/50 rounded-lg border border-blue-800">
              <Sparkles className="text-red-500" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SmartResume <span className="text-blue-200">AI</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-blue-900/50 border border-blue-800 rounded-lg p-1 gap-1">
              <button 
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 font-medium ${activeTab === 'editor' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-200 hover:text-white hover:bg-blue-800/50'}`}
              >
                <FileText size={16} /> Editor
              </button>
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 font-medium ${activeTab === 'analysis' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-200 hover:text-white hover:bg-blue-800/50'}`}
              >
                <Layout size={16} /> Analysis
              </button>
            </div>
            <div className="h-6 w-px bg-blue-800 mx-2"></div>
            <button onClick={exportJSON} className="text-blue-300 hover:text-white transition-colors" title="Export JSON">
              <Download size={20} />
            </button>
            <button onClick={handlePrint} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm border border-red-500">
              <Printer size={16} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        
        {/* Left Panel: Inputs & Analysis */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto no-print h-full pb-20 custom-scrollbar">
          {activeTab === 'editor' ? (
            <div className="animate-in fade-in duration-300">
               <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                {Object.values(TemplateType).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                      template === t 
                        ? 'bg-blue-950 text-white border-blue-950 shadow-md ring-2 ring-blue-200 ring-offset-1' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <Editor data={resumeData} onChange={setResumeData} />
            </div>
          ) : (
             <div className="animate-in fade-in duration-300">
              <ATSAnalysis resumeData={resumeData} />
            </div>
          )}
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-7 h-full bg-slate-200/60 rounded-xl border border-gray-300 overflow-hidden flex flex-col shadow-inner">
          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-500/5">
             {/* The resume preview container - sized A4 approximately */}
            <div id="resume-preview" className="w-[210mm] bg-white shadow-2xl origin-top transform scale-[0.6] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 transition-transform duration-300">
              <ResumeTemplate data={resumeData} type={template} />
            </div>
          </div>
        </div>
      </main>

       {/* Print-only container */}
      <div className="print-only">
        <ResumeTemplate data={resumeData} type={template} />
      </div>
    </div>
  );
};

export default App;