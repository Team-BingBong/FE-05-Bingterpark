interface Response {
  message: string;
  data: {
    myOrder: number;
    isMyTurn: boolean;
  };
}

// 대기열 조회 API
export default async function getWaitingOrder(
  eventId: number,
  sessionId: string
): Promise<Response> {
  const response = await fetch(
    `/api/v1/bookings/waiting-order?eventId=${eventId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        'Booking-Session-Id': `${sessionId}`,
      },
    }
  );
  const data = await response.json();

  return data;
}
