import React, { useEffect, useState, useRef } from "react";
import { Modal, Frame, TitleBar, Alert } from "@react95/core";
import { Mspaint } from "@react95/icons";

function Paint({ closePaint, zIndex }) {
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

        handleResize(); // Check initial size
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
                <Modal
                    id="paint"
                    icon={<Mspaint variant="16x16_4" />}
                    title={"Paint"}
                    titleBarOptions={[
                        <Modal.Minimize key="minimize" />,
                        <TitleBar.Close onClick={closePaint} key="close" />,
                    ]}
                    style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: '100vw',
                        maxHeight: '100vh',
                        top: 0,
                        left: 0,
                        zIndex: zIndex
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
                </Modal>
            )}
        </>
    );
}

export default Paint;
