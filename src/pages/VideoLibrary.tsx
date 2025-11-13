import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Tag, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";

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

const VideoLibrary = () => {
  useRequireAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [searchQuery, topicFilter, difficultyFilter, videos]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
      setFilteredVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = [...videos];

    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (topicFilter !== "all") {
      filtered = filtered.filter((video) => video.topic === topicFilter);
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((video) => video.difficulty === difficultyFilter);
    }

    setFilteredVideos(filtered);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const uniqueTopics = Array.from(new Set(videos.map((v) => v.topic)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            🎥 Video Learning
          </h1>
          <p className="text-muted-foreground">
            Explore educational videos and enhance your learning journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search videos by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {uniqueTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-border/50 hover:border-primary/50"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <Badge variant="outline" className={getDifficultyColor(video.difficulty)}>
                      {video.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {video.topic}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>👁️ {video.views_count} views</span>
                    <span>👍 {video.likes_count} likes</span>
                  </div>
                  <Button className="w-full mt-4" variant="default">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLibrary;
