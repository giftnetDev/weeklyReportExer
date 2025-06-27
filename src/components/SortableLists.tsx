import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

interface Item {
    id: string;
    content: string;
}

type Lists = Record<string, Item[]>;
type NewItemInputs = Record<string, string>;

const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const move = (
    source: Item[],
    destination: Item[],
    droppableSource: { index: number; droppableId: string },
    droppableDestination: { index: number; droppableId: string }
): { [key: string]: Item[] } => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [moved] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, moved);
    return {
        [droppableSource.droppableId]: sourceClone,
        [droppableDestination.droppableId]: destClone,
    };
};

const days = ['일', '월', '화', '수', '목', '금', '토'];

const SortableLists: React.FC = () => {
    const initialLists: Lists = days.reduce((acc, day) => {
        acc[day] = [];
        return acc;
    }, {} as Lists);

    const initialInputs: NewItemInputs = days.reduce((acc, day) => {
        acc[day] = '';
        return acc;
    }, {} as NewItemInputs);

    const [lists, setLists] = useState<Lists>(initialLists);
    const [newItemContent, setNewItemContent] = useState<NewItemInputs>(initialInputs);

    const handleAddItem = (day: string) => {
        const content = newItemContent[day].trim();
        if (!content) return;
        const newItem: Item = { id: `${day}-${Date.now()}`, content };
        setLists(prev => ({
            ...prev,
            [day]: [...prev[day], newItem],
        }));
        setNewItemContent(prev => ({ ...prev, [day]: '' }));
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId) {
            const items = reorder(lists[source.droppableId], source.index, destination.index);
            setLists(prev => ({ ...prev, [source.droppableId]: items }));
        } else {
            const movedLists = move(
                lists[source.droppableId],
                lists[destination.droppableId],
                source,
                destination
            );
            setLists(prev => ({
                ...prev,
                [source.droppableId]: movedLists[source.droppableId],
                [destination.droppableId]: movedLists[destination.droppableId],
            }));
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <DragDropContext onDragEnd={onDragEnd}>
                {days.map(day => (
                    <div key={day} style={{ width: '200px', margin: '8px' }}>
                        <h3>[{day}]</h3>
                        <div style={{ display: 'flex', marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={newItemContent[day]}
                                onChange={e => setNewItemContent(prev => ({ ...prev, [day]: e.target.value }))}
                                placeholder="새 아이템"
                                style={{ flexGrow: 1, marginRight: '4px' }}
                            />
                            <button onClick={() => handleAddItem(day)}>추가</button>
                        </div>
                        <Droppable droppableId={day}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                                        padding: 8,
                                        minHeight: 150,
                                    }}
                                >
                                    {lists[day].map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(prov, snap) => (
                                                <div
                                                    ref={prov.innerRef}
                                                    {...prov.draggableProps}
                                                    {...prov.dragHandleProps}
                                                    style={{
                                                        userSelect: 'none',
                                                        padding: 12,
                                                        margin: '0 0 8px 0',
                                                        backgroundColor: snap.isDragging ? '#263B4A' : '#456C86',
                                                        color: 'white',
                                                        ...prov.draggableProps.style,
                                                    }}
                                                >
                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
        </div>
    );
};

export default SortableLists;
