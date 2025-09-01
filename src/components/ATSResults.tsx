import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp,
  Target,
  Brain,
  FileText
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ATSResultsProps {
  results: {
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
  };
}

export const ATSResults = ({ results }: ATSResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const radarData = results.categories ? [
    { subject: 'Technical Skills', score: results.categories.technical_skills, fullMark: 100 },
    { subject: 'Experience', score: results.categories.experience, fullMark: 100 },
    { subject: 'Education', score: results.categories.education, fullMark: 100 },
    { subject: 'Keywords', score: results.categories.keywords, fullMark: 100 },
    { subject: 'Formatting', score: results.categories.formatting, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Overall ATS Score */}
      <Card className="bg-gradient-secondary border-0 shadow-elegant">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">ATS Compatibility Score</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="relative">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center bg-${getScoreColor(results.ats_score)}/10 border-4 border-${getScoreColor(results.ats_score)}/20`}>
              <div className="text-center">
                <div className={`text-4xl font-bold text-${getScoreColor(results.ats_score)}`}>
                  {results.ats_score}
                </div>
                <div className="text-sm text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Badge 
              variant="outline" 
              className={`bg-${getScoreColor(results.ats_score)}/10 border-${getScoreColor(results.ats_score)}/30 text-${getScoreColor(results.ats_score)}`}
            >
              {getScoreLabel(results.ats_score)}
            </Badge>
            
            <Progress 
              value={results.ats_score} 
              className="w-full h-3"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Analysis */}
        <div className="space-y-4">
          {/* Matched Skills */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-score-excellent" />
                <CardTitle className="text-lg">Matched Skills</CardTitle>
                <Badge variant="outline">{results.matched_skills.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.matched_skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-score-excellent/10 border-score-excellent/30 text-score-excellent"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {results.matched_skills.length === 0 && (
                <p className="text-muted-foreground text-sm">No matching skills found</p>
              )}
            </CardContent>
          </Card>

          {/* Missing Skills */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-score-poor" />
                <CardTitle className="text-lg">Missing Skills</CardTitle>
                <Badge variant="outline">{results.missing_skills.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.missing_skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-score-poor/10 border-score-poor/30 text-score-poor"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {results.missing_skills.length === 0 && (
                <p className="text-muted-foreground text-sm">All required skills are present!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        {results.categories && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">AI Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
          
          {results.recommendations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No specific recommendations at this time.</p>
              <p className="text-xs mt-1">Your resume is well-aligned with the job requirements!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};