import React, { Suspense } from 'react';
import ConceptboardClient from './components/ConceptboardClient';

export default function ConceptboardPage() {
  return (
    <Suspense fallback={<div className="text-white p-10 text-center">Loading...</div>}>
      <ConceptboardClient />
    </Suspense>
  );
}
