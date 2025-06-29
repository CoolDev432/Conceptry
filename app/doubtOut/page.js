'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const DoubtOut = () => {
  const [Note, setNote] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedContent, setSelectedContent] = useState('');
  const [doubtText, setDoubtText] = useState('');
  const [isSubmittingDoubt, setIsSubmittingDoubt] = useState(false);
  const [doubtResponse, setDoubtResponse] = useState(null);
  const [currentAIError, setCurrentAIError] = useState(null);

  const { user } = useUser();

  const isAIThinking = isSubmittingDoubt;

  const getNotes = useCallback(async () => {
    if (!user?.emailAddresses[0]?.emailAddress) return;
    try {
      const res = await fetch(`/api/getNotes?email=${user.emailAddresses[0].emailAddress}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const resJSON = await res.json();
      setNote(resJSON.documents);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) getNotes();
  }, [user, getNotes]);

  const handleSubmitDoubt = async () => {
    if (!selectedContent || !doubtText.trim()) {
      alert('Please select a note and enter your doubt.');
      return;
    }
    if (selectedIndex === null || !Note[selectedIndex] || !Note[selectedIndex].head) {
      alert('Selected note is invalid. Please select a valid note.');
      return;
    }

    setIsSubmittingDoubt(true);
    setCurrentAIError(null);
    setDoubtResponse(null);

    const apiUrl = `/api/chat?prompt=${encodeURIComponent(doubtText)}&head=${encodeURIComponent(Note[selectedIndex].head)}`;

    try {
      const response = await fetch(apiUrl, { method: 'GET' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }
      const data = await response.json();
      setDoubtResponse(data.result);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setCurrentAIError(error);
      setDoubtResponse(`Error: ${error.message}`);
    } finally {
      setIsSubmittingDoubt(false);
      setDoubtText('');
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 flex justify-center">
      <div className="flex flex-col items-center w-full max-w-3xl">
        <h1 className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center">
          DoubtOut
        </h1>
        <p className="text-gray-300/70 mt-2 text-center text-sm sm:text-base">
          Oust Those Doubts!
        </p>

        <div className="mt-10 flex flex-wrap gap-6 w-full">
          {Note.length > 0 ? (
            Note.map((item, index) => {
              const isSelected = selectedIndex === index;
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index);
                    setSelectedContent(item.content);
                    setDoubtResponse(null);
                    setCurrentAIError(null);
                  }}
                  className={`bg-white/5 backdrop-blur-md border transition-all duration-300 p-4 sm:p-6 rounded-2xl shadow-xl cursor-pointer text-xl sm:text-2xl w-full hover:scale-[1.02] ${
                    isSelected
                      ? 'border-2 border-blue-600'
                      : 'border-white/10 hover:border-purple-500'
                  }`}
                >
                  <h1>{item.head}</h1>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-center w-full">Loading notes or no notes found...</p>
          )}

          {selectedIndex !== null && (
            <div className="w-full mt-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">Selected Note Content:</h2>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10 text-gray-300">
                <p className='whitespace-pre-line'>{selectedContent}</p>
              </div>

              <textarea
                className="p-4 mt-6 w-full h-32 font-medium text-white border border-white/20 rounded-lg bg-white/5 backdrop-blur-md placeholder-gray-400 resize-none"
                placeholder="Type your doubt here, referring to the selected note content..."
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
              />

              <div className="w-full flex justify-center mt-4">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleSubmitDoubt}
                  disabled={!selectedContent || !doubtText.trim() || isSubmittingDoubt || isAIThinking}
                >
                  {isSubmittingDoubt || isAIThinking ? 'Thinking...' : 'Submit Doubt'}
                </Button>
              </div>

              {doubtResponse && (
                <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700 text-gray-200">
                  <h2 className="text-xl font-semibold mb-2">Doubt Answer:</h2>
                  <p className='whitespace-pre-line font-bold'>{doubtResponse}</p>
                </div>
              )}

              {currentAIError && (
                <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-700 text-gray-200">
                  <h2 className="text-xl font-semibold mb-2">Error:</h2>
                  <p>{currentAIError.message || 'An unknown error occurred.'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtOut;