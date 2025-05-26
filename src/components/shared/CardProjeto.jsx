
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Tag } from 'lucide-react';

const CardProjeto = ({ title, description, image_url, technologies, github_url, live_url }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-card dark:bg-card/80 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out border border-border/50 glass-card"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img  
          src={image_url} 
          alt={`Imagem do projeto ${title}`} 
          class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-3 text-primary">{title}</h3>
        <p className="text-foreground/80 dark:text-foreground/70 text-sm mb-4 h-20 overflow-y-auto">
          {description}
        </p>

        <div className="mb-4">
          <p className="text-xs font-medium text-foreground/60 dark:text-foreground/50 mb-1 flex items-center">
            <Tag size={14} className="mr-1 text-primary/80" /> Tecnologias:
          </p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full dark:bg-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2 border-t border-border/30">
          {github_url && (
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <a href={github_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <Github size={16} className="mr-2" /> GitHub
              </a>
            </Button>
          )}
          {live_url && (
            <Button variant="default" size="sm" asChild className="w-full sm:w-auto">
              <a href={live_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <ExternalLink size={16} className="mr-2" /> Ver Online
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CardProjeto;
  