// WhatsAppBanner.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const WhatsAppBanner = ({ visible, onClose }) => {
  const whatsappLink =
    'https://wa.me/5538991284050?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Tech%20Connect.';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 z-[99] p-4 md:p-0"
        >
          <div
            className={cn(
              'bg-card shadow-xl rounded-xl p-4 md:p-5 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 w-full md:max-w-md',
              'bg-gradient-to-r from-green-500 to-teal-500 text-white'
            )}
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
              <div>
                <p className="font-bold text-base md:text-lg leading-tight">
                  Fale com um especialista!
                </p>
                <p className="text-xs md:text-sm opacity-90">
                  Tire suas dúvidas e peça seu orçamento.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="default"
                size="sm"
                className="bg-white text-green-600 hover:bg-white/90 flex-grow sm:flex-grow-0 whitespace-nowrap"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Conversar Agora
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 md:h-9 md:w-9"
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppBanner;
