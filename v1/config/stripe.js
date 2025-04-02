import Stripe from "stripe";
const stripe = new Stripe("sk_test_your_secret_key");

await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: true, // Cancels at end of the billing cycle
});

await stripe.subscriptions.del(subscriptionId);

await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }], // Monthly price
  trial_end: Math.floor(new Date().setMonth(new Date().getMonth() + 3) / 1000), // 3-month trial
});

// for intial period create a paid stripe trial then set its end date for when the billing starts and cancel or revoke billing as such.
