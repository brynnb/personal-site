import React from 'react';
import { Frame } from '@react95/core';
import { HelpBook } from '@react95/icons';
import styled from 'styled-components';
import Win95Window from './Win95Window';

const HELP_ICON = <HelpBook variant="16x16_4" />;

const CreditsBody = styled.div`
    width: 380px;
    max-width: calc(100vw - 48px);
    padding: 12px;
    font-size: 12px;
    line-height: 1.45;
    color: black;

    h2 {
        margin: 0 0 10px;
        font-size: 14px;
        font-weight: bold;
    }

    dl {
        margin: 0;
    }

    dt {
        margin-top: 10px;
        font-weight: bold;
    }

    dt:first-child {
        margin-top: 0;
    }

    dd {
        margin: 2px 0 0 16px;
    }

    a {
        color: #0000aa;
    }
`;

function CreditsPanel({ onClose, isMobile }) {
    return (
        <Win95Window
            id="credits-help"
            icon={HELP_ICON}
            title="Help"
            onClose={onClose}
            isMobile={isMobile}
            style={{
                left: isMobile ? '5%' : 'calc(50% - 190px)',
                top: isMobile ? '12%' : '18%',
                userSelect: 'none'
            }}
        >
            <Frame backgroundColor="$material" boxShadow="$in">
                <CreditsBody>
                    <h2>Credits</h2>
                    <dl>
                        <dt>Windows UI</dt>
                        <dd>
                            Built with <a href="https://github.com/React95/React95" target="_blank" rel="noreferrer">React95</a>.
                        </dd>

                        <dt>DOS / BIOS Screen</dt>
                        <dd>
                            Shutdown screen adapted from <a href="https://github.com/ncot-tech/award-bios-recreation" target="_blank" rel="noreferrer">award-bios-recreation</a>.
                        </dd>

                        <dt>DOOM and Chex Quest</dt>
                        <dd>
                            Powered by <a href="https://emulatorjs.org/" target="_blank" rel="noreferrer">EmulatorJS</a> using the prboom core.
                        </dd>

                        <dt>Winamp</dt>
                        <dd>
                            Powered by <a href="https://github.com/captbaritone/webamp" target="_blank" rel="noreferrer">Webamp</a>.
                        </dd>

                        <dt>Paint</dt>
                        <dd>
                            Powered by <a href="https://github.com/1j01/jspaint" target="_blank" rel="noreferrer">JS Paint</a>.
                        </dd>

                        <dt>3D Pipes Screensaver</dt>
                        <dd>
                            Powered by <a href="https://github.com/1j01/pipes" target="_blank" rel="noreferrer">Pipes</a> by Isaiah Odhner.
                        </dd>
                    </dl>
                </CreditsBody>
            </Frame>
        </Win95Window>
    );
}

export default React.memo(CreditsPanel);
