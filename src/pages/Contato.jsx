import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient.js';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactInfoCard = ({ icon: Icon, title, content, href, delay, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.15 + 0.5, ease: "easeOut" }}
    className="bg-card dark:bg-card/80 p-6 rounded-xl shadow-lg flex items-start space-x-4 border border-border/50 glass-card h-full"
  >
    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
      <Icon size={20} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {isLoading ? (
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse mt-1"></div>
      ) : content ? (
        href ? (
          <a href={href} className="text-sm text-primary hover:underline break-all">{content}</a>
        ) : (
          <p className="text-sm text-foreground/70 dark:text-foreground/60 break-all">{content}</p>
        )
      ) : (
        <p className="text-sm text-foreground/70 dark:text-foreground/60">Não disponível</p>
      )}
    </div>
  </motion.div>
);

const ContatoPage = () => {
  const { toast } = useToast();
  const [contactSettings, setContactSettings] = useState({
    email: '',
    phone: '',
    address: 'Escritório Remoto - Atendemos Globalmente',
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const fetchContactSettings = async () => {
      setIsLoadingSettings(true);
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('company_email, company_phone')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setContactSettings(prev => ({
            ...prev,
            email: data.company_email || '',
            phone: data.company_phone || '',
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar configurações de contato:", error);
        toast({
          title: "Erro ao carregar informações",
          description: "Não foi possível buscar os dados de contato.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchContactSettings();
  }, [toast]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactSettings.email) {
      toast({
        title: "Erro de Configuração",
        description: "O email de destino não está configurado. Contate o administrador.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: JSON.stringify({
          senderName: formData.name,
          senderEmail: formData.email,
          subject: formData.subject,
          message: formData.message,
          recipientEmail: contactSettings.email,
        }),
      });

      if (error) throw error;

      if (data && data.success) {
        toast({
          title: "Mensagem Enviada!",
          description: "Obrigado por entrar em contato. Responderemos em breve.",
          variant: "default",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data?.error || "Falha ao enviar email. Resposta da função desconhecida.");
      }

    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao Enviar Mensagem",
        description: error.message || "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold mb-4 text-primary"
          >
            Entre em Contato
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 max-w-2xl mx-auto"
          >
            Tem uma ideia, projeto ou apenas quer dizer olá? Adoraríamos ouvir de você! Preencha o formulário abaixo ou utilize um dos nossos canais de contato.
          </motion.p>
        </div>
      </motion.section>

      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <ContactInfoCard 
            icon={Mail} 
            title="Email" 
            content={contactSettings.email} 
            href={contactSettings.email ? `mailto:${contactSettings.email}` : undefined}
            delay={0} 
            isLoading={isLoadingSettings}
          />
          <ContactInfoCard 
            icon={Phone} 
            title="Telefone" 
            content={contactSettings.phone} 
            href={contactSettings.phone ? `tel:${contactSettings.phone.replace(/\D/g, '')}` : undefined}
            delay={1} 
            isLoading={isLoadingSettings}
          />
          <ContactInfoCard 
            icon={MapPin} 
            title="Endereço" 
            content={contactSettings.address} 
            delay={2} 
            isLoading={false} 
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          className="max-w-2xl mx-auto bg-card dark:bg-card/80 p-8 md:p-10 rounded-xl shadow-2xl border border-border/50 glass-card"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">Envie-nos uma Mensagem</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" type="text" placeholder="Seu nome" value={formData.name} onChange={handleInputChange} required className="mt-1 bg-background/50 dark:bg-background/30" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} required className="mt-1 bg-background/50 dark:bg-background/30" />
            </div>
            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input id="subject" type="text" placeholder="Assunto da mensagem" value={formData.subject} onChange={handleInputChange} required className="mt-1 bg-background/50 dark:bg-background/30" />
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" placeholder="Sua mensagem..." rows={5} value={formData.message} onChange={handleInputChange} required className="mt-1 bg-background/50 dark:bg-background/30" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isLoadingSettings}>
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
              ) : (
                <Send size={18} className="mr-2" />
              )}
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default ContatoPage;