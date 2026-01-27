import React, { useState, useRef } from 'react';
import { Modal, TitleBar } from '@react95/core';
import { Network2, Sndvol32303, Sndrec3210 } from '@react95/icons';
import styled from 'styled-components';

const HamsterWrapper = styled.div`
    width: 100%;
    height: 350px;
    background-image: url('${process.env.PUBLIC_URL}/images/hamsterdance.gif');
    background-repeat: repeat;
    background-size: 60px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 40px;
    overflow: hidden;
`;

const HamsterTitle = styled.img`
    width: 80%;
    max-width: 400px;
    z-index: 1;
`;

const AudioControl = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 2;
    background: rgba(192, 192, 192, 0.8);
    padding: 2px;
    border: 1px solid #000;
    box-shadow: inset 1px 1px #fff, inset -1px -1px #808080;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HamsterDance = ({ closeHamsterDance, zIndex }) => {
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef(null);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            if (isMuted) {
                audioRef.current.play().catch(e => console.log("Audio play failed", e));
            }
            setIsMuted(!isMuted);
        }
    };

    return (
        <Modal
            id="hamster"
            icon={<Network2 variant="16x16_4" />}
            title="Network Neighborhood"
            titleBarOptions={
                <TitleBar.Close onClick={closeHamsterDance} />
            }
            style={{
                width: '450px',
                height: 'auto',
                position: 'fixed',
                top: '40%',
                left: '45%',
                transform: 'translate(-50%, -50%)',
                zIndex: zIndex,
                userSelect: 'none'
            }}
        >
            <HamsterWrapper>
                <HamsterTitle
                    src={`${process.env.PUBLIC_URL}/images/hamstertitle.gif`}
                    alt="Hamster Dance"
                />

                <AudioControl onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? (
                        <Sndvol32303 variant="32x32_4" />
                    ) : (
                        <Sndrec3210 variant="32x32_4" />
                    )}
                </AudioControl>

                <audio
                    ref={audioRef}
                    src={`${process.env.PUBLIC_URL}/hamstersong.mp3`}
                    loop
                    muted={isMuted}
                />
            </HamsterWrapper>
        </Modal>
    );
};

export default React.memo(HamsterDance);
