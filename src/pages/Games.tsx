import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Grid3x3, Puzzle, Zap, Layers, Timer, Keyboard, Target, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const Games = () => {
  useRequireAuth();
  const navigate = useNavigate();

  const games = [
    {
      id: "sudoku",
      title: "Sudoku",
      description: "Classic number puzzle to sharpen your logic skills",
      icon: Grid3x3,
      difficulty: "Medium",
      xp: 50,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "queens",
      title: "Queens Puzzle",
      description: "Place queens on a chessboard without conflicts",
      icon: Puzzle,
      difficulty: "Hard",
      xp: 75,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "pattern",
      title: "Pattern Matching",
      description: "Match patterns quickly to boost pattern recognition",
      icon: Layers,
      difficulty: "Easy",
      xp: 30,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "zip",
      title: "Zip Match",
      description: "Connect matching pairs in minimum moves",
      icon: Zap,
      difficulty: "Medium",
      xp: 40,
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "memory",
      title: "Memory Flip",
      description: "Classic memory card game to improve recall",
      icon: Brain,
      difficulty: "Easy",
      xp: 25,
      color: "from-red-500 to-rose-500"
    },
    {
      id: "speed",
      title: "Brain Speed Test",
      description: "Quick mental math challenges against the clock",
      icon: Timer,
      difficulty: "Medium",
      xp: 45,
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "typing",
      title: "Typing Speed Test",
      description: "Test and improve your typing accuracy and speed",
      icon: Keyboard,
      difficulty: "Easy",
      xp: 35,
      color: "from-teal-500 to-cyan-500"
    },
    {
      id: "aptitude",
      title: "Aptitude Speed Run",
      description: "Solve aptitude questions as fast as possible",
      icon: Target,
      difficulty: "Hard",
      xp: 100,
      color: "from-amber-500 to-red-500"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-500 bg-green-500/10";
      case "Medium": return "text-yellow-500 bg-yellow-500/10";
      case "Hard": return "text-red-500 bg-red-500/10";
      default: return "text-primary bg-primary/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-soft">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-gradient-hero rounded-lg shadow-medium">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduSync</span>
          </Link>
          <Button variant="outline" className="w-full justify-start gap-3 mb-4" onClick={() => navigate("/dashboard")}>
            <Home className="h-5 w-5" />
            Back to Dashboard
          </Button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              🎮 Play & Prepare
            </h1>
            <p className="text-muted-foreground">
              Sharpen your skills with fun, gamified challenges
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card 
                key={game.id}
                className="cursor-pointer hover:shadow-elegant transition-all duration-300 hover:scale-105 group"
                onClick={() => navigate(`/games/${game.id}`)}
              >
                <CardHeader>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${game.color} w-fit mb-4 group-hover:scale-110 transition-transform shadow-medium`}>
                    <game.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <Zap className="h-4 w-4" />
                      {game.xp} XP
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Games;
