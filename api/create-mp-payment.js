// api/create-mp-payment.js
// Vercel Serverless Function — Mercado Pago
// Variável de ambiente necessária: MP_ACCESS_TOKEN

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  console.log('ACCESS_TOKEN presente:', !!ACCESS_TOKEN);
  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado.' });
  }

  const { type, email, firstName, lastName, cpf, token, paymentMethodId, issuerId, installments, identificationType, identificationNumber } = req.body;

  const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    // ── PIX ─────────────────────────────────────────────
    if (type === 'pix') {
      const body = {
        transaction_amount: 99.00,
        description: 'Editflow - Acesso Anual',
        payment_method_id: 'pix',
        payer: {
          email,
          first_name: firstName,
          last_name: lastName || '',
        },
      };

      const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(body),
      });

      const data = await mpRes.json();
      if (!mpRes.ok) {
        return res.status(400).json({ error: data.message || 'Erro ao criar PIX.' });
      }

      const qr = data.point_of_interaction?.transaction_data;
      return res.status(200).json({
        payment_id: data.id,
        status: data.status,
        qr_code: qr?.qr_code || '',
        qr_code_base64: qr?.qr_code_base64 || '',
      });
    }

    // ── BOLETO ───────────────────────────────────────────
    if (type === 'boleto') {
      const body = {
        transaction_amount: 99.00,
        description: 'Editflow - Acesso Anual',
        payment_method_id: 'bolbradesco',
        payer: {
          email,
          first_name: firstName,
          last_name: lastName || '',
          identification: { type: 'CPF', number: cpf },
        },
      };

      const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(body),
      });

      const data = await mpRes.json();
      if (!mpRes.ok) {
        return res.status(400).json({ error: data.message || 'Erro ao gerar boleto.' });
      }

      const boletoUrl = data.transaction_details?.external_resource_url || '';
      return res.status(200).json({
        payment_id: data.id,
        status: data.status,
        boleto_url: boletoUrl,
      });
    }

    // ── CARTÃO ───────────────────────────────────────────
    if (type === 'card') {
      const body = {
        transaction_amount: 99.00,
        description: 'Editflow - Acesso Anual',
        token,
        installments: installments || 1,
        payment_method_id: paymentMethodId,
        issuer_id: issuerId,
        payer: {
          email,
          first_name: firstName,
          last_name: lastName || '',
          identification: { type: identificationType || 'CPF', number: identificationNumber },
        },
      };

      const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(body),
      });

      const data = await mpRes.json();
      if (!mpRes.ok) {
        return res.status(400).json({ error: data.message || 'Erro ao processar cartão.' });
      }

      return res.status(200).json({
        payment_id: data.id,
        status: data.status,
        status_detail: data.status_detail,
      });
    }

    return res.status(400).json({ error: 'Tipo de pagamento inválido.' });

  } catch (err) {
    console.error('MP Payment Error:', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
}
