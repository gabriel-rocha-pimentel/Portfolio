import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Lightbulb, Users } from 'lucide-react';
import CardProjeto from '@/components/shared/CardProjeto.jsx';
import { supabase } from '@/lib/supabaseClient.js';
import { useToast } from "@/components/ui/use-toast";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.2 + 0.5, ease: "easeOut" }}
    className="bg-card dark:bg-card/80 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border/50 glass-card h-full"
  >
    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
    <p className="text-foreground/70 dark:text-foreground/60 text-sm">{description}</p>
  </motion.div>
);

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3); 

        if (error) throw error;
        setFeaturedProjects(data || []);
      } catch (error) {
        console.error("Erro ao buscar projetos em destaque:", error);
        toast({
          title: "Erro ao carregar projetos",
          description: "Não foi possível buscar os projetos em destaque.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchFeaturedProjects();
  }, [toast]);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 rounded-xl"
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
          >
            Bem-vindo à Tech&Connect
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 max-w-2xl mx-auto mb-10"
          >
            Transformamos ideias em soluções digitais inovadoras. Conectamos tecnologia e criatividade para impulsionar o seu sucesso.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="space-x-4"
          >
            <Button size="lg" asChild>
              <Link to="/projetos">
                Nossos Projetos <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contato">Fale Conosco</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <section className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          Por que nos escolher?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Zap} 
            title="Inovação Constante" 
            description="Buscamos as últimas tendências e tecnologias para oferecer soluções de ponta."
            delay={0}
          />
          <FeatureCard 
            icon={Lightbulb} 
            title="Soluções Criativas" 
            description="Pensamos fora da caixa para resolver seus desafios de forma única e eficaz."
            delay={1}
          />
          <FeatureCard 
            icon={Users} 
            title="Parceria Estratégica" 
            description="Trabalhamos lado a lado com nossos clientes para alcançar resultados extraordinários."
            delay={2}
          />
        </div>
      </section>

      <section className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          Projetos em Destaque
        </motion.h2>
        {isLoadingProjects ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="bg-card dark:bg-card/80 rounded-xl shadow-lg p-6 animate-pulse glass-card">
                <div className="h-56 w-full bg-muted rounded-md mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-1"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <CardProjeto key={project.id || index} {...project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">Nenhum projeto em destaque no momento.</p>
        )}
        <motion.div 
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild>
            <Link to="/projetos">
              Ver Todos os Projetos <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-12 bg-primary/5 dark:bg-primary/10 rounded-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-primary">Pronto para começar seu próximo projeto?</h2>
          <p className="text-lg text-foreground/80 dark:text-foreground/70 mb-8 max-w-xl mx-auto">
            Vamos conversar sobre suas ideias e como podemos ajudá-lo a transformá-las em realidade.
          </p>
          <Button size="lg" asChild>
            <Link to="/contato">
              Entre em Contato <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;