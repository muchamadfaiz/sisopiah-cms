import React, { useContext } from 'react'
import { ScrumboardContext } from './ScrumboardContext'
import { Draggable } from 'react-beautiful-dnd';
import BoardCard from './BoardCard';
import { modalModeTypes } from './utils';

const Board = ({ title, contents, index, isScrollable, isCombineEnabled, useClone }) => {
	const { updateModal, updateModalMode, updateCurrentListId, updateCardData } = useContext(ScrumboardContext)
	const newCard = listId => {
		updateModal(true)
		updateModalMode(modalModeTypes(0))
		updateCurrentListId(listId)
	}	

	const onUpdateCardModal = (obj, listId) => {
		updateModal(true)
		updateModalMode(modalModeTypes(1))
		updateCurrentListId(listId)
		updateCardData(obj)
  }

	return (
		<Draggable draggableId={title} index={index}>
			{
				(provided, snapshot) => (
					<div className="board-column" ref={provided.innerRef} {...provided.draggableProps}>
						<div className="board-title" {...provided.dragHandleProps}>
							<h4 className="mb-0">{title}</h4>
						</div>
						<BoardCard
							listId={title}
							listType="CONTENT"
							className={snapshot.isDragging ? 'is-dragging' : ''}
							contents={contents}
							internalScroll={isScrollable}
							isCombineEnabled={isCombineEnabled}
							useClone={useClone}
							cardData={onUpdateCardModal}
						/>
						<div className="board-add" onClick={() => newCard(title)}>
							<div>Add task</div>
						</div>
					</div>
				)
			}
		</Draggable>
	)
}

export default Board
