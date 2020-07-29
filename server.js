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

// transfer to /autocomplete
app.post('/autocomplete', (req, res) => {
    console.log(req);
    if (!req.body) {
        res.send("No data received");
    }

    if (!req.body.address) {
        res.send("No address found");
    }
    const address = req.body.address;

    // This is for testing without call the backend API
    res.send([
        {
            address: address,
            zipCode: '94043',
        },
        {
            address: address,
            zipCode: '94025',
        },
    ]);

    // get auotcompelete address from backend API
 /*    axios.post(`http://localhost:${portBackend}/delivery/autocomplete`, {
        "address" : address,
    })
        .then(response => {
            console.log(response.data);
            res.send(response.data);
        })
        .catch(error => console.log(error)); */

})

// transfer ship information from client to java servlet /recommendation
app.post('/recommendation', (req, res) => {

   if (!req.body) {
    res.send("No data received");
  }

  if (!req.body.address) {
    res.send("No station address found")
  }

  if (!req.body.receiverAddr) {
    res.send("No twoAddr found")
  }

  console.log(req.body);
  res.send(
      [
          {
              "carrier": "drone",
              "price": "7.20",
              "dispatch within: ": "30 mins"
          },
          {
              "carrier": "drone",
              "price": "6.60",
              "dispatch within: ": "1 hour"
          },
          {
              "carrier": "drone",
              "price": "6.00",
              "dispatch within: ": "2 hours"
          },
          {
              "carrier": "robot",
              "price": "3.72",
              "dispatch within: ": "30 mins"
          },
          {
              "carrier": "robot",
              "price": "3.41",
              "dispatch within: ": "1 hour"
          },
          {
              "carrier": "robot",
              "price": "3.10",
              "dispatch within: ": "2 hours"
          }
      ]
  )
 /* axios.post(`http://localhost:${portBackend}/delivery/recommendation`, {
    "senderAddr": req.body.senderAddr,
    "receiverAddr": req.body.receiverAddr,
    "weight": req.body.weight,
  })
      .then((response) => {
        console.log(response.data);
        res.send(response.data)
      })
      .catch((error) => {
        res.send(error)
      }) */
})

app.post('/validAddr', (req, res) => {
  if (!req.body) {
    res.send("No data received");
  }

  if (!req.body.senderAddr) {
    res.send("No oneAddr found")
  }

  if (!req.body.receiverAddr) {
    res.send("No twoAddr found")
  }
  console.log(req.body);
  axios.post(`http://localhost:${portBackend}/delivery/validaddr`, {
    "senderAddr": req.body.senderAddr,
    "receiverAddr": req.body.receiverAddr,
  })
      .then((response) => {
        console.log(response.data);
        res.send(response.data)
      })
      .catch((error) => {
        res.send(error)
      })
})

// tracking
app.post('/tracking', (req, res) => {
  if (!req.body) {
    res.send("No data received");
  }

  if (!req.body.tracking_id) {
    res.send("No tracking id found")
  }

  if (req.body.tracking_id === '1111') {
    res.send(
      {
        "current location": "37.78,-122.48",
        "estimated delivered time": "2020-07-26 23:30:00",
        "delay": true,
        "destination": "37.77325570,-122.43554290",
        "status": "in transit"
    
      }
    )
  } 
  else if (req.body.tracking_id === '2222') {
    res.send(
      {
        "current location": "37.76,-122.46",
        "estimated delivered time": "2020-07-26 23:30:00",
        "delay": true,
        "destination": "37.77325570,-122.43554290",
        "status": "in transit"
    
      }
    ) 
  }
  else if (req.body.tracking_id === '3333') {
    res.send(
      {
        "current location": "37.75,-122.44",
        "estimated delivered time": "2020-07-26 23:30:00",
        "delay": true,
        "destination": "37.77325570,-122.43554290",
        "status": "in transit"
      }
    ) 
  } 
  else {
    res.send(
      {
        "current location": "37.77148800,-122.43540050",
        "estimated delivered time": "2020-07-26 23:30:00",
        "delay": true,
        "destination": "37.77325570,-122.43554290",
        "status": "in transit"
      }
  
    // // return response without calling the backend
    // res.send({
    //     "status": "Order delivered!"
    // })

    // res.send([
    //   {
    //     "current location": "37.77148800,-122.43540050",
    //     "estimated delivered time": "2020-07-26 23:30:00",
    //     "delay": true,
    //     "destination": "37.77325570,-122.43554290",
    //     "status": "in transit"
    
    //   }
    )
  }

    // console.log(req.body);
    // axios.post(`http://localhost:${portBackend}/delivery/tracking`, {
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

app.post('/neworder', (req, res) => {
    if (!req.body) {
        res.send("No data received");
    }

    if (!req.body.deliveryTime) {
        res.send("No delivery time!");
    }

    console.log(req.body);
    axios.post(`http://localhost:${portBackend}/delivery/neworder`, {
        "senderFisrtName":req.body.senderFisrtName,
        "senderLastName":req.body.senderLastName,
        "senderAddress": req.body.senderAddress,
        "senderPhoneNumber":req.body.senderPhoneNumber,
        "senderEmail":req.body.senderEmail,
        "recipentFisrtName":req.body.recipentFisrtName,
        "recipentLastName":req.body.recipentLastName,
        "recipentAddress": req.body.recipentAddress,
        "recipentPhoneNumber":req.body.recipentPhoneNumber,
        "recipentEmail": req.body.recipentEmail,
        "packageWeight" : req.body.packageWeight,
        "packageHeight" : req.body.packageHeight,
        "packageLength" : req.body.packageLength,
        "packageWidth" : req.body.packageWidth,
        "carrier" : req.body.carrier,
        "totalCost" : req.body.totalCost,
        "deliveryTime": req.body.deliveryTime,
    })
        .then((response) => {
            console.log(response.data);
            res.send(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});


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

    //sending response without calling the backend
    res.send({
        "email_address": "xxx@gmail.com",
        "user_name": "newUser",
        "name": "xxx xxx",
        "phone_number": "xxx-xxx-xxxx",
        "status": "OK"
    })
    // console.log(req.body);
    //   axios.post(`http://localhost:${portBackend}/delivery/login`, {
    //       "user_id": req.body.user_id,
    //       "password": req.body.password,
    //   })
    //   .then((response) => {
    //   console.log(response.data);
    //       res.send(response.data)
    //   })
    //   .catch((error) => {
    //       res.send(error)
    //   })
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

    //sending response without calling the backend
    res.send({
        "status": "OK"
    })
    // console.log(req.body);
    // axios.post(`http://localhost:${portBackend}/delivery/register`, {
    //     "user_id": req.body.user_id,
    //     "password": req.body.password,
    //     "last_name":"xxx",
    //     "first_name":"xxx",
    //     "email_address":"xxx",
    //     "phone_number":"xxx",
    // })
    // .then((response) => {
    // console.log(response.data);
    //     res.send(response.data)
    // })
    // .catch((error) => {
    //     res.send(error)
    // })
})

// app.post('/activeorder', () => ())
app.post('/activeorder', (req, res) => {
    if (!req.body) {
        res.send("No request body");
    }

    if (!req.body.user_id) {
        res.send("user_id not found");
    }

    // send response without calling the backend
    res.send([
        {
            "Tracking ID": "1111",
            "Delivery Address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043-1351",
            "Delivery Time": "2020-07-21 1:50:00",
            "Order ID": "1",
            "Recipient": "Sai",
            "Order Date": "2020-07-21 1:00:00",
            "Order Status": "active"
        },
        {
          "Tracking ID": "2222",
          "Delivery Address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043-1351",
          "Delivery Time": "2020-07-21 2:50:00",
          "Order ID": "2",
          "Recipient": "Zhanzhi",
          "Order Date": "2020-07-21 2:00:00",
          "Order Status": "active"
      },
      {
        "Tracking ID": "3333",
        "Delivery Address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043-1351",
        "Delivery Time": "2020-07-21 3:50:00",
        "Order ID": "3",
        "Recipient": "Xin",
        "Order Date": "2020-07-21 3:00:00",
        "Order Status": "active"
    }
    ])
    // // calling the backend
    // axios.post(`http://localhost:${portBackend}/dronbert/activeorder`, {
    //   user_id: req.body.user_id
    // })
    // .then((response) => {
    //   console.log(response)
    //   res.send(response.data);
    // })
    // .catch((error) => {
    //   console.log(`error ${error}`)
    //   res.send(error);
    // })
})

// app.post('/history', () => ())
app.post('/history', (req, res) => {
    if (!req.body) {
        res.send("No request body");
    }

    if (!req.body.user_id) {
        res.send("user_id not found");
    }

    // send response without calling the backend
    res.send([
        {
            "Tracking ID": "1234",
            "Delivery Address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043-1351",
            "Delivery Time": "2020-07-21 10:50:00",
            "Order ID": "1",
            "Recipient": "Sai Chen",
            "Order Date": "2020-07-21 10:00:00",
            "Order Status": "active"
        },
        {
            "Tracking ID": "1232",
            "Delivery Address": "1 Hacker Way, Menlo Park, CA 94025-1456",
            "Delivery Time": "2020-07-20 10:50:00",
            "Order ID": "11",
            "Recipient": "Bingqi Zhou",
            "Order Date": "2020-07-20 10:00:00",
            "Order Status": "complete"
        }
    ])
    // // calling the backend
    // axios.post(`http://localhost:${portBackend}/dronbert/history`, {
    //   user_id: req.body.user_id
    // })
    // .then((response) => {
    //   console.log(response)
    //   res.send(response.data);
    // })
    // .catch((error) => {
    //   console.log(`error ${error}`)
    //   res.send(error);
    // })
})

// app.post('/detail', () => ())
app.post('/detail', (req, res) => {
    if (!req.body) {
        res.send("No request body");
    }

    if (!req.body.order_id) {
        res.send("order_id not found");
    }

    // send response without calling the backend
  /*  res.send({
        "machine_type": "robot",
        "sender_phone": "12345678",
        "recipient_email": "cs@gmail.com",
        "sender_name": "Bingqi Zhou",
        "recipient_address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043-1351",
        "sender_address": "1 Hacker Way, Menlo Park, CA 94025-1456",
        "package_height": "11.0",
        "package_length": "11.0",
        "package_width": "11.0",
        "package_fragile": "0",
        "package_weight": "10.0",
        "total cost": "15.0",
        "recipient_name": "Sai Chen",
        "delivered_at": "",
        "sender_email": "zbq@gmail.com",
        "recipient_phone": "87654321"
    }) */

    // // communicate with the backend
     axios.post(`http://18.221.255.187/delivery/detail`, {
       "order_id": req.body.order_id
     })
     .then((response) => {
          console.log(response)
       res.send(response.data);
     })
     .catch((error) => {
       console.log(`error ${error}`)
       res.send(error);
     })
})

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
