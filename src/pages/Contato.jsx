import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient.js";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import emailjs from "@emailjs/browser";

const readEnv = (viteKey, nextKey) => {
  /* global import.meta */
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[viteKey]) {
    return import.meta.env[viteKey];
  }
  if (typeof process !== "undefined" && process.env && process.env[nextKey]) {
    return process.env[nextKey];
  }
  return undefined;
};

const ENV = {
  SERVICE_ID: readEnv("VITE_EMAILJS_SERVICE_ID", "NEXT_PUBLIC_EMAILJS_SERVICE_ID"),
  TEMPLATE_ID: readEnv("VITE_EMAILJS_TEMPLATE_ID", "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID"),
  PUBLIC_KEY: readEnv("VITE_EMAILJS_PUBLIC_KEY", "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"),
};

// -----------------------------------------------------------------------------
// SUB‑COMPONENTE: CARD DE INFO
// -----------------------------------------------------------------------------
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
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse mt-1" />
      ) : content ? (
        href ? (
          <a href={href} className="text-sm text-primary hover:underline break-all">
            {content}
          </a>
        ) : (
          <p className="text-sm text-foreground/70 dark:text-foreground/60 break-all">{content}</p>
        )
      ) : (
        <p className="text-sm text-foreground/70 dark:text-foreground/60">Não disponível</p>
      )}
    </div>
  </motion.div>
);

// -----------------------------------------------------------------------------
// PÁGINA DE CONTATO
// -----------------------------------------------------------------------------
const ContatoPage = () => {
  const { toast } = useToast();

  const [contactSettings, setContactSettings] = useState({
    email: "",
    phone: "",
    address: "Escritório Remoto – Atendemos Globalmente",
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  // ---------------------------------------------------------------------------
  // FETCH SUPABASE SETTINGS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      setIsLoadingSettings(true);
      try {
        const { data, error } = await supabase.from("settings").select("company_email, company_phone").single();
        if (error && error.code !== "PGRST116") throw error;
        if (data) {
          setContactSettings(prev => ({
            ...prev,
            email: data.company_email || "",
            phone: data.company_phone || "",
          }));
        }
      } catch (err) {
        console.error("Supabase settings error:", err);
        toast({ title: "Erro ao carregar informações", description: "Não foi possível buscar dados de contato.", variant: "destructive" });
      } finally {
        setIsLoadingSettings(false);
      }
    })();
  }, [toast]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateForm = useCallback(() => {
    const { name, email, subject, message } = formData;
    // Regex muito simples para email; ajuste se quiser mais estrito
    const emailRegex = /.+@.+\..+/;
    if (!name || !email || !subject || !message) return "Preencha todos os campos.";
    if (!emailRegex.test(email)) return "Email inválido.";
    return undefined;
  }, [formData]);

  const handleSubmit = async e => {
    e.preventDefault();

    // Validação de front‑end
    const validationError = validateForm();
    if (validationError) {
      toast({ title: "Erro de Validação", description: validationError, variant: "destructive" });
      return;
    }

    // Verificar credenciais do EmailJS
    if (!ENV.SERVICE_ID || !ENV.TEMPLATE_ID || !ENV.PUBLIC_KEY) {
      toast({ title: "Configuração ausente", description: "Credenciais do EmailJS não configuradas.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        ENV.SERVICE_ID,
        ENV.TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: contactSettings.email, // se o template requer
        },
        ENV.PUBLIC_KEY,
      );

      toast({ title: "Mensagem enviada!", description: "Obrigado pelo contato – responderemos em breve.", variant: "default" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      toast({ title: "Falha no envio", description: err?.text || "Não foi possível enviar sua mensagem.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* HERO */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">
            Entre em Contato
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 max-w-2xl mx-auto">
            Tem um projeto ou dúvida? Preencha o formulário ou use um dos canais abaixo.
          </motion.p>
        </div>
      </motion.section>

      {/* INFO CARDS */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <ContactInfoCard icon={Mail} title="Email" content={contactSettings.email} href={contactSettings.email ? `mailto:${contactSettings.email}` : undefined} delay={0} isLoading={isLoadingSettings} />
          <ContactInfoCard icon={Phone} title="Telefone" content={contactSettings.phone} href={contactSettings.phone ? `tel:${contactSettings.phone.replace(/\D/g, "")}` : undefined} delay={1} isLoading={isLoadingSettings} />
          <ContactInfoCard icon={MapPin} title="Endereço" content={contactSettings.address} delay={2} isLoading={false} />
        </div>

        {/* FORM */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="max-w-2xl mx-auto bg-card dark:bg-card/80 p-8 md:p-10 rounded-xl shadow-2xl border border-border/50 glass-card">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">Envie sua mensagem</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="Seu nome" value={formData.name} onChange={handleInputChange} required className="mt-1 bg-background/50 dark:bg-background/30" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="voce@exemplo.com" value={formData.email} onChange={handleInputChange} required className="mt-1 bg-background/50 dark:bg-background/30" />
            </div>
            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input id="subject" placeholder="Assunto" value={formData.subject} onChange={handleInputChange} required className="mt-1 bg-background/50 dark:bg-background/30" />
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" placeholder="Sua mensagem" rows={5} value={formData.message} onChange={handleInputChange} required className="mt-1 bg-background/50 dark:bg-background/30" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isLoadingSettings}>
              {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2" /> : <Send size={18} className="mr-2" />}
              {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
            </Button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default ContatoPage;
