import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Mic, Video, MessageSquare, Users, Maximize2, Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudyRoom = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, type: "ai", text: "Hello! I'm your AI study assistant. How can I help you today?" },
    { id: 2, type: "user", text: "Can you explain quantum mechanics?" },
    { id: 3, type: "ai", text: "Quantum mechanics is the branch of physics that studies matter and energy at atomic and subatomic scales..." },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, type: "user", text: message }]);
      setMessage("");
      // Mock AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: prev.length + 1, 
          type: "ai", 
          text: "I'm analyzing your question. Let me help you understand this concept better..." 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">AI Study Room</h1>
            <p className="text-sm text-muted-foreground">Mathematics 101 - Group Study</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">3 Online</span>
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
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
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center relative group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary-foreground">AJ</span>
                    </div>
                    <p className="text-sm font-medium">Alex Johnson (You)</p>
                  </div>
                  <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg flex items-center justify-center relative group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-secondary-foreground">SM</span>
                    </div>
                    <p className="text-sm font-medium">Sarah Miller</p>
                  </div>
                  <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="lg" className="gap-2">
                  <Mic className="h-5 w-5" />
                  <span className="hidden sm:inline">Mute</span>
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Video className="h-5 w-5" />
                  <span className="hidden sm:inline">Camera</span>
                </Button>
                <Button variant="destructive" size="lg">
                  Leave Room
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Whiteboard */}
          <Card className="flex-1 shadow-medium">
            <CardHeader>
              <CardTitle className="text-lg">Shared Whiteboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <p className="text-muted-foreground">Collaborative whiteboard area</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Panel */}
        <Card className="border-l border-border rounded-none shadow-soft">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-hero rounded-lg">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              AI Study Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100vh-170px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.type === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="border-t border-border p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Summarize Notes
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Generate Quiz
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Explain Topic
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Find Resources
                </Button>
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask AI anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" variant="hero">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyRoom;
