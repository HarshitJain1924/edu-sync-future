import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ChevronLeft, CheckCircle2, XCircle, Trophy, RotateCw, Clock, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    fetchQuizSets();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedSet && !showResults && startTime) {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedSet, showResults, startTime]);

  const fetchQuizSets = async () => {
    try {
      const { data, error } = await supabase.from("quiz_sets").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setQuizSets(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error:", error);
      toast({ title: "Error", description: "Failed to load quiz sets", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (quizId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizId).order("order_index");
      if (error) throw error;
      setQuestions((data || []).map(q => ({ ...q, options: Array.isArray(q.options) ? q.options as string[] : [] })));
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCorrectAnswers(0);
      setShowResults(false);
      setStartTime(Date.now());
      setTimer(0);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error:", error);
      toast({ title: "Error", description: "Failed to load questions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSetSelect = (set: QuizSet) => {
    setSelectedSet(set);
    fetchQuestions(set.id);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setShowFeedback(true);
    if (selectedAnswer === questions[currentIndex].correct_answer) {
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

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  if (loading && !selectedSet) return <div className="min-h-screen flex items-center justify-center"><Brain className="h-12 w-12 animate-pulse text-primary" /></div>;

  if (!selectedSet) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" className="mb-6" onClick={() => navigate("/dashboard")}><Home className="mr-2 h-5 w-5" />Back</Button>
          <h1 className="text-3xl font-bold mb-6">Quiz Sets</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizSets.map((set) => (
              <Card key={set.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleSetSelect(set)}>
                <CardHeader><CardTitle>{set.title}</CardTitle><CardDescription>{set.description}</CardDescription></CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const scorePercentage = (correctAnswers / questions.length) * 100;
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center"><div className="text-6xl font-bold text-primary">{Math.round(scorePercentage)}%</div></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card rounded-lg border"><div className="text-2xl font-bold text-green-500">{correctAnswers}</div><p className="text-sm">Correct</p></div>
              <div className="text-center p-4 bg-card rounded-lg border"><div className="text-2xl font-bold text-red-500">{questions.length - correctAnswers}</div><p className="text-sm">Wrong</p></div>
              <div className="text-center p-4 bg-card rounded-lg border"><div className="text-2xl font-bold text-primary">{formatTime(timer)}</div><p className="text-sm">Time</p></div>
            </div>
            <div className="flex gap-4">
              <Button className="flex-1" onClick={() => { setShowResults(false); setCurrentIndex(0); setSelectedAnswer(null); setShowFeedback(false); setCorrectAnswers(0); setStartTime(Date.now()); }}><RotateCw className="mr-2" />Retake</Button>
              <Button variant="outline" className="flex-1" onClick={() => setSelectedSet(null)}>Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) return <div className="min-h-screen flex items-center justify-center">No questions</div>;

  const currentQuestion = questions[currentIndex];
  const isCorrect = showFeedback && selectedAnswer === currentQuestion.correct_answer;
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b px-8 py-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          <Button variant="ghost" onClick={() => setSelectedSet(null)}><ChevronLeft className="mr-2" />Exit</Button>
          <div className="flex gap-6">
            <div className="flex items-center gap-2"><Clock className="h-5 w-5" /><span className="font-mono">{formatTime(timer)}</span></div>
            <span className="font-semibold">{currentIndex + 1} / {questions.length}</span>
          </div>
        </div>
      </div>
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <Progress value={progressPercentage} className="mb-8" />
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-2xl">{currentQuestion.question}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.correct_answer;
                return (
                  <button key={index} onClick={() => !showFeedback && setSelectedAnswer(option)} disabled={showFeedback}
                    className={cn("w-full p-4 text-left rounded-lg border-2 transition-all", !showFeedback && !isSelected && "border-border hover:border-primary",
                      !showFeedback && isSelected && "border-primary bg-primary/5", showFeedback && isCorrectOption && "border-green-500 bg-green-500/10",
                      showFeedback && isSelected && !isCorrectOption && "border-red-500 bg-red-500/10")}>
                    <div className="flex justify-between">
                      <span>{option}</span>
                      {showFeedback && isCorrectOption && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                      {showFeedback && isSelected && !isCorrectOption && <XCircle className="h-6 w-6 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
          {showFeedback && (
            <Card className={cn("mb-6", isCorrect ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5")}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">{isCorrect ? "Correct! ✨" : "Incorrect"}</h3>
                <p className="text-sm text-muted-foreground">{isCorrect ? "Great job!" : `Correct answer: ${currentQuestion.correct_answer}`}</p>
              </CardContent>
            </Card>
          )}
          <Button className="w-full" size="lg" onClick={showFeedback ? handleNext : handleSubmitAnswer} disabled={!showFeedback && !selectedAnswer}>
            {showFeedback ? (currentIndex < questions.length - 1 ? "Next Question" : "View Results") : "Submit Answer"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
