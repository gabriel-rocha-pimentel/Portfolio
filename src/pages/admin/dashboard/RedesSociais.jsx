import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { Linkedin, Github, Instagram, Youtube, Globe, Save } from 'lucide-react';

const SOCIAL_LINKS_TABLE = 'social_links';

const socialFieldsConfig = [
  { id: 'instagram', label: 'Instagram URL', icon: Instagram, placeholder: 'https://instagram.com/seuusuario', db_column: 'instagram' },
  { id: 'linkedin', label: 'LinkedIn URL', icon: Linkedin, placeholder: 'https://linkedin.com/in/seuusuario', db_column: 'linkedin' },
  { id: 'github', label: 'GitHub URL', icon: Github, placeholder: 'https://github.com/seuusuario', db_column: 'github' },
  { id: 'youtube', label: 'YouTube URL', icon: Youtube, placeholder: 'https://youtube.com/c/seucanal', db_column: 'youtube' },
  { id: 'whatsapp', label: 'WhatsApp Link (API)', icon: Globe, placeholder: 'https://wa.me/55XXXXXXXXXXX', db_column: 'whatsapp' },
];

const RedesSociaisPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [linksId, setLinksId] = useState(null);
  const [socialLinks, setSocialLinks] = useState(
    socialFieldsConfig.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from(SOCIAL_LINKS_TABLE)
          .select('*')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setLinksId(data.id);
          const fetchedLinks = {};
          socialFieldsConfig.forEach(field => {
            fetchedLinks[field.id] = data[field.db_column] || '';
          });
          setSocialLinks(fetchedLinks);
        }
      } catch (error) {
        toast({
          title: "Erro ao Carregar Links",
          description: error.message || "Não foi possível buscar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSocialLinks();
  }, [user, toast]);

  const handleChange = (id, value) => {
    setSocialLinks(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    const linksToSave = {};
    socialFieldsConfig.forEach(field => {
      linksToSave[field.db_column] = socialLinks[field.id];
    });
    linksToSave.updated_at = new Date().toISOString();

    try {
      let error;
      if (linksId) {
        const { error: updateError } = await supabase
          .from(SOCIAL_LINKS_TABLE)
          .update(linksToSave)
          .eq('id', linksId);
        error = updateError;
      } else {
        // linksToSave.user_id = user.id; // Se quiser associar ao usuário
        const { data: insertData, error: insertError } = await supabase
          .from(SOCIAL_LINKS_TABLE)
          .insert(linksToSave)
          .select()
          .single();
        error = insertError;
        if (insertData) setLinksId(insertData.id);
      }

      if (error) throw error;

      toast({
        title: "Links Salvos!",
        description: "Os links das redes sociais foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao Salvar Links",
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
      <h1 className="text-3xl font-bold text-foreground">Redes Sociais</h1>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Links das Redes Sociais</CardTitle>
          <CardDescription>Adicione ou edite os links das suas redes sociais que aparecerão no site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {socialFieldsConfig.map(field => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <div className="relative mt-1">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id={field.id}
                    type="url"
                    placeholder={field.placeholder}
                    value={socialLinks[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            ))}
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Salvando...' : <><Save size={16} className="mr-2" /> Salvar Links</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RedesSociaisPage;