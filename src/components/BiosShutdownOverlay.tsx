import { useEffect, useMemo, useState, type CSSProperties } from 'react';

type BiosShutdownOverlayProps = {
  onReboot: () => void;
};

type ShutdownStage = 'flash' | 'bios';

const MEMORY_MAX_KB = 32768;
const MEMORY_STEP_KB = 1024;
const MEMORY_INTERVAL_MS = 48;
const BLACK_FLASH_MS = 500;
const POST_LINE_INTERVAL_MS = 200;
const AUTO_REBOOT_DELAY_MS = 500;
const ENERGY_STAR_LOGO_SRC = `${process.env.PUBLIC_URL}/bios/energy-star-logo.png`;

const POST_LINES = [
  'Initialize Plug and Play Cards...',
  'PNP Init Completed',
  '',
  'Trend ChipAwayVirus(R) On Guard',
  '',
  'Detecting HDD Primary Master   ... SAMSUNG SV4002H',
  'Detecting HDD Primary Slave    ... None',
  'Detecting HDD Secondary Master ... ATAPI DVD DD 2X16X4X16',
  'Detecting HDD Secondary Slave  ... None',
];

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 2147483646,
  backgroundColor: '#000',
  color: '#d8d8d8',
  fontFamily: '"Lucida Console", "Courier New", monospace',
  fontSize: 'clamp(11px, 1.28vw, 18px)',
  lineHeight: 1.22,
  letterSpacing: 0,
  overflow: 'hidden',
  userSelect: 'none',
};

const biosScreenStyle: CSSProperties = {
  ...overlayStyle,
  padding: 'clamp(14px, 2vw, 28px)',
  boxSizing: 'border-box',
};

const blueTextStyle: CSSProperties = {
  color: '#4d7cff',
};

const whiteTextStyle: CSSProperties = {
  color: '#f1f1f1',
};

const topRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  columnGap: '2ch',
  alignItems: 'start',
};

const logoStyle: CSSProperties = {
  minWidth: 'clamp(104px, 18vw, 180px)',
  textAlign: 'right',
};

const energyStarLogoStyle: CSSProperties = {
  display: 'block',
  width: 'clamp(104px, 18vw, 180px)',
  height: 'auto',
  imageRendering: 'pixelated',
};

const bottomBlockStyle: CSSProperties = {
  position: 'absolute',
  left: 'clamp(14px, 2vw, 28px)',
  right: 'clamp(14px, 2vw, 28px)',
  bottom: 'clamp(14px, 2vw, 28px)',
};

const formatMemory = (memoryKb: number): string => (
  memoryKb.toString().padStart(6, ' ')
);

function AwardLogo() {
  return (
    <div style={logoStyle} aria-hidden="true">
      <img
        src={ENERGY_STAR_LOGO_SRC}
        alt=""
        draggable={false}
        style={energyStarLogoStyle}
      />
    </div>
  );
}

function BiosShutdownOverlay({ onReboot }: BiosShutdownOverlayProps) {
  const [stage, setStage] = useState<ShutdownStage>('flash');
  const [memoryStep, setMemoryStep] = useState(0);
  const [postLineCount, setPostLineCount] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  const memoryKb = useMemo(
    () => Math.min(memoryStep * MEMORY_STEP_KB, MEMORY_MAX_KB),
    [memoryStep],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => setStage('bios'), BLACK_FLASH_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (stage !== 'bios') return undefined;

    const interval = window.setInterval(() => {
      setMemoryStep((currentStep) => {
        const nextStep = currentStep + 1;

        if (nextStep * MEMORY_STEP_KB >= MEMORY_MAX_KB) {
          window.clearInterval(interval);
          window.setTimeout(() => setPostLineCount(1), 450);
        }

        return nextStep;
      });
    }, MEMORY_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (postLineCount === 0 || postLineCount >= POST_LINES.length) return undefined;

    const timeout = window.setTimeout(() => {
      setPostLineCount((count) => Math.min(count + 1, POST_LINES.length));
    }, POST_LINE_INTERVAL_MS);

    return () => window.clearTimeout(timeout);
  }, [postLineCount]);

  useEffect(() => {
    if (postLineCount < POST_LINES.length) return undefined;

    const timeout = window.setTimeout(onReboot, AUTO_REBOOT_DELAY_MS);
    const interval = window.setInterval(() => {
      setCursorVisible((visible) => !visible);
    }, 420);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [onReboot, postLineCount]);

  useEffect(() => {
    const handleKeyDown = () => onReboot();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReboot]);

  if (stage === 'flash') {
    return <div aria-hidden="true" style={overlayStyle} onClick={onReboot} />;
  }

  const postLines = POST_LINES.slice(0, postLineCount);
  const allPostLinesVisible = postLineCount >= POST_LINES.length;

  return (
    <div role="presentation" style={biosScreenStyle} onClick={onReboot}>
      <div style={topRowStyle}>
        <div>
          <div>
            <span style={blueTextStyle}> ■■ </span>
            <span>Award Modular BIOS v4.50PG, An Energy Star Ally</span>
          </div>
          <div>
            <span style={blueTextStyle}>■■■</span>
            <span>Copyright (C) 1984-95, Award Software, Inc.</span>
          </div>
          <br />
          <div style={whiteTextStyle}>ASUS PVI-486AP4 ACPI BIOS Revision 1011 Beta 005</div>
          <br />
          <div>80486DX2 CPU at 66MHz</div>
        </div>
        <AwardLogo />
      </div>

      <div style={{ marginTop: '1.35em' }}>
        Memory Test : {formatMemory(memoryKb)}K OK
      </div>

      {postLineCount > 0 && (
        <div style={{ marginTop: '1.25em' }}>
          <div>Award Plug and Play BIOS Extension&nbsp;&nbsp;v1.0A</div>
          <div>Copyright (C) 1995, Award Software, Inc.</div>
          <br />
          {postLines.map((line, index) => {
            const isLastVisibleLine = index === postLines.length - 1;
            const shouldShowCursor = allPostLinesVisible && isLastVisibleLine;

            if (!line) {
              return <div key={`gap-${index}`}>&nbsp;</div>;
            }

            return (
              <div key={`${index}-${line || 'blank'}`}>
                {line}
                {shouldShowCursor && (
                  <span style={{ visibility: cursorVisible ? 'visible' : 'hidden' }}>_</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={bottomBlockStyle}>
        <div>
          {postLineCount > 0
            ? 'Press DEL to enter SETUP'
            : 'Press DEL to enter SETUP, ESC to skip memory test'}
        </div>
        <div>02/21/97-VT496G-2A4L6F0IC-00</div>
      </div>
    </div>
  );
}

export default BiosShutdownOverlay;
