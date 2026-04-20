import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      const amountTotal = Number(session.amount_total || 0) / 100;
      const paymentIntentId =
        typeof session.payment_intent === "string" ? session.payment_intent : null;

      const { error: bookingUpdateError } = await supabaseAdmin
  .from("bookings")
  .update({
    payment_status: "paid",
    status: "confirmed",
    total_price: amountTotal,
  })
  .eq("id", bookingId);

      if (bookingUpdateError) {
        console.error("Booking update error:", bookingUpdateError);
      }

      const { data: booking, error: bookingFetchError } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .maybeSingle();

      if (bookingFetchError) {
        console.error("Booking fetch error:", bookingFetchError);
      }

      if (booking) {
        const notaryPrice = Number(booking.price || 0);
        const totalPrice = amountTotal;
        const platformFee = Math.max(totalPrice - notaryPrice, 0);

        const { error: transactionInsertError } = await supabaseAdmin
          .from("transactions")
          .insert([
            {
              booking_id: booking.id,
              notary_id: booking.notary_id,
              customer_id: booking.user_id,
              service_date: booking.date,
              transaction_date: new Date().toISOString().slice(0, 10),
              address: booking.address,
              payment_method: "stripe",
              payment_status: "paid",
              notary_price: notaryPrice,
              platform_fee: platformFee,
              total_price: totalPrice,
              stripe_payment_intent_id: paymentIntentId,
              receipt_number: `ST-${booking.id.slice(0, 8).toUpperCase()}`,
            },
          ]);

        if (transactionInsertError) {
          console.error("Transaction insert error:", transactionInsertError);
        }
      }
    }
  }

  return new Response("ok", { status: 200 });
}