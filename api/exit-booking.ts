// 예매 토큰 발급 API
export default async function exitBooking(
  bookingToken: string,
  seatNumber: number
) {
  const response = await fetch(`/api/v1/bookings/${seatNumber}/exit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      'Booking-Authorization': `Bearer ${bookingToken}`,
    },
  });
  const data = await response.json();

  return data;
}
