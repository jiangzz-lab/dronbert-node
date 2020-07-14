const express = require("express");
const app = express();
const { resolve } = require("path");
const cors = require('cors');
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());
app.use(cors());
const axios = require('axios');

// test communication at /
app.get('/', (req, res) => {
  res.send('Communication Succcessful!')
})

const portBackend = process.env.PORT_BACKEND || 8080;
// transfer ship information from client to java servlet /recommendation
app.post('/recommendation', (req, res) => {
  if (!req.body) {
    res.send("No data received");
  }

  if (!req.body.oneAddr) {
    res.send("No oneAddr found")
  }

  if (!req.body.twoAddr) {
    res.send("No twoAddr found")
  }

  console.log(req.body);
  axios.post(`http://localhost:${portBackend}/delivery/recommendation`, {
    "oneAddr": req.body.oneAddr,
    "twoAddr": req.body.twoAddr,
  })
      .then((response) => {
        console.log(response.data);
        res.send(response.data)
      })
      .catch((error) => {
        res.send(error)
      })
})

// app.post('/login', ())
app.post('/login', (req, res) => {
  if (!req.body) {
      res.send("No data received");
  }

  if (!req.body.user_id) {
      res.send("No username found")
  }

  if (!req.body.password) {
      res.send("No password found")
  }

console.log(req.body);
  axios.post(`http://localhost:${portBackend}/delivery/login`, {
      "user_id": req.body.user_id,
      "password": req.body.password,
  })
  .then((response) => {
  console.log(response.data);
      res.send(response.data)
  })
  .catch((error) => {
      res.send(error)
  })
})

// app.post('/register', () => ())
app.post('/register', (req, res) => {
  if (!req.body) {
      res.send("No data received");
  }

  if (!req.body.user_id) {
      res.send("No username found")
  }

  if (!req.body.password) {
      res.send("No password found")
  }

  if (!req.body.last_name) {
      res.send("No last name found")
  }

  if (!req.body.first_name) {
      res.send("No first name found")
  }

  if (!req.body.email_address) {
      res.send("No email address found")
  }

  if (!req.body.phone_number) {
      res.send("No phone number found")
  }

console.log(req.body);
  axios.post(`http://localhost:${portBackend}/delivery/register`, {
      "user_id": req.body.user_id,
      "password": req.body.password,
      "last_name":req.body.last_name,
      "first_name":req.body.first_name,
      "email_address":req.body.email_address,
      "phone_number":req.body.phone_number,
  })
  .then((response) => {
  console.log(response.data);
      res.send(response.data)
  })
  .catch((error) => {
      res.send(error)
  })
})

// routers for payment
// get stripe public key from /stripe-key by GET method

app.get("/stripe-key", (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// helper function to calculate amount to charge
const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // You should always calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

// make payment by sending card information to /pay by POST method
app.post("/pay", async (req, res) => {
  const { paymentMethodId, items, currency } = req.body;

  const orderAmount = calculateOrderAmount(items);

  try {
    // Create new PaymentIntent with a PaymentMethod ID from the client.
    const intent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: currency,
      payment_method: paymentMethodId,
      error_on_requires_action: true,
      confirm: true
    });

    console.log("💰 Payment received!");
    // The payment is complete and the money has been moved
    // You can add any post-payment code here (e.g. shipping, fulfillment, etc)

    // Send the client secret to the client to use in the demo
    res.send({ clientSecret: intent.client_secret });
  } catch (e) {
    // Handle "hard declines" e.g. insufficient funds, expired card, card authentication etc
    // See https://stripe.com/docs/declines/codes for more
    if (e.code === "authentication_required") {
      res.send({
        error:
          "This card requires authentication in order to proceeded. Please use a different card."
      });
    } else {
      res.send({ error: e.message });
    }
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Node server listening on port ${port}!`));
