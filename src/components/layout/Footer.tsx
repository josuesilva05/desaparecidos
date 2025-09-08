import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0c0d18] border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-gray-600 dark:text-gray-400">
              Sistema desenvolvido para ajudar famílias a encontrarem seus
              entes queridos
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Se você tem informações sobre alguma pessoa desaparecida, entre
            em contato: <strong>(65) 3901-4839 (1ª DP - CENTRO DE CUIABÁ)</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
