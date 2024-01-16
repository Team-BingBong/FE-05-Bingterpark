'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import createBooking from '@/api/create-booking';
import { useRouter } from 'next/navigation';
import useStore from '@/hooks/useStore';

interface SearchParams {
  seats: string;
  names: string;
}

const formSchema = z.object({
  timeId: z.string(),
  seatIds: z.string(),
  buyerName: z.string(),
  buyerPhoneNumber: z.string(),
  receiptType: z.string(),
  deliveryAddress: z.optional(z.string()),
});

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const router = useRouter();
  const { bookingToken } = useStore();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeId: '1',
      seatIds: searchParams.names,
      buyerName: '김코딩',
      buyerPhoneNumber: '01012345678',
      receiptType: '현장수령',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    createBooking({
      bookingInfo: {
        ...values,
        timeId: Number(values.timeId),
        seatIds: searchParams.seats.split(',').map((seatId) => Number(seatId)),
      },
      bookingToken,
    }).then((res) => {
      const queryString = Object.entries(res.data)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&');

      router.push(`/payment?${queryString}`);
    });
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6"
      >
        <div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight mb-2">
            예매 정보
          </h3>
        </div>
        <FormField
          control={form.control}
          name="timeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>공연</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={'BLACKPINK WORLD TOUR ［BORN PINK］ FINALE IN SEOUL'}
                  disabled
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>선택 회차</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={'2025년 1월 1일 (수) 20:00'}
                  disabled
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seatIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>선택 좌석</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="buyerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>구매자 명</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="buyerPhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>구매자 번호</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="receiptType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>수령 방법</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          다음
        </Button>
      </form>
    </Form>
  );
}
