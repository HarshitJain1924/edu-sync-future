import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, ChevronLeft, ChevronRight, RotateCw, CheckCircle2, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  topic: string;
}

const Flashcards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const fetchFlashcardSets = async () => {
    try {
      const { data, error } = await supabase
        .from("flashcard_sets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFlashcardSets(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching flashcard sets:", error);
      }
      toast({
        title: "Error",
        description: "Failed to load flashcard sets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcards = async (setId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("set_id", setId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setFlashcards(data || []);
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownCards(new Set());
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching flashcards:", error);
      }
      toast({
        title: "Error",
        description: "Failed to load flashcards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetSelect = (set: FlashcardSet) => {
    setSelectedSet(set);
    fetchFlashcards(set.id);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnew = () => {
    setKnownCards(new Set(knownCards).add(currentIndex));
    handleNext();
  };

  const handleDidntKnow = () => {
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
  };

  const progressPercentage = flashcards.length > 0 
    ? ((currentIndex + 1) / flashcards.length) * 100 
    : 0;

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
            <Button variant="secondary" className="w-full justify-start gap-3">
              <BookOpen className="h-5 w-5" />
              Flashcards
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/quiz")}>
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
              <h1 className="text-3xl font-bold mb-2">Flashcards Learning</h1>
              <p className="text-muted-foreground">Revise key concepts interactively</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcardSets.map((set) => (
                <Card 
                  key={set.id} 
                  className="shadow-soft hover:shadow-medium transition-all cursor-pointer"
                  onClick={() => handleSetSelect(set)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
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
        ) : (
          <>
            <header className="mb-8">
              <Button variant="ghost" size="sm" onClick={() => setSelectedSet(null)} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Sets
              </Button>
              <h1 className="text-3xl font-bold mb-2">{selectedSet.title}</h1>
              <p className="text-muted-foreground">{selectedSet.description}</p>
            </header>

            {flashcards.length > 0 ? (
              <div className="max-w-3xl mx-auto">
                {/* Flashcard */}
                <div 
                  className="relative h-96 mb-8 cursor-pointer perspective-1000"
                  onClick={handleFlip}
                >
                  <div 
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Front */}
                    <Card 
                      className="absolute inset-0 flex items-center justify-center shadow-elegant backface-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="mb-4 text-sm text-muted-foreground">Question</div>
                        <p className="text-2xl font-semibold">{flashcards[currentIndex].question}</p>
                        <div className="mt-8 text-sm text-muted-foreground">Click to reveal answer</div>
                      </CardContent>
                    </Card>

                    {/* Back */}
                    <Card 
                      className="absolute inset-0 flex items-center justify-center shadow-elegant bg-primary/5"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="mb-4 text-sm text-muted-foreground">Answer</div>
                        <p className="text-xl">{flashcards[currentIndex].answer}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleFlip}
                    className="gap-2"
                  >
                    <RotateCw className="h-5 w-5" />
                    Flip Card
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleNext}
                    disabled={currentIndex === flashcards.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Knowledge Buttons */}
                {isFlipped && (
                  <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleDidntKnow}
                      className="gap-2 border-destructive/50 hover:bg-destructive/10"
                    >
                      <XCircle className="h-5 w-5 text-destructive" />
                      I didn't know this
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleKnew}
                      className="gap-2 border-green-500/50 hover:bg-green-500/10"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      I knew this
                    </Button>
                  </div>
                )}

                {/* Progress */}
                <Card className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium">
                        Progress: {currentIndex + 1} / {flashcards.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Known: {knownCards.size} / {flashcards.length}
                      </div>
                    </div>
                    <Progress value={progressPercentage} className="mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {progressPercentage.toFixed(0)}% Complete
                      </div>
                      {currentIndex === flashcards.length - 1 && (
                        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                          <RotateCw className="h-4 w-4" />
                          Start Over
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No flashcards in this set yet.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Flashcards;
