import React, { useState, useEffect, useCallback, memo } from 'react';
import styled from 'styled-components';
import { Modal, TitleBar, Button, Frame, ProgressBar } from '@react95/core';
import { Computer } from '@react95/icons';

const DefragGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  gap: 1px;
  background-color: #000;
  padding: 1px;
  border: 1px solid #808080;
  overflow-y: auto;
  max-height: 200px;
`;

const Block = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${props => props.color || '#fff'};
  box-shadow: inset 1px 1px 1px rgba(255,255,255,0.2), inset -1px -1px 1px rgba(0,0,0,0.2);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
  border: 1px solid #808080;
  box-shadow: inset 1px 1px #fff, 1px 1px #000;
`;

const COLORS = {
    EMPTY: '#ffffff',
    CONTIGUOUS: '#0000ff', // Blue
    FRAGMENTED: '#ff0000', // Red
    READING: '#ffff00',    // Yellow
    OPTIMIZED: '#13fafb',  // Cyan/Light Blue
    UNMOVABLE: '#808080',  // Gray
    SYSTEM: '#000080',     // Dark Blue
};

// Sub-component to handle the actual simulation logic 
// this keeps the Modal component from re-rendering its wrapper unnecessarily
const DefragContent = memo(({ isPaused, setIsPaused, closeDefrag }) => {
    const [blocks, setBlocks] = useState([]);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Defragmenting...');
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const initialBlocks = Array.from({ length: 400 }, () => {
            const rand = Math.random();
            if (rand < 0.1) return COLORS.FRAGMENTED;
            if (rand < 0.2) return COLORS.SYSTEM;
            if (rand < 0.25) return COLORS.UNMOVABLE;
            if (rand < 0.6) return COLORS.CONTIGUOUS;
            return COLORS.EMPTY;
        });
        setBlocks(initialBlocks);
    }, []);

    const tick = useCallback(() => {
        if (isPaused || isFinished) return;

        setBlocks(prev => {
            const next = [...prev];
            const readingIndex = next.findIndex(c => c === COLORS.READING);
            if (readingIndex !== -1) {
                next[readingIndex] = COLORS.OPTIMIZED;
                return next;
            }
            const targetIndex = next.findIndex((c) =>
                c !== COLORS.OPTIMIZED &&
                c !== COLORS.UNMOVABLE &&
                c !== COLORS.EMPTY &&
                c !== COLORS.SYSTEM
            );
            if (targetIndex !== -1) {
                next[targetIndex] = COLORS.READING;
            } else {
                setIsFinished(true);
                setStatus('Defragmentation Complete');
                setProgress(100);
            }
            return next;
        });

        setProgress(prev => {
            const next = prev + 0.25;
            return next >= 100 ? 100 : next;
        });
    }, [isPaused, isFinished]);

    useEffect(() => {
        const interval = setInterval(tick, 200);
        return () => clearInterval(interval);
    }, [tick]);

    const handleRestart = () => {
        setProgress(0);
        setIsFinished(false);
        setStatus('Defragmenting...');
        setBlocks(Array.from({ length: 400 }, () => {
            const rand = Math.random();
            if (rand < 0.1) return COLORS.FRAGMENTED;
            if (rand < 0.2) return COLORS.SYSTEM;
            if (rand < 0.25) return COLORS.UNMOVABLE;
            if (rand < 0.6) return COLORS.CONTIGUOUS;
            return COLORS.EMPTY;
        }));
    };

    return (
        <div style={{ padding: '10px', backgroundColor: '#c0c0c0' }}>
            <div style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '5px' }}>Defragmenting... {Math.floor(progress)}% Complete</div>
                <ProgressBar percent={Math.floor(progress)} />
                <div style={{ marginTop: '5px', fontSize: '11px', textAlign: 'right', height: '14px' }}>
                    {status}
                </div>
            </div>

            <Frame boxShadow="in" backgroundColor="white" style={{ padding: '2px' }}>
                <DefragGrid>
                    {blocks.map((color, i) => (
                        <Block key={i} color={color} />
                    ))}
                </DefragGrid>
            </Frame>

            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                <LegendItem><LegendColor color={COLORS.CONTIGUOUS} /> Belongs</LegendItem>
                <LegendItem><LegendColor color={COLORS.FRAGMENTED} /> Fragmented</LegendItem>
                <LegendItem><LegendColor color={COLORS.READING} /> Reading</LegendItem>
                <LegendItem><LegendColor color={COLORS.OPTIMIZED} /> Optimized</LegendItem>
                <LegendItem><LegendColor color={COLORS.SYSTEM} /> System</LegendItem>
                <LegendItem><LegendColor color={COLORS.UNMOVABLE} /> Unmovable</LegendItem>
                <LegendItem><LegendColor color={COLORS.EMPTY} /> Free</LegendItem>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => setIsPaused(!isPaused)} disabled={isFinished}>
                    {isPaused ? 'Resume' : 'Stop'}
                </Button>
                <Button onClick={handleRestart} disabled={!isFinished}>
                    Restart
                </Button>
                <Button onClick={closeDefrag}>Close</Button>
            </div>
        </div>
    );
});

const Defrag = ({ closeDefrag, zIndex }) => {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <Modal
            id="defrag"
            icon={<Computer variant="16x16_4" />}
            title="Defragmenting Drive C"
            titleBarOptions={
                <TitleBar.Close onClick={closeDefrag} />
            }
            style={{
                width: '350px',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: zIndex
            }}
        >
            <DefragContent
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                closeDefrag={closeDefrag}
            />
        </Modal>
    );
};

export default memo(Defrag);
