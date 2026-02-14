import React from 'react'
import styled from 'styled-components'
import { Mspaint, Notepad2, Computer, Network2, RecycleFull, Explore, Folder, Wangimg130 } from '@react95/icons'
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

function Shortcuts({ openExplorer, openPaint, openNotepad, openRecycleBin, openInternet, openHamsterDance, openPhoto, openDefrag, activeSelection, setActiveSelection }) {
    const lastClickTime = React.useRef(0);
    const lastClickId = React.useRef(null);

    const handleIconClick = (id, action, e) => {
        e.stopPropagation();
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime.current;

        // If it's the same icon and within 500ms, trigger open action
        if (lastClickId.current === id && timeDiff < 500) {
            action();
            lastClickId.current = null; // reset to prevent triple-click "opening again"
        } else {
            setActiveSelection(id);
            lastClickTime.current = currentTime;
            lastClickId.current = id;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxHeight: 'calc(100vh - 30px)', width: 'fit-content' }}>
            <StyledShorcut
                isSelected={activeSelection === 'computer'}
                onClick={(e) => handleIconClick('computer', openDefrag, e)}
            >
                <div className="icon-wrapper">
                    <Computer variant="32x32_4" />
                </div>
                <div className="shortcut-label">My Computer</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'network'}
                onClick={(e) => handleIconClick('network', openHamsterDance, e)}
            >
                <div className="icon-wrapper">
                    <Network2 variant="32x32_4" />
                </div>
                <div className="shortcut-label">Network Neighborhood</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'internet'}
                onClick={(e) => handleIconClick('internet', openInternet, e)}
            >
                <div className="icon-wrapper">
                    <Explore variant="32x32_4" />
                </div>
                <div className="shortcut-label">The Internet</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'recycle'}
                onClick={(e) => handleIconClick('recycle', openRecycleBin, e)}
            >
                <div className="icon-wrapper">
                    <RecycleFull variant="32x32_4" />
                </div>
                <div className="shortcut-label">Recycle Bin</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'explorer'}
                onClick={(e) => handleIconClick('explorer', openExplorer, e)}
            >
                <div className="icon-wrapper">
                    <Folder variant="32x32_4" />
                </div>
                <div className="shortcut-label">Stuff</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'paint'}
                onClick={(e) => handleIconClick('paint', openPaint, e)}
            >
                <div className="icon-wrapper">
                    <Mspaint variant="32x32_4" />
                </div>
                <div className="shortcut-label">Paint</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'idlequest'}
                onClick={(e) => handleIconClick('idlequest', () => window.open('https://idlequest.net', '_blank'), e)}
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
                onClick={(e) => handleIconClick('focustavern', () => window.open('https://focustavern.com', '_blank'), e)}
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
                isSelected={activeSelection === 'capturequest'}
                onClick={(e) => handleIconClick('capturequest', () => window.open('https://capturequest.net', '_blank'), e)}
            >
                <div className="icon-wrapper">
                    <StyledIcon
                        src={`${process.env.PUBLIC_URL}/icons/capturequest.png`}
                        alt="CaptureQuest"
                    />
                </div>
                <div className="shortcut-label">CaptureQuest</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'newyokosuka'}
                onClick={(e) => handleIconClick('newyokosuka', () => window.open('https://www.newyokosuka.com/', '_blank'), e)}
            >
                <div className="icon-wrapper">
                    <StyledIcon
                        src={`${process.env.PUBLIC_URL}/images/ny.gif`}
                        alt="New Yokosuka"
                    />
                </div>
                <div className="shortcut-label">New Yokosuka</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'media'}
                onClick={(e) => handleIconClick('media', startWebamp, e)}
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
                isSelected={activeSelection === 'photo'}
                onClick={(e) => handleIconClick('photo', openPhoto, e)}
            >
                <div className="icon-wrapper">
                    <Wangimg130 variant="32x32_4" />
                </div>
                <div className="shortcut-label">hi-res-travel-photo.jpg</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'about'}
                onClick={(e) => handleIconClick('about', () => openNotepad({ id: 'about', name: 'About.txt' }), e)}
            >
                <div className="icon-wrapper">
                    <Notepad2 variant="32x32_4" />
                </div>
                <div className="shortcut-label">About.txt</div>
            </StyledShorcut>

            <StyledShorcut
                isSelected={activeSelection === 'projects'}
                onClick={(e) => handleIconClick('projects', () => openNotepad({ id: 'projects', name: 'Projects.txt' }), e)}
            >
                <div className="icon-wrapper">
                    <Notepad2 variant="32x32_4" />
                </div>
                <div className="shortcut-label">Projects.txt</div>
            </StyledShorcut>
        </div>
    )
}

export default React.memo(Shortcuts);
