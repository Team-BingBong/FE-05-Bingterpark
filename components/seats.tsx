'use client';

import getSeats from '@/api/get-seats';
import issueToken from '@/api/issue-token';
import selectSeat from '@/api/select-seat';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import deselectSeat from '@/api/deselect-seat';
import useStore from '@/hooks/useStore';

interface Props {
  eventId: number;
}

export default function Seats(props: Props) {
  const { eventId } = props;
  const { toast } = useToast();
  const { sessionId, bookingToken, setBookingToken } = useStore();
  const eventTimeId = 1;

  const [areas, setAreas] = useState<
    Awaited<ReturnType<typeof getSeats>>['data']
  >([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [selectedSeatNames, setSelectedSeatNames] = useState<string[]>([]);

  const handleClick = async (seatId: number, seatName: string) => {
    const areaIndex = areas.findIndex((area) =>
      area.seats.some((seat) => seat.id === seatId)
    );

    const seatIndex = areas[areaIndex].seats.findIndex(
      (seat) => seat.id === seatId
    );
    const isSelectable = areas[areaIndex].seats[seatIndex].isSelectable;

    // 좌석 취소
    if (selectedSeats.includes(seatId)) {
      await deselectSeat(bookingToken, seatId);
      setAreas((prev) => {
        const stringifiedPrev = JSON.stringify(prev);
        const newAreas = JSON.parse(stringifiedPrev);

        newAreas[areaIndex].seats[seatIndex].isSelectable = true;

        return newAreas;
      });
      setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
      setSelectedSeatNames((prev) => prev.filter((name) => name !== seatName));
      return;
    }

    // 좌석 선택
    if (isSelectable) {
      const res = await selectSeat(bookingToken, seatId);

      if (res?.errorCode === 'SEAT_HELD_BY_ANOTHER_MEMBER') {
        toast({ title: res?.errorMessage, variant: 'destructive' });
        setAreas((prev) => {
          const stringifiedPrev = JSON.stringify(prev);
          const newAreas = JSON.parse(stringifiedPrev);

          newAreas[areaIndex].seats[seatIndex].isSelectable = false;

          return newAreas;
        });
        return;
      } else {
        setAreas((prev) => {
          const stringifiedPrev = JSON.stringify(prev);
          const newAreas = JSON.parse(stringifiedPrev);

          newAreas[areaIndex].seats[seatIndex].isSelectable = true;

          return newAreas;
        });
        setSelectedSeats((prev) => [...prev, seatId]);
        setSelectedSeatNames((prev) => [...prev, seatName]);
      }
      return;
    }
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { token: bookingToken },
      } = await issueToken(eventId, sessionId);
      setBookingToken(bookingToken);

      const { data } = await getSeats(eventTimeId, sessionId, bookingToken);
      setAreas(data);
    };

    init();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex gap-4 mb-10 flex-col">
        {areas.map((area) => (
          <div key={area.id}>
            <p>{area.type}</p>
            <div className="flex gap-2">
              {area.seats.map((seat) => (
                <Button
                  key={seat.id}
                  disabled={!seat.isSelectable}
                  onClick={() => handleClick(seat.id, seat.name)}
                  className={`${
                    selectedSeats.includes(seat.id) &&
                    'bg-yellow-400 hover:bg-yellow-500'
                  }`}
                >
                  {seat.name}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Link href={`/booking?seats=${selectedSeats}&names=${selectedSeatNames}`}>
        <Button variant="outline">좌석 선택 완료</Button>
      </Link>
    </div>
  );
}
