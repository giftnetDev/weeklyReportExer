import React, { useState } from 'react';
import type { DayTaskData } from './DayTask';

interface TaskModalProps {
    day: string;
    onConfirm: (data: Omit<DayTaskData, 'id'>) => void;
    onCancel: () => void;
    initialData?: Omit<DayTaskData, 'id'>;
    confirmText?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ day, onConfirm, onCancel, initialData, confirmText = '확인' }) => {
    const [title, setTitle] = useState(initialData?.title ?? '');
    const [memo, setMemo] = useState(initialData?.memo ?? '');
    const isValid = title.trim() !== '' || memo.trim() !== '';

    const handleConfirm = () => {
        if (!isValid) return;
        onConfirm({ title: title.trim() || undefined, memo: memo.trim() || undefined });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 300 }}>
                <h2>{day}에 태스크 {confirmText === '확인' ? '추가' : '수정'}</h2>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="제목 (선택)"
                    style={{ width: '100%', marginBottom: 8 }}
                />
                <textarea
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    placeholder="메모 (선택)"
                    style={{ width: '100%', marginBottom: 8 }}
                />
                <button disabled={!isValid} onClick={handleConfirm} style={{ marginRight: 8 }}>
                    {confirmText}
                </button>
                <button onClick={onCancel}>취소</button>
            </div>
        </div>
    );
};

export default TaskModal;