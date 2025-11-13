import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, ChevronLeft, CheckCircle2, XCircle, Trophy, RotateCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  order_index: number;
}

interface QuizSet {
  id: string;
  title: string;
  description: string;
  topic: string;
}

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizSets();
  }, []);

  const fetchQuizSets = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_sets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuizSets(data || []);
    } catch (error) {
      console.error("Error fetching quiz sets:", error);
      toast({
        title: "Error",
        description: "Failed to load quiz sets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (quizId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      
      // Transform the data to ensure options is properly typed
      const transformedData = (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options as string[] : []
      }));
      
      setQuestions(transformedData);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCorrectAnswers(0);
      setShowResults(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetSelect = (set: QuizSet) => {
    setSelectedSet(set);
    fetchQuestions(set.id);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setShowFeedback(true);
    const isCorrect = selectedAnswer === questions[currentIndex].correct_answer;
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectAnswers(0);
    setShowResults(false);
  };

  const progressPercentage = questions.length > 0 
    ? ((currentIndex + 1) / questions.length) * 100 
    : 0;

  const scorePercentage = questions.length > 0
    ? (correctAnswers / questions.length) * 100
    : 0;

  const getScoreMessage = () => {
    if (scorePercentage >= 90) return "Excellent! 🎉";
    if (scorePercentage >= 70) return "Great job! 👏";
    if (scorePercentage >= 50) return "Good effort! 💪";
    return "Keep practicing! 📚";
  };

  if (loading && !selectedSet) {
    return (
      <div className="min-h-screen bg-background">
        <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-soft">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-gradient-hero rounded-lg shadow-medium">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EduSync</span>
            </Link>
          </div>
        </aside>
        <main className="ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-soft">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-gradient-hero rounded-lg shadow-medium">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduSync</span>
          </Link>

          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/dashboard")}>
              <BookOpen className="h-5 w-5" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/flashcards")}>
              <BookOpen className="h-5 w-5" />
              Flashcards
            </Button>
            <Button variant="secondary" className="w-full justify-start gap-3">
              <Brain className="h-5 w-5" />
              Quizzes
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {!selectedSet ? (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Quick Quiz</h1>
              <p className="text-muted-foreground">Test your understanding</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizSets.map((set) => (
                <Card 
                  key={set.id} 
                  className="shadow-soft hover:shadow-medium transition-all cursor-pointer"
                  onClick={() => handleSetSelect(set)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      {set.title}
                    </CardTitle>
                    <CardDescription>{set.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                        {set.topic}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : showResults ? (
          <>
            <header className="mb-8">
              <Button variant="ghost" size="sm" onClick={() => setSelectedSet(null)} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Quizzes
              </Button>
              <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            </header>

            <div className="max-w-2xl mx-auto">
              <Card className="shadow-elegant">
                <CardContent className="p-12 text-center">
                  <div className="mb-6">
                    <Trophy className="h-20 w-20 mx-auto text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{getScoreMessage()}</h2>
                  <div className="mb-6">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {correctAnswers} / {questions.length}
                    </div>
                    <p className="text-muted-foreground">
                      You scored {scorePercentage.toFixed(0)}%
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={handleRestart} className="gap-2">
                      <RotateCw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedSet(null)}>
                      Back to Quizzes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <header className="mb-8">
              <Button variant="ghost" size="sm" onClick={() => setSelectedSet(null)} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Quizzes
              </Button>
              <h1 className="text-3xl font-bold mb-2">{selectedSet.title}</h1>
              <p className="text-muted-foreground">{selectedSet.description}</p>
            </header>

            {questions.length > 0 ? (
              <div className="max-w-3xl mx-auto">
                {/* Progress */}
                <Card className="shadow-soft mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium">
                        Question {currentIndex + 1} of {questions.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Score: {correctAnswers} / {currentIndex + (showFeedback ? 1 : 0)}
                      </div>
                    </div>
                    <Progress value={progressPercentage} />
                  </CardContent>
                </Card>

                {/* Question Card */}
                <Card className="shadow-elegant mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {questions[currentIndex].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {questions[currentIndex].options.map((option, index) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === questions[currentIndex].correct_answer;
                      const showCorrect = showFeedback && isCorrect;
                      const showIncorrect = showFeedback && isSelected && !isCorrect;

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={showFeedback}
                          className={cn(
                            "w-full p-4 text-left rounded-lg border-2 transition-all",
                            "hover:border-primary hover:bg-primary/5",
                            isSelected && !showFeedback && "border-primary bg-primary/10",
                            showCorrect && "border-green-500 bg-green-500/10",
                            showIncorrect && "border-destructive bg-destructive/10",
                            showFeedback && "cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "font-medium",
                              showCorrect && "text-green-500",
                              showIncorrect && "text-destructive"
                            )}>
                              {option}
                            </span>
                            {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                            {showIncorrect && <XCircle className="h-5 w-5 text-destructive" />}
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  {!showFeedback ? (
                    <Button
                      size="lg"
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="min-w-[200px]"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleNext}
                      className="min-w-[200px]"
                    >
                      {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
                    </Button>
                  )}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <Card className={cn(
                    "mt-6 shadow-soft animate-fade-in",
                    selectedAnswer === questions[currentIndex].correct_answer 
                      ? "border-green-500/50 bg-green-500/5" 
                      : "border-destructive/50 bg-destructive/5"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        {selectedAnswer === questions[currentIndex].correct_answer ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                        )}
                        <div>
                          <h3 className="font-semibold mb-1">
                            {selectedAnswer === questions[currentIndex].correct_answer 
                              ? "Correct! ✅" 
                              : "Incorrect ❌"}
                          </h3>
                          {selectedAnswer !== questions[currentIndex].correct_answer && (
                            <p className="text-sm text-muted-foreground">
                              The correct answer is: <span className="font-medium text-foreground">{questions[currentIndex].correct_answer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No questions in this quiz yet.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Quiz;
