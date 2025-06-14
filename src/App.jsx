// App.jsx (ajuste na estrutura e importações)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/context/AuthContext';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBanner from '@/components/layout/WhatsAppBanner';

import HomePage from '@/pages/Home';
import SobrePage from '@/pages/Sobre';
import ProjetosPage from '@/pages/Projetos';
import ContatoPage from '@/pages/Contato';

import LoginPage from '@/pages/admin/Login';
import CriarUsuarioPage from '@/pages/admin/CriarUsuario';
import EsqueciSenhaPage from '@/pages/admin/EsqueciSenha';

import AdminLayout from '@/components/layout/AdminLayout';
import DashboardPage from '@/pages/admin/dashboard/Index';
import PerfilPage from '@/pages/admin/dashboard/Perfil';
import ConfiguracoesPage from '@/pages/admin/dashboard/Configuracoes';
import RedesSociaisPage from '@/pages/admin/dashboard/RedesSociais';
import AdminProjetosPage from '@/pages/admin/dashboard/Projetos';

// Proteção de rota para usuários autenticados
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/admin/login" replace />;
}

// Layout público com banner do WhatsApp
function MainLayout() {
  const [showWhatsAppBanner, setShowWhatsAppBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionStorage.getItem('whatsappBannerClosed') !== 'true') {
        setShowWhatsAppBanner(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseWhatsAppBanner = () => {
    setShowWhatsAppBanner(false);
    sessionStorage.setItem('whatsappBannerClosed', 'true');
  };

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/projetos" element={<ProjetosPage />} />
          <Route path="/contato" element={<ContatoPage />} />
        </Routes>
      </main>
      <WhatsAppBanner visible={showWhatsAppBanner} onClose={handleCloseWhatsAppBanner} />
      <Footer />
    </>
  );
}

// Rotas protegidas para o painel administrativo
function AdminDashboardRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
        <Route path="redes-sociais" element={<RedesSociaisPage />} />
        <Route path="projetos" element={<AdminProjetosPage />} />
      </Routes>
    </AdminLayout>
  );
}

// Aplicação principal
function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/*" element={<MainLayout />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/criar-usuario" element={<CriarUsuarioPage />} />
        <Route path="/admin/esqueci-senha" element={<EsqueciSenhaPage />} />
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute>
              <AdminDashboardRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
