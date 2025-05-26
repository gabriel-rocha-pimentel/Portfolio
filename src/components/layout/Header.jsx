
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Briefcase, Home, Info, Mail, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out
       ${isActive 
         ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' 
         : 'text-foreground/70 hover:text-primary hover:bg-primary/5 dark:text-foreground/60 dark:hover:text-primary dark:hover:bg-primary/10'
       }`
    }
  >
    {children}
  </NavLink>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Início', icon: <Home size={18} className="mr-1" /> },
    { path: '/sobre', label: 'Sobre Nós', icon: <Info size={18} className="mr-1" /> },
    { path: '/projetos', label: 'Projetos', icon: <Briefcase size={18} className="mr-1" /> },
    { path: '/contato', label: 'Contato', icon: <Mail size={18} className="mr-1" /> },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm dark:bg-background/70"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img  alt="Tech&Connect Logo" class="h-10 w-auto rounded-sm" src="https://images.unsplash.com/photo-1555617778-02518510b9fa?q=80&w=2070&auto=format&fit=crop" />
            </motion.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Tech&Connect
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <NavItem key={item.path} to={item.path}>
                <span className="flex items-center">{item.icon} {item.label}</span>
              </NavItem>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/login" className="flex items-center">
                  <UserCog size={16} className="mr-2" /> Admin
                </Link>
              </Button>
            </motion.div>
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden bg-background/95 dark:bg-background/90 absolute w-full shadow-lg pb-4"
        >
          <nav className="flex flex-col space-y-2 px-4 pt-2">
            {navItems.map(item => (
              <NavItem key={item.path} to={item.path} onClick={toggleMenu}>
                <span className="flex items-center">{item.icon} {item.label}</span>
              </NavItem>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pt-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/admin/login" onClick={toggleMenu} className="flex items-center justify-center">
                  <UserCog size={16} className="mr-2" /> Admin
                </Link>
              </Button>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
  