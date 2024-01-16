'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
  ANONYMOUS,
} from '@tosspayments/payment-widget-sdk';
import { nanoid } from 'nanoid';
import { useQuery } from '@tanstack/react-query';
import createBooking from '@/api/create-booking';

type SearchParams = Awaited<ReturnType<typeof createBooking>>['data'];

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
const customerKey = nanoid();

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  const { bookingId, bookingName, paymentFailUrl, paymentSuccessUrl, amount } =
    searchParams;
  const { data: paymentWidget } = usePaymentWidget(clientKey!, customerKey);
  // const { data: paymentWidget } = usePaymentWidget(clientKey, ANONYMOUS); // 비회원 결제
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance['renderPaymentMethods']
  > | null>(null);
  const agreementsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance['renderAgreement']
  > | null>(null);
  const [price, setPrice] = useState(50_000);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    // ------  결제위젯 렌더링 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      '#payment-widget',
      { value: amount },
      { variantKey: 'DEFAULT' }
    );
    paymentMethodsWidget.updateAmount(amount);
    paymentMethodsWidgetRef.current = paymentMethodsWidget;

    // ------  이용약관 렌더링 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
    paymentWidget.renderAgreement('#agreement', {
      variantKey: 'AGREEMENT',
    });
  }, [paymentWidget]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    // ------ 금액 업데이트 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#updateamount결제-금액
    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  return (
    <main>
      <div className="wrapper">
        <div className="box_section">
          <div id="payment-widget" style={{ width: '100%' }} />
          <div id="agreement" style={{ width: '100%' }} />
          <div style={{ paddingLeft: '24px' }}>
            <div className="checkable typography--p">
              <label
                htmlFor="coupon-box"
                className="checkable__label typography--regular"
              >
                <span className="checkable__label-text">
                  결제 금액: {amount.toLocaleString()}원
                </span>
              </label>
            </div>
          </div>
          <div className="result wrapper">
            <button
              className="button bg-[#3182F6] text-white rounded-lg px-5 h-12"
              style={{ marginTop: '30px' }}
              onClick={async () => {
                try {
                  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                  // @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
                  await paymentWidget?.requestPayment({
                    orderId: bookingId,
                    orderName: bookingName,
                    customerName: '김토스',
                    customerEmail: 'customer123@gmail.com',
                    customerMobilePhone: '01012341234',
                    successUrl: `${window.location.origin}/success`,
                    failUrl: paymentFailUrl,
                  });
                } catch (error) {
                  // 에러 처리하기
                  console.error(error);
                }
              }}
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function usePaymentWidget(clientKey: string, customerKey: string) {
  return useQuery({
    queryKey: ['payment-widget', clientKey, customerKey],
    queryFn: () => {
      // ------  결제위젯 초기화 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
      return loadPaymentWidget(clientKey, customerKey);
    },
  });
}
