import React, { forwardRef } from 'react';
import type {
    DraggableProvidedDraggableProps,
    DraggableProvidedDragHandleProps,
} from '@hello-pangea/dnd';

export interface DayTaskData {
    id: string;
    title?: string;
    memo?: string;
}

interface DayTaskProps {
    data: DayTaskData;
    onClick: () => void;
    onDelete?: (id: string) => void;
    draggableProps?: DraggableProvidedDraggableProps;
    dragHandleProps?: DraggableProvidedDragHandleProps;
    isDragging?: boolean;
}

const DayTask = forwardRef<HTMLDivElement, DayTaskProps>(({
                                                              data,
                                                              onClick,
                                                              onDelete,
                                                              draggableProps,
                                                              dragHandleProps,
                                                              isDragging = false,
                                                          }, ref) => (
    <div
        ref={ref}
        {...draggableProps}
        {...dragHandleProps}
        onClick={onClick}
        style={{
            position: 'relative',
            userSelect: 'none',
            padding: 8,
            margin: '0 0 8px 0',
            backgroundColor: isDragging ? '#263B4A' : '#456C86',
            color: 'white',
            borderRadius: 4,
            ...(draggableProps?.style as React.CSSProperties),
        }}
    >
        {data.title && (
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                {data.title}
            </div>
        )}
        {data.memo && (
            <div style={{ fontSize: '0.9em', opacity: 0.85 }}>
                {data.memo}
            </div>
        )}

        <button
            onClick={e => {
                e.stopPropagation();
                onDelete?.(data.id);
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
                zIndex: 1,
            }}
        >
            ×
        </button>
    </div>
));

export default DayTask;