import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CardProjeto from '@/components/shared/CardProjeto.jsx';
import { Button } from '@/components/ui/button';
import { Filter, Search, ListX } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { supabase } from '@/lib/supabaseClient.js';
import { useToast } from "@/components/ui/use-toast";

const categories = ["Todos", "Web", "Mobile", "Data Science", "IA", "IoT", "UX Design", "Outros"];

const ProjetosPage = () => {
  const [allProjectsData, setAllProjectsData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const projectsWithCategory = data.map(p => ({
          ...p,
          // Heurística simples para categoria baseada em tecnologias, pode ser melhorado
          // Se não houver tecnologias ou nenhuma corresponder, categoriza como 'Outros'
          category: p.technologies?.some(t => t.toLowerCase().includes("react native") || t.toLowerCase().includes("mobile") || t.toLowerCase().includes("swift") || t.toLowerCase().includes("kotlin") || t.toLowerCase().includes("unity")) ? "Mobile" 
                  : p.technologies?.some(t => t.toLowerCase().includes("python") || t.toLowerCase().includes("data science") || t.toLowerCase().includes("machine learning") || t.toLowerCase().includes("tensorflow")) ? "Data Science"
                  : p.technologies?.some(t => t.toLowerCase().includes("ai") || t.toLowerCase().includes("inteligência artificial")) ? "IA"
                  : p.technologies?.some(t => t.toLowerCase().includes("iot") || t.toLowerCase().includes("arduino") || t.toLowerCase().includes("raspberry pi")) ? "IoT"
                  : p.technologies?.some(t => t.toLowerCase().includes("ux") || t.toLowerCase().includes("ui") || t.toLowerCase().includes("figma")) ? "UX Design"
                  : p.technologies?.some(t => t.toLowerCase().includes("react") || t.toLowerCase().includes("angular") || t.toLowerCase().includes("vue") || t.toLowerCase().includes("node") || t.toLowerCase().includes("web")) ? "Web"
                  : "Outros"
        }));
        
        setAllProjectsData(projectsWithCategory || []);
        setFilteredProjects(projectsWithCategory || []);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        toast({
          title: "Erro ao carregar projetos",
          description: "Não foi possível buscar os projetos do banco de dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [toast]);

  const applyFilters = (category, term) => {
    let projects = category === "Todos" 
      ? allProjectsData 
      : allProjectsData.filter(p => p.category === category);
    
    if (term) {
      const lowerTerm = term.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(lowerTerm) ||
        (p.description && p.description.toLowerCase().includes(lowerTerm)) ||
        (p.technologies && p.technologies.some(t => t.toLowerCase().includes(lowerTerm)))
      );
    }
    setFilteredProjects(projects);
  };
  
  const handleFilterCategory = (category) => {
    setActiveCategory(category);
    applyFilters(category, searchTerm);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(activeCategory, term);
  };

  return (
    <div className="space-y-12 md:space-y-16 pb-16">
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
            Nossos Projetos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 max-w-2xl mx-auto"
          >
            Explore uma seleção de projetos que demonstram nossa paixão por tecnologia e nosso compromisso com a excelência e inovação.
          </motion.p>
        </div>
      </motion.section>

      <section className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card dark:bg-card/80 rounded-lg shadow border border-border/50 glass-card"
        >
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Buscar projetos por título, descrição ou tecnologia..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full bg-background/50 dark:bg-background/30"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
            <Filter size={20} className="text-primary mr-2 shrink-0" />
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterCategory(category)}
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
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
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <CardProjeto key={project.id || index} {...project} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-foreground/70 dark:text-foreground/60 py-10 flex flex-col items-center"
          >
            <ListX size={48} className="mb-4 text-primary/50" />
            <p className="text-xl">Nenhum projeto encontrado.</p>
            <p className="text-sm">Tente ajustar seus filtros ou termo de busca.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default ProjetosPage;