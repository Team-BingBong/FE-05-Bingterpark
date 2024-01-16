// 대기열 진입 API
export default async function enterQueue(eventId: number, sessionId: string) {
  await fetch(`/api/v1/bookings/enter-queue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      'Booking-Session-Id': `${sessionId}`,
    },
    body: JSON.stringify({ eventId }),
  });

  return;
}
