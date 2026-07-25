import React, { useCallback, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import '@react95/core/GlobalStyle';
import '@react95/core/themes/win95.css';
import { ClippyProvider } from '@react95/clippy';
import { Cursor } from '@react95/core';
import DataService from '../services/dataService';
import DataContext from '../contexts/dataContext';
import { WindowProvider } from '../contexts/windowContext';
import Desktop from './Desktop';
import BiosShutdownOverlay from './BiosShutdownOverlay';

const dataService = new DataService();

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Fixedsys Excelsior';
    src: url('/fonts/fixedsys-excelsior.ttf') format('truetype');
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }

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

  @media (max-width: 850px) {
    .clippy, .clippy-balloon {
      display: none !important;
    }
  }

  /* React95 TitleBar title text */
  .r95_1kpzw685 {
    line-height: 1.2em !important;
  }

  /* Force Start Menu popup above all windows */
  [style*="position: fixed"][style*="bottom: 0px"] > [style*="position: absolute"] {
    z-index: 999999 !important;
  }

  ${Cursor.Auto}
`;

const App = () => {
  const [biosVisible, setBiosVisible] = useState(false);
  const [biosRunId, setBiosRunId] = useState(0);

  const startShutdown = useCallback(() => {
    setBiosRunId((runId) => runId + 1);
    setBiosVisible(true);
  }, []);

  const rebootToDesktop = useCallback(() => {
    setBiosVisible(false);
  }, []);

  return (
    <DataContext.Provider value={dataService}>
      <ClippyProvider>
        <WindowProvider>
          <GlobalStyles />
          <Desktop onShutdown={startShutdown} />
          {biosVisible && (
            <BiosShutdownOverlay key={biosRunId} onReboot={rebootToDesktop} />
          )}
        </WindowProvider>
      </ClippyProvider>
    </DataContext.Provider>
  );
};
export default App;
