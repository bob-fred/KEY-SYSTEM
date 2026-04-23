const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔧 À REMPLACER (WEBHOOK DISCORD)
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1496843404762419232/jzeLP_4B0FIcnmhxhscnGpySoUMKhItYBAFayOWzGa1YRCxFmYYLEt2hgad0DFwXdNv8";

// test serveur
app.get("/", (req, res) => {
  res.send("Server OK");
});

// commandes site
app.post("/create-order", (req, res) => {
  console.log("Commande reçue :", req.body);
  res.json({ success: true });
});

// PayPal webhook
app.post("/paypal-webhook", async (req, res) => {

  const event = req.body;

  if(event.event_type === "PAYMENT.CAPTURE.COMPLETED"){

    await fetch(DISCORD_WEBHOOK, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        content:
`💸 PAIEMENT OK
📧 Email: ${event.resource?.payer?.email_address}
💰 Montant: ${event.resource?.amount?.value}`
      })
    });

  }

  res.sendStatus(200);
});

// 🔥 PORT RENDER OBLIGATOIRE
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server ON");
});
