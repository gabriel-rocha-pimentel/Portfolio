// src/components/shared/CardProjeto.jsx

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Tag } from 'lucide-react';
import placeholderImg from '@/assets/placeholder.png'; // imagem genérica local

const CardProjeto = React.memo(function CardProjeto({
  title,
  description = '',
  image_url = placeholderImg,
  technologies = [],
  github_url = null,
  live_url = null
}) {
  // 1) Normaliza `technologies` para sempre ser um array de strings
  const techs = useMemo(() => {
    if (Array.isArray(technologies)) {
      return technologies;
    }
    if (typeof technologies === 'string') {
      return technologies.split(',').map((t) => t.trim());
    }
    return [];
  }, [technologies]);

  // 2) Define a fonte da imagem
  const imgSrc = image_url || placeholderImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group bg-card dark:bg-card/80 rounded-xl shadow-lg overflow-hidden
                 hover:shadow-2xl transition-shadow duration-300 ease-in-out
                 border border-border/50 glass-card"
      role="region"
      aria-labelledby={`card-${title}`}
    >
      {/* Imagem do projeto */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imgSrc}
          alt={title ? `Screenshot do projeto ${title}` : 'Screenshot de projeto'}
          className="w-full h-full object-cover transition-transform duration-500
                     ease-in-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = placeholderImg;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Conteúdo textual */}
      <div className="p-6">
        <h3 id={`card-${title}`} className="text-2xl font-semibold mb-3 text-primary">
          {title}
        </h3>
        {description && (
          <p className="text-foreground/80 dark:text-foreground/70 text-sm mb-4
                        max-h-20 overflow-y-auto">
            {description}
          </p>
        )}

        {/* Lista de tecnologias */}
        {techs.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground/60 dark:text-foreground/50 mb-1 flex items-center">
              <Tag size={14} className="mr-1 text-primary/80" /> Tecnologias:
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Tecnologias usadas">
              {techs.map((tech, idx) => (
                <li
                  key={idx}
                  className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full dark:bg-primary/20"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links de ação */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2
                        border-t border-border/30">
          {github_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full sm:w-auto"
              aria-label={`Ver código fonte de ${title} no GitHub`}
            >
              <a href={github_url} target="_blank" rel="noopener noreferrer">
                <Github size={16} className="mr-2" /> GitHub
              </a>
            </Button>
          )}
          {live_url && (
            <Button
              variant="default"
              size="sm"
              asChild
              className="w-full sm:w-auto"
              aria-label={`Ver projeto ${title} online`}
            >
              <a href={live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="mr-2" /> Ver Online
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

CardProjeto.propTypes = {
  title:        PropTypes.string.isRequired,
  description:  PropTypes.string,
  image_url:    PropTypes.string,
  technologies: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]),
  github_url:   PropTypes.string,
  live_url:     PropTypes.string
};

export default CardProjeto;
