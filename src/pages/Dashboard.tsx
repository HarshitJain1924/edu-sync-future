import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Video, Calendar, TrendingUp, Users, Settings, LogOut, Play, Clock, Gamepad2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  useRequireAuth();
  const navigate = useNavigate();
  const [videoStats, setVideoStats] = useState({
    videosWatched: 0,
    totalWatchTime: 0,
    streak: 0
  });
  const userName = "Alex"; // Mock user name

  useEffect(() => {
    fetchVideoStats();
  }, []);

  const fetchVideoStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: progress } = await supabase
        .from('video_progress')
        .select('progress_seconds, completed')
        .eq('user_id', user.id);

      if (progress) {
        const completed = progress.filter(p => p.completed).length;
        const totalSeconds = progress.reduce((sum, p) => sum + p.progress_seconds, 0);

        setVideoStats({
          videosWatched: completed,
          totalWatchTime: totalSeconds,
          streak: 3 // Placeholder for streak calculation
        });
      }
    } catch (error) {
      console.error('Error fetching video stats:', error);
    }
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const upcomingSessions = [
    { id: 1, title: "Mathematics 101", time: "Today, 2:00 PM", teacher: "Dr. Smith" },
    { id: 2, title: "Physics Lab", time: "Tomorrow, 10:00 AM", teacher: "Prof. Johnson" },
    { id: 3, title: "History Discussion", time: "Friday, 3:00 PM", teacher: "Ms. Williams" },
  ];

  const stats = [
    { label: "Completed Classes", value: "24", icon: BookOpen, color: "from-primary to-primary/70" },
    { label: "Active Sessions", value: "3", icon: Video, color: "from-secondary to-accent" },
    { label: "Study Hours", value: "156", icon: TrendingUp, color: "from-accent to-secondary" },
    { label: "Study Groups", value: "5", icon: Users, color: "from-primary to-accent" },
  ];

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
            <Button variant="secondary" className="w-full justify-start gap-3">
              <BookOpen className="h-5 w-5" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/study-rooms")}>
              <Video className="h-5 w-5" />
              Study Rooms
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/videos")}>
              <Video className="h-5 w-5" />
              🎥 Video Learning
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/analytics")}>
              <TrendingUp className="h-5 w-5" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/flashcards")}>
              <BookOpen className="h-5 w-5" />
              Flashcards
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/quiz")}>
              <Brain className="h-5 w-5" />
              Quizzes
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/games")}>
              <Gamepad2 className="h-5 w-5" />
              🎮 Play & Prepare
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/teacher")}>
              👨‍🏫 Teacher Panel
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/admin")}>
              🛡️ Admin Panel
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button variant="outline" className="w-full justify-start gap-3" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
          <p className="text-muted-foreground">Track your learning progress and access your study materials</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-medium transition-all duration-300 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg shadow-soft`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Learning Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              🎥 Video Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">
                  {videoStats.videosWatched}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Play className="h-3 w-3" />
                  Videos Watched
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">
                  {formatWatchTime(videoStats.totalWatchTime)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  Time Spent Learning
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">
                  {videoStats.streak} days 🔥
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Active Streak
                </div>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate('/videos')}
            >
              <Video className="mr-2 h-4 w-4" />
              Browse Video Library
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your scheduled study sessions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-semibold mb-1">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">with {session.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-24 text-lg"
              onClick={() => navigate("/study-rooms")}
            >
              <Users className="mr-2 h-6 w-6" />
              Join Study Room
            </Button>
            <Button 
              variant="outline" 
              className="h-24 text-lg"
              onClick={() => navigate("/flashcards")}
            >
              <BookOpen className="mr-2 h-6 w-6" />
              Practice Flashcards
            </Button>
            <Button 
              variant="outline" 
              className="h-24 text-lg"
              onClick={() => navigate("/quiz")}
            >
              <Brain className="mr-2 h-6 w-6" />
              Take a Quiz
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
