interface Params {
  bookingInfo: {
    timeId: number;
    seatIds: number[];
    receiptType: string;
    buyerName: string;
    buyerPhoneNumber: string; // '010-1234-5678';
  };
  bookingToken: string;
}

interface Response {
  message: string;
  data: {
    bookingId: string; // '1705132823371';
    bookingName: string; //'BLACKPINK WORLD TOUR ［BORN PINK］ FINALE IN SEOUL 1';
    amount: number; //100000;
    status: string;
    paymentSuccessUrl: string; //'https://localhost:8080/api/v1/success';
    paymentFailUrl: string; //'https://localhost:8080/api/v1/fail';
  };
}

// 예매 생성 API
export default async function createBooking(params: Params): Promise<Response> {
  const response = await fetch(`/api/v1/bookings/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      'Booking-Authorization': `Bearer ${params.bookingToken}`,
    },
    body: JSON.stringify(params.bookingInfo),
  });

  const data = await response.json();
  return data;
}
