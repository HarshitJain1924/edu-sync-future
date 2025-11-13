import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ChevronLeft, Flag, Check, X, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const ContentModeration = () => {
  useRequireAuth();
  const navigate = useNavigate();

  const flaggedItems = [
    { 
      id: 1, 
      type: "Note", 
      title: "Chemistry Lab Report.pdf", 
      user: "Alice Johnson",
      reporter: "John Doe", 
      reason: "Inappropriate content",
      date: "2024-03-15",
      severity: "high"
    },
    { 
      id: 2, 
      type: "Message", 
      title: "Study Room Chat Message", 
      user: "Bob Smith",
      reporter: "Jane Smith", 
      reason: "Spam",
      date: "2024-03-14",
      severity: "medium"
    },
    { 
      id: 3, 
      type: "Note", 
      title: "Physics Notes.pdf", 
      user: "Carol White",
      reporter: "Mike Brown", 
      reason: "Copyright violation",
      date: "2024-03-13",
      severity: "high"
    },
    { 
      id: 4, 
      type: "Message", 
      title: "Math Study Room Discussion", 
      user: "David Brown",
      reporter: "Sarah Lee", 
      reason: "Offensive language",
      date: "2024-03-12",
      severity: "low"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-muted text-muted-foreground border-border";
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
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              Content Moderation
            </h1>
            <p className="text-muted-foreground">Review and moderate flagged content</p>
          </header>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Flagged Content ({flaggedItems.length})</CardTitle>
              <CardDescription>Content requiring review and action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-6 border-2 rounded-lg hover:shadow-medium transition-all ${getSeverityColor(item.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Flag className="h-5 w-5" />
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getSeverityColor(item.severity)}`}>
                            {item.severity}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><span className="font-semibold">Type:</span> {item.type}</p>
                          <p><span className="font-semibold">Posted by:</span> {item.user}</p>
                          <p><span className="font-semibold">Reported by:</span> {item.reporter}</p>
                          <p><span className="font-semibold">Reason:</span> {item.reason}</p>
                          <p><span className="font-semibold">Date:</span> {item.date}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-border/50">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Content
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1">
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ContentModeration;
