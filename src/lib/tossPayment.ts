import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

const clientKey = process.env.NEXT_PUBLIC_TOSS_WIDGET_CLIENT_KEY ?? "";
const customerKey = process.env.NEXT_PUBLIC_TOSS_CUSTOMER_KEY ?? "";

let paymentWidgetPromise: Promise<PaymentWidgetInstance> | null = null;

export function getPaymentWidget(): Promise<PaymentWidgetInstance> {
    if (!paymentWidgetPromise) {
        paymentWidgetPromise = loadPaymentWidget(clientKey, customerKey);
    }
    return paymentWidgetPromise;
}
