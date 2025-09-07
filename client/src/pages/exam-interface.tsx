import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Mic, MicOff, Volume2, ChevronLeft, ChevronRight, Clock, Brain, FileText } from "lucide-react";
import Navigation from "@/components/navigation";
// Embedded exam questions to avoid import issues
const examQuestions = {
  ndt: [
    {
      id: "ndt-1",
      type: "MULTIPLE_CHOICE" as const,
    prompt: "In professional commercial underwater inspection operations, what is the primary advantage of systematic grid pattern inspection methodology for ensuring comprehensive coverage and quality assurance?",
    options: [
      "Reduces total inspection time and operational costs significantly while maintaining basic coverage",
      "Ensures complete systematic coverage with quality assurance verification and eliminates missed critical structural areas",
      "Minimizes specialized lighting and equipment requirements for standard operations",
      "Reduces diver physical exertion and gas consumption rates during extended work periods"
    ],
    correctAnswer: "Ensures complete systematic coverage with quality assurance verification and eliminates missed critical structural areas",
    explanation: "Systematic grid pattern methodology ensures no areas are missed during inspection, provides quality assurance verification, and is critical for structural integrity assessment in commercial diving operations.",
    points: 3,
    order: 1
  },
  {
      id: "ndt-2",
      type: "MULTIPLE_CHOICE" as const,
    prompt: "Which corrosion type is most commonly associated with dissimilar metal connections in marine environments and requires electrochemical galvanic series analysis for proper assessment?",
    options: [
      "General uniform corrosion across large surface areas of marine structures",
      "Localized pitting corrosion with high depth-to-diameter ratios and irregular patterns",
      "Galvanic corrosion with preferential anode attack at connection points and metal interfaces",
      "Crevice corrosion in confined joint spaces and under marine growth deposits"
    ],
    correctAnswer: "Galvanic corrosion with preferential anode attack at connection points and metal interfaces",
    explanation: "Galvanic corrosion occurs when dissimilar metals are in electrical contact in seawater, creating a galvanic cell where the more anodic metal corrodes preferentially at connection points.",
    points: 2,
      order: 2
    }
  ],
  lst: [
    {
      id: "lst-1",
      type: "MULTIPLE_CHOICE" as const,
      prompt: "In advanced life support operations, what is the primary function of the tertiary backup system during emergency scenarios?",
      options: [
        "To reduce operational costs during normal operations",
        "To provide immediate life support continuity when primary and secondary systems fail",
        "To minimize gas consumption during routine maintenance",
        "To standardize training procedures for new technicians"
      ],
      correctAnswer: "To provide immediate life support continuity when primary and secondary systems fail",
      explanation: "Tertiary systems are emergency backup systems designed to maintain life support when both primary and secondary systems are compromised.",
      points: 3,
      order: 1
    }
  ],
  alst: [
    {
      id: "alst-1",
      type: "MULTIPLE_CHOICE" as const,
      prompt: "In advanced life support technician operations, what is the primary responsibility during emergency decompression scenarios?",
      options: [
        "To minimize gas consumption during emergency procedures",
        "To maintain life support continuity while managing emergency decompression protocols",
        "To reduce operational costs during crisis situations",
        "To standardize emergency response training"
      ],
      correctAnswer: "To maintain life support continuity while managing emergency decompression protocols",
      explanation: "ALSTs must ensure continuous life support while coordinating emergency decompression procedures to protect diver safety.",
      points: 3,
      order: 1
    }
  ],
  dmt: [
    {
      id: "dmt-1",
      type: "MULTIPLE_CHOICE" as const,
      prompt: "In diving medical technician operations, what is the primary focus during underwater emergency medical situations?",
      options: [
        "To minimize medical equipment costs during emergencies",
        "To provide immediate medical assessment and stabilization while managing diving-specific complications",
        "To reduce training requirements for medical personnel",
        "To standardize medical procedures across all diving operations"
      ],
      correctAnswer: "To provide immediate medical assessment and stabilization while managing diving-specific complications",
      explanation: "DMTs must provide immediate medical care while understanding and managing diving-specific medical complications like decompression sickness and barotrauma.",
      points: 3,
      order: 1
    }
  ],
  "commercial-supervisor": [
    {
      id: "cds-1",
      type: "MULTIPLE_CHOICE" as const,
      prompt: "In commercial dive supervision, what is the primary responsibility during complex underwater operations?",
      options: [
        "To minimize operational costs while maintaining safety standards",
        "To coordinate all aspects of diving operations while ensuring diver safety and operational efficiency",
        "To reduce training requirements for dive teams",
        "To standardize procedures across all commercial diving operations"
      ],
      correctAnswer: "To coordinate all aspects of diving operations while ensuring diver safety and operational efficiency",
      explanation: "Commercial dive supervisors must coordinate all operational aspects while maintaining the highest safety standards and operational efficiency.",
      points: 3,
      order: 1
    }
  ]
};

interface ExamQuestion {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'WRITTEN' | 'TRUE_FALSE';
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  order: number;
}

// Function to get questions based on exam slug
const getQuestionsForExam = (slug: string): ExamQuestion[] => {
  console.log('Getting questions for slug:', slug);
  console.log('Available exam questions keys:', Object.keys(examQuestions));
  const questions = examQuestions[slug as keyof typeof examQuestions];
  if (!questions) {
    console.warn(`No questions found for exam slug: ${slug}`);
    return [];
  }
  console.log('Found questions:', questions.length);
  return questions;
};

export default function ExamInterface() {
  const [match, params] = useRoute("/exams/:slug/start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Get appropriate time limit based on exam type
  const getTimeLimit = (slug: string): number => {
    const timeLimits: Record<string, number> = {
      'ndt': 1800,      // 30 minutes for NDT
      'lst': 2400,      // 40 minutes for LST
      'alst': 2700,     // 45 minutes for ALST
      'dmt': 2100,      // 35 minutes for DMT
      'commercial-supervisor': 3600  // 60 minutes for Commercial Supervisor
    };
    return timeLimits[slug] || 1800; // Default to 30 minutes
  };

  const [timeRemaining, setTimeRemaining] = useState(
    match ? getTimeLimit(params.slug) : 1800
  );

  // Get questions based on exam slug
  const questions = match ? getQuestionsForExam(params.slug) : [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Get exam title based on slug
  const getExamTitle = (slug: string): string => {
    const titles: Record<string, string> = {
      'ndt': 'NDT Inspection Practice Test',
      'lst': 'LST Life Support Practice Test',
      'alst': 'ALST Advanced Life Support Practice Test',
      'dmt': 'DMT Diving Medical Practice Test',
      'commercial-supervisor': 'Commercial Dive Supervisor Practice Test'
    };
    return titles[slug] || 'Professional Diving Practice Test';
  };

  // Timer countdown - MUST be before any conditional returns
  useEffect(() => {
    if (timeRemaining > 0 && !examSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitExam();
    }
  }, [timeRemaining, examSubmitted]);

  // Handle case when no questions are found
  if (match && totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Exam Not Found</h1>
              <p className="text-gray-600 mb-6">
                No questions found for the exam: {params.slug}
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    setShowExplanations(true);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return <FileText className="w-4 h-4" />;
      case 'WRITTEN': return <Mic className="w-4 h-4" />;
      case 'TRUE_FALSE': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const answeredQuestions = Object.keys(answers).length;
  const timeIsLow = timeRemaining < 600; // Less than 10 minutes

  if (!match) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Exam Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900" data-testid="text-exam-title">
                {match ? getExamTitle(params.slug) : 'Professional Diving Practice Test'}
              </h1>
              <p className="text-slate-600">Prepare for Commercial Diving Certification Exams</p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
              timeIsLow ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span data-testid="text-time-remaining">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-slate-600">
                {answeredQuestions}/{totalQuestions} answered
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {!examSubmitted ? (
          /* Question Interface */
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getQuestionTypeIcon(currentQuestion.type)}
                  <Badge variant="outline">
                    {currentQuestion.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-slate-600">
                    {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Question Prompt */}
              <h3 className="text-lg font-semibold text-slate-900 mb-6" data-testid="text-question-prompt">
                {currentQuestion.prompt}
              </h3>

              {/* Answer Interface */}
              {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-3 mb-6">
                  {currentQuestion.options?.map((option, index) => (
                    <label 
                      key={index}
                      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === option
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="mt-1 mr-3"
                        data-testid={`radio-option-${index}`}
                      />
                      <span className="text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'TRUE_FALSE' && (
                <div className="space-y-3 mb-6">
                  {['True', 'False'].map((option) => (
                    <label 
                      key={option}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === option
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="mr-3"
                        data-testid={`radio-${option.toLowerCase()}`}
                      />
                      <span className="text-slate-700 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'WRITTEN' && (
                <div className="space-y-4 mb-6">
                  <Textarea
                    placeholder="Type your detailed response here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="min-h-[200px] text-base"
                    data-testid="textarea-written-answer"
                  />
                  
                  {/* Voice Recording */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5 text-slate-600" />
                      <span className="text-slate-700 font-medium">Voice Dictation Available</span>
                    </div>
                    <Button
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      data-testid="button-voice-recording"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  data-testid="button-previous"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="space-x-3">
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <Button
                      onClick={handleSubmitExam}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid="button-submit-exam"
                    >
                      Complete Practice Test
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      data-testid="button-next"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Results Interface */
          <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Practice Test Completed Successfully</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Your practice test has been completed. Review the detailed explanations below to prepare for your certification exam.
                </p>
              </CardContent>
            </Card>

            {/* Question Review with AI Explanations */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI-Powered Detailed Explanations
              </h2>
              
              {questions.map((question: ExamQuestion, index: number) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900">
                        Question {index + 1}: {question.type.replace('_', ' ')}
                      </h3>
                      <Badge variant="outline">{question.points} pts</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-700">{question.prompt}</p>
                    
                    {question.explanation && (
                      <div className="bg-blue-50 border-l-4 border-l-blue-400 p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Professional Explanation:</h4>
                        <p className="text-blue-700">{question.explanation}</p>
                      </div>
                    )}

                    {answers[question.id] && (
                      <div className="bg-slate-50 p-3 rounded">
                        <h4 className="font-medium text-slate-800 mb-1">Your Answer:</h4>
                        <p className="text-slate-700">{answers[question.id]}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}