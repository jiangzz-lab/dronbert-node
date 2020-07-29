const express = require("express");
const app = express();
const { resolve } = require("path");
const cors = require("cors");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());
app.use(cors());
const axios = require("axios");

// test communication at /
app.get("/", (req, res) => {
  res.send("Communication Successful!");
});

const portBackend = process.env.PORT_BACKEND || 8080;

// app.post('/register', () => ())
app.post("/register", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/register`, {
      user_id: req.body.user_id,
      password: req.body.password,
      last_name: req.body.last_name,
      first_name: req.body.first_name,
      email_address: req.body.email_address,
      phone_number: req.body.phone_number,
      address: req.body.address
    })
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

// app.post('/login', ())
app.post("/login", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/login`, {
      user_id: req.body.user_id,
      password: req.body.password
    })
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

// transfer to /autocomplete
app.post("/autocomplete", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/autocomplete`, {
      address: req.body.address
    })
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.post("/validAddr", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/validaddr`, {
      senderAddr: req.body.senderAddr,
      receiverAddr: req.body.receiverAddr
    })
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

// transfer ship information from client to java servlet /recommendation
app.post("/recommendation", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/recommendation`, {
      address: req.body.address,
      receiverAddr: req.body.receiverAddr,
      weight: req.body.weight,
      length: req.body.length,
      width: req.body.width,
      height: req.body.height,
      fragile: req.body.fragile
    })
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.post("/neworder", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/neworder`, {
      userId: req.body.userId,
      senderFirstName: req.body.senderFirstName,
      senderLastName: req.body.senderLastName,
      senderPhoneNumber: req.body.senderPhoneNumber,
      senderEmail: req.body.senderEmail,
      recipientFirstName: req.body.recipientFirstName,
      recipientLastName: req.body.recipientLastName,
      recipientAddress: req.body.recipientAddress,
      recipientPhoneNumber: req.body.recipientPhoneNumber,
      recipientEmail: req.body.recipientEmail,
      packageWeight: req.body.packageWeight,
      packageHeight: req.body.packageHeight,
      totalCost: req.body.totalCost,
      active: req.body.active,
      isFragile: req.body.isFragile,
      packageLength: req.body.packageLength,
      packageWidth: req.body.packageWidth,
      carrier: req.body.carrier,
      stationId: req.body.stationId,
      appointmentTime: req.body.appointmentTime
    })
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});

// tracking
app.post("/tracking", (req, res) => {
  if (!req.body) {
    res.send("No data received");
  }

  if (!req.body.tracking_id) {
    res.send("No tracking id found");
  }

  // return response without calling the backend
  res.send({
    status: "Order delivered!"
  });

  // console.log(req.body);
  // axios.post(`http://18.221.255.187/delivery/tracking`, {
  //   "tracking_id": req.body.tracking_id,
  // })
  //     .then((response) => {
  //       console.log(response.data);
  //       res.send(response.data)
  //     })
  //     .catch((error) => {
  //       res.send(error)
  //     })
});

// app.post('/activeorder', () => ())
app.post("/activeorder", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/activeorder`, {
      user_id: req.body.user_id
    })
    .then(response => {
      console.log(response);
      res.send(response.data);
    })
    .catch(error => {
      console.log(`error ${error}`);
      res.send(error);
    });
});

app.post("/history", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/history`, {
      user_id: req.body.user_id
    })
    .then(response => {
      console.log(response);
      res.send(response.data);
    })
    .catch(error => {
      console.log(`error ${error}`);
      res.send(error);
    });
});

// app.post('/detail', () => ())
app.post("/detail", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/detail`, {
      order_id: req.body.order_id
    })
    .then(response => {
      console.log(response);
      res.send(response.data);
    })
    .catch(error => {
      console.log(`error ${error}`);
      res.send(error);
    });
});

// app.post('/userprofile', () => ())
app.post("/userprofile", (req, res) => {
  axios
    .post(`http://18.221.255.187/delivery/userprofile`, {
      user_id: req.body.user_id,
      email: req.body.email,
      last_name: req.body.last_name,
      first_name: req.body.first_name,
      phoneNumber: req.body.phoneNumber,
      primaryAddress: req.body.primaryAddress,
      zipCode: req.body.zipCode
    })
    .then(response => {
      console.log(response);
      res.send(response.data);
    })
    .catch(error => {
      console.log(`error ${error}`);
      res.send(error);
    });
});

// router to use google distance matrix API
app.post("/duration", async (req, res) => {
  if (!req.body) {
    res.send("no data received!");
  }
  if (!req.body.origins) {
    res.send("no origin address!");
  }
  if (!req.body.destinations) {
    res.send("no destination address!");
  }
  console.log(req.body);
  var distance = require("google-distance-matrix");
  distance.key("AIzaSyCy_VrkQrprJMRX1PBGVX0VVNgH9h4tFZA");
  distance.units("imperial");
  const origins = req.body.origins.map(origin => origin["address"]);
  const destinations = req.body.destinations.map(
    destination => destination["address"]
  );
  await distance.matrix(origins, destinations, function(err, distances) {
    if (err) {
      return console.log(err);
    }
    if (!distances) {
      return console.log("no distances");
    }
    if (distances.status === "OK") {
      console.log(distances);
      console.log(distances.rows);
      console.log(distances.rows[0]);
      const durations = distances.rows[0].elements.map((element, index) => {
        return {
          duration: element.status === "OK" ? element.duration.value : Infinity,
          distance:
            element.status === "OK" ? element.distance.text : "not accessible",
          status: element.status
        };
      });
      res.send(durations);
    }
  });
});

// routers for payment
// get stripe public key from /stripe-key by GET method

app.get("/stripe-key", (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// helper function to calculate amount to charge
const calculateOrderAmount = price => {
  // Replace this constant with a calculation of the order's amount
  // You should always calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return Number(price * 100);
};

// make payment by sending card information to /pay by POST method
app.post("/pay", async (req, res) => {
  const { paymentMethodId, price, currency } = req.body;

  const orderAmount = calculateOrderAmount(price);

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
