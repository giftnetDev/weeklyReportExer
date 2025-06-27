import React from 'react';

interface EventCardProps {
    title: string;
    body: string;
    onEdit: (cardElement: HTMLElement) => void;
}

const EventCard: React.FC<EventCardProps> = ({ title, body, onEdit }) => {
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('delete-btn')) return;
        if (cardRef.current) {
            onEdit(cardRef.current);
        }
    };

    const handleDelete = () => {
        if (cardRef.current) {
            cardRef.current.classList.add('fade-out');
            setTimeout(() => {
                cardRef.current?.remove();
            }, 300);
        }
    };

    return (
        <div className="event-card" ref={cardRef} onClick={handleClick}>
    <button className="delete-btn" onClick={handleDelete}>×</button>
    <div className="card-title">{title}</div>
        <div className="card-body">{body}</div>
        </div>
);
};

export default EventCard;
