import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users, Video, FileText, TrendingUp, Shield, AlertTriangle, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireRole } from "@/hooks/useRequireRole";

const AdminDashboard = () => {
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

  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Active Rooms", value: "89", change: "+8%", icon: Video, color: "from-purple-500 to-pink-500" },
    { label: "Total Quizzes", value: "456", change: "+15%", icon: Brain, color: "from-green-500 to-emerald-500" },
    { label: "Active Users", value: "847", change: "+5%", icon: TrendingUp, color: "from-yellow-500 to-orange-500" }
  ];

  const recentUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Student", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Teacher", status: "Active" },
    { id: 3, name: "Carol White", email: "carol@example.com", role: "Student", status: "Active" }
  ];

  const flaggedContent = [
    { id: 1, type: "Note", title: "Chemistry Lab Report", reporter: "John Doe", reason: "Inappropriate content" },
    { id: 2, type: "Message", title: "Study Room Chat", reporter: "Jane Smith", reason: "Spam" }
  ];

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
          
          <nav className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3 mb-4" onClick={() => navigate("/dashboard")}>
              <Home className="h-5 w-5" />
              Back to Dashboard
            </Button>
            <Button variant="secondary" className="w-full justify-start gap-3">
              <Shield className="h-5 w-5" />
              Admin Panel
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/admin/users")}>
              <Users className="h-5 w-5" />
              User Management
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/admin/rooms")}>
              <Video className="h-5 w-5" />
              Study Rooms
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/admin/content")}>
              <AlertTriangle className="h-5 w-5" />
              Content Moderation
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/admin/analytics")}>
              <TrendingUp className="h-5 w-5" />
              Analytics
            </Button>
          </nav>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard 🛡️</h1>
            <p className="text-muted-foreground">Platform management and oversight</p>
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
                    <span className="text-sm font-semibold text-green-500">{stat.change}</span>
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Users */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Users
                </CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:shadow-medium transition-all">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{user.role}</span>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => navigate("/admin/users")}>
                    View All Users
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Flagged Content */}
            <Card className="shadow-soft border-yellow-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Flagged Content
                </CardTitle>
                <CardDescription>Requires moderation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedContent.map((item) => (
                    <div key={item.id} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold text-yellow-500">{item.type}</span>
                          <h3 className="font-semibold">{item.title}</h3>
                        </div>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Reported by: {item.reporter}</p>
                      <p className="text-sm text-muted-foreground">Reason: {item.reason}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => navigate("/admin/content")}>
                    View All Flagged Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Analytics Chart Placeholder */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Platform Analytics
              </CardTitle>
              <CardDescription>User activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics chart placeholder</p>
                  <p className="text-sm text-muted-foreground">Daily/weekly usage graphs would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
