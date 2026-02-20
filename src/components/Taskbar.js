import React, { useState, useEffect, useRef } from 'react'
import { Frame, List } from '@react95/core'
import { Logo, MediaCd, Mapi32801 } from '@react95/icons'
import styled from 'styled-components'
import Tray from './Tray'
import { useWindowManager } from '../contexts/windowContext'

const TaskBarFrame = styled(Frame)`
    padding-right: 80px;
    z-index: 999999 !important;

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

const StyledList = styled(List)`
    z-index: 999999;
    position: relative;
    li:not(:has(svg)) {
        padding-inline-start: 15px;
    }
`;

const WindowButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    width: 160px;
    height: 22px;
    font-size: 11px;
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
    font-size: 12px;
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

const WindowTitle = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;


function Taskbar({ onClockClick }) {
    const { openWindows, activeWindowId, focusWindow } = useWindowManager();
    const [showList, setShowList] = useState(false);
    const taskbarRef = useRef(null);

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
                        <Frame
                            position="absolute"
                            bottom="28px"
                            onClick={() => setShowList(false)}
                        >
                            <StyledList>
                                <List.Item
                                    icon={
                                        <IconContainer>
                                            <StyledIcon src={`${process.env.PUBLIC_URL}/images/githubicon.png`} alt="GitHub" />
                                        </IconContainer>
                                    }
                                    onClick={() => window.open("https://github.com/brynnb", "_blank")}
                                >
                                    GitHub
                                </List.Item>
                                <List.Item
                                    icon={
                                        <IconContainer>
                                            <StyledIcon src={`${process.env.PUBLIC_URL}/images/linkedinicon.png`} alt="LinkedIn" />
                                        </IconContainer>
                                    }
                                    onClick={() => window.open("https://www.linkedin.com/in/brynn-bateman/", "_blank")}
                                >
                                    LinkedIn
                                </List.Item>
                                <List.Item
                                    icon={<Mapi32801 variant="32x32_4" />}
                                    onClick={() => window.location.href = "mailto:contact2026@brynnbateman.com"}
                                >
                                    Email Me
                                </List.Item>
                                <List.Divider />
                                <List.Item
                                    icon={<MediaCd variant="32x32_4" />}
                                    onClick={() => window.open("https://music.youtube.com/playlist?list=PLHtpGEmB89DMvEtXBB_3bo2TMR_1HQTcj&si=qnJUxqjHpyCthu1z", "_blank")}
                                >
                                    Ambience Playlist
                                </List.Item>
                            </StyledList>
                        </Frame>
                    )}

                    <StartButton
                        $active={showList}
                        onClick={() => setShowList(!showList)}
                    >
                        <Logo variant="32x32_4" style={{ width: 20, height: 20 }} />
                        Start
                    </StartButton>

                    <Frame w="100%" paddingLeft="$0" ml="$2" display="flex">
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
                    </Frame>
                </TaskBarFrame>
            </div>
            <Tray onClockClick={onClockClick} />
        </>
    )
}

export default Taskbar
