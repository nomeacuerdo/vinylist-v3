import React, { useState, FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FormattedRelease } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CalendarModal: FC<{
  records: FormattedRelease[];
  day: number;
  month: number;
  monthName: string;
  today: Date;
}> = ({ records, day, month, monthName, today }) => {
  const isToday = today.getMonth() === month && today.getDate() === day;

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {day}
      </AlertDialogTrigger>
      <AlertDialogContent >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {isToday ? 'Albums released today!' : `Albums released on ${monthName} ${day}`}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="AlertDialogDescription">
					{isToday ? 'Shows the albums that were released today' : `Shows the albums that were released on ${monthName} ${day}`}
				</AlertDialogDescription>

        <ul className="divide-y divide-gray-200 my-4 max-h-64">
          {records.map((rec, idx) => (
            <li key={idx} className="py-3 px-1 hover:bg-gray-800 transition">
              <Link
                key={rec.id}
                href={`/release/${rec.id}`}
                className="flex items-center gap-2"
              >
                <Image
                  src={rec.cover}
                  width={50}
                  height={50}
                  alt={rec.name}
                  placeholder="blur"
                  blurDataURL="/711.gif"
                />
                <div className="flex flex-col justify-between h-[50px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{rec.artist}</span>
                    <span className="text-gray-500">–</span>
                    <span>{rec.name}</span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    ({rec.year.slice(0, 4)})
                    {(() => {
                      let fromDate: Date | null = null;
                      if (/^\d{4}-\d{2}-\d{2}$/.test(rec.year)) {
                        fromDate = new Date(rec.year);
                      } else if (/^\d{4}-\d{2}$/.test(rec.year)) {
                        fromDate = new Date(`${rec.year}-01`);
                      } else if (/^\d{4}$/.test(rec.year)) {
                        fromDate = new Date(`${rec.year}-01-01`);
                      }
                      if (fromDate) {
                        let elapsed = today.getFullYear() - fromDate.getFullYear();
                        const hasPassed =
                          today.getMonth() > fromDate.getMonth() ||
                          (today.getMonth() === fromDate.getMonth() && today.getDate() >= fromDate.getDate());
                        const cakeMarker = isToday ? ' 🎂' : ' •';

                        if (hasPassed || isToday) {
                          return `${cakeMarker} ${elapsed} year${elapsed === 1 ? '' : 's'} old`;
                        }

                        return `${cakeMarker} ${elapsed - 1} 👉 ${elapsed} years old`;
                      }
                      return '';
                    })()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CalendarModal;