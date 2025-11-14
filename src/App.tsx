import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages for better initial load performance
const Index = lazy(() => import("./pages/Index"));

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">404 - Page not found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
