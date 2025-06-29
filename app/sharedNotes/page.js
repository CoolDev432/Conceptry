'use client'

import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Popup from './components/Popup';

const Shared = () => {
    const [notes, setNotes] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState(null);

    async function getNotes() {
        try {
            const res = await fetch('/api/getSharedNotes');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const resJSON = await res.json();
            setNotes(resJSON);
        } catch (error) {
            console.error("Failed to fetch shared notes:", error);
        }
    }

    useEffect(() => {
        getNotes();
    }, []);

    const openPopup = (id) => {
        setSelectedNoteId(id);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedNoteId(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center px-4 py-12">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-center drop-shadow-lg">
                🚀 Shared Notes
            </h1>

            <div className="flex justify-evenly items-center gap-5 flex-wrap">
                {notes?.documents?.length > 0 ? (
                    notes.documents.map((note) => (
                        <Cards
                            key={note.$id}
                            id={note.$id}
                            name={note.sharedBy || "He who shall not be named!"}
                            content={note.content}
                            head={note.head}
                            onCommentClick={openPopup}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full text-center">
                        No shared notes found.
                    </p>
                )}
            </div>

            {isPopupOpen && (
                <Popup
                    id={selectedNoteId}
                    onClose={closePopup}
                />
            )}
        </div>
    );
};

const Cards = ({ id, name, content, head, onCommentClick }) => {
    return (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg transition-transform hover:-translate-y-2 hover:shadow-2xl hover:border-amber-400 select-none duration-300 max-w-lg mx-auto flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-white mb-2">{head}</h2>
            <p className="text-sm text-gray-400 mb-4 italic">Shared by: {name}</p>
            <p className="text-white">{content}</p>

            <div
                className='mt-3 bg-slate-950 w-fit p-3 cursor-pointer hover:scale-110 hover:shadow-2xl shadow-black transition-all rounded-full flex gap-2 items-center'
                onClick={() => onCommentClick(id)}
            >
                <MessageCircle size={20} /> <h1>Comment</h1>
            </div>
        </div>
    );
};

export default Shared;