-- Create flashcard_sets table
CREATE TABLE public.flashcard_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  set_id UUID NOT NULL REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Create quiz_sets table
CREATE TABLE public.quiz_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quiz_id UUID NOT NULL REFERENCES public.quiz_sets(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Create user_progress table to track flashcard and quiz progress
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'flashcard_set' or 'quiz_set'
  content_id UUID NOT NULL,
  progress_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(user_id, content_type, content_id)
);

-- Enable RLS
ALTER TABLE public.flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flashcard_sets
CREATE POLICY "Anyone can view flashcard sets"
  ON public.flashcard_sets FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create flashcard sets"
  ON public.flashcard_sets FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own flashcard sets"
  ON public.flashcard_sets FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own flashcard sets"
  ON public.flashcard_sets FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for flashcards
CREATE POLICY "Anyone can view flashcards"
  ON public.flashcards FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create flashcards"
  ON public.flashcards FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.flashcard_sets
    WHERE id = set_id AND created_by = auth.uid()
  ));

CREATE POLICY "Users can update flashcards in their sets"
  ON public.flashcards FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.flashcard_sets
    WHERE id = set_id AND created_by = auth.uid()
  ));

CREATE POLICY "Users can delete flashcards in their sets"
  ON public.flashcards FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.flashcard_sets
    WHERE id = set_id AND created_by = auth.uid()
  ));

-- RLS Policies for quiz_sets
CREATE POLICY "Anyone can view quiz sets"
  ON public.quiz_sets FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create quiz sets"
  ON public.quiz_sets FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own quiz sets"
  ON public.quiz_sets FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own quiz sets"
  ON public.quiz_sets FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for quiz_questions
CREATE POLICY "Anyone can view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create quiz questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quiz_sets
    WHERE id = quiz_id AND created_by = auth.uid()
  ));

CREATE POLICY "Users can update quiz questions in their sets"
  ON public.quiz_questions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.quiz_sets
    WHERE id = quiz_id AND created_by = auth.uid()
  ));

CREATE POLICY "Users can delete quiz questions in their sets"
  ON public.quiz_questions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.quiz_sets
    WHERE id = quiz_id AND created_by = auth.uid()
  ));

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_flashcard_sets_updated_at
  BEFORE UPDATE ON public.flashcard_sets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_quiz_sets_updated_at
  BEFORE UPDATE ON public.quiz_sets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data for flashcards
INSERT INTO public.flashcard_sets (title, description, topic, created_by)
VALUES 
  ('SDLC Fundamentals', 'Learn the basics of Software Development Life Cycle', 'SDLC', (SELECT id FROM public.profiles LIMIT 1)),
  ('Operating Systems Basics', 'Key concepts in Operating Systems', 'Operating Systems', (SELECT id FROM public.profiles LIMIT 1));

INSERT INTO public.flashcards (set_id, question, answer, order_index)
VALUES
  ((SELECT id FROM public.flashcard_sets WHERE topic = 'SDLC' LIMIT 1), 'What is SDLC?', 'Software Development Life Cycle - a structured process for developing software applications', 0),
  ((SELECT id FROM public.flashcard_sets WHERE topic = 'SDLC' LIMIT 1), 'Name the phases of SDLC.', 'Requirement Analysis, Design, Implementation, Testing, Deployment, and Maintenance', 1),
  ((SELECT id FROM public.flashcard_sets WHERE topic = 'SDLC' LIMIT 1), 'What is the purpose of the Testing phase?', 'To identify and fix bugs, ensure quality, and verify that the software meets requirements', 2),
  ((SELECT id FROM public.flashcard_sets WHERE topic = 'Operating Systems' LIMIT 1), 'What is an Operating System?', 'Software that manages computer hardware and software resources and provides services for programs', 0),
  ((SELECT id FROM public.flashcard_sets WHERE topic = 'Operating Systems' LIMIT 1), 'What is a process?', 'A program in execution, including the program code, current activity, and allocated resources', 1);

-- Insert sample data for quizzes
INSERT INTO public.quiz_sets (title, description, topic, created_by)
VALUES 
  ('SDLC Quiz', 'Test your knowledge of Software Development Life Cycle', 'SDLC', (SELECT id FROM public.profiles LIMIT 1)),
  ('OS Scheduling Algorithms', 'Quiz on Operating System scheduling algorithms', 'Operating Systems', (SELECT id FROM public.profiles LIMIT 1));

INSERT INTO public.quiz_questions (quiz_id, question, options, correct_answer, order_index)
VALUES
  (
    (SELECT id FROM public.quiz_sets WHERE topic = 'SDLC' LIMIT 1),
    'Which phase comes after Design in SDLC?',
    '["Requirement Analysis", "Implementation", "Testing", "Maintenance"]'::jsonb,
    'Implementation',
    0
  ),
  (
    (SELECT id FROM public.quiz_sets WHERE topic = 'SDLC' LIMIT 1),
    'What is the main goal of the Maintenance phase?',
    '["Write new code", "Fix bugs and add features", "Design the system", "Gather requirements"]'::jsonb,
    'Fix bugs and add features',
    1
  ),
  (
    (SELECT id FROM public.quiz_sets WHERE topic = 'Operating Systems' LIMIT 1),
    'Which is NOT a CPU scheduling algorithm?',
    '["FCFS", "Round Robin", "LRU", "SJF"]'::jsonb,
    'LRU',
    0
  ),
  (
    (SELECT id FROM public.quiz_sets WHERE topic = 'Operating Systems' LIMIT 1),
    'What does FCFS stand for?',
    '["First Come First Serve", "Fast CPU File System", "First Call First Signal", "File Control File System"]'::jsonb,
    'First Come First Serve',
    1
  );