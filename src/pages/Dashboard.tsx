import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Video, Calendar, TrendingUp, Users, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = "Alex"; // Mock user name

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
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => navigate("/")}>
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
          <p className="text-muted-foreground">Ready to continue your learning journey?</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-medium`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <Card className="lg:col-span-2 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your scheduled classes and study groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div>
                    <h4 className="font-semibold">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">{session.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.time}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start learning now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="hero" className="w-full justify-start gap-3" onClick={() => navigate("/study-rooms")}>
                <Brain className="h-5 w-5" />
                Study Rooms
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Calendar className="h-5 w-5" />
                Schedule Class
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <BookOpen className="h-5 w-5" />
                My Courses
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Users className="h-5 w-5" />
                Study Groups
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
