export default async function successPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const res = await fetch(
    `http://localhost:8082/api/v1/payments/success?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`
  );
  const data = await res.json();

  return data;
}
