import React from 'react'
import styled from 'styled-components'
import * as Icons from '@react95/icons'

const StyledItem = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: column;
	text-align: center;
	width: 25%;
	padding: 10px 0;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    .icon-wrapper {
        ${({ isSelected }) => isSelected && `
            filter: contrast(0.5) brightness(1.2) sepia(1) hue-rotate(180deg) saturate(5);
        `}
    }
`;

const StyledSpan = styled.span`
	margin-top: 5px;
    padding: 0 2px;
    ${({ isSelected }) => isSelected ? `
        background-color: #020242;
        color: white;
        outline: 1px dotted #fff;
    ` : `
        background-color: transparent;
        color: #000;
    `}
`

const iconMap = {
	info_bubble: 'InfoBubble',
	notepad_2: 'Notepad2',
	flying_through_space_100: 'FlyingThroughSpace100',
	progman_11: 'Progman11',
	inetcfg_2301: 'Inetcfg2301',
	folder: 'Folder',
};

function File({ item, openNotepad, openFolder, isSelected, onSelect }) {
	const { name, icon, type } = item;
	const IconComponent = Icons[iconMap[icon]] || Icons.Notepad2;

	const handleSingleClick = (e) => {
		e.stopPropagation();
		onSelect();
	};

	const handleDoubleClick = (e) => {
		e.stopPropagation();
		if (type === 'folder') {
			openFolder(item);
		} else {
			openNotepad(item);
		}
	};

	return (
		<StyledItem isSelected={isSelected} onClick={handleSingleClick} onDoubleClick={handleDoubleClick}>
			<div className="icon-wrapper">
				<IconComponent variant="32x32_4" />
			</div>
			<StyledSpan isSelected={isSelected}>{name}</StyledSpan>
		</StyledItem>
	)
}

export default File
