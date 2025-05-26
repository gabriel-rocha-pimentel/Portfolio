import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext.jsx';
import { User, Mail, Lock, Save } from 'lucide-react';

const PerfilPage = () => {
  const { user, loading: authLoading, updateUser } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsProfileSubmitting(true);
    try {
      const updates = {
        data: { full_name: fullName },
      };
      if (email !== user.email) {
        updates.email = email; 
      }

      const { error } = await updateUser(updates);
      if (error) throw error;

      toast({
        title: "Perfil Atualizado!",
        description: "Suas informações de perfil foram salvas.",
      });
      if (email !== user.email) {
        toast({
          title: "Confirmação de Email Necessária",
          description: "Um email de confirmação foi enviado para o novo endereço.",
          variant: "default",
          duration: 7000,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao Atualizar Perfil",
        description: error.message || "Não foi possível salvar as informações.",
        variant: "destructive",
      });
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Erro",
        description: "As novas senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    if (!newPassword) {
        toast({
            title: "Erro",
            description: "A nova senha não pode estar vazia.",
            variant: "destructive",
        });
        return;
    }
    setIsPasswordSubmitting(true);
    try {
      const { error } = await updateUser({ password: newPassword });
      if (error) throw error;
      toast({
        title: "Senha Atualizada!",
        description: "Sua senha foi alterada com sucesso.",
      });
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast({
        title: "Erro ao Alterar Senha",
        description: error.message || "Não foi possível alterar a senha.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };
  
  if (authLoading && !user) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Informações Pessoais</CardTitle>
          <CardDescription>Atualize seu nome e email. A alteração de email requer confirmação.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
               <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" disabled={isProfileSubmitting}>
              {isProfileSubmitting ? 'Salvando...' : <><Save size={16} className="mr-2" /> Salvar Informações</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Alterar Senha</CardTitle>
          <CardDescription>Modifique sua senha de acesso.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Crie uma nova senha (mín. 6 caracteres)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" variant="outline" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? 'Alterando...' : <><Save size={16} className="mr-2" /> Alterar Senha</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerfilPage;