import React from 'react'
import styled from 'styled-components'
import { Mspaint, Notepad2, Computer, Network2, RecycleFull, Explore, Folder } from '@react95/icons'
import { startWebamp } from '../utils/startWebamp';

const StyledShorcut = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    margin-left: 20px;
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    .icon-wrapper {
        margin-bottom: 4px;
        ${({ isSelected }) => isSelected && `
            filter: contrast(0.5) brightness(1.2) sepia(1) hue-rotate(180deg) saturate(5);
        `}
    }

    .shortcut-label {
        padding: 1px 2px;
        ${({ isSelected }) => isSelected ? `
            background-color: #020242;
            color: white;
            outline: 1px dotted #fff;
        ` : `
            background-color: transparent;
            color: #000;
        `}
    }
`;

const StyledIcon = styled.img`
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
`;

function Shortcuts({ openExplorer, openPaint, openNotepad, openRecycleBin, openInternet, openHamsterDance, activeSelection, setActiveSelection }) {
    const handleIconClick = (id, e) => {
        e.stopPropagation();
        setActiveSelection(id);
    };

    const handleIconDoubleClick = (action, e) => {
        e.stopPropagation();
        action();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxHeight: 'calc(100vh - 30px)', width: 'fit-content' }}>
            <StyledShorcut
                isSelected={activeSelection === 'computer'}
                onClick={(e) => handleIconClick('computer', e)}
                onDoubleClick={(e) => handleIconDoubleClick(() => { }, e)}
            >
                <div className="icon-wrapper">
                    <Computer variant="32x32_4" />
                </div>
                <div className="shortcut-label">My Computer</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'network'}
                onClick={(e) => handleIconClick('network', e)}
                onDoubleClick={(e) => handleIconDoubleClick(openHamsterDance, e)}
            >
                <div className="icon-wrapper">
                    <Network2 variant="32x32_4" />
                </div>
                <div className="shortcut-label">Network Neighborhood</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'internet'}
                onClick={(e) => handleIconClick('internet', e)}
                onDoubleClick={(e) => handleIconDoubleClick(openInternet, e)}
            >
                <div className="icon-wrapper">
                    <Explore variant="32x32_4" />
                </div>
                <div className="shortcut-label">The Internet</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'recycle'}
                onClick={(e) => handleIconClick('recycle', e)}
                onDoubleClick={(e) => handleIconDoubleClick(openRecycleBin, e)}
            >
                <div className="icon-wrapper">
                    <RecycleFull variant="32x32_4" />
                </div>
                <div className="shortcut-label">Recycle Bin</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'explorer'}
                onClick={(e) => handleIconClick('explorer', e)}
                onDoubleClick={(e) => handleIconDoubleClick(openExplorer, e)}
            >
                <div className="icon-wrapper">
                    <Folder variant="32x32_4" />
                </div>
                <div className="shortcut-label">Stuff</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'paint'}
                onClick={(e) => handleIconClick('paint', e)}
                onDoubleClick={(e) => handleIconDoubleClick(openPaint, e)}
            >
                <div className="icon-wrapper">
                    <Mspaint variant="32x32_4" />
                </div>
                <div className="shortcut-label">Paint</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'idlequest'}
                onClick={(e) => handleIconClick('idlequest', e)}
                onDoubleClick={(e) => handleIconDoubleClick(() => window.open('https://idlequest.net', '_blank'), e)}
            >
                <div className="icon-wrapper">
                    <StyledIcon
                        src={`${process.env.PUBLIC_URL}/icons/idlequesticon.png`}
                        alt="IdleQuest"
                    />
                </div>
                <div className="shortcut-label">IdleQuest</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'focustavern'}
                onClick={(e) => handleIconClick('focustavern', e)}
                onDoubleClick={(e) => handleIconDoubleClick(() => window.open('https://focustavern.com', '_blank'), e)}
            >
                <div className="icon-wrapper">
                    <StyledIcon
                        src={`${process.env.PUBLIC_URL}/icons/focustavern_retro.png`}
                        alt="Focus Tavern"
                    />
                </div>
                <div className="shortcut-label">Focus Tavern</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'media'}
                onClick={(e) => handleIconClick('media', e)}
                onDoubleClick={(e) => handleIconDoubleClick(startWebamp, e)}
            >
                <div className="icon-wrapper">
                    <StyledIcon
                        src={`${process.env.PUBLIC_URL}/images/winamp.png`}
                        alt="Winamp"
                    />
                </div>
                <div className="shortcut-label">Winamp</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'about'}
                onClick={(e) => handleIconClick('about', e)}
                onDoubleClick={(e) => handleIconDoubleClick(() => openNotepad({ id: 'about', name: 'About.txt' }), e)}
            >
                <div className="icon-wrapper">
                    <Notepad2 variant="32x32_4" />
                </div>
                <div className="shortcut-label">About.txt</div>
            </StyledShorcut>
        </div>
    )
}

export default Shortcuts
