import React from 'react';
import { Modal, TitleBar } from '@react95/core';
import { Globe } from '@react95/icons';

const Internet = ({ closeInternet, zIndex }) => {
    return (
        <Modal
            id="internet"
            icon={<Globe variant="16x16_4" />}
            title="The Internet"
            titleBarOptions={
                <TitleBar.Close onClick={closeInternet} />
            }
            style={{
                width: '300px',
                height: 'auto',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: zIndex,
                userSelect: 'none'
            }}
        >
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', backgroundColor: 'black', userSelect: 'none' }}>
                <img
                    src={`${process.env.PUBLIC_URL}/images/baby.gif`}
                    alt="The Internet"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </div>
        </Modal>
    );
};

export default React.memo(Internet);
