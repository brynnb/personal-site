import React, { useContext } from 'react'
import { Modal, Frame, TitleBar } from '@react95/core'
import { Notepad2 as NotepadIcon } from '@react95/icons'
import styled from 'styled-components'
import DataContext from '../contexts/dataContext'

const ContentWrapper = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
`;

const StyledContent = styled.div`
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    overflow-y: scroll;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;
    font-family: 'MS Sans Serif', 'Fixedsys', monospace;
    font-size: 14px;
    padding: 2px;
    background: white;
    user-select: text;

    /* In WebKit browsers, use full width since fake scrollbar is hidden */
    @supports selector(::-webkit-scrollbar) {
        width: 100%;
    }

    /* WebKit scrollbar styling for Chrome/Safari/Edge */
    &::-webkit-scrollbar {
        width: 16px;
        height: 16px;
    }
    &::-webkit-scrollbar-track {
        background-color: #dfdfdf;
        box-shadow: inset -1px -1px #ffffff, inset 1px 1px #808080;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #c0c0c0;
        box-shadow: inset 1px 1px #ffffff, inset -1px -1px #808080;
    }
    &::-webkit-scrollbar-corner {
        background-color: #c0c0c0;
    }

    a {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }
`;

/* Fake decorative scrollbars - always visible */
const ScrollbarButton = styled.div`
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #c0c0c0;
    box-shadow: inset 1px 1px #ffffff, inset -1px -1px #808080;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
    }
`;

const FakeVerticalScrollbar = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: calc(100% - 16px);
    background-color: #dfdfdf;
    box-shadow: inset -1px -1px #ffffff, inset 1px 1px #808080;
    
    /* Hide in WebKit browsers where native scrollbar styling works */
    @supports selector(::-webkit-scrollbar) {
        display: none;
    }
`;

const UpArrow = styled(ScrollbarButton)`
    top: 0;
    right: 0;
    &::after {
        border-width: 0 4px 5px 4px;
        border-color: transparent transparent #808080 transparent;
    }
`;

const DownArrow = styled(ScrollbarButton)`
    bottom: 0;
    right: 0;
    &::after {
        border-width: 5px 4px 0 4px;
        border-color: #808080 transparent transparent transparent;
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

const linkify = (text) => {
    // Match emails OR URLs
    // Group 1: Emails (to be ignored/text)
    // Group 2: URLs (to be linked)
    const combinedRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|net|org|io|dev|co|me|info|xyz)[^\s]*)/g;

    return text.split(combinedRegex).map((part, i) => {
        if (!part) return null;

        // If it's an email (checked against the first part of the regex)
        if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            return part;
        }

        // If it's a URL
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

function Notepad({ closeNotepad, selectedItem, isMobile, zIndex, style }) {
    const data = useContext(DataContext);
    const fullItem = data.getItem(selectedItem.id);

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
                        let text = `${p.title}\n${p.description}\nTech Stack: ${p.techStack || ''}`;
                        if (p.url) text += `\nLink: ${p.url}`;
                        if (p.repo) text += `\nGitHub: ${p.repo}`;
                        return text;
                    }).join('\n\n')
                    : '';
            default:
                const content = item.content.paragraph || item.content.paragraphs || '';
                return Array.isArray(content) ? content.join('\n\n') : content;
        }
    };

    return (
        <Modal
            id="notepad"
            icon={<NotepadIcon variant="16x16_4" />}
            title={`${selectedItem.name.replace('.txt', '')} - Notepad`}
            titleBarOptions={
                <TitleBar.Close onClick={closeNotepad} />
            }
            style={{
                left: isMobile ? '5%' : 'calc(50% - 300px)',
                top: isMobile ? '3%' : '10%',
                width: isMobile ? '90%' : 600,
                height: isMobile ? '85vh' : (selectedItem.id === 'about' ? 800 : 600),
                zIndex: zIndex,
                ...style
            }}
            menu={[
                { name: 'File', list: [] },
                { name: 'Edit', list: [] },
                { name: 'Search', list: [] },
                { name: 'Help', list: [] }
            ]}>
            <Frame
                backgroundColor="$inputBackground"
                boxShadow="$in"
                h="100%"
                padding="$2"
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <ContentWrapper>
                    <StyledContent>
                        {linkify(getContent(fullItem))}
                    </StyledContent>
                    <FakeVerticalScrollbar>
                        <UpArrow />
                        <DownArrow />
                    </FakeVerticalScrollbar>
                    <FakeHorizontalScrollbar>
                        <LeftArrow />
                        <RightArrow />
                    </FakeHorizontalScrollbar>
                    <FakeScrollbarCorner />
                </ContentWrapper>
            </Frame>
        </Modal >
    )
}

export default React.memo(Notepad)
