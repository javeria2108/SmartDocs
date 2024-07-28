'use client';

import { createDocument } from '@/lib/actions/room.actions';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { JSX, SVGProps } from 'react';

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();

  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({ userId, email });

      if (room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      onClick={addDocumentHandler}
      className="bg-[#1a73e8] text-white flex items-center justify-center px-4 py-2 rounded-md shadow-md hover:bg-pink-500"
    >
      <PlusIcon className="mr-2 h-5 w-5" />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
};

export default AddDocumentBtn;

// PlusIcon component in a separate file (e.g., PlusIcon.tsx)
function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
