import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext.jsx';
import { UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';

const CriarUsuarioPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Erro de Validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUp(email, password, { data: { full_name: fullName } });
      if (error) {
        throw error;
      }
      toast({
        title: "Conta Criada!",
        description: "Verifique seu email para confirmar a conta. Após a confirmação, faça login.",
        variant: "default",
      });
      navigate('/admin/login');
    } catch (error) {
      toast({
        title: "Erro ao Criar Conta",
        description: error.message || "Não foi possível criar a conta. Tente novamente.",
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
          <h1 className="text-3xl font-bold text-primary">Criar Conta Admin</h1>
          <p className="text-foreground/70 dark:text-foreground/60">Crie uma nova conta de administrador.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="fullName">Nome Completo</Label>
            <div className="relative mt-1">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="pl-10 bg-background/50 dark:bg-background/30"
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
                className="pl-10 bg-background/50 dark:bg-background/30"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha forte (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 bg-background/50 dark:bg-background/30"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <UserPlus size={18} className="mr-2" /> Criar Conta
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground/70 dark:text-foreground/60">
          Já tem uma conta?{' '}
          <Link to="/admin/login" className="font-medium text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default CriarUsuarioPage;