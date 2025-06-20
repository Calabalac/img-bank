
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Library from "./pages/Library";
import ImageView from "./pages/ImageView";
import Auth from "./pages/Auth";
import About from "./pages/About";
import AdminPanel from "./pages/AdminPanel";
import Features from "./pages/Features";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import UploadPage from "./pages/Upload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/library" element={<Library />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/:filename" element={<ImageView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
