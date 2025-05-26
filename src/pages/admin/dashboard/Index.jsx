import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Briefcase, Settings, Activity, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from "@/components/ui/use-toast";

const StatCard = ({ title, value, icon: Icon, color, delay, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
  >
    <Card className="hover:shadow-lg transition-shadow duration-300 glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground/80">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color || 'text-primary'}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 bg-muted rounded w-1/2 animate-pulse my-1"></div>
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">Total no sistema</p>
      </CardContent>
    </Card>
  </motion.div>
);


const DashboardPage = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setIsLoadingStats(true);
      try {
        const { count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        if (projectsError) throw projectsError;
        setTotalProjects(projectsCount || 0);

        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('company_name')
          .limit(1)
          .single();
        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
        setCompanyName(settingsData?.company_name || 'Sua Empresa');

      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível buscar as estatísticas do painel.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [user, toast]);


  return (
    <div className="space-y-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl font-bold text-foreground"
      >
        Visão Geral - {isLoadingStats ? "Carregando..." : companyName}
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total de Projetos" value={totalProjects} icon={Briefcase} color="text-blue-500" delay={0} isLoading={isLoadingStats} />
        <StatCard title="Configurações" value="Gerenciar" icon={Settings} color="text-yellow-500" delay={1} isLoading={isLoadingStats} />
        <StatCard title="Redes Sociais" value="Atualizar" icon={LinkIcon} color="text-purple-500" delay={2} isLoading={isLoadingStats} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <Card className="h-full glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <ul className="space-y-3">
                  <li className="h-4 bg-muted rounded w-full animate-pulse"></li>
                  <li className="h-4 bg-muted rounded w-5/6 animate-pulse"></li>
                  <li className="h-4 bg-muted rounded w-3/4 animate-pulse"></li>
                </ul>
              ) : (
                <ul className="space-y-3 text-sm text-foreground/80">
                  <li><span className="font-semibold text-primary">Novo projeto</span> pode ter sido adicionado.</li>
                  <li>Verifique as configurações de contato.</li>
                  <li>Seu <span className="font-semibold text-primary">perfil de usuário</span> está atualizado?</li>
                  <li>Links de redes sociais foram checados.</li>
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        >
          <Card className="h-full glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Links Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/80">Acesse rapidamente as seções mais importantes:</p>
              <ul className="list-disc list-inside text-primary space-y-1">
                <li><a href="/admin/dashboard/projetos" className="hover:underline">Gerenciar Projetos</a></li>
                <li><a href="/admin/dashboard/configuracoes" className="hover:underline">Editar Configurações da Empresa</a></li>
                <li><a href="/admin/dashboard/redes-sociais" className="hover:underline">Atualizar Redes Sociais</a></li>
                <li><a href="/admin/dashboard/perfil" className="hover:underline">Editar Meu Perfil</a></li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-primary/80 to-purple-500/80 p-6 rounded-lg shadow-lg text-center text-primary-foreground"
      >
        <h3 className="text-xl font-semibold mb-2">Bem-vindo ao Painel {isLoadingStats ? "" : companyName}!</h3>
        <p className="text-sm">Gerencie todo o conteúdo do seu site de forma fácil e intuitiva.</p>
      </motion.div>

    </div>
  );
};

export default DashboardPage;