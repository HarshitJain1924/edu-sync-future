import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft, TrendingUp, TrendingDown, Award, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();

  const performanceData = [
    { subject: "Mathematics", score: 92, trend: "up", change: "+5%" },
    { subject: "Physics", score: 87, trend: "up", change: "+3%" },
    { subject: "History", score: 78, trend: "down", change: "-2%" },
    { subject: "Literature", score: 94, trend: "up", change: "+8%" },
  ];

  const weeklyActivity = [
    { day: "Mon", hours: 4 },
    { day: "Tue", hours: 6 },
    { day: "Wed", hours: 3 },
    { day: "Thu", hours: 7 },
    { day: "Fri", hours: 5 },
    { day: "Sat", hours: 2 },
    { day: "Sun", hours: 4 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Performance Analytics</h1>
            <p className="text-sm text-muted-foreground">Track your learning progress</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Export Report
        </Button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-medium">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold">A-</span>
              </div>
              <p className="text-sm text-muted-foreground">Overall Grade</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-accent shadow-medium">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold">31h</span>
              </div>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-secondary shadow-medium">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold">+12%</span>
              </div>
              <p className="text-sm text-muted-foreground">Improvement</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-medium">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold">87</span>
              </div>
              <p className="text-sm text-muted-foreground">AI Sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Subject */}
        <Card className="shadow-medium mb-8">
          <CardHeader>
            <CardTitle>Performance by Subject</CardTitle>
            <CardDescription>Your scores and trends across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{subject.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{subject.score}%</span>
                        {subject.trend === "up" ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${subject.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                          {subject.change}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-hero h-2 rounded-full transition-all" 
                        style={{ width: `${subject.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Study hours for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-4 h-64">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative">
                    <div 
                      className="bg-gradient-hero rounded-t-lg transition-all hover:shadow-glow"
                      style={{ height: `${(day.hours / 7) * 200}px` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground">{day.day}</p>
                    <p className="text-sm font-bold">{day.hours}h</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
