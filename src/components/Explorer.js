import React from 'react'
import styled from 'styled-components'
import { Frame } from '@react95/core'
import * as Icons from '@react95/icons'
import Item from './Item'
import Win95Window from './Win95Window'

const FilesWrapper = styled.div`
	display: flex;
	grid-template-columns: repeat(4, 1fr);
	flex-wrap: wrap;
`;


function Explorer({ items, closeExplorer, openNotepad, openFolder, isMobile, title = "Explorer - Brynn Bateman", id = "explorer", icon = "Folder", style = {} }) {
    const [activeFileSelection, setActiveFileSelection] = React.useState(null);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setActiveFileSelection(null);
        }
    };

    const memoizedIcon = React.useMemo(() => {
        const IconComponent = Icons[icon] || Icons.Folder;
        return <IconComponent variant="16x16_4" />;
    }, [icon]);

    return (
        <Win95Window
            id={id}
            icon={memoizedIcon}
            title={title}
            onClose={closeExplorer}
            style={{
                left: isMobile ? '5%' : '15%',
                top: '20%',
                width: isMobile ? '90%' : 400,
                height: isMobile ? '70vh' : 450,
                ...style
            }}
            menu={[
                { name: 'File', list: null },
                { name: 'Edit', list: null },
                { name: 'Help', list: null },
            ]}
            isMobile={isMobile}
        >
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
        </Win95Window>
    )
}

export default React.memo(Explorer);
