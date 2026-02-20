import React from 'react';
import { Globe } from '@react95/icons';
import Win95Window from './Win95Window';

const GLOBE_ICON = <Globe variant="16x16_4" />;

const Internet = ({ closeInternet }) => {
    return (
        <Win95Window
            id="internet"
            icon={GLOBE_ICON}
            title="The Internet"
            onClose={closeInternet}
            style={{
                width: '300px',
                height: 'auto',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
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
        </Win95Window>
    );
};

export default React.memo(Internet);
