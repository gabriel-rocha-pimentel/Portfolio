import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext.jsx';
import { Mail, Send, ArrowLeft } from 'lucide-react';

const EsqueciSenhaPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        throw error;
      }
      toast({
        title: "Email Enviado!",
        description: "Se uma conta existir para este email, você receberá instruções para redefinir sua senha.",
        variant: "default",
      });
      // Não redirecionar imediatamente, o usuário precisa checar o email.
      // navigate('/admin/login'); 
    } catch (error) {
      toast({
        title: "Erro ao Redefinir Senha",
        description: error.message || "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-card dark:bg-card/90 p-8 rounded-xl shadow-2xl border border-border/50 glass-card"
      >
        <div className="text-center mb-8">
          <img  alt="Tech&Connect Admin Logo" class="h-12 w-auto mx-auto mb-4" src="https://images.unsplash.com/photo-1687288198686-a1bd07b331a2" />
          <h1 className="text-3xl font-bold text-primary">Redefinir Senha</h1>
          <p className="text-foreground/70 dark:text-foreground/60">Insira seu email para receber o link de redefinição.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="pl-10 bg-background/50 dark:bg-background/30"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground"></div>
            ) : (
              <>
                <Send size={18} className="mr-2" /> Enviar Link de Redefinição
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm">
          <Link to="/admin/login" className="font-medium text-primary hover:underline flex items-center justify-center">
            <ArrowLeft size={16} className="mr-1" /> Voltar para o Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default EsqueciSenhaPage;