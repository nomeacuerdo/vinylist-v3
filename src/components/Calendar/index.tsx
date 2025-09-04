"use client"
import React, { useState, FC } from 'react';
import { FormattedRelease } from '@/lib/types';
import CalendarMonth from './CalendarMonth';

interface CalendarProps {
  data: {
    LP: FormattedRelease[];
    Single: FormattedRelease[];
    Other: FormattedRelease[];
  };
}

const Calendar: FC<CalendarProps> = ({ data }) => {
  const [selected, setSelected] = useState<'LP' | 'Single' | 'Other'>('LP');

  return (
    <>
      <div className="flex gap-2 pb-4">
        <button
          className={`px-4 py-2 rounded ${selected === 'LP' ? 'bg-pink-500 text-white' : 'border-gray-200 text-gray-200'}`}
          onClick={() => setSelected('LP')}
        >
          LP
        </button>
        <button
          className={`px-4 py-2 rounded ${selected === 'Single' ? 'bg-pink-500 text-white' : 'border-gray-200 text-gray-200'}`}
          onClick={() => setSelected('Single')}
        >
          Single
        </button>
        <button
          className={`px-4 py-2 rounded ${selected === 'Other' ? 'bg-pink-500 text-white' : 'border-gray-200 text-gray-200'}`}
          onClick={() => setSelected('Other')}
        >
          Other
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 justify-center">
        {Array.from({ length: 12 }, (_, i) => i).map((month, idx) => (
          <CalendarMonth key={idx} month={month} data={data[selected]} />
        ))}
      </div>
    </>
  );
};

export default Calendar;

