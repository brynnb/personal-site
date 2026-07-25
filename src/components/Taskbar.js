import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { Frame, List } from '@react95/core'
import {
    FileFind,
    FolderExe,
    FolderFile,
    HelpBook,
    Intl101,
    Logo,
    Mapi32801,
    MediaCd,
    Mspaint,
    Notepad2,
    Rundll1,
    Settings,
    Shell3228,
    Star,
    Wangimg130
} from '@react95/icons'
import styled from 'styled-components'
import Tray from './Tray'
import DataContext from '../contexts/dataContext'
import { useWindowManager } from '../contexts/windowContext'
import { startWebamp } from '../utils/startWebamp'
import BsodOverlay from './BsodOverlay'
import RunDialog from './RunDialog'
import PipesScreensaver from './PipesScreensaver'

const START_MENU_WIDTH = 240;
const START_MENU_RAIL_WIDTH = 32;
const START_MENU_RAIL_TOP_GAP = 3;
const START_MENU_RAIL_IMAGE_WIDTH = 42;
const START_MENU_RAIL_IMAGE_HEIGHT = 226;
const START_SUBMENU_WIDTH = 240;
const START_SUBMENU_ICON_SIZE = 16;

const TaskBarFrame = styled(Frame)`
    align-items: center;
    padding-right: 80px;
    z-index: 999999 !important;

    @media (max-width: 500px) {
        padding-right: 2px;
    }

    /* Start Menu popup should be above all windows */
    & > div:first-child {
        z-index: 999999 !important;
    }
`;

const StyledIcon = styled.img`
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
`;

const IconContainer = styled.div`
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: -8px;
    margin-right: 8px;
`;

const StartMenuFrame = styled(Frame)`
    z-index: 999999 !important;
    display: flex !important;
    align-items: stretch;
    width: ${START_MENU_WIDTH}px;
    min-height: ${START_MENU_RAIL_IMAGE_HEIGHT + START_MENU_RAIL_TOP_GAP}px;
    padding: 0 !important;
    overflow: visible;
`;

const StartMenuRail = styled.div`
    position: relative;
    flex: 0 0 ${START_MENU_RAIL_WIDTH}px;
    margin-top: ${START_MENU_RAIL_TOP_GAP}px;
    background-color: #0000aa;
    overflow: hidden;
`;

const StartMenuRailImage = styled.img`
    position: absolute;
    left: 50%;
    bottom: 0;
    width: ${START_MENU_RAIL_IMAGE_WIDTH}px;
    height: ${START_MENU_RAIL_IMAGE_HEIGHT}px;
    display: block;
    max-width: none;
    transform: translateX(-50%);
    pointer-events: none;
    user-select: none;
`;

const StyledList = styled(List)`
    z-index: 999999;
    position: relative;
    width: ${START_MENU_WIDTH - START_MENU_RAIL_WIDTH}px;
    min-height: ${START_MENU_RAIL_IMAGE_HEIGHT + START_MENU_RAIL_TOP_GAP}px;

    ul {
        width: ${START_SUBMENU_WIDTH}px;
    }

    li:not(:has(svg)) {
        padding-inline-start: 15px;
    }

    li:not(:empty) {
        box-sizing: border-box;
        min-height: 36px;
        padding-top: 5px;
        padding-bottom: 5px;
        cursor: default;
    }

    li:empty {
        min-height: 0;
        padding: 0;
    }

    li svg {
        flex-shrink: 0;
    }

    li > ul li:not(:empty) {
        min-height: 22px;
        padding-inline: 4px 18px;
        padding-top: 2px;
        padding-bottom: 2px;
        font-size: 75%;
    }

    li > ul li:not(:has(svg)) {
        padding-inline-start: 4px;
    }

    li > ul li svg {
        width: ${START_SUBMENU_ICON_SIZE}px;
        height: ${START_SUBMENU_ICON_SIZE}px;
        min-width: ${START_SUBMENU_ICON_SIZE}px;
        margin-right: 4px;
    }

    li > ul ${IconContainer} {
        width: ${START_SUBMENU_ICON_SIZE}px;
        height: ${START_SUBMENU_ICON_SIZE}px;
        margin-left: 0;
        margin-right: 4px;
    }
`;

const MenuText = styled.span`
    display: inline-flex;
    align-items: center;
    min-width: 0;
    white-space: nowrap;
`;

const Accelerator = styled.span`
    text-decoration: underline;
`;

const WindowButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    width: 160px;
    height: 22px;
    font-size: 12px;
    font-family: inherit;
    border: none;
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #c0c0c0;
    box-shadow: ${props => props.$active
        ? 'inset 1px 1px #808080, inset -1px -1px #ffffff'
        : 'inset 1px 1px #ffffff, inset -1px -1px #808080'};
    font-weight: normal;
    color: black;

    &:active {
        box-shadow: inset 1px 1px #808080, inset -1px -1px #ffffff;
    }
`;

const StartButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    height: 22px;
    font-size: 13px;
    font-weight: bold;
    font-family: inherit;
    border: none;
    cursor: pointer;
    background-color: #c0c0c0;
    box-shadow: ${props => props.$active
        ? 'inset 1px 1px #808080, inset -1px -1px #ffffff'
        : 'inset 1px 1px #ffffff, inset -1px -1px #808080'};
    color: black;

    &:active {
        box-shadow: inset 1px 1px #808080, inset -1px -1px #ffffff;
    }
`;

const StartLabel = styled.span`
    transform: translateY(-3px);
`;

const WindowTitle = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform: translateY(1px);

`;

const WindowButtonsArea = styled(Frame)`
    align-items: center;
`;

function AcceleratorLabel({ text, accelerator }) {
    const index = text.toLowerCase().indexOf(accelerator.toLowerCase());

    if (index === -1) {
        return <MenuText>{text}</MenuText>;
    }

    return (
        <MenuText>
            {text.slice(0, index)}
            <Accelerator>{text[index]}</Accelerator>
            {text.slice(index + 1)}
        </MenuText>
    );
}

function Taskbar({
    onClockClick,
    onShutdown,
    openCredits,
    openPaint,
    openNotepad,
    openDoom,
    openChexQuest,
    openPhoto,
    openAmbience
}) {
    const { openWindows, activeWindowId, focusWindow } = useWindowManager();
    const data = useContext(DataContext);
    const [showList, setShowList] = useState(false);
    const [showBsod, setShowBsod] = useState(false);
    const [showRunDialog, setShowRunDialog] = useState(false);
    const [showPipes, setShowPipes] = useState(false);
    const taskbarRef = useRef(null);
    const openWindowsUpdate = useCallback(() => setShowBsod(true), []);
    const closeWindowsUpdate = useCallback(() => setShowBsod(false), []);
    const openRunDialog = useCallback(() => setShowRunDialog(true), []);
    const closeRunDialog = useCallback(() => setShowRunDialog(false), []);
    const openPipes = useCallback(() => setShowPipes(true), []);
    const closePipes = useCallback(() => setShowPipes(false), []);
    const runCommand = useCallback(() => {
        setShowRunDialog(false);
        setShowBsod(true);
    }, []);

    const runMenuAction = (event, action) => {
        event.stopPropagation();
        setShowList(false);
        if (action) action();
    };

    const openUrl = (url) => {
        window.open(url, "_blank");
    };

    const openDocument = (id) => {
        const item = data?.getItem(id);
        if (item && openNotepad) openNotepad(item);
    };

    const imageIcon = (src, alt) => (
        <IconContainer>
            <StyledIcon src={`${process.env.PUBLIC_URL}${src}`} alt={alt} />
        </IconContainer>
    );

    const programItems = [
        { label: 'Ambience', icon: <MediaCd variant="32x32_4" />, action: openAmbience },
        { label: 'DOOM', icon: imageIcon('/icons/doomicon.png', 'DOOM'), action: openDoom },
        { label: 'Chex Quest', icon: imageIcon('/icons/chex.ico', 'Chex Quest'), action: openChexQuest },
        { label: 'Paint', icon: <Mspaint variant="32x32_4" />, action: openPaint },
        { label: 'IdleQuest', icon: imageIcon('/icons/idlequesticon.png', 'IdleQuest'), action: () => openUrl('https://idlequest.net') },
        { label: 'CaptureQuest', icon: imageIcon('/icons/capturequest.png', 'CaptureQuest'), action: () => openUrl('https://capturequest.net') },
        { label: 'New Yokosuka', icon: imageIcon('/images/ny.gif', 'New Yokosuka'), action: () => openUrl('https://www.newyokosuka.com/') },
        { label: 'Winamp', icon: imageIcon('/images/winamp.png', 'Winamp'), action: startWebamp },
        { label: 'Vanguard: Eternal Sagas', icon: imageIcon('/icons/vanguard.png', 'Vanguard: Eternal Sagas'), action: () => openUrl('https://eternalsagas.com/') },
        { label: 'Vayeate Game Studio', icon: imageIcon('/icons/vayeate.png', 'Vayeate Game Studio'), action: () => openUrl('https://www.vayeate.com/') },
    ];

    const documentItems = ['about', 'projects', 'password-file']
        .map((id) => data?.getItem(id))
        .filter(Boolean);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!taskbarRef.current) return;
            if (!taskbarRef.current.contains(event.target)) {
                setShowList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div ref={taskbarRef}>
                <TaskBarFrame
                    position="fixed"
                    bottom="0px"
                    left="0px"
                    right="0px"
                    display="flex"
                    justifyContent="space-between"
                    h="28px"
                    w="100%"
                    padding="$2"
                    zIndex="$taskbar"
                    backgroundColor="$material"
                    boxShadow="$out"
                >
                    {showList && (
                        <StartMenuFrame
                            position="absolute"
                            bottom="28px"
                        >
                            <StartMenuRail aria-hidden="true">
                                <StartMenuRailImage
                                    src={`${process.env.PUBLIC_URL}/images/win98startleftside.jpg`}
                                    alt=""
                                    draggable="false"
                                />
                            </StartMenuRail>
                            <StyledList>
                                <List.Item
                                    icon={<Intl101 variant="32x32_4" />}
                                    onClick={(event) => runMenuAction(event, openWindowsUpdate)}
                                >
                                    Windows Update
                                </List.Item>
                                <List.Divider />
                                <List.Item icon={<FolderExe variant="32x32_4" />}>
                                    <AcceleratorLabel text="Programs" accelerator="P" />
                                    <List>
                                        {programItems.map((item) => (
                                            <List.Item
                                                key={item.label}
                                                icon={item.icon}
                                                onClick={(event) => runMenuAction(event, item.action)}
                                            >
                                                {item.label}
                                            </List.Item>
                                        ))}
                                    </List>
                                </List.Item>
                                <List.Item icon={<Star variant="32x32_4" />}>
                                    <AcceleratorLabel text="Favorites" accelerator="a" />
                                    <List>
                                        <List.Item
                                            icon={<Wangimg130 variant="32x32_4" />}
                                            onClick={(event) => runMenuAction(event, openPhoto)}
                                        >
                                            hi-res-travel-photo.jpg
                                        </List.Item>
                                    </List>
                                </List.Item>
                                <List.Item icon={<FolderFile variant="32x32_4" />}>
                                    <AcceleratorLabel text="Documents" accelerator="D" />
                                    <List>
                                        {documentItems.map((item) => (
                                            <List.Item
                                                key={item.id}
                                                icon={<Notepad2 variant="32x32_4" />}
                                                onClick={(event) => runMenuAction(event, () => openDocument(item.id))}
                                            >
                                                {item.name}
                                            </List.Item>
                                        ))}
                                    </List>
                                </List.Item>
                                <List.Item
                                    icon={<Settings variant="32x32_4" />}
                                    onClick={(event) => runMenuAction(event, openPipes)}
                                >
                                    <AcceleratorLabel text="Settings" accelerator="S" />
                                </List.Item>
                                <List.Item
                                    icon={<FileFind variant="32x32_4" />}
                                >
                                    <AcceleratorLabel text="Find" accelerator="F" />
                                    <List>
                                        <List.Item
                                            icon={imageIcon('/images/githubicon.png', 'GitHub')}
                                            onClick={(event) => runMenuAction(event, () => openUrl("https://github.com/brynnb"))}
                                        >
                                            GitHub
                                        </List.Item>
                                        <List.Item
                                            icon={imageIcon('/images/linkedinicon.png', 'LinkedIn')}
                                            onClick={(event) => runMenuAction(event, () => openUrl("https://www.linkedin.com/in/brynn-bateman/"))}
                                        >
                                            LinkedIn
                                        </List.Item>
                                        <List.Item
                                            icon={<Mapi32801 variant="32x32_4" />}
                                            onClick={(event) => runMenuAction(event, () => {
                                                window.location.href = "mailto:contact2026@brynnbateman.com";
                                            })}
                                        >
                                            Email Me
                                        </List.Item>
                                    </List>
                                </List.Item>
                                <List.Item
                                    icon={<HelpBook variant="32x32_4" />}
                                    onClick={(event) => runMenuAction(event, openCredits)}
                                >
                                    <AcceleratorLabel text="Help" accelerator="H" />
                                </List.Item>
                                <List.Item
                                    icon={<Rundll1 variant="32x32_4" />}
                                    onClick={(event) => runMenuAction(event, openRunDialog)}
                                >
                                    <AcceleratorLabel text="Run" accelerator="R" />
                                </List.Item>
                                <List.Divider />
                                <List.Item
                                    icon={<Shell3228 variant="32x32_4" />}
                                    onClick={(event) => runMenuAction(event, onShutdown)}
                                >
                                    Shut Down...
                                </List.Item>
                            </StyledList>
                        </StartMenuFrame>
                    )}

                    <StartButton
                        $active={showList}
                        onClick={() => setShowList(!showList)}
                    >
                        <Logo variant="32x32_4" style={{ width: 20, height: 20 }} />
                        <StartLabel>Start</StartLabel>
                    </StartButton>

                    <WindowButtonsArea w="100%" paddingLeft="$0" ml="$2" display="flex">
                        {openWindows.map((win) => (
                            <WindowButton
                                key={win.id}
                                $active={win.id === activeWindowId}
                                onClick={() => focusWindow(win.id)}
                            >
                                {win.icon && (
                                    <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: 16, height: 16, overflow: 'hidden' }}>
                                        {win.icon}
                                    </span>
                                )}
                                <WindowTitle>{win.title}</WindowTitle>
                            </WindowButton>
                        ))}
                    </WindowButtonsArea>
                </TaskBarFrame>
            </div>
            <Tray onClockClick={onClockClick} />
            {showBsod && <BsodOverlay onClose={closeWindowsUpdate} />}
            {showRunDialog && (
                <RunDialog onClose={closeRunDialog} onRun={runCommand} />
            )}
            {showPipes && <PipesScreensaver onClose={closePipes} />}
        </>
    )
}

export default Taskbar
