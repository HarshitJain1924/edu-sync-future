import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Search, Shield, ChevronLeft, Ban, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireRole } from "@/hooks/useRequireRole";
import { cn } from "@/lib/utils";

const UserManagement = () => {
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

  const [filter, setFilter] = useState<"all" | "student" | "teacher" | "admin">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "student", status: "active", joined: "2024-01-15" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "teacher", status: "active", joined: "2024-01-10" },
    { id: 3, name: "Carol White", email: "carol@example.com", role: "student", status: "active", joined: "2024-02-01" },
    { id: 4, name: "David Brown", email: "david@example.com", role: "admin", status: "active", joined: "2023-12-20" },
    { id: 5, name: "Eve Davis", email: "eve@example.com", role: "student", status: "disabled", joined: "2024-01-25" },
    { id: 6, name: "Frank Miller", email: "frank@example.com", role: "teacher", status: "active", joined: "2024-02-10" }
  ];

  const filteredUsers = users.filter(user => {
    const matchesRole = filter === "all" || user.role === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/10 text-red-500";
      case "teacher": return "bg-blue-500/10 text-blue-500";
      case "student": return "bg-green-500/10 text-green-500";
      default: return "bg-muted text-muted-foreground";
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
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage platform users and permissions</p>
          </header>

          {/* Filters and Search */}
          <Card className="mb-6 shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Search users by name or email..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filter === "student" ? "default" : "outline"}
                    onClick={() => setFilter("student")}
                  >
                    Students
                  </Button>
                  <Button 
                    variant={filter === "teacher" ? "default" : "outline"}
                    onClick={() => setFilter("teacher")}
                  >
                    Teachers
                  </Button>
                  <Button 
                    variant={filter === "admin" ? "default" : "outline"}
                    onClick={() => setFilter("admin")}
                  >
                    Admins
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:shadow-medium transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getRoleBadgeColor(user.role))}>
                          {user.role}
                        </span>
                        {user.status === "disabled" && (
                          <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-semibold">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Joined: {user.joined}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.status === "active" ? "destructive" : "default"}
                      >
                        {user.status === "active" ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Disable
                          </>
                        ) : (
                          "Enable"
                        )}
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

export default UserManagement;
