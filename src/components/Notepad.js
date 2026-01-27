import React, { useContext } from 'react'
import { Modal, Frame, TitleBar } from '@react95/core'
import { Notepad2 as NotepadIcon } from '@react95/icons'
import styled from 'styled-components'
import DataContext from '../contexts/dataContext'

const StyledContent = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: scroll;
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;
    font-family: 'MS Sans Serif', 'Fixedsys', monospace;
    font-size: 14px;
    padding: 2px;
    background: transparent;
    user-select: text;

    /* Custom scrollbar styling to match React95 */
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

const linkify = (text) => {
    // Match emails OR URLs
    // Group 1: Emails (to be ignored/text)
    // Group 2: URLs (to be linked)
    const combinedRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-z]{2,})/g;

    return text.split(combinedRegex).map((part, i) => {
        if (!part) return null;

        // If it's an email (checked against the first part of the regex)
        if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            return part;
        }

        // If it's a URL
        if (part.match(/^(https?:\/\/|www\.|[a-zA-Z0-9.-]+\.[a-z]{2,})/)) {
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

function Notepad({ closeNotepad, selectedItem, isMobile, zIndex }) {
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
                    ? `PROJECTS\n\n${item.content.projects.map(p => `${p.title}\n${p.description}\nLink: ${p.repo}`).join('\n\n')}`
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
                left: isMobile ? '5%' : '50%',
                top: isMobile ? '3%' : '10%',
                width: isMobile ? '90%' : 600,
                height: isMobile ? '85vh' : (selectedItem.id === 'about' ? 800 : 600),
                zIndex: zIndex
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
                <StyledContent>
                    {linkify(getContent(fullItem))}
                </StyledContent>
            </Frame>
        </Modal >
    )
}

export default React.memo(Notepad)
