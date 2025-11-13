import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ChevronLeft, TrendingUp, Users, Video, BookOpen, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireRole } from "@/hooks/useRequireRole";
import { Progress } from "@/components/ui/progress";

const PlatformAnalytics = () => {
  const { isAuthorized, isLoading } = useRequireRole('admin');
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  const metrics = [
    { label: "Total Users", value: "1,234", trend: "+12% this month", icon: Users },
    { label: "Active Users Today", value: "847", trend: "+5% vs yesterday", icon: Activity },
    { label: "Total Rooms Created", value: "456", trend: "+8% this week", icon: Video },
    { label: "Quizzes Completed", value: "2,341", trend: "+15% this month", icon: BookOpen }
  ];

  const dailyUsage = [
    { day: "Mon", users: 120 },
    { day: "Tue", users: 140 },
    { day: "Wed", users: 180 },
    { day: "Thu", users: 160 },
    { day: "Fri", users: 200 },
    { day: "Sat", users: 90 },
    { day: "Sun", users: 80 }
  ];

  const maxUsers = Math.max(...dailyUsage.map(d => d.users));

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
          
          <Button variant="outline" className="w-full justify-start gap-3 mb-4" onClick={() => navigate("/admin")}>
            <ChevronLeft className="h-5 w-5" />
            Back to Admin
          </Button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Platform Analytics
            </h1>
            <p className="text-muted-foreground">Comprehensive platform usage and metrics</p>
          </header>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <metric.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-1">{metric.value}</p>
                    <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                    <p className="text-xs text-green-500 font-semibold">{metric.trend}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Active Users Chart */}
          <Card className="shadow-soft mb-8">
            <CardHeader>
              <CardTitle>Daily Active Users</CardTitle>
              <CardDescription>User activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyUsage.map((day) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <span className="text-sm font-semibold w-12">{day.day}</span>
                    <div className="flex-1">
                      <Progress value={(day.users / maxUsers) * 100} className="h-8" />
                    </div>
                    <span className="text-sm font-semibold w-16 text-right">{day.users} users</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">User growth chart placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Most popular features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Study Rooms</span>
                      <span className="text-sm font-semibold">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Quizzes</span>
                      <span className="text-sm font-semibold">65%</span>
                    </div>
                    <Progress value={65} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Flashcards</span>
                      <span className="text-sm font-semibold">52%</span>
                    </div>
                    <Progress value={52} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Games</span>
                      <span className="text-sm font-semibold">43%</span>
                    </div>
                    <Progress value={43} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformAnalytics;
