'use client'
import { FC } from "react";
import Image from 'next/image';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
import { Cell } from "@tanstack/react-table";
import { Release } from '@/lib/types';

interface ModalProps {
  cell: Cell<Release, string>;
}

const Modal: FC<ModalProps> = ({ cell }) => {
  const cellContext = cell?.getContext();
  const { cover_image, title } = cellContext?.row?.original?.basic_information;
  const thumbnail: string = cell.getValue() as string;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Avatar>
          <AvatarImage src={thumbnail} alt={title} />
          <AvatarFallback>{title.split('').shift()}</AvatarFallback>
        </Avatar>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <Image
              src={cover_image}
              width={500}
              height={500}
              alt={title}
              placeholder="blur"
              blurDataURL="/711.gif"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
