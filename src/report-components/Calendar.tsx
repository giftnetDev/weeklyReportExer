import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import DayList from './DayList';
import TaskModal from './TaskModal';
import type { DayTaskData } from './DayTask';

const days = ['일', '월', '화', '수', '목', '금', '토'];

type Lists = Record<string, DayTaskData[]>;

const Calendar: React.FC = () => {
    const [lists, setLists] = useState<Lists>(() => days.reduce((acc, day) => ({ ...acc, [day]: [] }), {} as Lists));
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [editTask, setEditTask] = useState<{ day: string; data: DayTaskData } | null>(null);

    const handleAdd = (data: Omit<DayTaskData, 'id'>) => {
        if (!selectedDay) return;
        const newItem: DayTaskData = { id: `${selectedDay}-${Date.now()}`, ...data };
        setLists(prev => ({ ...prev, [selectedDay]: [...prev[selectedDay], newItem] }));
        setSelectedDay(null);
    };

    const handleEdit = (data: Omit<DayTaskData, 'id'>) => {
        if (!editTask) return;
        setLists(prev => ({
            ...prev,
            [editTask.day]: prev[editTask.day].map(item => item.id === editTask.data.id ? { ...item, ...data } : item),
        }));
        setEditTask(null);
    };

    const handleDelete = (day: string, id: string) => {
        setLists(prev => ({ ...prev, [day]: prev[day].filter(item => item.id !== id) }));
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        const src = Array.from(lists[source.droppableId]);
        const dst = Array.from(lists[destination.droppableId]);

        if (source.droppableId === destination.droppableId) {
            const [moved] = src.splice(source.index, 1);
            src.splice(destination.index, 0, moved);
            setLists(prev => ({ ...prev, [source.droppableId]: src }));
        } else {
            const [moved] = src.splice(source.index, 1);
            dst.splice(destination.index, 0, moved);
            setLists(prev => ({ ...prev, [source.droppableId]: src, [destination.droppableId]: dst }));
        }
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                    {days.map(day => (
                        <DayList
                            key={day}
                            day={day}
                            items={lists[day]}
                            onDayClick={d => setSelectedDay(d)}
                            onTaskClick={(d, item) => setEditTask({ day: d, data: item })}
                            onTaskDelete={handleDelete}
                        />
                    ))}
                </div>
            </DragDropContext>
            {selectedDay && (
                <TaskModal day={selectedDay} onConfirm={handleAdd} onCancel={() => setSelectedDay(null)} confirmText="추가" />
            )}
            {editTask && (
                <TaskModal
                    day={editTask.day}
                    initialData={{ title: editTask.data.title, memo: editTask.data.memo }}
                    onConfirm={handleEdit}
                    onCancel={() => setEditTask(null)}
                    confirmText="저장"
                />
            )}
        </>
    );
};

export default Calendar;
