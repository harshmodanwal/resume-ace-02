import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Zap, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisButtonProps {
  onAnalyze: () => Promise<void>;
  disabled: boolean;
  hasJobDescription: boolean;
  hasResume: boolean;
}

export const AnalysisButton = ({ 
  onAnalyze, 
  disabled, 
  hasJobDescription, 
  hasResume 
}: AnalysisButtonProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!hasJobDescription || !hasResume) {
      toast({
        title: "Missing Requirements",
        description: "Please provide both a job description and upload your resume before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await onAnalyze();
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

  const getButtonText = () => {
    if (isAnalyzing) return "Analyzing with AI...";
    if (!hasJobDescription && !hasResume) return "Add Job Description & Resume";
    if (!hasJobDescription) return "Add Job Description";
    if (!hasResume) return "Upload Resume";
    return "Analyze Resume with AI";
  };

  const getButtonIcon = () => {
    if (isAnalyzing) return <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />;
    if (!hasJobDescription || !hasResume) return <AlertCircle className="w-4 h-4" />;
    return <Brain className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleAnalyze}
        disabled={disabled || isAnalyzing}
        className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-elegant hover:shadow-glow"
        size="lg"
      >
        <div className="flex items-center space-x-2">
          {getButtonIcon()}
          <span>{getButtonText()}</span>
          {!isAnalyzing && hasJobDescription && hasResume && (
            <Zap className="w-4 h-4 ml-1" />
          )}
        </div>
      </Button>
      
      {hasJobDescription && hasResume && !disabled && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Analysis powered by Google Gemini AI
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This will analyze your resume against the job requirements
          </p>
        </div>
      )}
      
      {(!hasJobDescription || !hasResume) && (
        <div className="p-3 bg-score-fair/10 border border-score-fair/20 rounded-lg">
          <p className="text-sm text-score-fair text-center">
            {!hasJobDescription && !hasResume && "Please add a job description and upload your resume to begin analysis"}
            {!hasJobDescription && hasResume && "Please add a job description to analyze your resume"}
            {hasJobDescription && !hasResume && "Please upload your resume to begin analysis"}
          </p>
        </div>
      )}
    </div>
  );
};