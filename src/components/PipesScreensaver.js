import React, { useEffect } from 'react';
import styled from 'styled-components';

const Screensaver = styled.div`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    overflow: hidden;
    background: #000;
    cursor: pointer;
`;

const PipesFrame = styled.iframe`
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    pointer-events: none;
`;

const PIPES_OPTIONS = encodeURIComponent(JSON.stringify({ hideUI: true }));

function PipesScreensaver({ onClose }) {
    useEffect(() => {
        window.addEventListener('keydown', onClose);
        return () => window.removeEventListener('keydown', onClose);
    }, [onClose]);

    return (
        <Screensaver
            role="button"
            tabIndex={0}
            aria-label="3D Pipes screensaver. Click or press any key to close."
            onPointerDown={onClose}
        >
            <PipesFrame
                src={`${process.env.PUBLIC_URL}/screensavers/pipes/index.html#${PIPES_OPTIONS}`}
                title="3D Pipes screensaver"
            />
        </Screensaver>
    );
}

export default PipesScreensaver;
