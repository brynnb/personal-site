import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Frame } from '@react95/core'
import { Notepad2 as NotepadIcon } from '@react95/icons'
import styled from 'styled-components'
import DataContext from '../contexts/dataContext'
import Win95Window from './Win95Window'

const NotepadWrapper = styled.div`
    @media (max-width: 850px) {
        /* On mobile, override Win95Window positioning to be fullscreen */
        & > div {
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: calc(100vh - 28px) !important;
            height: calc(100dvh - 28px) !important;
        }
    }
`;

const ContentWrapper = styled.div`
    flex: 1;
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
`;

const NotepadBodyFrame = styled(Frame)`
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--r95-color-borderDarkest);
    border-left: 1px solid var(--r95-color-borderDarkest);
`;

const StyledContent = styled.div`
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    overflow-y: scroll;
    overflow-x: hidden;
    overscroll-behavior: none;
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;
    font-family: 'Fixedsys Excelsior', 'Fixedsys', monospace;
    font-size: 16px;
    font-variant-ligatures: none;
    padding: 4px;
    padding-bottom: 80px;
    background: white;
    user-select: text;
    color: black;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    a {
        font-family: 'Fixedsys Excelsior', 'Fixedsys', monospace;
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }
`;

const ScrollbarButton = styled.button`
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 0;
    padding: 0;
    border: 0;
    background-color: #c0c0c0;
    box-shadow:
        inset 1px 1px #ffffff,
        inset -1px -1px #000000,
        inset 2px 2px #dfdfdf,
        inset -2px -2px #808080;
    display: flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    user-select: none;

    &:active {
        box-shadow:
            inset 1px 1px #000000,
            inset -1px -1px #ffffff,
            inset 2px 2px #808080,
            inset -2px -2px #dfdfdf;
    }

    &:active::after {
        transform: translate(1px, 1px);
    }

    &::after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
    }
`;

const VerticalScrollbar = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: calc(100% - 16px);
    background-color: #dfdfdf;
    box-shadow: inset -1px -1px #ffffff, inset 1px 1px #808080;
    user-select: none;
`;

const VerticalTrack = styled.div`
    position: absolute;
    top: 16px;
    right: 0;
    bottom: 16px;
    left: 0;
    overflow: hidden;
    background-color: #dfdfdf;
    box-shadow: inset -1px -1px #ffffff, inset 1px 1px #808080;
`;

const VerticalThumb = styled.div`
    position: absolute;
    top: ${({ $top }) => $top}px;
    left: 0;
    width: 16px;
    height: ${({ $height }) => $height}px;
    display: ${({ $visible }) => ($visible ? 'block' : 'none')};
    box-sizing: border-box;
    background-color: #c0c0c0;
    box-shadow:
        inset 1px 1px #ffffff,
        inset -1px -1px #000000,
        inset 2px 2px #dfdfdf,
        inset -2px -2px #808080;
    touch-action: none;
    user-select: none;
`;

const UpArrow = styled(ScrollbarButton)`
    top: 0;
    right: 0;
    &::after {
        border-width: 0 4px 5px 4px;
        border-color: transparent transparent #000000 transparent;
    }
`;

const DownArrow = styled(ScrollbarButton)`
    bottom: 0;
    right: 0;
    &::after {
        border-width: 5px 4px 0 4px;
        border-color: #000000 transparent transparent transparent;
    }
`;

const FakeHorizontalScrollbar = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    height: 16px;
    width: calc(100% - 16px);
    background-color: #dfdfdf;
    box-shadow: inset -1px -1px #ffffff, inset 1px 1px #808080;
`;

const LeftArrow = styled(ScrollbarButton)`
    left: 0;
    bottom: 0;
    &::after {
        border-width: 4px 5px 4px 0;
        border-color: transparent #808080 transparent transparent;
    }
`;

const RightArrow = styled(ScrollbarButton)`
    right: 0;
    bottom: 0;
    &::after {
        border-width: 4px 0 4px 5px;
        border-color: transparent transparent transparent #808080;
    }
`;

const FakeScrollbarCorner = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    background-color: #c0c0c0;
`;

const MIN_THUMB_HEIGHT = 18;
const LINE_SCROLL_AMOUNT = 32;

function Win95VerticalScrollbar({ contentRef, contentVersion }) {
    const trackRef = useRef(null);
    const dragRef = useRef(null);
    const [metrics, setMetrics] = useState({
        maxScroll: 0,
        scrollTop: 0,
        thumbHeight: 0,
        thumbTop: 0,
        thumbTravel: 0
    });

    const updateMetrics = useCallback(() => {
        const content = contentRef.current;
        const track = trackRef.current;
        if (!content || !track) return;

        const maxScroll = Math.max(0, content.scrollHeight - content.clientHeight);
        const trackHeight = track.clientHeight;
        const proportionalHeight = content.scrollHeight > 0
            ? Math.round(trackHeight * (content.clientHeight / content.scrollHeight))
            : trackHeight;
        const thumbHeight = Math.min(
            trackHeight,
            Math.max(MIN_THUMB_HEIGHT, proportionalHeight)
        );
        const thumbTravel = Math.max(0, trackHeight - thumbHeight);
        const scrollTop = Math.min(maxScroll, Math.max(0, content.scrollTop));
        const thumbTop = maxScroll > 0
            ? Math.round((scrollTop / maxScroll) * thumbTravel)
            : 0;

        setMetrics((current) => {
            const next = {
                maxScroll,
                scrollTop,
                thumbHeight,
                thumbTop,
                thumbTravel
            };

            return Object.keys(next).every((key) => current[key] === next[key])
                ? current
                : next;
        });
    }, [contentRef]);

    useEffect(() => {
        const content = contentRef.current;
        const track = trackRef.current;
        if (!content || !track) return undefined;

        const animationFrame = window.requestAnimationFrame(updateMetrics);
        content.addEventListener('scroll', updateMetrics, { passive: true });

        const resizeObserver = typeof ResizeObserver === 'undefined'
            ? null
            : new ResizeObserver(updateMetrics);

        if (resizeObserver) {
            resizeObserver.observe(content);
            resizeObserver.observe(track);
        } else {
            window.addEventListener('resize', updateMetrics);
        }

        return () => {
            window.cancelAnimationFrame(animationFrame);
            content.removeEventListener('scroll', updateMetrics);
            resizeObserver?.disconnect();
            if (!resizeObserver) {
                window.removeEventListener('resize', updateMetrics);
            }
        };
    }, [contentRef, contentVersion, updateMetrics]);

    const scrollBy = useCallback((amount) => {
        contentRef.current?.scrollBy({ top: amount, behavior: 'auto' });
    }, [contentRef]);

    const handleTrackPointerDown = useCallback((event) => {
        if (event.target !== event.currentTarget) return;

        const content = contentRef.current;
        const track = trackRef.current;
        if (!content || !track) return;

        const clickPosition = event.clientY - track.getBoundingClientRect().top;
        const pageAmount = Math.max(LINE_SCROLL_AMOUNT, content.clientHeight - 24);

        if (clickPosition < metrics.thumbTop) {
            scrollBy(-pageAmount);
        } else if (clickPosition > metrics.thumbTop + metrics.thumbHeight) {
            scrollBy(pageAmount);
        }
    }, [contentRef, metrics.thumbHeight, metrics.thumbTop, scrollBy]);

    const handleThumbPointerDown = useCallback((event) => {
        if (metrics.maxScroll <= 0) return;

        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
            pointerId: event.pointerId,
            startY: event.clientY,
            startScrollTop: contentRef.current?.scrollTop || 0
        };
    }, [contentRef, metrics.maxScroll]);

    const handleThumbPointerMove = useCallback((event) => {
        const drag = dragRef.current;
        const content = contentRef.current;
        if (!drag || !content || drag.pointerId !== event.pointerId) return;

        const scrollPerPixel = metrics.thumbTravel > 0
            ? metrics.maxScroll / metrics.thumbTravel
            : 0;
        content.scrollTop = drag.startScrollTop
            + ((event.clientY - drag.startY) * scrollPerPixel);
    }, [contentRef, metrics.maxScroll, metrics.thumbTravel]);

    const stopThumbDrag = useCallback((event) => {
        if (dragRef.current?.pointerId !== event.pointerId) return;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        dragRef.current = null;
    }, []);

    const handleThumbKeyDown = useCallback((event) => {
        const content = contentRef.current;
        if (!content) return;

        const pageAmount = Math.max(LINE_SCROLL_AMOUNT, content.clientHeight - 24);
        const actions = {
            ArrowUp: () => scrollBy(-LINE_SCROLL_AMOUNT),
            ArrowDown: () => scrollBy(LINE_SCROLL_AMOUNT),
            PageUp: () => scrollBy(-pageAmount),
            PageDown: () => scrollBy(pageAmount),
            Home: () => { content.scrollTop = 0; },
            End: () => { content.scrollTop = metrics.maxScroll; }
        };

        if (actions[event.key]) {
            event.preventDefault();
            actions[event.key]();
        }
    }, [contentRef, metrics.maxScroll, scrollBy]);

    return (
        <VerticalScrollbar>
            <UpArrow
                type="button"
                aria-label="Scroll up"
                onClick={() => scrollBy(-LINE_SCROLL_AMOUNT)}
            />
            <VerticalTrack ref={trackRef} onPointerDown={handleTrackPointerDown}>
                <VerticalThumb
                    role="scrollbar"
                    aria-label="Vertical scrollbar"
                    aria-orientation="vertical"
                    aria-valuemin={0}
                    aria-valuemax={Math.round(metrics.maxScroll)}
                    aria-valuenow={Math.round(metrics.scrollTop)}
                    tabIndex={metrics.maxScroll > 0 ? 0 : -1}
                    $visible={metrics.maxScroll > 0}
                    $height={metrics.thumbHeight}
                    $top={metrics.thumbTop}
                    onKeyDown={handleThumbKeyDown}
                    onPointerDown={handleThumbPointerDown}
                    onPointerMove={handleThumbPointerMove}
                    onPointerUp={stopThumbDrag}
                    onPointerCancel={stopThumbDrag}
                />
            </VerticalTrack>
            <DownArrow
                type="button"
                aria-label="Scroll down"
                onClick={() => scrollBy(LINE_SCROLL_AMOUNT)}
            />
        </VerticalScrollbar>
    );
}

const linkify = (text) => {
    const combinedRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|net|org|io|dev|co|me|info|xyz)[^\s]*)/g;

    return text.split(combinedRegex).map((part, i) => {
        if (!part) return null;

        if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            return part;
        }

        if (part.match(/^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(?:com|net|org|io|dev|co|me|info|xyz))/)) {
            const url = part.startsWith('http') ? part : `http://${part}`;
            return (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    {part}
                </a>
            );
        }

        return part;
    });
};

const NOTEPAD_ICON = <NotepadIcon variant="16x16_4" />;

function Notepad({ id = "notepad", closeNotepad, selectedItem, style }) {
    const data = useContext(DataContext);
    const contentRef = useRef(null);
    const fullItem = data.getItem(selectedItem.id);
    const largeText = selectedItem.id === 'about' || selectedItem.id === 'projects';

    const getContent = (item) => {
        if (!item || !item.content) return '';

        switch (item.id) {
            case 'about':
                return item.content.paragraphs ? item.content.paragraphs.join('\n\n') : '';
            case 'resume':
                return item.content.workExperience
                    ? `RESUME\n\n${item.content.workExperience.map(w => `${w.jobTitle} @ ${w.company}\n${w.period}\n${w.description || ''}`).join('\n\n')}`
                    : '';
            case 'skills':
                return item.content.hard
                    ? `TECHNICAL SKILLS\n${item.content.hard.map(s => `- ${s.name}: ${s.progress}%`).join('\n')}\n\nINTERPERSONAL SKILLS\n${item.content.soft || ''}`
                    : '';
            case 'contact':
                return `CONTACT\n\nEmail: ${item.content.email || ''}\n\nSocial:\n${item.content.social ? item.content.social.map(s => `- ${s.name}: ${s.link}`).join('\n') : ''}`;
            case 'projects':
                return item.content.projects
                    ? item.content.projects.map(p => {
                        let text = `${p.title}\n${p.description}`;
                        if (p.url) text += `\n${p.url}`;
                        else if (p.repo) text += `\n${p.repo}`;
                        return text;
                    }).join('\n\n')
                    : '';
            default:
                const content = item.content.paragraph || item.content.paragraphs || '';
                return Array.isArray(content) ? content.join('\n\n') : content;
        }
    };
    const content = getContent(fullItem);

    return (
        <NotepadWrapper>
            <Win95Window
                id={id}
                icon={NOTEPAD_ICON}
                title={`${selectedItem.name.replace('.txt', '')} - Notepad`}
                onClose={closeNotepad}
                style={{
                    left: 'calc(50% - 300px)',
                    top: '10%',
                    width: 600,
                    height: selectedItem.id === 'about' ? 470 : 600,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    border: '1px solid var(--r95-color-borderDark)',
                    ...style
                }}
                menu={[
                    { name: 'File', list: null },
                    { name: 'Edit', list: null },
                    { name: 'Search', list: null },
                    { name: 'Help', list: null }
                ]}
            >
                <NotepadBodyFrame
                    backgroundColor="$inputBackground"
                >
                    <ContentWrapper>
                        <StyledContent ref={contentRef} $largeText={largeText}>
                            {linkify(content)}
                        </StyledContent>
                        <Win95VerticalScrollbar
                            contentRef={contentRef}
                            contentVersion={`${selectedItem.id}:${content.length}`}
                        />
                        <FakeHorizontalScrollbar>
                            <LeftArrow type="button" tabIndex={-1} aria-hidden="true" />
                            <RightArrow type="button" tabIndex={-1} aria-hidden="true" />
                        </FakeHorizontalScrollbar>
                        <FakeScrollbarCorner />
                    </ContentWrapper>
                </NotepadBodyFrame>
            </Win95Window>
        </NotepadWrapper>
    )
}

export default React.memo(Notepad)
