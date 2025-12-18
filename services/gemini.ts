import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSAnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeATSCompatibility = async (
  resume: ResumeData,
  jobDescription: string
): Promise<ATSAnalysisResult> => {
  if (!jobDescription || jobDescription.length < 50) {
    throw new Error("Job description is too short for analysis.");
  }

  const prompt = `
    You are an expert ATS (Applicant Tracking System) analyst.
    Analyze the following resume against the provided job description.
    Provide a match score (0-100), a list of critical missing keywords found in the JD but not the resume,
    specific actionable suggestions to improve the resume for this role, and a brief summary feedback.

    RESUME:
    ${JSON.stringify(resume)}

    JOB DESCRIPTION:
    ${jobDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            matchPercentage: { type: Type.NUMBER },
            missingKeywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            suggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            summaryFeedback: { type: Type.STRING },
          },
          required: ["score", "matchPercentage", "missingKeywords", "suggestions", "summaryFeedback"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ATSAnalysisResult;
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    // Return a fallback or rethrow depending on UI handling needs
    throw error;
  }
};

export const enhanceWorkDescription = async (
  role: string,
  company: string,
  currentDescription: string
): Promise<string> => {
  const prompt = `
    Rewrite the following work experience description to be more professional, 
    action-oriented, and impactful. Use bullet points (•) if suitable.
    Keep it concise but detailed enough to show value.
    
    Role: ${role}
    Company: ${company}
    Current Description: "${currentDescription}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || currentDescription;
  } catch (error) {
    console.error("Enhancement Error:", error);
    return currentDescription;
  }
};

export const generateProfessionalSummary = async (resume: ResumeData): Promise<string> => {
    const prompt = `
      Write a compelling, professional summary (3-4 sentences max) for a resume based on the following details.
      Highlight key skills and experience.
      
      Name: ${resume.fullName}
      Target Job: ${resume.jobTitle}
      Skills: ${resume.skills.map(s => s.name).join(', ')}
      Experience: ${resume.workExperience.map(w => w.role + ' at ' + w.company).join(', ')}
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return response.text || "";
    } catch (error) {
      console.error("Summary Gen Error:", error);
      return "";
    }
  };