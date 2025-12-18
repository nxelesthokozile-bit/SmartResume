import React, { useState } from 'react';
import { ResumeData, Skill, WorkExperience, Education } from '../types';
import { Plus, Trash2, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { enhanceWorkDescription, generateProfessionalSummary } from '../services/gemini';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const updateField = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateField('workExperience', [...data.workExperience, newExp]);
  };

  const removeWorkExperience = (id: string) => {
    updateField('workExperience', data.workExperience.filter(exp => exp.id !== id));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string) => {
    const updated = data.workExperience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateField('workExperience', updated);
  };

  const handleEnhanceDescription = async (id: string) => {
    const exp = data.workExperience.find(e => e.id === id);
    if (!exp || !exp.description) return;

    setLoadingAI(`work-${id}`);
    const enhanced = await enhanceWorkDescription(exp.role, exp.company, exp.description);
    updateWorkExperience(id, 'description', enhanced);
    setLoadingAI(null);
  };

  const handleGenerateSummary = async () => {
    setLoadingAI('summary');
    const summary = await generateProfessionalSummary(data);
    updateField('summary', summary);
    setLoadingAI(null);
  };

  const addSkill = () => {
    const newSkill: Skill = { id: Date.now().toString(), name: '', level: 'Intermediate' };
    updateField('skills', [...data.skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    updateField('skills', data.skills.filter(s => s.id !== id));
  };

  const updateSkill = (id: string, name: string) => {
    const updated = data.skills.map(s => s.id === id ? { ...s, name } : s);
    updateField('skills', updated);
  };

  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), school: '', degree: '', graduationDate: '' };
    updateField('education', [...data.education, newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = data.education.map(e => e.id === id ? { ...e, [field]: value } : e);
    updateField('education', updated);
  };

  const removeEducation = (id: string) => {
    updateField('education', data.education.filter(e => e.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      
      {/* Personal Info */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('personal')}
          className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800">Personal Information</span>
          {activeSection === 'personal' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        
        {activeSection === 'personal' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={data.fullName} 
                onChange={e => updateField('fullName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Job Title</label>
              <input 
                type="text" 
                value={data.jobTitle} 
                onChange={e => updateField('jobTitle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={data.email} 
                onChange={e => updateField('email', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="text" 
                value={data.phone} 
                onChange={e => updateField('phone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text" 
                value={data.location} 
                onChange={e => updateField('location', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn / Website</label>
              <input 
                type="text" 
                value={data.linkedin} 
                onChange={e => updateField('linkedin', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
                <button 
                  onClick={handleGenerateSummary}
                  disabled={loadingAI === 'summary'}
                  className="text-xs flex items-center gap-1 text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  <Wand2 size={12} /> {loadingAI === 'summary' ? 'Generating...' : 'Auto-Generate'}
                </button>
              </div>
              <textarea 
                rows={4}
                value={data.summary} 
                onChange={e => updateField('summary', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('experience')}
          className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800">Work History</span>
          {activeSection === 'experience' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>

        {activeSection === 'experience' && (
          <div className="p-6 bg-gray-50/50 space-y-6">
            {data.workExperience.map((exp) => (
              <div key={exp.id} className="bg-white p-4 rounded border border-gray-200 relative group">
                <button 
                  onClick={() => removeWorkExperience(exp.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input 
                    placeholder="Job Title"
                    value={exp.role}
                    onChange={e => updateWorkExperience(exp.id, 'role', e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm font-medium"
                  />
                  <input 
                    placeholder="Company"
                    value={exp.company}
                    onChange={e => updateWorkExperience(exp.id, 'company', e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                  <input 
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={e => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                  <input 
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={e => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="relative">
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                    <button 
                      onClick={() => handleEnhanceDescription(exp.id)}
                      disabled={loadingAI === `work-${exp.id}`}
                      className="text-xs flex items-center gap-1 text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      <Wand2 size={12} /> {loadingAI === `work-${exp.id}` ? 'Enhancing...' : 'Enhance with AI'}
                    </button>
                  </div>
                  <textarea 
                    rows={4}
                    value={exp.description}
                    onChange={e => updateWorkExperience(exp.id, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={addWorkExperience}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} /> Add Position
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('education')}
          className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800">Education</span>
          {activeSection === 'education' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        
        {activeSection === 'education' && (
          <div className="p-6 bg-gray-50/50 space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="bg-white p-4 rounded border border-gray-200 relative group flex gap-4 items-start">
                 <button 
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                   <input 
                    placeholder="School / University"
                    value={edu.school}
                    onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm font-medium"
                  />
                  <input 
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                  <input 
                    placeholder="Graduation Date"
                    value={edu.graduationDate}
                    onChange={e => updateEducation(edu.id, 'graduationDate', e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            ))}
             <button 
              onClick={addEducation}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
        )}
      </div>

       {/* Skills */}
      <div>
        <button 
          onClick={() => toggleSection('skills')}
          className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800">Skills</span>
          {activeSection === 'skills' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>

        {activeSection === 'skills' && (
          <div className="p-6 bg-gray-50/50">
            <div className="flex flex-wrap gap-2 mb-4">
              {data.skills.map(skill => (
                <div key={skill.id} className="bg-white pl-3 pr-2 py-1 rounded-full border border-gray-300 flex items-center gap-2 shadow-sm">
                  <input 
                    className="outline-none text-sm w-24 bg-transparent"
                    value={skill.name}
                    onChange={e => updateSkill(skill.id, e.target.value)}
                    autoFocus={skill.name === ''}
                  />
                  <button onClick={() => removeSkill(skill.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button 
                onClick={addSkill}
                className="px-3 py-1 rounded-full border border-dashed border-gray-400 text-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};