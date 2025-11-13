-- Create videos table for video metadata
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER NOT NULL, -- in seconds
  topic TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_progress table for tracking user watch progress
CREATE TABLE IF NOT EXISTS public.video_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  progress_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create video_notes table for user notes and bookmarks
CREATE TABLE IF NOT EXISTS public.video_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  timestamp_seconds INTEGER NOT NULL,
  note_text TEXT NOT NULL,
  is_bookmark BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_interactions table for likes and saves
CREATE TABLE IF NOT EXISTS public.video_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  liked BOOLEAN DEFAULT false,
  saved BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for videos (public read)
CREATE POLICY "Videos are viewable by everyone"
  ON public.videos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON public.videos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update videos"
  ON public.videos FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for video_progress
CREATE POLICY "Users can view their own progress"
  ON public.video_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.video_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.video_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.video_progress FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for video_notes
CREATE POLICY "Users can view their own notes"
  ON public.video_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON public.video_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.video_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.video_notes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for video_interactions
CREATE POLICY "Users can view their own interactions"
  ON public.video_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON public.video_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
  ON public.video_interactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions"
  ON public.video_interactions FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_video_progress_user_id ON public.video_progress(user_id);
CREATE INDEX idx_video_progress_video_id ON public.video_progress(video_id);
CREATE INDEX idx_video_notes_user_id ON public.video_notes(user_id);
CREATE INDEX idx_video_notes_video_id ON public.video_notes(video_id);
CREATE INDEX idx_video_interactions_user_id ON public.video_interactions(user_id);
CREATE INDEX idx_video_interactions_video_id ON public.video_interactions(video_id);
CREATE INDEX idx_videos_topic ON public.videos(topic);
CREATE INDEX idx_videos_difficulty ON public.videos(difficulty);

-- Create triggers for updating timestamps using the correct function
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_video_progress_updated_at
  BEFORE UPDATE ON public.video_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_video_notes_updated_at
  BEFORE UPDATE ON public.video_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_video_interactions_updated_at
  BEFORE UPDATE ON public.video_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample videos
INSERT INTO public.videos (title, description, url, thumbnail_url, duration, topic, difficulty, tags, views_count, likes_count) VALUES
  ('Introduction to React Hooks', 'Learn the fundamentals of React Hooks including useState and useEffect', 'https://www.youtube.com/embed/dpw9EHDh2bM', 'https://img.youtube.com/vi/dpw9EHDh2bM/maxresdefault.jpg', 1200, 'React', 'beginner', ARRAY['react', 'hooks', 'javascript'], 150, 45),
  ('Advanced TypeScript Patterns', 'Deep dive into advanced TypeScript patterns and best practices', 'https://www.youtube.com/embed/VqA794KaSMg', 'https://img.youtube.com/vi/VqA794KaSMg/maxresdefault.jpg', 1800, 'TypeScript', 'advanced', ARRAY['typescript', 'patterns', 'advanced'], 89, 32),
  ('CSS Grid Layout Masterclass', 'Master CSS Grid Layout with practical examples', 'https://www.youtube.com/embed/EiNiSFIPIQE', 'https://img.youtube.com/vi/EiNiSFIPIQE/maxresdefault.jpg', 2400, 'CSS', 'intermediate', ARRAY['css', 'grid', 'layout'], 234, 78),
  ('Node.js Best Practices', 'Learn best practices for building scalable Node.js applications', 'https://www.youtube.com/embed/Oe421EPjeBE', 'https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg', 2100, 'Node.js', 'intermediate', ARRAY['nodejs', 'backend', 'javascript'], 176, 54),
  ('Database Design Fundamentals', 'Understanding database design principles and normalization', 'https://www.youtube.com/embed/ztHopE5Wnpc', 'https://img.youtube.com/vi/ztHopE5Wnpc/maxresdefault.jpg', 1500, 'Database', 'beginner', ARRAY['database', 'sql', 'design'], 298, 92),
  ('REST API Development', 'Build RESTful APIs from scratch with best practices', 'https://www.youtube.com/embed/0oXYLzuucwE', 'https://img.youtube.com/vi/0oXYLzuucwE/maxresdefault.jpg', 2700, 'API', 'intermediate', ARRAY['api', 'rest', 'backend'], 145, 48),
  ('Git and GitHub Workflow', 'Master Git commands and GitHub collaboration workflow', 'https://www.youtube.com/embed/RGOj5yH7evk', 'https://img.youtube.com/vi/RGOj5yH7evk/maxresdefault.jpg', 1350, 'Git', 'beginner', ARRAY['git', 'github', 'version-control'], 412, 128),
  ('Docker Container Basics', 'Introduction to Docker containers and containerization', 'https://www.youtube.com/embed/Gjnup-PuquQ', 'https://img.youtube.com/vi/Gjnup-PuquQ/maxresdefault.jpg', 1920, 'DevOps', 'intermediate', ARRAY['docker', 'containers', 'devops'], 187, 61);