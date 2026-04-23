const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1496843404762419232/jzeLP_4B0FIcnmhxhscnGpySoUMKhItYBAFayOWzGa1YRCxFmYYLEt2hgad0DFwXdNv8";

// stock commandes
let orders = {};

// recevoir commande depuis site
app.post("/create-order", (req, res) => {
  const { orderID, pseudo, discord, product } = req.body;

  orders[orderID] = { pseudo, discord, product };

  res.json({ ok: true });
});

// webhook PayPal
app.post("/paypal-webhook", async (req, res) => {
  const event = req.body;

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {

    const orderID = event.resource?.custom_id;
    const order = orders[orderID];

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
`💸 PAYPAL PAIEMENT
👤 Pseudo: ${order?.pseudo}
💬 Discord: ${order?.discord}
📦 Produit: ${order?.product}
💰 Montant: ${event.resource?.amount?.value}`
      })
    });

  }

  res.sendStatus(200);
});

app.listen(3000);