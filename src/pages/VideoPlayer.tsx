import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ThumbsUp,
  Bookmark,
  Clock,
  Play,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  duration: number;
  topic: string;
  difficulty: string;
  tags: string[];
  views_count: number;
  likes_count: number;
}

interface Note {
  id: string;
  timestamp_seconds: number;
  note_text: string;
  is_bookmark: boolean;
  created_at: string;
}

interface Interaction {
  liked: boolean;
  saved: boolean;
  rating: number | null;
}

const VideoPlayer = () => {
  useRequireAuth();
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLIFrameElement>(null);

  const [video, setVideo] = useState<Video | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [interaction, setInteraction] = useState<Interaction>({
    liked: false,
    saved: false,
    rating: null,
  });
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  useEffect(() => {
    if (videoId) {
      fetchVideoData();
      fetchNotes();
      fetchInteraction();
      fetchProgress();
      incrementViewCount();
    }
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

      if (error) throw error;
      setVideo(data);

      // Fetch related videos
      const { data: related } = await supabase
        .from("videos")
        .select("*")
        .eq("topic", data.topic)
        .neq("id", videoId)
        .limit(4);

      setRelatedVideos(related || []);
    } catch (error) {
      console.error("Error fetching video:", error);
      toast({ title: "Error", description: "Failed to load video", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("video_notes")
        .select("*")
        .eq("video_id", videoId)
        .eq("user_id", user.id)
        .order("timestamp_seconds", { ascending: true });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchInteraction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("video_interactions")
        .select("*")
        .eq("video_id", videoId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setInteraction({
          liked: data.liked,
          saved: data.saved,
          rating: data.rating,
        });
      }
    } catch (error) {
      console.error("Error fetching interaction:", error);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("video_progress")
        .select("*")
        .eq("video_id", videoId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data && video) {
        const progressPercent = (data.progress_seconds / video.duration) * 100;
        setProgress(progressPercent);
        setCurrentTime(data.progress_seconds);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const incrementViewCount = async () => {
    try {
      if (!video) return;
      await supabase
        .from("videos")
        .update({ views_count: video.views_count + 1 })
        .eq("id", videoId);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newLikedState = !interaction.liked;
      
      const { error } = await supabase
        .from("video_interactions")
        .upsert({
          user_id: user.id,
          video_id: videoId,
          liked: newLikedState,
          saved: interaction.saved,
        });

      if (error) throw error;

      setInteraction({ ...interaction, liked: newLikedState });
      
      if (video) {
        const newLikesCount = video.likes_count + (newLikedState ? 1 : -1);
        await supabase
          .from("videos")
          .update({ likes_count: newLikesCount })
          .eq("id", videoId);
        
        setVideo({ ...video, likes_count: newLikesCount });
      }

      toast({ title: newLikedState ? "Liked!" : "Unliked", description: "Your preference has been saved" });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({ title: "Error", description: "Failed to update like", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newSavedState = !interaction.saved;

      const { error } = await supabase
        .from("video_interactions")
        .upsert({
          user_id: user.id,
          video_id: videoId,
          liked: interaction.liked,
          saved: newSavedState,
        });

      if (error) throw error;

      setInteraction({ ...interaction, saved: newSavedState });
      toast({ title: newSavedState ? "Saved!" : "Removed from saved", description: "Your preference has been updated" });
    } catch (error) {
      console.error("Error toggling save:", error);
      toast({ title: "Error", description: "Failed to save video", variant: "destructive" });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("video_notes").insert({
        user_id: user.id,
        video_id: videoId,
        timestamp_seconds: Math.floor(currentTime),
        note_text: newNote,
        is_bookmark: false,
      });

      if (error) throw error;

      setNewNote("");
      setShowNoteInput(false);
      fetchNotes();
      toast({ title: "Note added!", description: "Your note has been saved" });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    }
  };

  const handleAddBookmark = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("video_notes").insert({
        user_id: user.id,
        video_id: videoId,
        timestamp_seconds: Math.floor(currentTime),
        note_text: "Bookmark",
        is_bookmark: true,
      });

      if (error) throw error;

      fetchNotes();
      toast({ title: "Bookmark added!", description: "Moment bookmarked successfully" });
    } catch (error) {
      console.error("Error adding bookmark:", error);
      toast({ title: "Error", description: "Failed to add bookmark", variant: "destructive" });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/videos")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Videos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden border-border/50">
              <div className="aspect-video bg-black">
                <iframe
                  ref={videoRef}
                  src={video.url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <CardContent className="p-4">
                <Progress value={progress} className="mb-4" />
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <Badge variant="outline">{video.difficulty}</Badge>
                  <Badge variant="outline">{video.topic}</Badge>
                  <span className="text-sm text-muted-foreground">
                    👁️ {video.views_count} views
                  </span>
                  <span className="text-sm text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {formatTime(video.duration)}
                  </span>
                </div>
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={interaction.liked ? "default" : "outline"}
                    onClick={handleLike}
                    className="flex-1"
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {interaction.liked ? "Liked" : "Like"} ({video.likes_count})
                  </Button>
                  <Button
                    variant={interaction.saved ? "default" : "outline"}
                    onClick={handleSave}
                    className="flex-1"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {interaction.saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" onClick={handleAddBookmark}>
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground">{video.description}</p>
              </CardContent>
            </Card>

            {/* Notes & Bookmarks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Notes & Bookmarks</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNoteInput(!showNoteInput)}
                  >
                    {showNoteInput ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showNoteInput && (
                  <div className="mb-4 space-y-2">
                    <Textarea
                      placeholder={`Add a note at ${formatTime(currentTime)}...`}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddNote} size="sm">
                      Save Note
                    </Button>
                  </div>
                )}
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No notes yet. Add your first note!
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="border border-border/50 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {formatTime(note.timestamp_seconds)}
                              </Badge>
                              {note.is_bookmark && (
                                <Badge variant="secondary" className="text-xs">
                                  🔖 Bookmark
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{note.note_text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Videos */}
            <Card>
              <CardHeader>
                <CardTitle>Related Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedVideos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No related videos found
                  </p>
                ) : (
                  relatedVideos.map((relatedVideo) => (
                    <div
                      key={relatedVideo.id}
                      className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/video/${relatedVideo.id}`)}
                    >
                      <div className="w-32 aspect-video bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={relatedVideo.thumbnail_url}
                          alt={relatedVideo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold line-clamp-2 mb-1">
                          {relatedVideo.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(relatedVideo.duration)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Test Your Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle>Test Your Knowledge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ready to test what you've learned?
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/quiz")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Quiz
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/flashcards")}
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Review Flashcards
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
