import React from 'react'
import styled from 'styled-components'
import { Modal, Frame, TitleBar } from '@react95/core'
import * as Icons from '@react95/icons'
import Item from './Item'

const FilesWrapper = styled.div`
	display: flex;
	grid-template-columns: repeat(4, 1fr);
	flex-wrap: wrap;
`;


function Explorer({ items, closeExplorer, openNotepad, openFolder, isMobile, title = "Explorer - Brynn Bateman", id = "explorer", icon = "WindowsExplorer", style = {} }) {
    const [activeFileSelection, setActiveFileSelection] = React.useState(null);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setActiveFileSelection(null);
        }
    };

    const IconComponent = Icons[icon] || Icons.WindowsExplorer;

    return (
        <Modal
            id={id}
            icon={<IconComponent variant="16x16_4" />}
            title={title}
            titleBarOptions={
                <TitleBar.Close onClick={closeExplorer} />
            }
            style={{
                left: isMobile ? '5%' : '15%',
                top: '20%',
                width: isMobile ? '90%' : 400,
                height: isMobile ? '70vh' : 450,
                ...style
            }}
            menu={[
                { name: 'File', list: [] },
                { name: 'Edit', list: [] },
                { name: 'Help', list: [] },
            ]}>
            <Frame
                backgroundColor="$inputBackground"
                boxShadow="$in"
                h="100%"
            >
                <FilesWrapper onClick={handleBackgroundClick}>
                    {
                        items.map((item) => (
                            <Item
                                key={item.id}
                                item={item}
                                openNotepad={openNotepad}
                                openFolder={openFolder}
                                isSelected={activeFileSelection === item.id}
                                onSelect={() => setActiveFileSelection(item.id)}
                            />
                        ))
                    }
                </FilesWrapper>
            </Frame>
        </Modal>
    )
}

export default Explorer
