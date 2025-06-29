'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const ConceptboardClient = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const [Notes, setNotes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handlePublish = async () => {
    if (!noteTitle || !noteContent) return alert('Please fill in both fields');

    setShowModal(false);
    setNoteTitle('');
    setNoteContent('');

    await fetch(
      `/api/createNotebookNotes?title=${noteTitle}&content=${noteContent}&id=${id}&name=${user?.firstName}`
    );
    fetchNotes();
  };

  async function fetchNotes() {
    const res = await fetch(`/api/getConceptboardContent?id=${id}`);
    const resJSON = await res.json();
    setNotes(resJSON.documents);
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <div className="w-full bg-gradient-to-r from-[#1e1f2f] to-[#2d2f45] shadow-md border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold select-none hover:scale-110 transition-all transition-1">
              {name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{name}</h1>
              <p className="text-gray-400 text-sm mt-1">
                {Notes.length} {Notes.length === 1 ? 'note' : 'notes'} published
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white cursor-pointer text-black font-semibold px-5 py-2 rounded-xl shadow-md hover:bg-gray-200 transition"
            >
              + Publish Note
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Publish a New Note</h2>

            <input
              type="text"
              placeholder="Note Title"
              className="w-full p-3 bg-gray-800 border border-white rounded-lg mb-4 placeholder-gray-400"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />

            <textarea
              placeholder="Note Content"
              className="w-full p-3 bg-gray-800 border border-white rounded-lg h-40 resize-none placeholder-gray-400"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg cursor-pointer"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Notes.length > 0 ? (
          Notes.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 border hover:border-yellow-500 border-gray-700 p-6 rounded-xl shadow-md transition hover:shadow-xl"
            >
              <h1 className="text-xl font-bold text-white whitespace-pre-line">{item.title}</h1>
              <p className="mt-3 text-gray-300 whitespace-pre-line">{item.content}</p>
              <h2 className="text-sm text-gray-500 mt-4 text-right whitespace-pre-line">— {item.name}</h2>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            <h1 className="text-gray-400 text-lg">Loading Posts...</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptboardClient;
