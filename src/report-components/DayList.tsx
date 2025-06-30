import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { DayTaskData } from './DayTask';
import DayTask from './DayTask';

export interface DayListProps {
    day: string;
    items: DayTaskData[];
    isDragging: boolean;
    onDayClick: (day: string) => void;
    onTaskClick: (day: string, task: DayTaskData) => void;
    onTaskDelete: (day: string, taskId: string) => void;
}

const DayList: React.FC<DayListProps> = ({
                                             day,
                                             items,
                                             isDragging,
                                             onDayClick,
                                             onTaskClick,
                                             onTaskDelete,
                                         }) => (
    <div style={{ width: '200px', margin: '8px' }}>
        <h3>[{day}]</h3>
        <div
            onClick={e => {
                if (isDragging) {
                    e.stopPropagation();
                    return;
                }
                onDayClick(day);
            }}
            style={{
                background: items.length === 0 ? '#f9f9f9' : 'transparent',
                padding: 8,
                minHeight: 150,
                cursor: 'pointer',
            }}
        >
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
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(prov, snap) => (
                                    <DayTask
                                        // CHK: 이제 handle props를 객체로 전달합니다
                                        ref={prov.innerRef}
                                        draggableProps={prov.draggableProps}
                                        dragHandleProps={prov.dragHandleProps!}
                                        isDragging={snap.isDragging}

                                        // task data & event handlers
                                        data={item}
                                        onClick={() => onTaskClick(day, item)}
                                        onDelete={id => onTaskDelete(day, id)}
                                    />
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    </div>
);

export default DayList;