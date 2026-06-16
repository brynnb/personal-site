import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Mute, Unmute } from '@react95/icons';

const asset = (path) => `${process.env.PUBLIC_URL}/ambience/${path}`;

const scrollSky = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const scrollRain = keyframes`
  from { background-position: 0 0; }
  to { background-position: 0 512px; }
`;

const fogMove = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const fogOpacity1 = keyframes`
  0% { opacity: .1; }
  22% { opacity: .5; }
  40% { opacity: .28; }
  58% { opacity: .4; }
  80% { opacity: .16; }
  100% { opacity: .1; }
`;

const fogOpacity2 = keyframes`
  0% { opacity: .5; }
  25% { opacity: .2; }
  50% { opacity: .1; }
  80% { opacity: .3; }
  100% { opacity: .5; }
`;

const fogOpacity3 = keyframes`
  0% { opacity: .8; }
  27% { opacity: .2; }
  52% { opacity: .6; }
  68% { opacity: .3; }
  100% { opacity: .8; }
`;

const Stage = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  background: #05070b;
`;

const SkyLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 200vw;
  height: 50%;
  display: flex;
  animation: ${scrollSky} 120s linear infinite;
  will-change: transform;
  pointer-events: none;
`;

const SkyTile = styled.div`
  flex: 0 0 50%;
  height: 100%;
  background: url("${asset('images/cloudysky2.jpg')}") no-repeat center top;
  background-size: cover;
  transform: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'none')};
  backface-visibility: hidden;
`;

const SceneryLayer = styled.div`
  position: absolute;
  inset: 0;
  background: url("${asset('images/loginbackgroundlayers.png')}") no-repeat center bottom;
  background-size: cover;
  pointer-events: none;
`;

const RainLayer = styled.div`
  position: absolute;
  inset: 0;
  background: url("${asset('images/rain3.png')}") repeat;
  background-size: 512px 512px;
  animation: ${scrollRain} 0.4s linear infinite;
  opacity: 0.6;
  will-change: background-position;
  pointer-events: none;
`;

const ArchesLayer = styled.div`
  position: absolute;
  inset: 0;
  background: url("${asset('images/arches.png')}") no-repeat center bottom;
  background-size: cover;
  pointer-events: none;
`;

const FogWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50%;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%);
`;

const FogLayerBase = styled.div`
  position: absolute;
  height: 100%;
  width: 200%;
  will-change: transform, opacity;
`;

const FogLayer1 = styled(FogLayerBase)`
  animation: ${fogOpacity1} 10s linear infinite, ${fogMove} 30s linear infinite;
`;

const FogLayer2 = styled(FogLayerBase)`
  animation: ${fogOpacity2} 21s linear infinite, ${fogMove} 26s linear infinite;
`;

const FogLayer3 = styled(FogLayerBase)`
  animation: ${fogOpacity3} 17s linear infinite, ${fogMove} 22s linear infinite;
`;

const FogImage = styled.div`
  float: left;
  width: 50%;
  height: 100%;
  background: url("${({ $bg }) => $bg}") center center / cover no-repeat transparent;
  filter: blur(1px) grayscale(0.2) saturate(1.2) sepia(0.2);
`;

const AudioToggle = styled.button`
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 5;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: #c0c0c0;
  color: #000;
  cursor: pointer;
  box-shadow: inset 1px 1px #ffffff, inset -1px -1px #808080;

  &:active {
    box-shadow: inset 1px 1px #808080, inset -1px -1px #ffffff;
  }
`;

function Ambience() {
  const musicRef = useRef(null);
  const rainRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const startAudio = useCallback((shouldMute = true) => {
    const music = musicRef.current;
    const rain = rainRef.current;

    if (music) {
      music.volume = 0.48;
      music.muted = shouldMute;
      music.play().catch(() => {});
    }

    if (rain) {
      rain.volume = 0.62;
      rain.muted = shouldMute;
      rain.play().catch(() => {});
    }
  }, []);

  const toggleAudio = useCallback((event) => {
    event.stopPropagation();
    const nextMuted = !muted;
    setMuted(nextMuted);
    startAudio(nextMuted);
  }, [muted, startAudio]);

  useEffect(() => {
    startAudio(true);

    const music = musicRef.current;
    const rain = rainRef.current;

    return () => {
      [music, rain].forEach((audio) => {
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [startAudio]);

  return (
    <Stage>
      <SkyLayer>
        <SkyTile />
        <SkyTile $flip />
      </SkyLayer>
      <SceneryLayer />
      <FogWrapper>
        <FogLayer1>
          <FogImage $bg={asset('images/fog1.png')} />
          <FogImage $bg={asset('images/fog1.png')} />
        </FogLayer1>
        <FogLayer2>
          <FogImage $bg={asset('images/fog2.png')} />
          <FogImage $bg={asset('images/fog2.png')} />
        </FogLayer2>
        <FogLayer3>
          <FogImage $bg={asset('images/fog2.png')} />
          <FogImage $bg={asset('images/fog2.png')} />
        </FogLayer3>
      </FogWrapper>
      <RainLayer />
      <ArchesLayer />
      <AudioToggle
        type="button"
        aria-label={muted ? 'Turn ambience audio on' : 'Mute ambience audio'}
        title={muted ? 'Turn ambience audio on' : 'Mute ambience audio'}
        onClick={toggleAudio}
      >
        {muted ? <Mute variant="32x32_4" /> : <Unmute variant="32x32_4" />}
      </AudioToggle>

      <audio ref={musicRef} src={asset('audio/enchanted-hearthlands.mp3')} loop preload="auto" muted={muted} />
      <audio ref={rainRef} src={asset('audio/rainandthundernew.mp3')} loop preload="auto" muted={muted} />
    </Stage>
  );
}

export default React.memo(Ambience);
