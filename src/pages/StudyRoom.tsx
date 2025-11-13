import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Video, Mic, Users, ArrowLeft, Maximize2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  message: string;
  created_at: string;
  profiles: {
    username: string;
  };
  user_id: string;
}

interface Participant {
  id: string;
  is_online: boolean;
  user_id: string;
  profiles: {
    username: string;
  };
}

const StudyRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (roomId && currentUser) {
      fetchRoomDetails();
      fetchMessages();
      fetchParticipants();
      
      const messagesChannel = subscribeToMessages();
      const participantsChannel = subscribeToParticipants();

      return () => {
        if (messagesChannel) supabase.removeChannel(messagesChannel);
        if (participantsChannel) supabase.removeChannel(participantsChannel);
      };
    }
  }, [roomId, currentUser]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    } else {
      setCurrentUser(user);
    }
  };

  const fetchRoomDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("study_rooms")
        .select("name")
        .eq("id", roomId)
        .single();

      if (error) throw error;
      setRoomName(data.name);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("room_messages")
        .select(`
          id,
          message,
          created_at,
          user_id,
          profiles:user_id (username)
        `)
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from("room_participants")
        .select(`
          id,
          is_online,
          user_id,
          profiles:user_id (username)
        `)
        .eq("room_id", roomId);

      if (error) throw error;
      setParticipants(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`room_messages:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return channel;
  };

  const subscribeToParticipants = () => {
    const channel = supabase
      .channel(`room_participants:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_participants",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          fetchParticipants();
        }
      )
      .subscribe();

    return channel;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    try {
      const { error } = await supabase
        .from("room_messages")
        .insert({
          room_id: roomId,
          user_id: currentUser.id,
          message: message.trim(),
        });

      if (error) throw error;
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLeaveRoom = async () => {
    try {
      if (currentUser) {
        await supabase
          .from("room_participants")
          .delete()
          .eq("room_id", roomId)
          .eq("user_id", currentUser.id);
      }
      navigate("/study-rooms");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleLeaveRoom}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{roomName || "Study Room"}</h1>
            <p className="text-sm text-muted-foreground">Virtual Study Session</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{participants.length} Online</span>
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 h-[calc(100vh-73px)]">
        {/* Main Video/Whiteboard Area */}
        <div className="lg:col-span-2 p-6 space-y-4">
          {/* Video Grid */}
          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {participants.slice(0, 4).map((participant) => (
                  <div 
                    key={participant.id} 
                    className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center relative group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold text-primary-foreground">
                          {participant.profiles?.username?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <p className="text-sm font-medium">
                        {participant.profiles?.username || "Unknown"}
                        {participant.user_id === currentUser?.id && " (You)"}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button size="sm" variant="outline">
                  <Mic className="h-4 w-4 mr-2" />
                  Mute
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Stop Video
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shared Whiteboard */}
          <Card className="flex-1 shadow-medium">
            <CardContent className="p-4 h-full">
              <div className="bg-muted rounded-lg h-[calc(100vh-400px)] flex items-center justify-center">
                <p className="text-muted-foreground">Shared Whiteboard (Coming Soon)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Panel */}
        <div className="border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Room Chat
            </h2>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>
                      {msg.profiles?.username?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {msg.profiles?.username || "Unknown"}
                        {msg.user_id === currentUser?.id && " (You)"}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(msg.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1 break-words">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
