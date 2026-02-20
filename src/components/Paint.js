import React, { useEffect, useState, useRef } from "react";
import { Frame, Alert, TitleBar } from "@react95/core";
import { Mspaint } from "@react95/icons";
import Win95Window from './Win95Window';

const PAINT_ICON = <Mspaint variant="16x16_4" />;

function Paint({ closePaint }) {
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const windowWidth = useRef(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            windowWidth.current = window.innerWidth;
            if (windowWidth.current < 768) {
                setShowAlert(true);
                setShowModal(false);
            } else {
                setShowAlert(false);
                setShowModal(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleCloseAlert = () => {
        setShowAlert(false);
        closePaint();
    };

    return (
        <>
            {showAlert && (
                <Alert
                    title="Error"
                    type="error"
                    message="Paint has the best user experience on desktop devices. Please open this on a larger screen."
                    titleBarOptions={
                        <TitleBar.Close key="close" onClick={handleCloseAlert} />
                    }
                    buttons={[
                        {
                            value: "OK",
                            onClick: handleCloseAlert,
                        },
                    ]}
                />
            )}
            {showModal && (
                <Win95Window
                    id="paint"
                    icon={PAINT_ICON}
                    title="Paint"
                    onClose={closePaint}
                    style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: '100vw',
                        maxHeight: '100vh',
                        top: 0,
                        left: 0,
                    }}
                >
                    <Frame style={{ padding: 0, width: "100%", height: "100%", border: 'none' }}>
                        <iframe
                            src="https://jspaint.app"
                            title="Paint"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                        ></iframe>
                    </Frame>
                </Win95Window>
            )}
        </>
    );
}

export default Paint;
