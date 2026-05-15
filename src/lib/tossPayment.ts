import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

// Use Toss Test Client Key
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "TOSS_TEST_CUSTOMER_KEY_1234";

let paymentWidgetPromise: Promise<PaymentWidgetInstance> | null = null;

export function getPaymentWidget(): Promise<PaymentWidgetInstance> {
    if (!paymentWidgetPromise) {
        paymentWidgetPromise = loadPaymentWidget(clientKey, customerKey);
    }
    return paymentWidgetPromise;
}
