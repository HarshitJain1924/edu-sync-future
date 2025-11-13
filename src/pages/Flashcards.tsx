import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, ChevronLeft, ChevronRight, RotateCw, CheckCircle2, XCircle, Heart, Shuffle, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

type CardStatus = 'unknown' | 'learning' | 'mastered';

const Flashcards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatuses, setCardStatuses] = useState<Map<number, CardStatus>>(new Map());
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
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
      setCardStatuses(new Map());
      setFavorites(new Set());
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

  const handleKnown = () => {
    const newStatuses = new Map(cardStatuses);
    const currentStatus = newStatuses.get(currentIndex) || 'unknown';
    if (currentStatus === 'learning') {
      newStatuses.set(currentIndex, 'mastered');
    } else {
      newStatuses.set(currentIndex, 'learning');
    }
    setCardStatuses(newStatuses);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleUnknown = () => {
    const newStatuses = new Map(cardStatuses);
    newStatuses.set(currentIndex, 'unknown');
    setCardStatuses(newStatuses);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
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
    setCardStatuses(new Map());
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleFavorite = () => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(currentIndex)) {
      newFavorites.delete(currentIndex);
    } else {
      newFavorites.add(currentIndex);
    }
    setFavorites(newFavorites);
  };

  const getMasteredCount = () => {
    return Array.from(cardStatuses.values()).filter(s => s === 'mastered').length;
  };

  const getLearningCount = () => {
    return Array.from(cardStatuses.values()).filter(s => s === 'learning').length;
  };

  const progressPercentage = flashcards.length > 0 
    ? ((currentIndex + 1) / flashcards.length) * 100 
    : 0;

  const currentStatus = cardStatuses.get(currentIndex) || 'unknown';
  const statusColors = {
    mastered: 'border-green-500 bg-green-500/10',
    learning: 'border-yellow-500 bg-yellow-500/10',
    unknown: 'border-red-500 bg-red-500/10'
  };

  if (loading && !selectedSet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Brain className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  if (!selectedSet) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" className="mb-6" onClick={() => navigate("/dashboard")}>
            <Home className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-6">Flashcard Sets</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flashcardSets.map((set) => (
              <Card key={set.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleSetSelect(set)}>
                <CardHeader>
                  <CardTitle>{set.title}</CardTitle>
                  <CardDescription>{set.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return <div className="min-h-screen bg-background flex items-center justify-center">No flashcards available</div>;
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="outline" className="mb-6" onClick={() => setSelectedSet(null)}>
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} />
          <div className="flex gap-4 mt-4">
            <Button size="sm" onClick={handleShuffle}><Shuffle className="mr-2 h-4 w-4" />Shuffle</Button>
            <Button size="sm" onClick={handleReset}><RotateCw className="mr-2 h-4 w-4" />Restart</Button>
          </div>
        </div>

        <Card className={cn("h-96 cursor-pointer mb-6 border-2", statusColors[currentStatus])} onClick={handleFlip}>
          <CardContent className="flex items-center justify-center h-full relative">
            <Button size="icon" variant="ghost" className="absolute top-4 right-4" onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}>
              <Heart className={favorites.has(currentIndex) ? "fill-red-500 text-red-500" : ""} />
            </Button>
            <div className="text-center">
              <p className="text-sm text-primary mb-4">{isFlipped ? "Answer" : "Question"}</p>
              <p className="text-xl">{isFlipped ? currentCard.answer : currentCard.question}</p>
            </div>
          </CardContent>
        </Card>

        {isFlipped && (
          <div className="flex gap-4 mb-4">
            <Button variant="outline" className="flex-1 border-red-500" onClick={handleUnknown}>
              <XCircle className="mr-2" />Unknown
            </Button>
            <Button variant="outline" className="flex-1 border-green-500" onClick={handleKnown}>
              <CheckCircle2 className="mr-2" />Known
            </Button>
          </div>
        )}

        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="mr-2" />Previous
          </Button>
          <Button onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
            Next<ChevronRight className="ml-2" />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-500/10 rounded-lg">
            <div className="text-2xl font-bold text-green-500">{getMasteredCount()}</div>
            <p className="text-sm">Mastered</p>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
            <div className="text-2xl font-bold text-yellow-500">{getLearningCount()}</div>
            <p className="text-sm">Learning</p>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg">
            <div className="text-2xl font-bold text-red-500">{flashcards.length - getMasteredCount() - getLearningCount()}</div>
            <p className="text-sm">Unknown</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
