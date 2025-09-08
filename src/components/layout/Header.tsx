import React from 'react';

const navigateToHome = () => {
  window.location.href = '/';
};

export const Header: React.FC = () => {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-2 py-2 flex items-center justify-between">
        <div onClick={navigateToHome} className="flex items-center space-x-3 select-none">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="https://desaparecidos.pjc.mt.gov.br/assets/img/pjc_logo.svg" alt="Brasão do Mato Grosso" className="w-12 h-12" />
          </div>
          <div  className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Polícia Judiciária Civil</h1>
            <span className="text-sm text-gray-300">Estado de Mato Grosso</span>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <h1 className="text-xl font-bold text-white">ABITUS - Desaparecidos</h1>
        </nav>
      </div>
    </header>
  );
};
