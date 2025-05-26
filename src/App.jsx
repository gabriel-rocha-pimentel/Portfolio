
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';

import HomePage from '@/pages/Home.jsx';
import SobrePage from '@/pages/Sobre.jsx';
import ProjetosPage from '@/pages/Projetos.jsx';
import ContatoPage from '@/pages/Contato.jsx';

import LoginPage from '@/pages/admin/Login.jsx';
import CriarUsuarioPage from '@/pages/admin/CriarUsuario.jsx';
import EsqueciSenhaPage from '@/pages/admin/EsqueciSenha.jsx';

import AdminLayout from '@/components/layout/AdminLayout.jsx';
import DashboardPage from '@/pages/admin/dashboard/Index.jsx';
import PerfilPage from '@/pages/admin/dashboard/Perfil.jsx';
import ConfiguracoesPage from '@/pages/admin/dashboard/Configuracoes.jsx';
import RedesSociaisPage from '@/pages/admin/dashboard/RedesSociais.jsx';
import AdminProjetosPage from '@/pages/admin/dashboard/Projetos.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

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

function MainLayout() {
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
      <Footer />
    </>
  );
}

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