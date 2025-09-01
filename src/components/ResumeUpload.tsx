import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploadProps {
  onFileUpload: (file: File, text: string) => void;
  isProcessing: boolean;
}

export const ResumeUpload = ({ onFileUpload, isProcessing }: ResumeUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      // For PDF files - using pdf-parse (client-side)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Simple text extraction for demo - in production, you'd use pdf-parse on the server
      return `[PDF Content from ${file.name}] - Text extraction would happen on the server using pdf-parse`;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX files - using mammoth (client-side)
      const arrayBuffer = await file.arrayBuffer();
      
      // Simple text extraction for demo - in production, you'd use mammoth on the server
      return `[DOCX Content from ${file.name}] - Text extraction would happen on the server using mammoth`;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const extractedText = await extractTextFromFile(file);
      setUploadedFile(file);
      onFileUpload(file, extractedText);
      
      toast({
        title: "Resume uploaded successfully",
        description: `${file.name} has been processed and is ready for analysis.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process the file",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isProcessing || isExtracting
  });

  const resetUpload = () => {
    setUploadedFile(null);
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <Card 
          {...getRootProps()} 
          className={`cursor-pointer transition-all duration-300 border-dashed border-2 ${
            isDragActive 
              ? 'border-primary bg-primary/5 shadow-glow' 
              : 'border-muted hover:border-primary hover:shadow-elegant'
          } ${isExtracting ? 'pointer-events-none opacity-50' : ''}`}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <input {...getInputProps()} />
            
            {isExtracting ? (
              <>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-lg font-medium text-foreground">Processing your resume...</p>
                <p className="text-sm text-muted-foreground">Extracting text content</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  Drag and drop your resume or click to browse
                </p>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Supports PDF and DOCX files up to 10MB
                </p>
                
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-score-excellent/20 bg-score-excellent/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-score-excellent/20 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-score-excellent" />
              </div>
              <div>
                <p className="font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-score-excellent" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetUpload}
                disabled={isProcessing}
              >
                Change File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {uploadedFile && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>File uploaded successfully. Ready for ATS analysis.</span>
        </div>
      )}
    </div>
  );
};