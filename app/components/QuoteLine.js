import React from 'react';

const QuoteLine = () => {
  return (
    <div className="flex items-center justify-center py-16 px-4 sm:px-8 bg-gradient-to-br from-gray-950 to-purple-900 text-white text-center font-sans rounded-t-4xl">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-lg mb-4">
          We Don&apos;t just give answers,
        </h2>
        <p className="text-xl md:text-2xl font-light leading-relaxed text-purple-200">
          we stress on the concepts those answers are built on.
        </p>
      </div>
    </div>
  );
};

export default QuoteLine;