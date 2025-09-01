import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not configured in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface AnalysisResults {
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendations: string[];
  categories?: {
    technical_skills: number;
    experience: number;
    education: number;
    keywords: number;
    formatting: number;
  };
}

export const analyzeResumeWithGemini = async (
  jobDescription: string,
  resumeText: string
): Promise<AnalysisResults> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer and resume optimization specialist. Analyze the following resume against the provided job description and return a detailed analysis.

JOB DESCRIPTION:
${jobDescription}

RESUME CONTENT:
${resumeText}

Please analyze the resume and provide a comprehensive ATS compatibility assessment. Return your response in the following JSON format only (no additional text):

{
  "ats_score": <number between 0-100>,
  "matched_skills": [<array of skills/keywords found in both resume and job description>],
  "missing_skills": [<array of important skills/keywords from job description that are missing in resume>],
  "recommendations": [<array of specific actionable recommendations to improve ATS score>],
  "categories": {
    "technical_skills": <score 0-100 for technical skills match>,
    "experience": <score 0-100 for experience relevance>,
    "education": <score 0-100 for education alignment>,
    "keywords": <score 0-100 for keyword optimization>,
    "formatting": <score 0-100 for ATS-friendly formatting>
  }
}

Important guidelines:
- Be precise and specific in skill matching
- Focus on hard skills, soft skills, and industry keywords
- Consider experience level, education requirements, and certifications
- Provide actionable recommendations for improvement
- Score should reflect realistic ATS compatibility
- Include both technical and non-technical skills in analysis
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const analysisData = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!analysisData.ats_score || !Array.isArray(analysisData.matched_skills)) {
      throw new Error('Invalid analysis data structure');
    }

    return analysisData;
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback to mock data if API fails
    if (error instanceof Error && error.message.includes('API_KEY')) {
      throw error;
    }
    
    throw new Error('Failed to analyze resume. Please check your connection and try again.');
  }
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  // For now, return a placeholder. In a real implementation, you would:
  // 1. Use pdf-parse library on the server side
  // 2. Or use a client-side PDF parsing library
  // 3. Or send the file to a backend service for processing
  
  return `[PDF Text Extraction]
This is a placeholder for PDF text extraction. 
File: ${file.name}
Size: ${(file.size / 1024).toFixed(2)} KB

In a production environment, you would:
1. Use pdf-parse library on a Node.js backend
2. Or use a client-side PDF.js library
3. Or integrate with a document processing service

Sample extracted content for demonstration:
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

EXPERIENCE:
Senior Frontend Developer at TechCorp (2021-2024)
- Developed responsive web applications using React, TypeScript, and Node.js
- Collaborated with cross-functional teams to deliver high-quality software
- Improved application performance by 40% through optimization techniques
- Led a team of 3 junior developers and mentored them in best practices

Frontend Developer at StartupXYZ (2019-2021)
- Built user interfaces using React, JavaScript, and CSS
- Worked with RESTful APIs and integrated third-party services
- Implemented responsive design principles for mobile compatibility
- Participated in agile development processes and sprint planning

SKILLS:
- Programming Languages: JavaScript, TypeScript, Python, HTML, CSS
- Frameworks: React, Node.js, Express, Next.js
- Tools: Git, Docker, AWS, MongoDB, PostgreSQL
- Soft Skills: Team leadership, Problem-solving, Communication

EDUCATION:
Bachelor of Science in Computer Science
University of Technology (2015-2019)
`;
};

export const extractTextFromDOCX = async (file: File): Promise<string> => {
  // Similar placeholder for DOCX extraction
  return `[DOCX Text Extraction]
This is a placeholder for DOCX text extraction.
File: ${file.name}
Size: ${(file.size / 1024).toFixed(2)} KB

In a production environment, you would use the mammoth library:
import mammoth from 'mammoth';

const arrayBuffer = await file.arrayBuffer();
const result = await mammoth.extractRawText({ arrayBuffer });
return result.value;

Sample extracted content for demonstration:
Jane Smith
Product Manager
Email: jane.smith@email.com

PROFESSIONAL SUMMARY:
Experienced Product Manager with 5+ years in technology companies. 
Skilled in product strategy, user research, and cross-functional team leadership.

EXPERIENCE:
Senior Product Manager at InnovaTech (2022-2024)
- Led product development for B2B SaaS platform serving 10,000+ users
- Conducted user research and data analysis to inform product decisions
- Collaborated with engineering, design, and marketing teams
- Increased user engagement by 35% through feature optimization

Product Manager at GrowthCo (2020-2022)
- Managed product roadmap and prioritized feature development
- Worked closely with stakeholders to define product requirements
- Analyzed market trends and competitive landscape
- Successfully launched 3 major product features

SKILLS:
- Product Strategy & Roadmapping
- User Research & Analytics
- Agile/Scrum Methodologies
- Data Analysis & A/B Testing
- Stakeholder Management
- Project Management Tools (Jira, Asana, Figma)

EDUCATION:
MBA in Business Administration
Business School (2018-2020)
`;
};