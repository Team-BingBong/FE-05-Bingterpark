// 대기열 이탈 API
export default async function createIssueToken(
  eventId: number,
  sessionId: string
) {
  const response = await fetch('/api/v1/bookings/exit-queue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      'Booking-Session-Id': `${sessionId}`,
    },
    body: JSON.stringify({ eventId }),
  });
  const data = await response.json();

  return data;
}
