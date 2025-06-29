'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditNotePopup = ({ head: initialHead, content: initialContent, noteId, onClose, onSave }) => {
  const [editedHead, setEditedHead] = useState(initialHead);
  const [editedContent, setEditedContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editedHead.trim() || !editedContent.trim()) {
      alert('Note head and content cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(noteId, editedHead, editedContent, null); // flowchart is null
      onClose();
    } catch (error) {
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-white mb-6">Edit Note</h2>

        <div className="mb-4">
          <label className="block text-gray-300 font-bold mb-2">Note Head:</label>
          <input className="p-3 w-full text-white border border-gray-600 rounded-lg bg-gray-700" value={editedHead} onChange={(e) => setEditedHead(e.target.value)} />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 font-bold mb-2">Note Content:</label>
          <textarea className="p-3 w-full h-48 text-white border border-gray-600 rounded-lg bg-gray-700" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditNotePopup;
