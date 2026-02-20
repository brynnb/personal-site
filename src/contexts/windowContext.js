import React, { createContext, useContext, useCallback, useRef, useState } from 'react';

const WindowContext = createContext(null);

const BASE_Z = 100;
const TASKBAR_Z = 999999;

export function WindowProvider({ children }) {
    // Use a counter to assign ever-increasing z-indices
    const zCounter = useRef(BASE_Z);

    // windows: Map of windowId -> { id, title, icon, zIndex, isOpen }
    const [windows, setWindows] = useState({});

    const openWindow = useCallback((id, title, icon) => {
        zCounter.current += 1;
        setWindows(prev => ({
            ...prev,
            [id]: {
                id,
                title: title || prev[id]?.title || id,
                icon: icon || prev[id]?.icon || null,
                zIndex: zCounter.current,
                isOpen: true,
            }
        }));
    }, []);

    const closeWindow = useCallback((id) => {
        setWindows(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const focusWindow = useCallback((id) => {
        zCounter.current += 1;
        setWindows(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    zIndex: zCounter.current,
                }
            };
        });
    }, []);

    const getZIndex = useCallback((id) => {
        return windows[id]?.zIndex || BASE_Z;
    }, [windows]);

    // Get sorted open windows for taskbar display
    const openWindows = Object.values(windows)
        .filter(w => w.isOpen)
        .sort((a, b) => {
            // Sort by the order they were first opened (lowest z = first opened)
            // Use their current id as tiebreaker for stability
            return a.id.localeCompare(b.id);
        });

    // Figure out which window is on top (active)
    const activeWindowId = openWindows.length > 0
        ? openWindows.reduce((top, w) => w.zIndex > top.zIndex ? w : top, openWindows[0]).id
        : null;

    return (
        <WindowContext.Provider value={{
            windows,
            openWindow,
            closeWindow,
            focusWindow,
            getZIndex,
            openWindows,
            activeWindowId,
            TASKBAR_Z,
        }}>
            {children}
        </WindowContext.Provider>
    );
}

export function useWindowManager() {
    const ctx = useContext(WindowContext);
    if (!ctx) throw new Error('useWindowManager must be used within WindowProvider');
    return ctx;
}

export default WindowContext;
