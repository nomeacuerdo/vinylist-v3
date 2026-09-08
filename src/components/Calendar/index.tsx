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
      <div className="flex flex-wrap gap-2 pb-5">
        <button
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selected === 'LP' ? 'border-pink-400 bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10'}`}
          onClick={() => setSelected('LP')}
        >
          LP
        </button>
        <button
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selected === 'Single' ? 'border-pink-400 bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10'}`}
          onClick={() => setSelected('Single')}
        >
          Single
        </button>
        <button
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selected === 'Other' ? 'border-pink-400 bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10'}`}
          onClick={() => setSelected('Other')}
        >
          Other
        </button>
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(16.5rem,1fr))]">
        {Array.from({ length: 12 }, (_, i) => i).map((month, idx) => (
          <CalendarMonth key={idx} month={month} data={data[selected]} />
        ))}
      </div>
    </>
  );
};

export default Calendar;

