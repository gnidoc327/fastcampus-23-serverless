import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import {BrowserRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
