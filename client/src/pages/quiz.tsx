import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Navigation from "@/components/navigation";
import QuizQuestion from "@/components/quiz-question";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Quiz() {
  const [, params] = useRoute("/lessons/:id/quiz");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(522); // 8:42 in seconds
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["/api/quizzes/lesson", params?.id],
    enabled: !!params?.id,
  });

  const submitAttemptMutation = useMutation({
    mutationFn: async (attemptData: any) => {
      return apiRequest("POST", "/api/quiz-attempts", attemptData);
    },
    onSuccess: () => {
      toast({
        title: "Quiz Submitted!",
        description: "Your quiz has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-slate-500" data-testid="text-quiz-not-found">
              Quiz not available for this lesson.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion - 1];
  const selectedAnswer = answers[currentQuestionData.id];
  const totalQuestions = quiz.questions.length;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionData.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const score = Object.entries(answers).reduce((correct, [questionId, answer]) => {
      const question = quiz.questions.find((q: any) => q.id === questionId);
      return question?.answer === answer ? correct + 1 : correct;
    }, 0);

    submitAttemptMutation.mutate({
      userId: "current-user", // This would come from auth context
      quizId: quiz.id,
      score,
      totalQuestions: quiz.questions.length,
      answers: JSON.stringify(answers),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900" data-testid="text-quiz-title">
                  {quiz.title}
                </h2>
                <p className="text-sm text-slate-500" data-testid="text-quiz-meta">
                  {totalQuestions} questions • {quiz.timeLimit || 10} minutes
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Time Remaining</div>
                <div className="text-lg font-mono font-semibold text-slate-900" data-testid="text-time-remaining">
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          </div>
          
          <QuizQuestion
            question={currentQuestionData}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            canGoNext={!!selectedAnswer}
            canGoPrevious={currentQuestion > 1}
            isLastQuestion={currentQuestion === totalQuestions}
          />
        </section>
      </main>
    </div>
  );
}
