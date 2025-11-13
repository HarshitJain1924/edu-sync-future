import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Plus, Users, FileText, TrendingUp, Clock, BookOpen, Video, MessageSquare, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireRole } from "@/hooks/useRequireRole";
import { Progress } from "@/components/ui/progress";

const TeacherDashboard = () => {
  const { isAuthorized, isLoading } = useRequireRole('teacher');
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  const myRooms = [
    { id: 1, name: "Mathematics 101", students: 24, active: true },
    { id: 2, name: "Physics Lab", students: 18, active: true },
    { id: 3, name: "Chemistry Basics", students: 20, active: false }
  ];

  const myStudents = [
    { id: 1, name: "Alice Johnson", progress: 85, quizzes: 12 },
    { id: 2, name: "Bob Smith", progress: 72, quizzes: 10 },
    { id: 3, name: "Carol White", progress: 94, quizzes: 15 },
    { id: 4, name: "David Brown", progress: 68, quizzes: 8 }
  ];

  const uploadedNotes = [
    { id: 1, title: "Calculus Basics.pdf", views: 156, uploaded: "2 days ago" },
    { id: 2, title: "Physics Formulas.pdf", views: 203, uploaded: "1 week ago" },
    { id: 3, title: "Chemistry Lab Guide.pdf", views: 98, uploaded: "3 days ago" }
  ];

  const recentActivity = [
    { id: 1, action: "New student joined Mathematics 101", time: "5 mins ago", icon: Users },
    { id: 2, action: "Quiz completed by 18 students", time: "1 hour ago", icon: TrendingUp },
    { id: 3, action: "Note 'Calculus Basics' viewed 15 times", time: "2 hours ago", icon: FileText },
    { id: 4, action: "Room 'Physics Lab' started", time: "3 hours ago", icon: Video }
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
              <Users className="h-5 w-5" />
              Teacher Panel
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/study-rooms")}>
              <Video className="h-5 w-5" />
              My Rooms
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <FileText className="h-5 w-5" />
              My Notes
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <TrendingUp className="h-5 w-5" />
              Analytics
            </Button>
          </nav>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Teacher Dashboard 👨‍🏫</h1>
            <p className="text-muted-foreground">Manage your classes, students, and content</p>
          </header>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Button className="h-24 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              Create Room
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              Upload Notes
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Brain className="h-6 w-6" />
              Generate Quiz
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              View Students
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* My Study Rooms */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  My Study Rooms
                </CardTitle>
                <CardDescription>Active and archived rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myRooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">{room.students} students</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${room.active ? 'bg-green-500/10 text-green-500' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                          {room.active ? 'Active' : 'Archived'}
                        </span>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Students */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  My Students
                </CardTitle>
                <CardDescription>Recent student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myStudents.map((student) => (
                    <div key={student.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-xs text-muted-foreground">{student.quizzes} quizzes completed</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Uploaded Notes */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Uploaded Notes
                </CardTitle>
                <CardDescription>Most viewed materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedNotes.map((note) => (
                    <div key={note.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:shadow-medium transition-all">
                      <div>
                        <h3 className="font-semibold">{note.title}</h3>
                        <p className="text-sm text-muted-foreground">{note.views} views • {note.uploaded}</p>
                      </div>
                      <Button size="sm" variant="ghost">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Analytics */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>Overall class metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Average Quiz Score</span>
                      <span className="text-2xl font-bold text-primary">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Student Engagement</span>
                      <span className="text-2xl font-bold text-primary">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Room Attendance</span>
                      <span className="text-2xl font-bold text-primary">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate AI Quiz Panel */}
            <Card className="shadow-soft border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Quiz Generator
                </CardTitle>
                <CardDescription>Generate custom quizzes using AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-4">
                      Create custom quizzes based on your uploaded notes and topics using AI
                    </p>
                    <Button className="w-full" size="lg">
                      <Brain className="mr-2 h-5 w-5" />
                      Generate Quiz with AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <activity.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
