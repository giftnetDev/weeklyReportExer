import React, { useState } from 'react';
import { DragDropContext,} from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import DayList from './DayList';
import TaskModal from './TaskModal';
import type { DayTaskData } from './DayTask';

const days = ['일', '월', '화', '수', '목', '금', '토'];
type Lists = Record<string, DayTaskData[]>;

const Calendar: React.FC = () => {
    const [lists, setLists] = useState<Lists>(
        () => days.reduce((acc, day) => ({ ...acc, [day]: [] }), {} as Lists)
    );
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [editTask, setEditTask] = useState<{ day: string; data: DayTaskData } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceList = Array.from(lists[source.droppableId]);
        const destList = Array.from(lists[destination.droppableId]);

        if (source.droppableId === destination.droppableId) {
            // 같은 리스트 내 순서 변경
            const [moved] = sourceList.splice(source.index, 1);
            sourceList.splice(destination.index, 0, moved);
            setLists(prev => ({
                ...prev,
                [source.droppableId]: sourceList,
            }));
        } else {
            // 다른 리스트로 이동
            const [moved] = sourceList.splice(source.index, 1);
            destList.splice(destination.index, 0, moved);
            setLists(prev => ({
                ...prev,
                [source.droppableId]: sourceList,
                [destination.droppableId]: destList,
            }));
        }
    };

    return (
        <>
            <DragDropContext
                onDragStart={() => setIsDragging(true)}
                onDragEnd={result => {
                    handleDragEnd(result);
                    // dragEnd 직후 click 이벤트가 발생하더라도 isDragging 을 잠시 유지
                    setTimeout(() => setIsDragging(false), 0);
                }}
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                    {days.map(day => (
                        <DayList
                            key={day}
                            day={day}
                            items={lists[day]}
                            isDragging={isDragging}
                            onDayClick={d => setSelectedDay(d)}
                            onTaskClick={(d, item) => setEditTask({ day: d, data: item })}
                            onTaskDelete={(d, id) =>
                                setLists(prev => ({
                                    ...prev,
                                    [d]: prev[d].filter(x => x.id !== id),
                                }))
                            }
                        />
                    ))}
                </div>
            </DragDropContext>

            {selectedDay && (
                <TaskModal
                    day={selectedDay}
                    onConfirm={data => {
                        const newItem: DayTaskData = { id: `${selectedDay}-${Date.now()}`, ...data };
                        setLists(prev => ({
                            ...prev,
                            [selectedDay]: [...prev[selectedDay], newItem],
                        }));
                        setSelectedDay(null);
                    }}
                    onCancel={() => setSelectedDay(null)}
                    confirmText="추가"
                />
            )}

            {editTask && (
                <TaskModal
                    day={editTask.day}
                    initialData={{ title: editTask.data.title, memo: editTask.data.memo }}
                    onConfirm={data => {
                        setLists(prev => ({
                            ...prev,
                            [editTask.day]: prev[editTask.day].map(item =>
                                item.id === editTask.data.id ? { ...item, ...data } : item
                            ),
                        }));
                        setEditTask(null);
                    }}
                    onCancel={() => setEditTask(null)}
                    confirmText="저장"
                />
            )}
        </>
    );
};

export default Calendar;