import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import getBooking from '@/api/get-booking';
import successPayment from '@/api/success-payment';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';

interface Props {
  searchParams: {
    paymentKey: string;
    orderId: string;
    amount: string;
  };
}

export default async function SuccessPage({ searchParams }: Props) {
  const { paymentKey, orderId, amount } = searchParams;
  await successPayment(paymentKey, orderId, Number(amount));

  const data = await getBooking(orderId);

  return (
    <div className="overflow-hidden rounded-[0.5rem] border py-5 px-2 shadow-md">
      <div className="flex justify-between px-4">
        <h2 className="font-semibold tracking-tight text-2xl">
          {data.data.id}
        </h2>
        <div>
          <Badge variant="outline">{data.data.status}</Badge>
        </div>
      </div>

      <CardContent className="overflow-hidden rounded-[0.5rem] p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>공연 정보</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-col text-sm">
            <ul className="space-y-1">
              <li className="flex justify-between items-center">
                <p className="leading-none">공연</p>
                <div>
                  <span className="font-semibold">
                    {'BLACKPINK WORLD TOUR ［BORN PINK］ FINALE IN SEOUL'}
                  </span>
                </div>
              </li>
              <li className="flex justify-between items-center">
                <p className="leading-none">공연 회차</p>
                <span>{data.data.eventTime}</span>
              </li>
              <li className="flex justify-between items-center">
                <p className="leading-none">공연 시간</p>
                <span>
                  {dayjs(data.data.eventTimeStartedAt).format(
                    'YYYY-MM-DD HH:mm'
                  )}{' '}
                  ~ {dayjs(data.data.eventTimeEndedAt).format('HH:mm')}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <p className="leading-none">선택 좌석</p>
                <div className="flex gap-2">
                  {data.data.seats.map((seat, idx) => (
                    <span key={`${seat.areaType}${seat.name}`}>
                      {seat.areaType} {seat.name}{' '}
                      {idx !== data.data.seats.length - 1 && ','}
                    </span>
                  ))}
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>결제 정보</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-col text-sm">
            <ul className="space-y-1">
              <li className="flex justify-between items-center">
                <p className="leading-none">결제 금액</p>
                <div>
                  <span className="font-semibold">
                    {data.data.amount.toLocaleString()}
                  </span>
                  원
                </div>
              </li>
              <li className="flex justify-between items-center">
                <p className="leading-none">결제 방법</p>
                <span>{data.data.paymentMethod}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
}
