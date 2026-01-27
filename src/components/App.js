import React from 'react';
import { createGlobalStyle } from 'styled-components';
import '@react95/core/GlobalStyle';
import '@react95/core/themes/win95.css';
import { ClippyProvider } from '@react95/clippy';
import { Cursor } from '@react95/core';
import DataService from '../services/dataService';
import DataContext from '../contexts/dataContext';
import Desktop from './Desktop';

const dataService = new DataService();

const GlobalStyles = createGlobalStyle`
  body {
    font-size: 15px;
    background-color: #008080;
    margin: 0;
    padding: 0;
    overflow: hidden;
    touch-action: manipulation;
  }

  /* Fix for Clippy balloon misalignment */
  .clippy-balloon {
    box-sizing: content-box !important;
  }
  .clippy-balloon * {
    box-sizing: content-box !important;
  }
  
  .clippy-tip {
    box-sizing: content-box !important;
  }

  ${Cursor.Auto}
`;

const App = () => (
  <DataContext.Provider value={dataService}>
    <ClippyProvider>
      <GlobalStyles />
      <Desktop />
    </ClippyProvider>
  </DataContext.Provider>
);
export default App;
