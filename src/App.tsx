import React from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import Routes from "./routes/routes";
import { Toaster } from 'react-hot-toast';
const App = () => {
  return (
    <BrowserRouter>
      <Routes />
      <Toaster/>
    </BrowserRouter>
  );
}
export default App;
