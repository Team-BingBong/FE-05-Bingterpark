interface Response {
  message: string;
  data: {
    id: string;
    amount: number;
    status: string;
    buyerName: string;
    buyerPhoneNumber: string;
    eventId: number;
    eventThumbnail: string;
    eventName: string;
    eventTime: number;
    eventTimeStartedAt: string;
    eventTimeEndedAt: string;
    receiptType: string;
    deliveryAddress: {
      recipientName: string;
      recipientPhoneNumber: string;
      streetAddress: string;
      detailAddress: string;
      zipCode: string;
    };
    createdAt: string;
    paymentMethod: string;
    paymentCard: {
      issuer: string;
      number: string;
      installmentPlanMonths: number;
      isInterestFree: true;
    };
    paymentVirtualAccount: {
      bank: string;
      accountNumber: string;
      customerName: string;
      dueDate: string;
    };
    paymentApprovedAt: string;
    seats: {
      areaType: string;
      name: string;
      price: number;
    }[];
    cancel: {
      id: number;
      amount: number;
      reason: string;
      createdBy: string;
      createdAt: string;
    };
  };
}

// 내 예매 내역 상세 조회 API
export default async function getBooking(bookingId: string): Promise<Response> {
  const response = await fetch(
    `http://localhost:8082/api/v1/bookings/${bookingId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    }
  );
  const data = await response.json();

  return data;
}
