import React, { useState } from 'react';

export interface DayTaskData {
    id: string;
    title?: string;
    memo?: string;
}

interface DayTaskProps {
    data: DayTaskData;
    onSave: (updated: DayTaskData) => void;
    onDelete?: (id: string) => void;
}

const DayTask: React.FC<DayTaskProps> = ({ data, onSave, onDelete }) => {
    const [title, setTitle] = useState(data.title ?? '');
    const [memo, setMemo] = useState(data.memo ?? '');
    const isValid = title.trim() !== '' || memo.trim() !== '';
    const handleSave = () => {
        if (!isValid) return;
        onSave({ id: data.id, title: title.trim() || undefined, memo: memo.trim() || undefined });
    };

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: 4, padding: 8, marginBottom: 8 }}>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목 (선택)"
                style={{ width: '100%', marginBottom: 4 }}
            />
            <textarea
                value={memo}
                onChange={e => setMemo(e.target.value)}
                placeholder="메모 (선택)"
                style={{ width: '100%', marginBottom: 4 }}
            />
            <button disabled={!isValid} onClick={handleSave} style={{ marginRight: 4 }}>
                저장
            </button>
            {onDelete && <button onClick={() => onDelete(data.id)}>삭제</button>}
        </div>
    );
};

export default DayTask;