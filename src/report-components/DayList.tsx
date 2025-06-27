import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { DayTaskData } from './DayTask';

export interface DayListProps {
    day: string;
    items: DayTaskData[];
    onDayClick: (day: string) => void;
    onTaskClick: (day: string, task: DayTaskData) => void;
    onTaskDelete: (day: string, taskId: string) => void;
}

const DayList: React.FC<DayListProps> = ({ day, items, onDayClick, onTaskClick, onTaskDelete }) => (
    <div style={{ width: '200px', margin: '8px' }}>
        <h3>[{day}]</h3>
        <div
            onClick={() => onDayClick(day)}
            style={{
                background: items.length === 0 ? '#f9f9f9' : 'transparent',
                padding: 8,
                minHeight: 150,
                cursor: 'pointer'
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
                            minHeight: 150
                        }}
                    >
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(prov, snap) => (
                                    <div
                                        onClick={e => { e.stopPropagation(); onTaskClick(day, item); }}
                                        ref={prov.innerRef}
                                        {...prov.draggableProps}
                                        {...prov.dragHandleProps}
                                        style={{
                                            position: 'relative',
                                            userSelect: 'none',
                                            padding: 8,
                                            margin: '0 0 8px 0',
                                            backgroundColor: snap.isDragging ? '#263B4A' : '#456C86',
                                            color: 'white',
                                            borderRadius: 4,
                                            ...prov.draggableProps.style
                                        }}
                                    >
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();            // CHK: 클릭 이벤트 전파를 막아서 모달 열림 방지
                                                onTaskDelete(day, item.id);     // CHK: 삭제 콜백 호출
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'white',
                                                fontSize: '1em',
                                                cursor: 'pointer',
                                                zIndex:1            //CHK : 버튼이 항상 위에 있어서 클릭이 보장
                                            }}
                                        >
                                            ×
                                        </button>
                                        {item.title && <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.title}</div>}
                                        {item.memo && <div style={{ fontSize: '0.9em', opacity: 0.85 }}>{item.memo}</div>}
                                    </div>
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

// CHK: 아래 줄을 추가했습니다. 없으면 `import DayList from './DayList'` 구문이 실패합니다.
export default DayList;