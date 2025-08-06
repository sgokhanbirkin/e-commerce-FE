import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Providers } from './components/Providers';
import { Basket } from './components/Basket';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Basket />
    </Providers>
  </StrictMode>
);
