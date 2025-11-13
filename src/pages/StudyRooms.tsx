import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, ArrowLeft, LogOut } from "lucide-react";
import { roomSchema } from "@/lib/validations";
import { z } from 'zod';

interface StudyRoom {
  id: string;
  name: string;
  description: string;
  created_by: string;
  is_active: boolean;
  max_participants: number;
  created_at: string;
  profiles: {
    username: string;
  };
}

const StudyRooms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchRooms();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    } else {
      setCurrentUser(user);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("study_rooms")
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = roomSchema.parse({
        name: newRoomName,
        description: newRoomDescription,
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("study_rooms")
        .insert({
          name: validated.name,
          description: validated.description,
          created_by: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study room created!",
      });

      setCreateDialogOpen(false);
      setNewRoomName("");
      setNewRoomDescription("");
      fetchRooms();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create room. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Add user as participant
      const { error } = await supabase
        .from("room_participants")
        .insert({
          room_id: roomId,
          user_id: user.id,
        });

      if (error && error.code !== "23505") throw error; // Ignore duplicate key error

      navigate(`/study-room/${roomId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Study Rooms</h1>
              <p className="text-muted-foreground">Join or create a virtual study session</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Study Room</DialogTitle>
                  <DialogDescription>Set up a new virtual study space for your classmates</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input
                      id="room-name"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      placeholder="Math Study Session"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-description">Description</Label>
                    <Textarea
                      id="room-description"
                      value={newRoomDescription}
                      onChange={(e) => setNewRoomDescription(e.target.value)}
                      placeholder="Let's work on chapter 5 problems together"
                    />
                  </div>
                  <Button type="submit" className="w-full">Create Room</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No study rooms yet. Create one to get started!</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {room.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Created by {room.profiles?.username || "Unknown"}</span>
                    </div>
                    <Button onClick={() => handleJoinRoom(room.id)}>
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyRooms;
