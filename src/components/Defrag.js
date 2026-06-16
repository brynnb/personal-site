import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import styled from 'styled-components';
import { Button } from '@react95/core';
import { Computer } from '@react95/icons';
import Win95Window from './Win95Window';

const ROWS = 22;
const COLUMNS = 54;
const BLOCK_SIZE = 9;
const TOTAL_BLOCKS = ROWS * COLUMNS;
const PROGRESS_SEGMENTS = 44;
const START_PROGRESS = 20;

const CELL_STYLES = {
    contiguous: { color: '#0052bd', border: '#001a7a' },
    optimized: { color: '#00ffff', border: '#008b8b' },
    fragmented: { color: '#ff1717', border: '#8f0000' },
    moving: { color: '#ffff00', border: '#9b8f00' },
    system: { color: '#000080', border: '#00003a' },
    unmovable: { color: '#808080', border: '#404040' },
    free: { color: '#ffffff', border: '#d8d8d8' },
};

const DefragPanel = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  background: #c0c0c0;
  color: #000;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
`;

const DiskFrame = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 2px;
  background: #fff;
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
  box-shadow: inset 1px 1px #000, inset -1px -1px #dfdfdf;
`;

const DiskMap = styled.div`
  display: grid;
  flex: 0 0 auto;
  grid-template-columns: repeat(${COLUMNS}, ${BLOCK_SIZE}px);
  grid-template-rows: repeat(${ROWS}, ${BLOCK_SIZE}px);
  gap: 1px;
  background: #fff;
  overflow: hidden;
`;

const Block = styled.div`
  width: ${BLOCK_SIZE}px;
  height: ${BLOCK_SIZE}px;
  background: ${({ $kind }) => CELL_STYLES[$kind].color};
  box-sizing: border-box;
  box-shadow: inset 1px 1px rgba(255, 255, 255, 0.22), inset -1px -1px rgba(0, 0, 0, 0.28);
`;

const ScrollBar = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 16px;
  margin-left: 2px;
  background: #c0c0c0;
  border-left: 1px solid #808080;
`;

const ScrollButton = styled.div`
  height: 15px;
  line-height: 12px;
  text-align: center;
  background: #c0c0c0;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  font-size: 10px;
`;

const ScrollTrack = styled.div`
  position: relative;
  flex: 1;
  border-left: 1px solid #808080;
  border-top: 1px solid #808080;
`;

const ScrollThumb = styled.div`
  position: absolute;
  top: 24px;
  left: 1px;
  right: 1px;
  height: 28px;
  background: #c0c0c0;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
`;

const FooterPanel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 214px;
  gap: 8px;
  margin-top: 7px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const StatusPanel = styled.div`
  min-width: 0;
`;

const StatusText = styled.div`
  height: 15px;
  line-height: 15px;
  overflow: hidden;
  white-space: nowrap;
`;

const PercentText = styled.div`
  height: 14px;
  line-height: 14px;
`;

const ProgressTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(${PROGRESS_SEGMENTS}, 1fr);
  gap: 1px;
  height: 15px;
  padding: 2px;
  box-sizing: border-box;
  background: #fff;
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  border-right: 1px solid #dfdfdf;
  border-bottom: 1px solid #dfdfdf;
`;

const ProgressCell = styled.div`
  min-width: 0;
  background: ${({ $filled }) => ($filled ? '#000080' : '#fff')};
`;

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 6px;
  align-content: start;

  button {
    min-width: 0;
    width: 100%;
    height: 22px;
    padding: 0;
    font-size: 11px;
  }
`;

const LegendPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px 10px;
  margin-top: 6px;
  padding: 5px;
  background: #c0c0c0;
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  white-space: nowrap;
  font-size: 11px;
`;

const LegendColor = styled.div`
  flex: 0 0 11px;
  width: 11px;
  height: 11px;
  background: ${({ $kind }) => CELL_STYLES[$kind].color};
  border: 1px solid ${({ $kind }) => CELL_STYLES[$kind].border};
  box-sizing: border-box;
`;

const LEGEND_ITEMS = [
    ['contiguous', 'Contiguous'],
    ['fragmented', 'Fragmented'],
    ['moving', 'Moving'],
    ['optimized', 'Optimized'],
    ['system', 'System'],
    ['free', 'Free'],
];

const hashCell = (row, column, salt = 0) => {
    const value = Math.sin((row + 1) * 127.1 + (column + 1) * 311.7 + salt * 43.3) * 43758.5453;
    return value - Math.floor(value);
};

const buildDiskMap = (progress, sweep) => {
    const completedBlocks = progress >= 100
        ? TOTAL_BLOCKS
        : Math.floor((progress / 100) * TOTAL_BLOCKS);
    const activeRow = Math.min(ROWS - 1, Math.floor(completedBlocks / COLUMNS));
    const activeColumn = completedBlocks % COLUMNS;
    const activeOffset = Math.floor((sweep % 18) / 3);
    const activeStart = Math.max(0, Math.min(COLUMNS - 18, activeColumn + activeOffset));

    return Array.from({ length: TOTAL_BLOCKS }, (_, index) => {
        const row = Math.floor(index / COLUMNS);
        const column = index % COLUMNS;

        if (index < completedBlocks) {
            return 'contiguous';
        }

        if (row === activeRow && column >= activeStart && column < activeStart + 11) {
            return 'fragmented';
        }

        if (row === activeRow && column >= activeStart + 12 && column < activeStart + 18) {
            return 'moving';
        }

        const group = Math.floor((column + row * 2) / (3 + (row % 4)));
        const gapChance = hashCell(row, group, 7);
        const islandChance = hashCell(row, Math.floor(column / 8), 11);
        const singleChance = hashCell(row, column, 13);

        if (row % 6 === 4 && gapChance < 0.62) return 'free';
        if (row > activeRow + 3 && gapChance < 0.42) return 'free';
        if (islandChance < 0.08) return 'system';
        if (singleChance < 0.01) return 'fragmented';
        if (singleChance > 0.985) return 'unmovable';
        return 'optimized';
    });
};

const DefragContent = memo(({ isPaused, setIsPaused }) => {
    const [progress, setProgress] = useState(START_PROGRESS);
    const [sweep, setSweep] = useState(44);
    const [isStopped, setIsStopped] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const [showDetails, setShowDetails] = useState(true);
    const isFinished = progress >= 100;
    const blocks = useMemo(() => buildDiskMap(progress, sweep), [progress, sweep]);
    const percent = Math.floor(progress);

    useEffect(() => {
        if (isPaused || isStopped || isFinished) return;

        const interval = setInterval(() => {
            setSweep(prev => (prev + 3) % 120);
            setProgress(prev => {
                const next = prev + 0.35;
                return next >= 100 ? 100 : next;
            });
        }, 120);

        return () => clearInterval(interval);
    }, [isPaused, isStopped, isFinished]);

    const handleStop = useCallback(() => {
        setIsStopped(true);
        setIsPaused(false);
    }, [setIsPaused]);

    const handlePause = useCallback(() => {
        if (!isFinished && !isStopped) {
            setIsPaused(prev => !prev);
        }
    }, [isFinished, isStopped, setIsPaused]);

    let statusText = 'Defragmenting file system...';
    if (isPaused) statusText = 'Defragmentation paused.';
    if (isStopped) statusText = 'Defragmentation stopped.';
    if (isFinished) statusText = 'Defragmentation complete.';

    return (
        <DefragPanel>
            {showDetails && (
                <DiskFrame>
                    <DiskMap aria-label="Drive C cluster map">
                        {blocks.map((kind, index) => (
                            <Block key={index} $kind={kind} />
                        ))}
                    </DiskMap>
                    <ScrollBar aria-hidden="true">
                        <ScrollButton>^</ScrollButton>
                        <ScrollTrack>
                            <ScrollThumb />
                        </ScrollTrack>
                        <ScrollButton>v</ScrollButton>
                    </ScrollBar>
                </DiskFrame>
            )}

            {showLegend && (
                <LegendPanel>
                    {LEGEND_ITEMS.map(([kind, label]) => (
                        <LegendItem key={kind}>
                            <LegendColor $kind={kind} />
                            {label}
                        </LegendItem>
                    ))}
                </LegendPanel>
            )}

            <FooterPanel>
                <StatusPanel>
                    <StatusText>{statusText}</StatusText>
                    <ProgressTrack aria-label={`${percent}% Complete`}>
                        {Array.from({ length: PROGRESS_SEGMENTS }).map((_, index) => (
                            <ProgressCell
                                key={index}
                                $filled={index < Math.round((percent / 100) * PROGRESS_SEGMENTS)}
                            />
                        ))}
                    </ProgressTrack>
                    <PercentText>{percent}% Complete</PercentText>
                </StatusPanel>

                <ControlPanel>
                    <Button onClick={handleStop} disabled={isStopped || isFinished}>
                        Stop
                    </Button>
                    <Button onClick={handlePause} disabled={isStopped || isFinished}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button onClick={() => setShowLegend(prev => !prev)}>
                        Legend
                    </Button>
                    <Button onClick={() => setShowDetails(prev => !prev)}>
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </Button>
                </ControlPanel>
            </FooterPanel>
        </DefragPanel>
    );
});

const DEFRAG_ICON = <Computer variant="16x16_4" />;

const Defrag = ({ closeDefrag }) => {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <Win95Window
            id="defrag"
            icon={DEFRAG_ICON}
            title="Defragmenting Drive C"
            onClose={closeDefrag}
            style={{
                width: '590px',
                maxWidth: 'calc(100vw - 12px)',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <DefragContent
                isPaused={isPaused}
                setIsPaused={setIsPaused}
            />
        </Win95Window>
    );
};

export default memo(Defrag);
