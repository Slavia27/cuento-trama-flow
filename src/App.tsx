
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Index from "./pages/Index";
import FormularioPage from "./pages/FormularioPage";
import AdminPage from "./pages/AdminPage";
import ComoFuncionaPage from "./pages/ComoFuncionaPage";
import GraciasPage from "./pages/GraciasPage";
import OpcionesPage from "./pages/OpcionesPage";
import PagarPage from "./pages/PagarPage";
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
          <Route path="/formulario" element={<FormularioPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/como-funciona" element={<ComoFuncionaPage />} />
          <Route path="/gracias" element={<GraciasPage />} />
          <Route path="/opciones/:requestId" element={<OpcionesPage />} />
          <Route path="/pagar" element={<PagarPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
