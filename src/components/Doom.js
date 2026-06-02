import React from 'react';
import DoomEngineGame from './DoomEngineGame';

const DOOM_ICON = (
    <img
        src={`${process.env.PUBLIC_URL}/icons/doomicon.png`}
        alt="DOOM"
        style={{ width: 16, height: 16, imageRendering: 'pixelated' }}
    />
);

const Doom = ({ closeDoom, isMobile }) => (
    <DoomEngineGame
        id="doom"
        title="DOOM.exe"
        icon={DOOM_ICON}
        src={`${process.env.PUBLIC_URL}/games/doom/index.html`}
        onClose={closeDoom}
        isMobile={isMobile}
    />
);

export default React.memo(Doom);
