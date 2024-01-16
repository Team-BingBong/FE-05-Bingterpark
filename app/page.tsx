'use client';

import enterQueue from '@/api/enter-queue';
import getWaitingOrder from '@/api/get-waiting-order';
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import useStore from '@/hooks/useStore';

const WaitingModal = dynamic(() => import('@/components/waiting-modal'), {
  ssr: false,
});
const Seats = dynamic(() => import('@/components/seats'));

export default function Home() {
  const eventId = 1;

  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [myOrder, setMyOrder] = useState<number>(0);
  const { sessionId } = useStore();

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        await enterQueue(eventId, sessionId);
        const {
          data: { isMyTurn, myOrder },
        } = await getWaitingOrder(eventId, sessionId);

        setIsMyTurn(isMyTurn);
        setMyOrder(myOrder);
      }
    };

    init();
  }, []);

  return (
    <>
      {!isMyTurn && (
        <WaitingModal
          eventId={eventId}
          myOrder={myOrder}
          setMyOrder={setMyOrder}
          setIsMyTurn={setIsMyTurn}
        />
      )}
      {isMyTurn && <Seats eventId={eventId} />}
    </>
  );
}
