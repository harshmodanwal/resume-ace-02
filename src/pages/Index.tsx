import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeUpload } from '@/components/ResumeUpload';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { ATSResults } from '@/components/ATSResults';
import { AnalysisButton } from '@/components/AnalysisButton';
import { Separator } from '@/components/ui/separator';
import { Brain, Zap, Target, TrendingUp, FileSearch } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResults {
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

const Index = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File, text: string) => {
    setResumeFile(file);
    setResumeText(text);
  };

  const mockAnalyzeWithGemini = async (jobDesc: string, resumeText: string): Promise<AnalysisResults> => {
    // Mock API call - In production, this would call your backend/edge function
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API delay
    
    // Mock response data
    return {
      ats_score: 78,
      matched_skills: [
        'React', 'Node.js', 'TypeScript', 'JavaScript', 'Git', 
        'Problem-solving', 'Team collaboration', 'AWS'
      ],
      missing_skills: [
        'Docker', 'Kubernetes', 'NoSQL databases', 
        'Microservices architecture', 'GraphQL'
      ],
      recommendations: [
        'Add experience with containerization technologies like Docker and Kubernetes to match modern deployment practices.',
        'Include specific examples of NoSQL database usage (MongoDB, DynamoDB) to strengthen your backend profile.',
        'Highlight any microservices architecture experience or distributed systems knowledge.',
        'Consider adding GraphQL to your skill set as it\'s mentioned in the job requirements.',
        'Quantify your achievements with metrics (e.g., "Improved performance by 40%" instead of "Improved performance").',
        'Include more industry-specific keywords from the job description in your experience section.'
      ],
      categories: {
        technical_skills: 85,
        experience: 75,
        education: 90,
        keywords: 65,
        formatting: 80
      }
    };
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both job description and resume before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const results = await mockAnalyzeWithGemini(jobDescription, resumeText);
      setAnalysisResults(results);
      
      toast({
        title: "Analysis Complete",
        description: `Your resume scored ${results.ats_score}/100 for ATS compatibility.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Resume Analyzer
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant ATS compatibility scores and AI-powered recommendations to optimize your resume for any job
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Description Input */}
          <div>
            <JobDescriptionInput 
              onJobDescriptionChange={setJobDescription}
              isProcessing={isAnalyzing}
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <FileSearch className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">Resume Upload</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ResumeUpload 
                  onFileUpload={handleFileUpload}
                  isProcessing={isAnalyzing}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analysis Button */}
        <div className="mb-8">
          <AnalysisButton
            onAnalyze={handleAnalyze}
            disabled={isAnalyzing}
            hasJobDescription={!!jobDescription.trim()}
            hasResume={!!resumeFile}
          />
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="mb-8 bg-gradient-secondary border-primary/20">
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">AI Analysis in Progress</h3>
                  <p className="text-muted-foreground">
                    Our AI is analyzing your resume against the job requirements...
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Extracting Skills</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Matching Keywords</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Generating Score</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {analysisResults && !isAnalyzing && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
              <p className="text-muted-foreground">
                Here's how your resume performs against the job requirements
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <ATSResults results={analysisResults} />
          </div>
        )}

        {/* Features Overview */}
        {!analysisResults && !isAnalyzing && (
          <div className="mt-12">
            <Card className="bg-gradient-secondary border-0">
              <CardContent className="py-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Powered by Advanced AI</h3>
                  <p className="text-muted-foreground">
                    Get professional insights to maximize your job application success
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                      <Target className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold">ATS Compatibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Get precise scores on how well your resume passes Applicant Tracking Systems
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto">
                      <Brain className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold">AI-Powered Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced algorithms identify skill gaps and optimization opportunities
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                      <TrendingUp className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold">Actionable Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive specific recommendations to improve your resume's effectiveness
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
