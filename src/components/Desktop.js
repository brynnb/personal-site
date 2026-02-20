import React, { useState, useContext, useEffect, useCallback } from 'react'
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
import { Wangimg130 } from '@react95/icons';
import { useClippy } from '@react95/clippy';
import Defrag from './Defrag';
import { useWindowManager } from '../contexts/windowContext';
import Win95Window from './Win95Window';

const funnyLines = [
    "bill gates tells me to burn things",
    "i for one welcome our new microsoft overlords.",
    "everything's coming up clippy!",
    "working on a portfolio? that's a paddlin'.",
    "this website is perfectly cromulent"
];

const PHOTO_ICON = <Wangimg130 variant="16x16_4" />;

function Desktop() {
    const isMobile = window.innerWidth < 850;

    const data = useContext(DataContext);
    const { clippy } = useClippy();
    const { focusWindow } = useWindowManager();

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
    const [photoOpened, togglePhoto] = useState(false);
    const [defragOpened, toggleDefrag] = useState(false);
    const [projectsOpened, toggleProjects] = useState(false);
    const [projectsItem, setProjectsItem] = useState(null);

    useEffect(() => {
        if (clippy && !isMobile) {
            clippy.show();
            clippy.animate();

            let index = 0;
            const initialDelay = setTimeout(() => {
                clippy.speak(funnyLines[index]);
            }, 1000);

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
    }, [clippy, isMobile]);

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

            const projectsFile = data.getItem('projects');
            setProjectsItem(projectsFile);
            toggleProjects(true);

            const aboutItem = data.getItem('about');
            setSelectedItem(aboutItem);
            toggleNotepad(true);
        }, [data]);


    const closeExplorer = useCallback(() => {
        toggleExplorer(false);
    }, []);

    const openExplorer = useCallback(() => {
        toggleExplorer(true);
        focusWindow('explorer');
    }, [focusWindow]);

    const closeMoreStuff = useCallback(() => toggleMoreStuff(false), []);
    const closeSecretStuff = useCallback(() => toggleSecretStuff(false), []);
    const openDefrag = useCallback(() => {
        toggleDefrag(true);
        focusWindow('defrag');
    }, [focusWindow]);
    const closeDefrag = useCallback(() => toggleDefrag(false), []);

    const openFolder = (item) => {
        if (item.id === 'more-stuff') {
            toggleMoreStuff(true);
            focusWindow('more-stuff');
        } else if (item.id === 'secret-stuff') {
            toggleSecretStuff(true);
            focusWindow('secret-stuff');
        }
    }

    const closeNotepad = useCallback(() => {
        toggleNotepad(false);
    }, []);

    const openNotepad = useCallback((item) => {
        if (item.id === 'projects') {
            toggleProjects(true);
            focusWindow('projects');
        } else {
            setSelectedItem(item)
            toggleNotepad(true);
            focusWindow('notepad');
        }
    }, [focusWindow]);

    const openPaint = useCallback(() => {
        togglePaint(true);
        focusWindow('paint');
    }, [focusWindow]);

    const closePaint = useCallback(() => {
        togglePaint(false);
    }, []);

    const openRecycleBin = useCallback(() => {
        toggleRecycleBin(true);
        focusWindow('recycle-bin');
    }, [focusWindow]);

    const closeRecycleBin = useCallback(() => {
        toggleRecycleBin(false);
    }, []);

    const openInternet = useCallback(() => {
        toggleInternet(true);
        focusWindow('internet');
    }, [focusWindow]);

    const closeInternet = useCallback(() => {
        toggleInternet(false);
    }, []);

    const openHamsterDance = useCallback(() => {
        toggleHamsterDance(true);
        focusWindow('hamster');
    }, [focusWindow]);

    const closeHamsterDance = useCallback(() => {
        toggleHamsterDance(false);
    }, []);

    const openClockAlert = useCallback(() => toggleClockAlert(true), []);
    const closeClockAlert = useCallback(() => toggleClockAlert(false), []);

    const openPhoto = useCallback(() => {
        togglePhoto(true);
        focusWindow('photo');
    }, [focusWindow]);
    const closePhoto = useCallback(() => togglePhoto(false), []);

    const handleBackgroundClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            setActiveSelection(null);
        }
    }, []);

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
                openPhoto={openPhoto}
                openDefrag={openDefrag}
            />
            {
                explorerOpened && (
                    <Explorer
                        items={items}
                        closeExplorer={closeExplorer}
                        openNotepad={openNotepad}
                        openFolder={openFolder}
                        isMobile={isMobile}
                        title="Stuff"
                        icon="Folder"
                        style={{
                            left: isMobile ? '5%' : '10%',
                            top: isMobile ? '10%' : '15%',
                        }}
                    />
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
                        style={{
                            left: isMobile ? '5%' : '20%',
                            top: '25%',
                        }}
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
                        style={{
                            left: isMobile ? '5%' : '25%',
                            top: '30%',
                        }}
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
                        style={{
                            left: isMobile ? '5%' : '15%',
                            top: isMobile ? '15%' : '20%',
                        }}
                    />
                )
            }
            {
                projectsOpened && (
                    <Notepad
                        id="projects"
                        closeNotepad={() => toggleProjects(false)}
                        selectedItem={projectsItem}
                        style={{
                            left: isMobile ? '100px' : 'calc(50% - 600px)',
                            top: isMobile ? '15%' : 'calc(10% + 200px)',
                        }}
                    />
                )
            }
            {
                notepadOpened && (
                    <Notepad id="notepad" closeNotepad={closeNotepad} selectedItem={selectedItem} />
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
                        message="don't click the clock!"
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
            {
                photoOpened && (
                    <Win95Window
                        id="photo"
                        icon={PHOTO_ICON}
                        title="hi-res-travel-photo.jpg"
                        onClose={closePhoto}
                        style={{
                            width: 'auto',
                            maxWidth: '90vw',
                            height: 'auto',
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            userSelect: 'none'
                        }}
                    >
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', backgroundColor: '#c0c0c0', userSelect: 'none' }}>
                            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                            <img
                                src={`${process.env.PUBLIC_URL}/images/hi-res-travel-photo.jpg`}
                                alt="High Resolution Travel Photo"
                                style={{ maxWidth: '100%', height: 'auto', imageRendering: 'pixelated' }}
                            />
                        </div>
                    </Win95Window>
                )
            }
            {
                defragOpened && (
                    <Defrag closeDefrag={closeDefrag} />
                )
            }
            <Player />
            <Taskbar onClockClick={openClockAlert} />
        </div>
    )
}

export default Desktop
