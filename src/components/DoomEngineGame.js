import React from 'react';
import { TitleBar } from '@react95/core';
import Win95Window from './Win95Window';

const CONTROLS = [
    ['A', 'Shoot'],
    ['Arrow keys', 'Move'],
    ['Z', 'Use'],
    ['R', 'Change weapons'],
    ['V', 'Map'],
    ['Enter', 'Menu']
];

const DoomEngineGame = ({ id, title, icon, src, onClose, isMobile }) => {
    const [showControls, setShowControls] = React.useState(true);

    const windowStyle = isMobile
        ? {
            width: 'calc(100vw - 16px)',
            height: 'calc(100vh - 48px)',
            top: '8px',
            left: '8px',
            userSelect: 'none'
        }
        : {
            width: '760px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 52px)',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            userSelect: 'none'
        };

    return (
        <Win95Window
            id={id}
            icon={icon}
            title={title}
            onClose={onClose}
            isMobile={isMobile}
            style={windowStyle}
        >
            <div style={{
                display: 'flex',
                flex: '1 1 auto',
                minHeight: 0,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'black',
                boxShadow: 'inset 1px 1px #808080, inset -1px -1px #ffffff'
            }}>
                <iframe
                    title={title}
                    src={src}
                    allow="autoplay; fullscreen; gamepad"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 0,
                        display: 'block',
                        backgroundColor: 'black'
                    }}
                />
                {showControls && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            zIndex: 2,
                            width: isMobile ? 'calc(100% - 16px)' : '210px',
                            maxWidth: 'calc(100% - 16px)',
                            color: '#000',
                            backgroundColor: '#c0c0c0',
                            fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
                            fontSize: '11px',
                            boxShadow: 'inset 1px 1px #ffffff, inset -1px -1px #808080, 1px 1px #000'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '18px',
                                padding: '1px 2px 1px 4px',
                                color: '#fff',
                                backgroundColor: '#000080',
                                fontWeight: 'bold'
                            }}
                        >
                            <span>Controls</span>
                            <TitleBar.OptionsBox>
                                <TitleBar.Close
                                    aria-label="Close controls"
                                    onClick={() => setShowControls(false)}
                                />
                            </TitleBar.OptionsBox>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                rowGap: '3px',
                                padding: '6px 8px 7px'
                            }}
                        >
                            {CONTROLS.map(([key, action]) => (
                                <div
                                    key={key}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '82px 1fr',
                                        alignItems: 'center',
                                        columnGap: '8px',
                                        minHeight: '15px',
                                        lineHeight: '14px'
                                    }}
                                >
                                    <strong style={{ lineHeight: '14px' }}>{key}</strong>
                                    <span style={{ lineHeight: '14px' }}>{action}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Win95Window>
    );
};

export default React.memo(DoomEngineGame);
