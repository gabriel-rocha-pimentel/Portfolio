import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, User, Settings, Share2, Briefcase, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end={to === "/admin/dashboard"}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
       ${isActive 
         ? 'bg-primary text-primary-foreground shadow-md' 
         : 'text-foreground/70 hover:bg-primary/10 hover:text-primary dark:text-foreground/60 dark:hover:bg-primary/20 dark:hover:text-primary'
       }`
    }
  >
    <Icon size={20} className="mr-3" />
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);

const SidebarAdmin = () => {
  const navItems = [
    { to: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/admin/dashboard/perfil', icon: User, label: 'Perfil' },
    { to: '/admin/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
    { to: '/admin/dashboard/redes-sociais', icon: Share2, label: 'Redes Sociais' },
    { to: '/admin/dashboard/projetos', icon: Briefcase, label: 'Projetos' },
  ];

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 bg-background dark:bg-background/80 border-r border-border/70 p-6 flex flex-col space-y-6 shadow-lg"
    >
      <Link to="/admin/dashboard" className="flex items-center space-x-2 mb-6">
        <img  alt="Tech&Connect Admin Logo" className="h-10 w-auto" src="https://images.unsplash.com/photo-1687288198686-a1bd07b331a2" />
        <span className="text-xl font-bold text-primary">Admin Panel</span>
      </Link>
      
      <nav className="flex-grow space-y-2">
        {navItems.map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="mt-auto">
        <Button variant="outline" asChild className="w-full">
          <Link to="/" className="flex items-center justify-center">
            <Home size={16} className="mr-2" />
            Voltar ao Site
          </Link>
        </Button>
      </div>
    </motion.aside>
  );
};

export default SidebarAdmin;