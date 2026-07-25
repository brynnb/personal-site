import React from 'react';
import { Button, Input } from '@react95/core';
import { Rundll1 } from '@react95/icons';
import styled from 'styled-components';
import Win95Window from './Win95Window';

const RUN_ICON = (
    <Rundll1
        variant="32x32_4"
        style={{ width: 16, height: 16 }}
    />
);

const DialogBody = styled.form`
    width: 390px;
    max-width: calc(100vw - 32px);
    box-sizing: border-box;
    padding: 10px 8px 8px;
`;

const Introduction = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
`;

const LargeIcon = styled.div`
    flex: 0 0 32px;
    width: 32px;
    height: 32px;

    svg {
        width: 32px;
        height: 32px;
    }
`;

const Instructions = styled.p`
    margin: 0;
    line-height: 1.25;
`;

const OpenRow = styled.label`
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    align-items: center;
    gap: 6px;
`;

const CommandInput = styled(Input)`
    width: 100%;
    height: 23px;
    box-sizing: border-box;
    padding: 2px 4px;
    caret-color: transparent;
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 12px;
`;

const DialogButton = styled(Button)`
    min-width: 76px;
`;

function RunDialog({ onClose, onRun }) {
    const runCommand = (event) => {
        event.preventDefault();
        onRun();
    };

    return (
        <Win95Window
            id="run-dialog"
            title="Run"
            icon={RUN_ICON}
            onClose={onClose}
            style={{
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <DialogBody onSubmit={runCommand}>
                <Introduction>
                    <LargeIcon aria-hidden="true">
                        <Rundll1 variant="32x32_4" />
                    </LargeIcon>
                    <Instructions>
                        Type the name of a program, folder, document, or Internet resource,
                        and Windows will open it for you.
                    </Instructions>
                </Introduction>

                <OpenRow>
                    <span><u>O</u>pen:</span>
                    <CommandInput
                        autoFocus
                        value={'command.com /c deltree /y "C:\\"'}
                        readOnly
                        aria-label="Open"
                    />
                </OpenRow>

                <ButtonRow>
                    <DialogButton type="submit">OK</DialogButton>
                    <DialogButton type="button" onClick={onClose}>Cancel</DialogButton>
                    <DialogButton type="button">Browse...</DialogButton>
                </ButtonRow>
            </DialogBody>
        </Win95Window>
    );
}

export default RunDialog;
