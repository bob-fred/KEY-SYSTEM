const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔔 TON WEBHOOK DISCORD (à remplacer)
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1496843404762419232/jzeLP_4B0FIcnmhxhscnGpySoUMKhItYBAFayOWzGa1YRCxFmYYLEt2hgad0DFwXdNv8";

// 🟢 TEST SERVEUR
app.get("/", (req, res) => {
  res.send("Server OK");
});

// 📦 RECEVOIR COMMANDES DU SITE
app.post("/create-order", (req, res) => {
  const { orderID, pseudo, discord, product } = req.body;

  console.log("Commande reçue:", req.body);

  // réponse rapide (important pour éviter timeout)
  res.json({ success: true });
});

// 💳 WEBHOOK PAYPAL
app.post("/paypal-webhook", async (req, res) => {
  const event = req.body;

  console.log("PayPal event reçu");

  try {

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {

      const email = event.resource?.payer?.email_address || "Unknown";
      const amount = event.resource?.amount?.value || "Unknown";

      // 🔔 ENVOI DISCORD
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content:
`💸 PAIEMENT CONFIRMÉ
📧 Email: ${email}
💰 Montant: ${amount}
`
        })
      });

    }

  } catch (err) {
    console.log("Erreur webhook:", err);
  }

  res.sendStatus(200);
});

// 🚀 PORT RENDER OBLIGATOIRE
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server ON sur port " + PORT);
});
