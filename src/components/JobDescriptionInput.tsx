import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Wand2 } from 'lucide-react';

interface JobDescriptionInputProps {
  onJobDescriptionChange: (description: string) => void;
  isProcessing: boolean;
}

export const JobDescriptionInput = ({ onJobDescriptionChange, isProcessing }: JobDescriptionInputProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleInputChange = (value: string) => {
    setJobDescription(value);
    setWordCount(value.trim().split(/\s+/).filter(word => word.length > 0).length);
    onJobDescriptionChange(value);
  };

  const sampleJobDescription = `We are looking for a Senior Software Engineer to join our dynamic team. The ideal candidate will have:

• 5+ years of experience in full-stack development
• Proficiency in React, Node.js, and TypeScript
• Experience with cloud platforms (AWS, Azure, or GCP)
• Strong knowledge of databases (SQL and NoSQL)
• Experience with containerization (Docker, Kubernetes)
• Excellent problem-solving and communication skills
• Bachelor's degree in Computer Science or related field

Responsibilities include developing scalable web applications, collaborating with cross-functional teams, and mentoring junior developers.`;

  const loadSampleJob = () => {
    handleInputChange(sampleJobDescription);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl">Job Description</CardTitle>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {wordCount} words
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Paste the job description here. Include required skills, qualifications, and responsibilities for the best ATS analysis..."
            value={jobDescription}
            onChange={(e) => handleInputChange(e.target.value)}
            className="min-h-[300px] resize-none focus:ring-2 focus:ring-primary transition-all"
            disabled={isProcessing}
          />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Minimum 50 words recommended for accurate analysis</span>
            {jobDescription.length > 0 && (
              <span>{jobDescription.length} characters</span>
            )}
          </div>
        </div>
        
        {jobDescription.length === 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Wand2 className="w-4 h-4" />
              <span>Try our sample job description:</span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={loadSampleJob}
              className="w-full"
              disabled={isProcessing}
            >
              Load Sample Job Description
            </Button>
          </div>
        )}
        
        {jobDescription.length > 0 && wordCount < 50 && (
          <div className="p-3 bg-score-fair/10 border border-score-fair/20 rounded-lg">
            <p className="text-sm text-score-fair">
              Add more details for better analysis. Include specific skills, requirements, and responsibilities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};