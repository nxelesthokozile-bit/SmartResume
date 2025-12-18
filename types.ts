export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  graduationDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  jobTitle: string; // Target job title
}

export interface JobDescription {
  title: string;
  content: string;
}

export interface ATSAnalysisResult {
  score: number;
  matchPercentage: number;
  missingKeywords: string[];
  suggestions: string[];
  summaryFeedback: string;
}

export enum TemplateType {
  CLASSIC = 'classic',
  MODERN = 'modern',
  MINIMALIST = 'minimalist',
}