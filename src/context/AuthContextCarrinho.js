import React, { createContext, useState } from 'react';

export const AuthUserContext = createContext({});

export const AuthUserProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (item) => {
    setCarrinho(prevCarrinho => [...prevCarrinho, item]);
  };

  const removerDoCarrinho = (index) => {
    setCarrinho(prevCarrinho => {
      const novoCarrinho = [...prevCarrinho];
      novoCarrinho.splice(index, 1);
      return novoCarrinho;
    });
  };

  return (
    <AuthUserContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho }}>
      {children}
    </AuthUserContext.Provider>
  );
};
