
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Eye, Zap, Award } from 'lucide-react';

const StatCard = ({ value, label, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.15 + 0.5, ease: "easeOut" }}
    className="bg-card dark:bg-card/80 p-6 rounded-xl shadow-lg text-center border border-border/50 glass-card"
  >
    <Icon className="mx-auto text-primary mb-3" size={36} />
    <p className="text-3xl font-bold text-foreground">{value}</p>
    <p className="text-sm text-foreground/70 dark:text-foreground/60">{label}</p>
  </motion.div>
);

const TeamMemberCard = ({ name, role, imageUrl, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: delay * 0.1 + 0.8, ease: "easeOut" }}
    className="bg-card dark:bg-card/80 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 border border-border/50 glass-card"
  >
    <img  
      src={imageUrl} 
      alt={`Foto de ${name}`} 
      class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary/50"
     src="https://images.unsplash.com/photo-1589442694956-9eaf242dd1fe" />
    <h4 className="text-xl font-semibold text-foreground">{name}</h4>
    <p className="text-primary">{role}</p>
  </motion.div>
);

const SobrePage = () => {
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
            Sobre a Tech&Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-foreground/80 dark:text-foreground/70 max-w-3xl mx-auto"
          >
            Somos uma equipe apaixonada por tecnologia, dedicada a criar soluções digitais que impulsionam negócios e transformam ideias em realidade. Nossa missão é conectar inovação, expertise e criatividade para entregar resultados excepcionais.
          </motion.p>
        </div>
      </motion.section>

      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <img  
              alt="Equipe Tech&Connect trabalhando em um projeto" 
              class="rounded-xl shadow-2xl w-full h-auto object-cover"
             src="https://images.unsplash.com/photo-1651009188116-bb5f80eaf6aa" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div>
              <Target className="text-primary mb-2" size={32} />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Nossa Missão</h2>
              <p className="text-foreground/70 dark:text-foreground/60">
                Fornecer soluções tecnológicas de vanguarda que capacitem nossos clientes a atingir seus objetivos de negócios, promovendo crescimento e inovação contínua.
              </p>
            </div>
            <div>
              <Eye className="text-primary mb-2" size={32} />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Nossa Visão</h2>
              <p className="text-foreground/70 dark:text-foreground/60">
                Ser reconhecida como líder em desenvolvimento de software, referência em qualidade, inovação e satisfação do cliente, construindo parcerias duradouras.
              </p>
            </div>
            <div>
              <Zap className="text-primary mb-2" size={32} />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Nossos Valores</h2>
              <ul className="list-disc list-inside text-foreground/70 dark:text-foreground/60 space-y-1">
                <li>Compromisso com a Excelência</li>
                <li>Inovação e Criatividade</li>
                <li>Transparência e Ética</li>
                <li>Colaboração e Trabalho em Equipe</li>
                <li>Foco no Cliente</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Nossos Números</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard value="5+" label="Projetos Entregues" icon={Award} delay={0} />
          <StatCard value="3+" label="Anos de Experiência" icon={Zap} delay={1} />
          <StatCard value="98%" label="Clientes Satisfeitos" icon={Users} delay={2} />
          <StatCard value="1000+" label="Cafés Consumidos" icon={Award} delay={3} />
        </div>
      </section>
      
      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Conheça Nossa Equipe</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <TeamMemberCard name="Gabriel Rocha" role="CEO & Lead Developer" imageUrl="placeholder_gabriel.jpg" delay={0} />
          {/*<TeamMemberCard name="Ana Silva" role="UX/UI Designer Chefe" imageUrl="placeholder_ana.jpg" delay={1} />*/}
          {/*<TeamMemberCard name="Carlos Pereira" role="Gerente de Projetos Sênior" imageUrl="placeholder_carlos.jpg" delay={2} />*/}
        </div>
      </section>
    </div>
  );
};

export default SobrePage;
  