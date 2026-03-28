<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Editflow — Crie conteúdo com IA</title>
  <script src="https://js.stripe.com/v3/"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg:      #07080a;
      --surface: #0e1014;
      --card:    #13161b;
      --border:  #1f232b;
      --border2: #2a2f3a;
      --accent:  #e8ff57;
      --text:    #edeae2;
      --muted:   #6b7280;
      --muted2:  #9ca3af;
      --danger:  #ff6b6b;
      --success: #4ade80;
      --radius:  14px;
      --radius-lg: 20px;
      --vid-w: 340px;
      --font-display: 'DM Serif Display', serif;
      --font-body: 'DM Sans', sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
    }
    body::after {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9999;
    }

    .page { max-width: 960px; margin: 0 auto; padding: 0 20px; }

    /* ── Header ── */
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28px 0 0;
      position: relative; z-index: 2;
    }
    .logo {
      font-family: var(--font-display);
      font-size: 1.35rem;
      letter-spacing: -0.01em;
    }
    .logo b { color: var(--accent); font-weight: 400; font-style: italic; }
    .header-badge {
      font-size: 0.68rem; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--bg); background: var(--accent);
      border-radius: 4px; padding: 4px 10px;
    }

    /* ── Hero ── */
    .hero {
      padding: 60px 0 0;
      text-align: center;
      position: relative; z-index: 2;
    }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 0.72rem; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--muted2); margin-bottom: 20px;
      opacity: 0; animation: riseIn 0.6s 0.1s ease forwards;
    }
    .hero-eyebrow::before, .hero-eyebrow::after {
      content: ''; display: block; width: 24px; height: 1px;
      background: var(--border2);
    }
    h1 {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 5.5vw, 3.8rem);
      line-height: 1.05; letter-spacing: -0.02em;
      max-width: 700px; margin: 0 auto 20px;
      opacity: 0; animation: riseIn 0.7s 0.2s ease forwards;
    }
    h1 .hl { color: var(--accent); font-style: italic; }
    .hero-sub {
      font-size: 1rem; font-weight: 300; color: var(--muted2);
      max-width: 440px; margin: 0 auto; line-height: 1.7;
      opacity: 0; animation: riseIn 0.7s 0.32s ease forwards;
    }

    /* ── Two-column ── */
    .main-section {
      display: grid;
      grid-template-columns: var(--vid-w) 1fr;
      gap: 40px; align-items: start;
      padding: 52px 0 80px;
      position: relative; z-index: 2;
    }

    /* Video */
    .video-col {
      position: sticky; top: 24px;
      opacity: 0; animation: riseIn 0.8s 0.4s ease forwards;
    }
    .video-wrap {
      position: relative; width: 100%;
      border-radius: var(--radius-lg); overflow: hidden;
      box-shadow:
        0 0 0 1px var(--border),
        0 40px 80px rgba(0,0,0,0.8),
        0 0 80px rgba(232,255,87,0.06);
    }
    .video-wrap::before { content: ''; display: block; padding-top: 177.78%; }
    .video-wrap iframe {
      position: absolute; inset: 0;
      width: 100%; height: 100%; border: none;
    }
    .video-glow {
      position: absolute; inset: -40px;
      background: radial-gradient(ellipse at center, rgba(232,255,87,0.08) 0%, transparent 65%);
      pointer-events: none; z-index: -1; border-radius: 50%;
    }
    .video-caption {
      margin-top: 14px;
      display: flex; align-items: center; gap: 8px;
      font-size: 0.75rem; color: var(--muted);
    }
    .video-caption::before {
      content: '';
      display: inline-block; width: 6px; height: 6px;
      border-radius: 50%; background: var(--accent); flex-shrink: 0;
      box-shadow: 0 0 6px var(--accent);
      animation: pulse 2s ease-in-out infinite;
    }

    /* Checkout col */
    .checkout-col {
      opacity: 0; animation: riseIn 0.8s 0.55s ease forwards;
    }
    .checkout-header { margin-bottom: 28px; }
    .checkout-header h2 {
      font-family: var(--font-display);
      font-size: 1.9rem; line-height: 1.1; margin-bottom: 8px;
    }
    .checkout-header p { font-size: 0.88rem; color: var(--muted2); line-height: 1.6; }

    .price-block {
      display: flex; align-items: baseline; gap: 6px;
      margin-bottom: 28px; padding: 18px 20px;
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .price-prefix { font-size: 0.8rem; color: var(--muted); font-weight: 300; }
    .price-value {
      font-family: var(--font-display);
      font-size: 2.4rem; letter-spacing: -0.03em;
    }
    .price-suffix { font-size: 0.8rem; color: var(--muted); margin-left: 2px; }
    .price-tag {
      margin-left: auto; font-size: 0.68rem; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--bg); background: var(--accent);
      border-radius: 4px; padding: 3px 8px;
    }

    .perks { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
    .perks li { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--muted2); }
    .perks li::before {
      content: '✓';
      display: inline-flex; align-items: center; justify-content: center;
      width: 18px; height: 18px; border-radius: 50%;
      background: rgba(232,255,87,0.12); color: var(--accent);
      font-size: 0.65rem; font-weight: 700; flex-shrink: 0;
    }

    /* Form card */
    .form-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 28px;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }

    label {
      font-size: 0.72rem; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted);
    }

    input[type="text"], input[type="email"] {
      width: 100%; background: var(--surface);
      border: 1px solid var(--border2); border-radius: 8px;
      padding: 11px 14px; font-family: var(--font-body);
      font-size: 0.9rem; color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input::placeholder { color: var(--muted); }
    input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(232,255,87,0.1);
    }

    /* Stripe Element wrapper */
    .stripe-wrap {
      background: var(--surface); border: 1px solid var(--border2);
      border-radius: 8px; padding: 12px 14px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .stripe-wrap.focused {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(232,255,87,0.1);
    }
    .stripe-wrap.invalid { border-color: var(--danger); }

    .form-divider {
      display: flex; align-items: center; gap: 12px;
      margin: 18px 0; color: var(--muted);
      font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    }
    .form-divider::before, .form-divider::after {
      content: ''; flex: 1; height: 1px; background: var(--border);
    }

    .btn-pay {
      width: 100%; padding: 14px;
      background: var(--accent); color: var(--bg);
      border: none; border-radius: 8px;
      font-family: var(--font-body); font-size: 0.95rem;
      font-weight: 600; letter-spacing: 0.03em;
      cursor: pointer; margin-top: 20px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    }
    .btn-pay:hover:not(:disabled) {
      background: #d4ec47;
      box-shadow: 0 4px 24px rgba(232,255,87,0.25);
      transform: translateY(-1px);
    }
    .btn-pay:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-pay .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(0,0,0,0.3);
      border-top-color: #000; border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: none;
    }
    .btn-pay.loading .spinner { display: block; }
    .btn-pay.loading .btn-label { display: none; }

    #msg {
      margin-top: 14px; font-size: 0.82rem;
      text-align: center; min-height: 20px; color: var(--danger);
    }
    #msg.ok { color: var(--success); }

    .secure-line {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; margin-top: 16px;
      font-size: 0.72rem; color: var(--muted);
    }
    .secure-line svg { opacity: 0.4; }

    /* Mobile */
    @media (max-width: 720px) {
      .main-section { grid-template-columns: 1fr; gap: 32px; padding-bottom: 60px; }
      .video-col { position: static; }
      .form-row  { grid-template-columns: 1fr; }
      h1 { font-size: 2.2rem; }
    }

    @keyframes riseIn {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%,100% { opacity: 1; } 50% { opacity: 0.3; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
<div class="page">

  <header>
    <div class="logo">Edit<b>flow</b></div>
    <div class="header-badge">Acesso imediato</div>
  </header>

  <section class="hero">
    <div class="hero-eyebrow">Novo método · IA + Criação</div>
    <h1>Conteúdo imersivo<br>criado com <span class="hl">inteligência</span></h1>
    <p class="hero-sub">
      Aprenda a usar IA para produzir vídeos de alta qualidade — do roteiro à edição — sem equipe, sem achismo.
    </p>
  </section>

  <div class="main-section">

    <!-- VÍDEO 9:16 -->
    <div class="video-col">
      <div style="position:relative">
        <div class="video-glow"></div>
        <div class="video-wrap">
          <iframe
            src="https://www.youtube.com/embed/cJDJkajzbbI?rel=0&modestbranding=1"
            title="Editflow — apresentação"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      </div>
      <div class="video-caption">Assista antes de comprar — sem pressa</div>
    </div>

    <!-- CHECKOUT EMBUTIDO -->
    <div class="checkout-col">
      <div class="checkout-header">
        <h2>Comece agora.<br>Sem desculpas.</h2>
        <p>Acesso vitalício · Atualizações inclusas · Suporte direto</p>
      </div>

      <div class="price-block">
        <span class="price-prefix">R$</span>
        <span class="price-value">197</span>
        <span class="price-suffix">pagamento único</span>
        <span class="price-tag">OFERTA</span>
      </div>

      <ul class="perks">
        <li>Módulo completo de criação com IA</li>
        <li>Templates de roteiro e edição prontos</li>
        <li>Acesso vitalício + atualizações grátis</li>
        <li>Comunidade exclusiva de criadores</li>
      </ul>

      <div class="form-card">
        <div class="form-row">
          <div class="form-group">
            <label for="fname">Nome</label>
            <input type="text" id="fname" placeholder="Seu nome" autocomplete="given-name" />
          </div>
          <div class="form-group">
            <label for="lname">Sobrenome</label>
            <input type="text" id="lname" placeholder="Sobrenome" autocomplete="family-name" />
          </div>
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" placeholder="seu@email.com" autocomplete="email" />
        </div>

        <div class="form-divider">Dados do cartão</div>

        <div class="form-group">
          <label>Número do cartão</label>
          <div class="stripe-wrap" id="el-number"></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Validade</label>
            <div class="stripe-wrap" id="el-expiry"></div>
          </div>
          <div class="form-group">
            <label>CVC</label>
            <div class="stripe-wrap" id="el-cvc"></div>
          </div>
        </div>

        <button class="btn-pay" id="pay-btn">
          <div class="spinner"></div>
          <span class="btn-label">Garantir acesso · R$ 197</span>
        </button>

        <div id="msg"></div>

        <div class="secure-line">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path d="M6 0L0 2.5V7C0 10.25 2.55 13.28 6 14C9.45 13.28 12 10.25 12 7V2.5L6 0Z" fill="currentColor"/>
          </svg>
          Pagamento seguro via Stripe · SSL
        </div>
      </div>
    </div>

  </div>
</div>

<script>
  // ─────────────────────────────────────────────────────────
  // CONFIGURAÇÃO — substitua sua chave pública do Stripe
  // Dashboard Stripe → Developers → API Keys → Publishable key
  // Começa com pk_live_ (produção) ou pk_test_ (testes)
  // ─────────────────────────────────────────────────────────
  const STRIPE_PK = 'pk_test_SUA_CHAVE_PUBLICA_AQUI';

  const stripe   = Stripe(STRIPE_PK);
  const elements = stripe.elements({
    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400&display=swap' }]
  });

  const elStyle = {
    base: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '14.5px',
      color: '#edeae2',
      '::placeholder': { color: '#6b7280' },
      iconColor: '#9ca3af',
    },
    invalid: { color: '#ff6b6b', iconColor: '#ff6b6b' }
  };

  const cardNumber = elements.create('cardNumber', { style: elStyle, showIcon: true });
  const cardExpiry = elements.create('cardExpiry', { style: elStyle });
  const cardCvc    = elements.create('cardCvc',    { style: elStyle });

  cardNumber.mount('#el-number');
  cardExpiry.mount('#el-expiry');
  cardCvc.mount('#el-cvc');

  // Focus / invalid visual nos wrappers
  function bindEvents(el, wrapperId) {
    el.on('focus', ()  => document.getElementById(wrapperId).classList.add('focused'));
    el.on('blur',  ()  => document.getElementById(wrapperId).classList.remove('focused'));
    el.on('change', e  => document.getElementById(wrapperId).classList.toggle('invalid', !!e.error));
  }
  bindEvents(cardNumber, 'el-number');
  bindEvents(cardExpiry, 'el-expiry');
  bindEvents(cardCvc,    'el-cvc');

  // ── Submit ────────────────────────────────────────────────
  document.getElementById('pay-btn').addEventListener('click', async () => {
    const name  = (
      document.getElementById('fname').value.trim() + ' ' +
      document.getElementById('lname').value.trim()
    ).trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !email) {
      setMsg('Preencha nome e e-mail antes de continuar.', false);
      return;
    }

    setLoading(true);

    try {
      // 1. Pede o clientSecret para a Vercel Function
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Erro ao conectar. Tente novamente.');
      const { clientSecret, error: serverErr } = await res.json();
      if (serverErr) throw new Error(serverErr);

      // 2. Confirma o pagamento direto no cartão (sem redirect)
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: { name, email },
        },
      });

      if (error) {
        setMsg(error.message, false);
      } else {
        setMsg('✓ Pagamento aprovado! Redirecionando...', true);
        setTimeout(() => { window.location.href = '/sucesso.html'; }, 1500);
      }

    } catch (err) {
      setMsg(err.message || 'Erro inesperado. Tente novamente.', false);
    }

    setLoading(false);
  });

  function setLoading(on) {
    const btn = document.getElementById('pay-btn');
    btn.disabled = on;
    btn.classList.toggle('loading', on);
  }

  function setMsg(text, ok) {
    const el = document.getElementById('msg');
    el.textContent = text;
    el.className = ok ? 'ok' : '';
  }
</script>
</body>
</html>
