interface Response {
  message: string;
  data: {
    token: string;
  };
}

// 예매 토큰 발급 API
export default async function issueToken(
  eventId: number,
  sessionId: string
): Promise<Response> {
  const response = await fetch('/api/v1/bookings/issue-token', {
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
