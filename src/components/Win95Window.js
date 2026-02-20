import React, { useRef, useState, useEffect } from 'react';
import { Frame, TitleBar } from '@react95/core';
import { useDraggable } from '@neodrag/react';
import { useWindowManager } from '../contexts/windowContext';

/**
 * A custom window component that replaces React95's Modal.
 * 
 * React95's Modal has a useEffect that tears down and re-registers with the
 * taskbar whenever icon/title references change, causing windows to vanish
 * from the taskbar and steal focus. This component uses React95's visual
 * primitives (Frame, TitleBar) but manages window state through our own
 * WindowManager context, completely bypassing the broken modal event system.
 */
function Win95Window({
    id,
    title,
    icon,
    children,
    onClose,
    menu = [],
    style = {},
    isMobile = false,
}) {
    const { openWindow, closeWindow, focusWindow, getZIndex, activeWindowId } = useWindowManager();
    const draggableRef = useRef(null);
    const [menuOpened, setMenuOpened] = useState('');
    const menuRef = useRef(null);

    useDraggable(draggableRef, {
        handle: '.draggable',
    });

    // Register window on mount, unregister on unmount
    useEffect(() => {
        openWindow(id, title, icon);
        return () => closeWindow(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Only re-run if ID changes (it never should)

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpened('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const zIndex = getZIndex(id);

    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <Frame
            ref={draggableRef}
            position="fixed"
            padding="$2"
            backgroundColor="$material"
            boxShadow="$out"
            role="dialog"
            style={{
                display: 'flex',
                flexDirection: 'column',
                top: '50px',
                zIndex,
                ...style,
            }}
            onMouseDown={() => focusWindow(id)}
        >
            <TitleBar
                active={activeWindowId === id}
                icon={icon}
                title={title}
                className="draggable"
                mb="$2"
            >
                <TitleBar.OptionsBox>
                    <TitleBar.Close onClick={handleClose} />
                </TitleBar.OptionsBox>
            </TitleBar>

            {menu && menu.length > 0 && (
                <ul ref={menuRef} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    listStyle: 'none',
                    margin: 0,
                    paddingLeft: 0,
                    paddingTop: '1px',
                    paddingBottom: '1px',
                    borderBottomStyle: 'solid',
                    borderWidth: '1px',
                    borderBottomColor: 'var(--r95-color-borderDark)',
                    boxShadow: '0 1px 0 0 var(--r95-color-borderLighter)',
                }}>
                    {menu.map(({ name, list }) => {
                        const active = menuOpened === name;
                        return (
                            <li
                                key={name}
                                onMouseDown={() => setMenuOpened(name)}
                                style={{
                                    position: 'relative',
                                    paddingLeft: '6px',
                                    paddingRight: '6px',
                                    userSelect: 'none',
                                    ...(active ? {
                                        backgroundColor: 'var(--r95-color-material)',
                                        color: 'var(--r95-color-materialTextInvert)',
                                    } : {})
                                }}
                            >
                                {name}
                                {active && list}
                            </li>
                        );
                    })}
                </ul>
            )}

            {children}
        </Frame>
    );
}

export default React.memo(Win95Window);
