import React, { useState, useEffect } from 'react';

interface Card {
    id: string;
    title: string;
    body: string;
}

interface ModalProps {
    mode: 'edit' | 'add';
    day: string;
    card: Card | null;
    onClose: () => void;
    onSave: (card: Card) => void;
}

const Modal: React.FC<ModalProps> = ({ mode, day, card, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        if (mode === 'edit' && card) {
            setTitle(card.title);
            setBody(card.body);
        } else {
            setTitle('');
            setBody('');
        }
    }, [mode, card]);

    const handleSave = () => {
        const newCard: Card = {
            id: card?.id || Date.now().toString(),
            title,
            body,
        };
        onSave(newCard);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>×</span>
                <h3>{mode === 'edit' ? '카드 수정' : '새 카드 추가'}</h3>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목"
                />
                <br />
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="내용을 입력하세요..."
                />
                <br />
                <button onClick={handleSave}>
                    {mode === 'edit' ? '저장' : '추가'}
                </button>
            </div>
        </div>
    );
};

export default Modal;
