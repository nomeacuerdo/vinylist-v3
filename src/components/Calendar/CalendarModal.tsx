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
  monthName: string;
}> = ({ records, day, monthName }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {day}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Albums on {monthName} {day}</AlertDialogTitle>
        </AlertDialogHeader>

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
                      const now = new Date();
                      let fromDate: Date | null = null;
                      if (/^\d{4}-\d{2}-\d{2}$/.test(rec.year)) {
                        fromDate = new Date(rec.year);
                      } else if (/^\d{4}-\d{2}$/.test(rec.year)) {
                        fromDate = new Date(`${rec.year}-01`);
                      } else if (/^\d{4}$/.test(rec.year)) {
                        fromDate = new Date(`${rec.year}-01-01`);
                      }
                      if (fromDate) {
                        let elapsed = now.getFullYear() - fromDate.getFullYear();
                        // If the month/day hasn't occurred yet this year, subtract 1
                        const hasPassed =
                          now.getMonth() > fromDate.getMonth() ||
                          (now.getMonth() === fromDate.getMonth() && now.getDate() >= fromDate.getDate());
                        if (!hasPassed) elapsed--;
                        return ` • ${elapsed} year${elapsed === 1 ? '' : 's'} ago`;
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