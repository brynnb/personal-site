import React from 'react';
import DoomEngineGame from './DoomEngineGame';

const CHEX_ICON = (
    <img
        src={`${process.env.PUBLIC_URL}/icons/chex.ico`}
        alt="Chex Quest"
        style={{ width: 16, height: 16, imageRendering: 'pixelated' }}
    />
);

const ChexQuest = ({ closeChexQuest, isMobile }) => (
    <DoomEngineGame
        id="chex-quest"
        title="Chex Quest.exe"
        icon={CHEX_ICON}
        src={`${process.env.PUBLIC_URL}/games/chex/`}
        onClose={closeChexQuest}
        isMobile={isMobile}
    />
);

export default React.memo(ChexQuest);
