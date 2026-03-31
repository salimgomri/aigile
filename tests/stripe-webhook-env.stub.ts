/** Assure STRIPE_* avant chargement de la route webhook (imports hoisted). */
if (!process.env.STRIPE_SECRET_KEY) process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
if (!process.env.STRIPE_WEBHOOK_SECRET) process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock'
