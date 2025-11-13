import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ChevronLeft, Users, Archive, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireRole } from "@/hooks/useRequireRole";

const RoomManagement = () => {
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

  const rooms = [
    { id: 1, name: "Mathematics 101", owner: "Bob Smith", members: 24, status: "active", created: "2024-01-15" },
    { id: 2, name: "Physics Lab", owner: "Alice Johnson", members: 18, status: "active", created: "2024-01-20" },
    { id: 3, name: "Chemistry Basics", owner: "Frank Miller", members: 20, status: "active", created: "2024-02-01" },
    { id: 4, name: "History Discussion", owner: "Bob Smith", members: 15, status: "archived", created: "2023-12-10" }
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
          
          <Button variant="outline" className="w-full justify-start gap-3 mb-4" onClick={() => navigate("/admin")}>
            <ChevronLeft className="h-5 w-5" />
            Back to Admin
          </Button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Study Rooms Management</h1>
            <p className="text-muted-foreground">Monitor and manage all study rooms</p>
          </header>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>All Study Rooms ({rooms.length})</CardTitle>
              <CardDescription>View room details and manage members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:shadow-medium transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          room.status === "active" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-muted-foreground/10 text-muted-foreground"
                        }`}>
                          {room.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {room.members} members
                        </span>
                        <span>Owner: {room.owner}</span>
                        <span>Created: {room.created}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        View Members
                      </Button>
                      {room.status === "active" ? (
                        <Button size="sm" variant="outline">
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </Button>
                      ) : (
                        <Button size="sm" variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      )}
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

export default RoomManagement;
