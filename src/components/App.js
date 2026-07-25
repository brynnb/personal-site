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
  :root {
    --crt-safe-top: 0px;
    --crt-safe-right: 0px;
    --crt-safe-bottom: 0px;
    --crt-safe-left: 0px;
  }

  @media (min-width: 851px) {
    :root {
      /* CRT safe-area tuning knobs:
         Retromator mask raw opening is roughly 2.4vw from the sides and
         3.1vh from the top/bottom. These values add a little usable cushion. */
      --crt-safe-top: 4.8vh;
      --crt-safe-right: 4.1vw;
      --crt-safe-bottom: 4.4vh;
      --crt-safe-left: 4.1vw;

      /* CRT screen corner tuning knobs. */
      --crt-screen-radius-x: 3.4vw;
      --crt-screen-radius-y: 5vh;
    }
  }

  html,
  #root {
    background-color: #000;
  }

  body {
    font-size: 15px;
    background-color: #000;
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

  .site-desktop-shell {
    position: fixed;
    top: var(--crt-safe-top);
    right: var(--crt-safe-right);
    bottom: var(--crt-safe-bottom);
    left: var(--crt-safe-left);
    overflow: hidden;
    background-color: #008080;
    border-radius: var(--crt-screen-radius-x, 0) / var(--crt-screen-radius-y, 0);
    z-index: 0;
  }

  .site-crt-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    pointer-events: none;
    overflow: hidden;
  }

  .site-crt-overlay::before,
  .site-crt-overlay::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  .site-crt-overlay::before {
    z-index: 1;
    opacity: 0;
    background:
      linear-gradient(rgba(18, 16, 16, 0) 10%, rgba(0, 0, 0, 0.11) 15%),
      linear-gradient(90deg, rgba(255, 0, 0, 0.01), rgba(0, 255, 0, 0.018), rgba(0, 0, 255, 0.01));
    background-size: 100% 3px, 3px 100%;
    animation: site-crt-flicker 8s steps(1, end) infinite;
  }

  

  .site-crt-scanline {
    position: fixed;
    left: 0;
    right: 0;
    top: -18vh;
    z-index: 2;
    height: 14vh;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.18) 14%,
      rgba(0, 0, 0, 0.05) 100%
    );
    opacity: 0.16;
    animation: site-crt-scanline 7.5s linear infinite;
  }

  .site-crt-frame {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 4;
    width: 100%;
    height: 100%;
    object-fit: fill;
    opacity: 0.95;
    user-select: none;
  }

  @media (min-width: 851px) {
    .site-crt-frame {
      display: block;
    }
  }

  @media (max-width: 420px) {
    .site-crt-overlay::before {
      opacity: 0.38;
      background-size: 100% 4px, 3px 100%;
    }

    .site-crt-overlay::after {
      box-shadow: inset 0 0 2rem rgba(0, 0, 0, 0.24);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .site-crt-overlay::before,
    .site-crt-scanline {
      animation: none;
    }

    .site-crt-scanline {
      display: none;
    }
  }

  @keyframes site-crt-flicker {
    0%, 100% {
      opacity: 0.5;
      transform: translateY(0);
    }

    18% {
      opacity: 0.46;
    }

    19% {
      transform: translateY(1px);
    }

    20% {
      transform: translateY(0);
    }

    64% {
      opacity: 0.54;
    }
  }

  @keyframes site-crt-scanline {
    0%, 72% {
      transform: translateY(-20vh);
    }

    100% {
      transform: translateY(136vh);
    }
  }

  ${Cursor.Auto}
`;

const CrtOverlay = () => (
  <div className="site-crt-overlay" aria-hidden="true">
    <div className="site-crt-scanline" />
    <img
      className="site-crt-frame"
      src={`${process.env.PUBLIC_URL}/crt/crtborder.png`}
      alt=""
      draggable="false"
    />
  </div>
);

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
          <CrtOverlay />
          {biosVisible && (
            <BiosShutdownOverlay key={biosRunId} onReboot={rebootToDesktop} />
          )}
        </WindowProvider>
      </ClippyProvider>
    </DataContext.Provider>
  );
};
export default App;
