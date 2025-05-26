
import React from 'react';
import SidebarAdmin from '@/components/shared/SidebarAdmin.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-muted/40 dark:bg-muted/20">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background dark:bg-background/80 backdrop-blur-sm border-b border-border/70 p-4 flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-semibold text-foreground"
          >
            Painel Administrativo
          </motion.h1>
          <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-500/10 hover:text-red-600">
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
  