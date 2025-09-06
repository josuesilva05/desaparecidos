import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-2 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Logo/Brasão */}
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="https://desaparecidos.pjc.mt.gov.br/assets/img/pjc_logo.svg" alt="Brasão do Mato Grosso" className="w-12 h-12" />
          </div>
          
          {/* Texto */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Polícia Judiciária Civil</h1>
            <span className="text-sm text-gray-300">Estado de Mato Grosso</span>
          </div>
        </div>
        
        {/* Área adicional para navegação futura */}
        <nav className="hidden md:flex space-x-6">
          {/* Aqui você pode adicionar links de navegação no futuro */}
        </nav>
      </div>
    </header>
  );
};
