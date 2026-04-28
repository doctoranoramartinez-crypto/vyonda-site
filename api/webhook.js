export default async function handler(req, res) {
  try {
    console.log("Webhook Mercado Pago:", {
      method: req.method,
      query: req.query,
      body: req.body
    });

    return res.status(200).send("OK");
  } catch (error) {
    return res.status(500).json({
      error: "Error en webhook",
      detail: error.message
    });
  }
}
