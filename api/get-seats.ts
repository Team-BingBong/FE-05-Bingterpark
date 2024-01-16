interface Response {
  message: string;
  data: {
    id: number;
    type: string;
    price: number;
    seats: {
      id: number;
      name: string;
      isSelectable: boolean;
    }[];
  }[];
}

// 좌석 목록 조회 API
export default async function getSeats(
  eventTimeId: number,
  sessionId: string,
  bookingToken: string
): Promise<Response> {
  const response = await fetch(`/api/v1/seats?eventTimeId=${eventTimeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      'Booking-Session-Id': `${sessionId}`,
      'Booking-Authorization': `Bearer ${bookingToken}`,
    },
  });
  const data = await response.json();

  return data;
}
