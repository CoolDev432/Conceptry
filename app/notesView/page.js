import React, { Suspense } from 'react';
import NotesView from './components/NotesView';

export default function NotesViewPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xl">Loading...</div>}>
      <NotesView />
    </Suspense>
  );
}