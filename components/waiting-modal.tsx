'use client';

import getWaitingOrder from '@/api/get-waiting-order';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import useStore from '@/hooks/useStore';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface Props {
  eventId: number;
  myOrder: number;
  setMyOrder: Dispatch<SetStateAction<number>>;
  setIsMyTurn: Dispatch<SetStateAction<boolean>>;
}

export default function WaitingModal(props: Props) {
  const { eventId, myOrder, setMyOrder, setIsMyTurn } = props;
  const { sessionId } = useStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = window.setInterval(() => {
        getWaitingOrder(eventId, sessionId).then((res) => {
          const { isMyTurn, myOrder } = res.data;

          if (isMyTurn) {
            clearInterval(id);
          }

          setMyOrder(myOrder);
          setIsMyTurn(isMyTurn);
        });
      }, 1000);

      // 컴포넌트 언마운트 시 인터벌 정리
      return () => {
        clearInterval(id);
      };
    }
  }, []);

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription className="flex items-center flex-col justify-center text-2xl">
            <div className="flex items-center gap-2">
              내 대기 순서{' '}
              <span className="px-2 py-1 rounded-lg bg-slate-200 box-content text-primary font-bold">
                {myOrder}
              </span>
            </div>
            <LoadingSpinner />
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
