import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient.js';
import { Github, Linkedin, Instagram, Youtube, Phone, Mail, Globe } from 'lucide-react';

const SocialIcon = ({ type }) => {
  switch (type) {
    case 'github': return <Github size={24} />;
    case 'linkedin': return <Linkedin size={24} />;
    case 'instagram': return <Instagram size={24} />;
    case 'youtube': return <Youtube size={24} />;
    case 'whatsapp': return <Globe size={24} />; // Using Globe for WhatsApp as it's a link
    default: return <Globe size={24} />;
  }
};

const SocialLink = ({ href, type, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2, color: 'hsl(var(--primary))' }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="text-foreground/70 hover:text-primary dark:text-foreground/60 dark:hover:text-primary"
    aria-label={label}
  >
    <SocialIcon type={type} />
  </motion.a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [companyInfo, setCompanyInfo] = useState({ name: 'Tech&Connect', email: '', phone: '' });
  const [socialLinks, setSocialLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('company_name, company_email, company_phone')
          .limit(1)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
        if (settingsData) {
          setCompanyInfo({
            name: settingsData.company_name || 'Tech&Connect',
            email: settingsData.company_email || '',
            phone: settingsData.company_phone || '',
          });
        }

        const { data: socialData, error: socialError } = await supabase
          .from('social_links')
          .select('*')
          .limit(1)
          .single();
        
        if (socialError && socialError.code !== 'PGRST116') throw socialError;
        if (socialData) {
          const formattedLinks = Object.entries(socialData)
            .filter(([key, value]) => value && ['instagram', 'linkedin', 'github', 'whatsapp', 'youtube'].includes(key))
            .map(([key, value]) => ({
              href: value,
              type: key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
            }));
          setSocialLinks(formattedLinks);
        }

      } catch (error) {
        console.error("Erro ao buscar dados para o rodapé:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  const contactItems = [
    ...(companyInfo.email ? [{ icon: Mail, text: companyInfo.email, href: `mailto:${companyInfo.email}` }] : []),
    ...(companyInfo.phone ? [{ icon: Phone, text: companyInfo.phone, href: `tel:${companyInfo.phone.replace(/\D/g, '')}` }] : []),
  ];


  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-muted/50 dark:bg-muted/20 py-12 border-t border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img  alt="Tech&Connect Logo Small" className="h-8 w-auto" src="https://images.unsplash.com/photo-1695480497603-381a2bee1c05" />
              <span className="text-xl font-semibold text-foreground">{isLoading ? 'Carregando...' : companyInfo.name}</span>
            </Link>
            <p className="text-sm text-foreground/70 dark:text-foreground/60">
              Desenvolvendo o futuro da tecnologia, conectando ideias e soluções inovadoras.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-4">Links Rápidos</p>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="text-sm text-foreground/70 hover:text-primary dark:text-foreground/60 dark:hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/projetos" className="text-sm text-foreground/70 hover:text-primary dark:text-foreground/60 dark:hover:text-primary transition-colors">Projetos</Link></li>
              <li><Link to="/contato" className="text-sm text-foreground/70 hover:text-primary dark:text-foreground/60 dark:hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/admin/login" className="text-sm text-foreground/70 hover:text-primary dark:text-foreground/60 dark:hover:text-primary transition-colors">Área Admin</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-4">Contato</p>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
              </div>
            ) : (
              <ul className="space-y-2">
                {contactItems.map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-foreground/70 dark:text-foreground/60">
                    <item.icon size={16} className="mr-2 text-primary" />
                    <a href={item.href} className="hover:text-primary transition-colors">{item.text}</a>
                  </li>
                ))}
                {contactItems.length === 0 && <li className="text-sm text-foreground/70 dark:text-foreground/60">Informações de contato não disponíveis.</li>}
              </ul>
            )}
            
            {isLoading && socialLinks.length === 0 ? (
                <div className="flex space-x-4 mt-6">
                    <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
            ) : socialLinks.length > 0 && (
              <div className="flex space-x-4 mt-6">
                {socialLinks.map(link => (
                  <SocialLink key={link.label} href={link.href} type={link.type} label={link.label} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 text-center">
          <p className="text-sm text-foreground/60 dark:text-foreground/50">
            &copy; {currentYear} {isLoading ? 'Tech&Connect' : companyInfo.name}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-foreground/50 dark:text-foreground/40 mt-1">
            Desenvolvido com ❤️ por Gabriel Rocha & Hostinger Horizons
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;