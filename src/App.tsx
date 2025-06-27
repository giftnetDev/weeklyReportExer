import { useState } from 'react';
import LeftMenu from './components/LeftMenu';
import Controls from './components/Controls';
import Calendar from './components/Calendar';
import Modal from './components/Modal';
import './App.css';
import './styles/calendar.css';

interface Card {
    id: string;
    title: string;
    body: string;
}

type WeeklyCards = {
    [day: string]: Card[];
};

function App() {
    const [cardsByDay, setCardsByDay] = useState<WeeklyCards>({
        일: [],
        월: [],
        화: [],
        수: [],
        목: [],
        금: [],
        토: [],
    });

    const [modalMode, setModalMode] = useState<'edit' | 'add' | null>(null);
    const [selectedCardInfo, setSelectedCardInfo] = useState<{
        day: string;
        card: Card | null;
    } | null>(null);

    return (
        <div className="app">
            <LeftMenu />
            <div className="main-content">
                <Controls />
                <Calendar
                    cardsByDay={cardsByDay}
                    setCardsByDay={setCardsByDay}
                    onEditCard={(day, card) => {
                        setSelectedCardInfo({ day, card });
                        setModalMode('edit');
                    }}
                    onAddCard={(day) => {
                        setSelectedCardInfo({ day, card: null });
                        setModalMode('add');
                    }}
                />
                <div className="notes">
                    <label htmlFor="weekly-notes"><strong>주간 특이사항</strong></label><br />
                    <textarea id="weekly-notes" placeholder="내용을 입력하세요..." />
                </div>
            </div>

            {modalMode && selectedCardInfo && (
                <Modal
                    mode={modalMode}
                    day={selectedCardInfo.day}
                    card={selectedCardInfo.card}
                    onClose={() => setModalMode(null)}
                    onSave={(updatedCard) => {
                        setCardsByDay((prev) => {
                            const updatedList = modalMode === 'edit'
                                ? prev[selectedCardInfo.day].map((c) =>
                                    c.id === updatedCard.id ? updatedCard : c)
                                : [...prev[selectedCardInfo.day], updatedCard];
                            return { ...prev, [selectedCardInfo.day]: updatedList };
                        });
                        setModalMode(null);
                    }}
                />
            )}
        </div>
    );
}

export default App;
