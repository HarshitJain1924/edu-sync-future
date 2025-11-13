import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  password: z.string().min(1, 'Password is required').max(100, 'Password too long'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password too long'),
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
});

// Message validation schema
export const messageSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(1000, 'Message is too long (max 1000 characters)'),
});

// Room validation schema
export const roomSchema = z.object({
  name: z.string().trim().min(1, 'Room name is required').max(100, 'Room name is too long (max 100 characters)'),
  description: z.string().trim().max(500, 'Description is too long (max 500 characters)').optional(),
});

// Quiz/Flashcard validation schemas
export const quizQuestionSchema = z.object({
  question: z.string().trim().min(5, 'Question is too short (min 5 characters)').max(500, 'Question is too long (max 500 characters)'),
  options: z.array(z.string().trim().max(200, 'Option is too long (max 200 characters)')).min(2, 'At least 2 options required').max(10, 'Too many options (max 10)'),
  correctAnswer: z.string().trim().max(200, 'Answer is too long (max 200 characters)'),
});

export const flashcardSchema = z.object({
  question: z.string().trim().min(3, 'Question is too short (min 3 characters)').max(500, 'Question is too long (max 500 characters)'),
  answer: z.string().trim().min(1, 'Answer is required').max(500, 'Answer is too long (max 500 characters)'),
});

// Video note validation schema
export const videoNoteSchema = z.object({
  note_text: z.string().trim().min(1, 'Note cannot be empty').max(1000, 'Note is too long (max 1000 characters)'),
  timestamp_seconds: z.number().int().min(0, 'Invalid timestamp'),
});
