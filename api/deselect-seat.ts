// 좌석 선택 해제 API
export default async function deselectSeat(
  bookingToken: string,
  seatId: number
) {
  const response = await fetch(`/api/v1/seats/${seatId}/deselect`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      'Booking-Authorization': `Bearer ${bookingToken}`,
    },
  });

  return;
}
