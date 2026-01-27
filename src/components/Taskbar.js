import React from 'react'
import { TaskBar, List } from '@react95/core'
import { MediaCd, Mapi32801 } from '@react95/icons'
import styled from 'styled-components'
import Tray from './Tray'

const StyledTaskBar = styled(TaskBar)`
    padding-right: 80px;
    z-index: 999999 !important;
    
    /* Hide the built-in clock */
    & > div:last-child {
        display: none !important;
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
    margin-left: -8px; /* Shift the icon container left */
    margin-right: 8px; /* Give the text more space */
`;

const StyledList = styled(List)`
    z-index: 999999;
    li:not(:has(svg)) {
        padding-inline-start: 15px;
    }
`;




function Taskbar({ onClockClick }) {


    return (
        <>
            <StyledTaskBar
                list={
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
                }
            />
            <Tray onClockClick={onClockClick} />
        </>
    )
}

export default Taskbar
