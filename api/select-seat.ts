interface Response {
  errorCode?: string;
  errorMessage?: string;
}

// 좌석 선택 API
export default async function selectSeat(
  bookingToken: string,
  seatId: number
): Promise<Response | undefined> {
  const response = await fetch(`/api/v1/seats/${seatId}/select`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      'Booking-Authorization': `Bearer ${bookingToken}`,
    },
  });

  if (response.status === 204) {
    return undefined;
  }

  const data = await response.json();

  return data;
}
