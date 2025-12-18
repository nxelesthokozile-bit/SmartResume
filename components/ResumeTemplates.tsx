import React from 'react';
import { ResumeData, TemplateType } from '../types';
import { MapPin, Phone, Mail, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  type: TemplateType;
}

const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="bg-white text-gray-900 font-serif p-8 h-full min-h-[1056px]">
    <div className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
      <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{data.fullName}</h1>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
        {data.location && <span className="flex items-center gap-1"><MapPin size={14} /> {data.location}</span>}
        {data.email && <span className="flex items-center gap-1"><Mail size={14} /> {data.email}</span>}
        {data.phone && <span className="flex items-center gap-1"><Phone size={14} /> {data.phone}</span>}
        {data.linkedin && <span className="flex items-center gap-1"><Linkedin size={14} /> {data.linkedin}</span>}
      </div>
    </div>

    {data.summary && (
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Professional Summary</h2>
        <p className="text-sm leading-relaxed">{data.summary}</p>
      </div>
    )}

    {data.skills.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {data.skills.map(skill => (
            <span key={skill.id} className="after:content-['•'] after:mx-2 last:after:content-['']">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    )}

    {data.workExperience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Work Experience</h2>
        <div className="space-y-4">
          {data.workExperience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-md">{exp.role}</h3>
                <span className="text-sm italic">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="text-sm font-semibold mb-1">{exp.company}</div>
              <p className="text-sm whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {data.education.length > 0 && (
      <div>
        <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Education</h2>
        <div className="space-y-3">
          {data.education.map(edu => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{edu.school}</h3>
                <span className="text-sm italic">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.degree}</div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="bg-white h-full min-h-[1056px] flex">
    {/* Sidebar */}
    <div className="w-1/3 bg-blue-950 text-white p-6 print-force-bg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight mb-2">{data.fullName}</h1>
        <p className="text-red-400 uppercase tracking-widest text-sm font-semibold">{data.jobTitle || 'Candidate'}</p>
      </div>

      <div className="space-y-4 text-sm mb-8 text-blue-100">
        {data.location && <div className="flex items-center gap-2"><MapPin size={16} className="shrink-0 text-red-400" /> {data.location}</div>}
        {data.email && <div className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-red-400" /> {data.email}</div>}
        {data.phone && <div className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-red-400" /> {data.phone}</div>}
        {data.linkedin && <div className="flex items-center gap-2"><Linkedin size={16} className="shrink-0 text-red-400" /> LinkedIn</div>}
      </div>

      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white uppercase border-b border-blue-800 pb-2 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="font-bold text-white">{edu.degree}</div>
                <div className="text-blue-200">{edu.school}</div>
                <div className="text-xs text-blue-400">{edu.graduationDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white uppercase border-b border-blue-800 pb-2 mb-4">Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(skill => (
              <span key={skill.id} className="bg-blue-900 px-2 py-1 rounded text-xs text-blue-100 border border-blue-800">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Main Content */}
    <div className="w-2/3 p-8 bg-white text-slate-800">
      {data.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-950 uppercase tracking-wider mb-3">Profile</h2>
          <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
        </div>
      )}

      {data.workExperience.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-950 uppercase tracking-wider mb-6">Experience</h2>
          <div className="space-y-6">
            {data.workExperience.map(exp => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-blue-100">
                <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
                <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-700">{exp.company}</span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="bg-white p-10 h-full min-h-[1056px] font-sans text-gray-800">
    <header className="mb-10">
      <h1 className="text-5xl font-light tracking-tight mb-2 text-black">{data.fullName}</h1>
      <p className="text-xl text-gray-500 font-light mb-4">{data.jobTitle}</p>
      <div className="flex gap-6 text-sm text-gray-500 font-medium">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.linkedin && <span>LinkedIn Profile</span>}
        {data.location && <span>{data.location}</span>}
      </div>
    </header>

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8">
        {data.summary && (
          <section className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">About Me</h3>
            <p className="text-base leading-7">{data.summary}</p>
          </section>
        )}

        {data.workExperience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Experience</h3>
            <div className="space-y-8">
              {data.workExperience.map(exp => (
                <div key={exp.id}>
                  <h4 className="text-lg font-bold text-black">{exp.role}</h4>
                  <div className="text-sm font-medium text-gray-500 mb-2">{exp.company} | {exp.startDate} — {exp.endDate}</div>
                  <p className="text-sm leading-6 text-gray-700 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4">
        {data.skills.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h3>
            <div className="flex flex-col gap-2">
              {data.skills.map(skill => (
                <div key={skill.id} className="text-sm border-b border-gray-100 pb-1">
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h3>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold text-sm text-black">{edu.school}</div>
                  <div className="text-sm text-gray-600">{edu.degree}</div>
                  <div className="text-xs text-gray-400 mt-1">{edu.graduationDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

export const ResumeTemplate: React.FC<TemplateProps> = ({ data, type }) => {
  switch (type) {
    case TemplateType.MODERN:
      return <ModernTemplate data={data} />;
    case TemplateType.MINIMALIST:
      return <MinimalistTemplate data={data} />;
    case TemplateType.CLASSIC:
    default:
      return <ClassicTemplate data={data} />;
  }
};