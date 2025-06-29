import { Suspense } from 'react';
import Classroom from './ClassroomContent';

export default function ClassroomPage() {
  return (
    <Suspense fallback={<div>Loading class details...</div>}>
      <Classroom />
    </Suspense>
  );
}