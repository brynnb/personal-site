import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Frame } from '@react95/core';
import { Sndvol32304, Network3 } from '@react95/icons';

const StyledTray = styled(Frame)`
    position: fixed;
    bottom: 2px;
    right: 2px;
    height: 24px;
    display: flex;
    align-items: center;
    padding: 0 4px;
    gap: 4px;
    z-index: 999999;
    box-shadow: inset -1px -1px #ffffff, inset 1px 1px #808080;
    background-color: #c0c0c0;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 0 2px;
    image-rendering: pixelated;
`;

const TimeText = styled.div`
    font-size: 12px;
    margin-left: 2px;
    margin-right: 4px;
    cursor: pointer;
`;

const Tray = ({ onClockClick }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const today = new Date();
            let h = today.getHours();
            const m = today.getMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';

            h = h % 12;
            h = h ? h : 12;
            const mStr = m < 10 ? `0${m}` : m;

            setTime(`${h}:${mStr} ${ampm}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <StyledTray>
            <IconWrapper>
                <Network3 variant="16x16_4" />
            </IconWrapper>
            <IconWrapper>
                <Sndvol32304 variant="16x16_4" />
            </IconWrapper>
            <TimeText onClick={onClockClick}>{time}</TimeText>
        </StyledTray>
    );
};

export default Tray;
