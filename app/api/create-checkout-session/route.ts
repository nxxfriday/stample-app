import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      bookingId,
      amount,
      address,
      customerEmail,
    }: {
      bookingId: string;
      amount: number;
      address: string;
      customerEmail?: string;
    } = body;

    if (!bookingId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment payload." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "STAMPLE Notary Service",
              description: `Booking ${bookingId} - ${address || "Mobile notary service"}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
      cancel_url: `${appUrl}/dashboard?payment=cancelled&bookingId=${bookingId}`,
      metadata: {
        bookingId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 }
    );
  }
}