import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { Building, Mail, Phone, Save } from 'lucide-react';

const SETTINGS_TABLE = 'settings'; // Nome da tabela no Supabase

const ConfiguracoesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [settingsId, setSettingsId] = useState(null); // Para armazenar o ID do registro de configurações
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from(SETTINGS_TABLE)
          .select('*')
          .limit(1) // Assumindo que haverá apenas um registro de configurações
          .single(); 

        if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
          throw error;
        }
        if (data) {
          setSettingsId(data.id);
          setCompanyName(data.company_name || '');
          setCompanyEmail(data.company_email || '');
          setCompanyPhone(data.company_phone || '');
        }
      } catch (error) {
        toast({
          title: "Erro ao Carregar Configurações",
          description: error.message || "Não foi possível buscar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [user, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    const settingsData = { 
      company_name: companyName, 
      company_email: companyEmail, 
      company_phone: companyPhone,
      updated_at: new Date().toISOString(), // Adiciona timestamp de atualização
    };

    try {
      let error;
      if (settingsId) {
        // Atualizar registro existente
        const { error: updateError } = await supabase
          .from(SETTINGS_TABLE)
          .update(settingsData)
          .eq('id', settingsId);
        error = updateError;
      } else {
        // Criar novo registro
        // settingsData.user_id = user.id; // Se quiser associar ao usuário
        const { data: insertData, error: insertError } = await supabase
          .from(SETTINGS_TABLE)
          .insert(settingsData)
          .select()
          .single();
        error = insertError;
        if (insertData) setSettingsId(insertData.id);
      }

      if (error) throw error;

      toast({
        title: "Configurações Salvas!",
        description: "As informações da empresa foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao Salvar Configurações",
        description: error.message || "Não foi possível salvar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-foreground">Configurações da Empresa</h1>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Informações da Empresa</CardTitle>
          <CardDescription>Edite os dados principais da sua empresa que serão exibidos no site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Nome da sua empresa"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="companyEmail">Email de Contato</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="companyEmail"
                  type="email"
                  placeholder="contato@suaempresa.com"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="companyPhone">Telefone de Contato</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="companyPhone"
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Salvando...' : <><Save size={16} className="mr-2" /> Salvar Configurações</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConfiguracoesPage;