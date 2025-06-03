import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
const App1 = () => {
  return (
    <div>
      <AppRoutes/>
      hello from app123
    </div>
  );
};
export default App;
