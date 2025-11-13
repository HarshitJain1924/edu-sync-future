import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StudyRooms from "./pages/StudyRooms";
import StudyRoom from "./pages/StudyRoom";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Games from "./pages/Games";
import GameTemplate from "./pages/games/GameTemplate";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RoomManagement from "./pages/admin/RoomManagement";
import ContentModeration from "./pages/admin/ContentModeration";
import PlatformAnalytics from "./pages/admin/PlatformAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study-rooms" element={<StudyRooms />} />
          <Route path="/study-room/:roomId" element={<StudyRoom />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:gameId" element={<GameTemplate />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/rooms" element={<RoomManagement />} />
          <Route path="/admin/content" element={<ContentModeration />} />
          <Route path="/admin/analytics" element={<PlatformAnalytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
