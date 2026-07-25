import React, { useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    box-sizing: border-box;
    padding: 30vh 6vw 24px;
    overflow: hidden;
    background-color: #0000aa;
    color: #ffffff;
    font-family: 'Lucida Console', 'Courier New', monospace;
    font-size: clamp(11px, 1.35vw, 16px);
    font-weight: bold;
    line-height: 1.25;
    user-select: none;
`;

const Message = styled.div`
    width: min(100%, 800px);
`;

const WindowsLabel = styled.div`
    width: fit-content;
    margin: 0 auto 16px;
    padding: 1px 7px;
    background-color: #c0c0c0;
    color: #0000aa;
`;

const ErrorText = styled.div`
    white-space: pre-wrap;
`;

const ContinueText = styled.div`
    margin-top: 16px;
    text-align: center;
`;

function BsodOverlay({ onClose }) {
    useEffect(() => {
        const timeout = window.setTimeout(onClose, 5000);
        window.addEventListener('keydown', onClose);

        return () => {
            window.clearTimeout(timeout);
            window.removeEventListener('keydown', onClose);
        };
    }, [onClose]);

    return (
        <Overlay
            role="alertdialog"
            aria-modal="true"
            aria-label="Windows error"
            onMouseDown={onClose}
        >
            <Message>
                <WindowsLabel>Windows</WindowsLabel>
                <ErrorText>{`An error has occurred. To continue:

Press Enter to return to Windows, or

Press CTRL+ALT+DEL to restart your computer. If you do this,
you will lose any unsaved information in all open applications.

Error: 0E : 016F : BFF9B3D4`}</ErrorText>
                <ContinueText>Press any key to continue _</ContinueText>
            </Message>
        </Overlay>
    );
}

export default BsodOverlay;
