const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔐 WEBHOOK DISCORD (mets ton nouveau ici)
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1496843404762419232/jzeLP_4B0FIcnmhxhscnGpySoUMKhItYBAFayOWzGa1YRCxFmYYLEt2hgad0DFwXdNv8";

// 🟢 test serveur
app.get("/", (req, res) => {
  res.send("Server OK");
});

// 📦 recevoir commande site
app.post("/create-order", (req, res) => {
  const data = req.body;

  console.log("Nouvelle commande :", data);

  res.json({ success: true });
});

// 💳 webhook PayPal
app.post("/paypal-webhook", async (req, res) => {
  const event = req.body;

  console.log("PayPal event:", event);

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {

    const email = event.resource?.payer?.email_address || "Unknown";
    const amount = event.resource?.amount?.value || "Unknown";
    const customID = event.resource?.custom_id || "Unknown";

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
`💸 PAIEMENT CONFIRMÉ
🆔 Order: ${customID}
📧 Email: ${email}
💰 Montant: ${amount}`
      })
    });

  }

  res.sendStatus(200);
});

// 🚀 PORT RENDER OBLIGATOIRE
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server ON on port " + PORT);
});
