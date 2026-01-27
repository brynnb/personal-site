import React, { useState, useContext, useEffect } from 'react'
import Explorer from './Explorer'
import Notepad from './Notepad';
import DataContext from '../contexts/dataContext'
import Shortcuts from './Shortcuts';
import Player from './Player';
import Paint from './Paint';
import Internet from './Internet';
import HamsterDance from './HamsterDance';
import Taskbar from './Taskbar';
import { Alert, TitleBar } from '@react95/core';

import { useClippy } from '@react95/clippy';

const funnyLines = [
    "bill gates tells me to burn things",
    "i for one welcome our new microsoft overlords.",
    "everything's coming up clippy!",
    "working on a portfolio? that's a paddlin'.",
    "this website is perfectly cromulent"
];

function Desktop() {
    const isMobile = window.innerWidth < 850;

    const data = useContext(DataContext);
    const { clippy } = useClippy();
    const [explorerOpened, toggleExplorer] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [notepadOpened, toggleNotepad] = useState(false);
    const [paintOpened, togglePaint] = useState(false);
    const [internetOpened, toggleInternet] = useState(false);
    const [hamsterDanceOpened, toggleHamsterDance] = useState(false);
    const [recycleBinOpened, toggleRecycleBin] = useState(false);
    const [moreStuffOpened, toggleMoreStuff] = useState(false);
    const [secretStuffOpened, toggleSecretStuff] = useState(false);
    const [activeSelection, setActiveSelection] = useState(null);
    const [items, setItems] = useState([]);
    const [trashItems, setTrashItems] = useState([]);
    const [moreStuffItems, setMoreStuffItems] = useState([]);
    const [secretStuffItems, setSecretStuffItems] = useState([]);
    const [clockAlertOpened, toggleClockAlert] = useState(false);

    useEffect(() => {
        if (clippy) {
            clippy.show();
            clippy.animate();

            let index = 0;
            const initialDelay = setTimeout(() => {
                clippy.speak(funnyLines[index]);
            }, 1000); // Wait 1s for positioning

            const interval = setInterval(() => {
                index = (index + 1) % funnyLines.length;
                clippy.speak(funnyLines[index]);
                clippy.animate();
            }, 30000);

            return () => {
                clearTimeout(initialDelay);
                clearInterval(interval);
            };
        }
    }, [clippy]);

    useEffect(
        () => {
            const files = data.getFolderItems(null);
            const trash = data.getTrashItems();
            const moreStuff = data.getFolderItems('more-stuff');
            const secretStuff = data.getFolderItems('secret-stuff');

            setItems(files);
            setTrashItems(trash);
            setMoreStuffItems(moreStuff);
            setSecretStuffItems(secretStuff);

            const aboutItem = data.getItem('about');
            setSelectedItem(aboutItem);
            toggleNotepad(true);
        }, [data]);


    const closeExplorer = () => {
        toggleExplorer(false);
    };

    const openExplorer = () => {
        toggleExplorer(true);
    };

    const closeMoreStuff = () => toggleMoreStuff(false);
    const closeSecretStuff = () => toggleSecretStuff(false);

    const openFolder = (item) => {
        if (item.id === 'more-stuff') {
            toggleMoreStuff(true);
        } else if (item.id === 'secret-stuff') {
            toggleSecretStuff(true);
        }
    }

    const closeNotepad = () => {
        toggleNotepad(false);
    };

    const openNotepad = (item) => {
        setSelectedItem(item)
        toggleNotepad(true);
    };

    const openPaint = () => {
        togglePaint(true);
    };

    const closePaint = () => {
        togglePaint(false);
    };

    const openRecycleBin = () => {
        toggleRecycleBin(true);
    };

    const closeRecycleBin = () => {
        toggleRecycleBin(false);
    };

    const openInternet = () => {
        toggleInternet(true);
    };

    const closeInternet = () => {
        toggleInternet(false);
    };

    const openHamsterDance = () => {
        toggleHamsterDance(true);
    };

    const closeHamsterDance = () => {
        toggleHamsterDance(false);
    };

    const openClockAlert = () => toggleClockAlert(true);
    const closeClockAlert = () => toggleClockAlert(false);

    const handleBackgroundClick = (e) => {
        // Only deselect if we click the actual desktop background
        if (e.target === e.currentTarget) {
            setActiveSelection(null);
        }
    };

    return (
        <div
            onClick={handleBackgroundClick}
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 0
            }}
        >
            <Shortcuts
                openExplorer={openExplorer}
                openPaint={openPaint}
                openNotepad={openNotepad}
                openRecycleBin={openRecycleBin}
                openInternet={openInternet}
                openHamsterDance={openHamsterDance}
                activeSelection={activeSelection}
                setActiveSelection={setActiveSelection}
            />
            {
                explorerOpened && (
                    <Explorer items={items} closeExplorer={closeExplorer} openNotepad={openNotepad} openFolder={openFolder} isMobile={isMobile} title="Stuff" icon="Folder" />
                )
            }
            {
                moreStuffOpened && (
                    <Explorer
                        items={moreStuffItems}
                        closeExplorer={closeMoreStuff}
                        openNotepad={openNotepad}
                        openFolder={openFolder}
                        isMobile={isMobile}
                        title="More Stuff"
                        id="more-stuff"
                        icon="Folder"
                        style={{ left: isMobile ? '5%' : '20%', top: '25%' }}
                    />
                )
            }
            {
                secretStuffOpened && (
                    <Explorer
                        items={secretStuffItems}
                        closeExplorer={closeSecretStuff}
                        openNotepad={openNotepad}
                        openFolder={openFolder}
                        isMobile={isMobile}
                        title="Really Secret Stuff"
                        id="secret-stuff"
                        icon="Folder"
                        style={{ left: isMobile ? '5%' : '25%', top: '30%' }}
                    />
                )
            }
            {
                recycleBinOpened && (
                    <Explorer
                        items={trashItems}
                        closeExplorer={closeRecycleBin}
                        openNotepad={openNotepad}
                        openFolder={openFolder}
                        isMobile={isMobile}
                        title="Recycle Bin"
                        id="recycle-bin"
                        icon="RecycleFull"
                    />
                )
            }
            {
                notepadOpened && (
                    <Notepad closeNotepad={closeNotepad} selectedItem={selectedItem} isMobile={isMobile} />
                )
            }
            {
                paintOpened && (
                    <Paint closePaint={closePaint} />
                )
            }
            {
                internetOpened && (
                    <Internet closeInternet={closeInternet} />
                )
            }
            {
                hamsterDanceOpened && (
                    <HamsterDance closeHamsterDance={closeHamsterDance} />
                )
            }
            {
                clockAlertOpened && (
                    <Alert
                        title="System Message"
                        type="error"
                        message="please don't click the clock"
                        titleBarOptions={[
                            <TitleBar.Close key="close" onClick={closeClockAlert} />
                        ]}
                        buttons={[
                            {
                                value: "OK",
                                onClick: closeClockAlert,
                            },
                        ]}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            width: '300px',
                            zIndex: 1000000
                        }}
                    />
                )
            }
            <Player />
            <Taskbar onClockClick={openClockAlert} />
        </div>
    )
}

export default Desktop
