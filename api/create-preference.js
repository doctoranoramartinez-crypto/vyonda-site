export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ error: "Falta MERCADOPAGO_ACCESS_TOKEN" });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    const preference = {
      items: items.map((item) => ({
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: "MXN"
      })),

      back_urls: {
        success: "https://vyondahealth.com/pago-exitoso.html",
        failure: "https://vyondahealth.com/pago-rechazado.html",
        pending: "https://vyondahealth.com/pago-pendiente.html"
      },

      auto_return: "approved",
      notification_url: "https://vyondahealth.com/api/webhook",
      statement_descriptor: "VYONDA",

      metadata: {
        marca: "VYONDA Health & Wellness",
        origen: "vyondahealth.com"
      }
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(preference)
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      return res.status(mpResponse.status).json(data);
    }

    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error al crear preferencia",
      detail: error.message
    });
  }
}
