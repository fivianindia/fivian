// Vercel serverless function: sends order and contact notifications to Discord.
// The webhook URL lives in the Vercel environment variable DISCORD_WEBHOOK_URL (never in the site code).
const BAD = /https?:\/\/|www\.|t\.me|@everyone|@here|<@/i;
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, max);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const hook = process.env.DISCORD_WEBHOOK_URL;
  if (!hook) return res.status(500).json({ ok: false });
  const origin = String(req.headers.origin || req.headers.referer || '');
  if (!/^https:\/\/((www\.)?fivian\.in|fivian[\w-]*\.vercel\.app)(\/|$)/.test(origin)) return res.status(403).json({ ok: false });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const type = body && body.type, d = (body && body.data) || {};
  const name = clean(d.name, 80), phone = clean(d.phone, 20);
  if (!name || phone.replace(/\D/g, '').length < 10 || BAD.test(name) || BAD.test(phone)) return res.status(400).json({ ok: false });

  let embed;
  if (type === 'order') {
    const address = clean(d.address, 500);
    const items = Array.isArray(d.items) ? d.items.slice(0, 40) : [];
    let total = 0;
    const lines = items.map(i => {
      const q = Math.max(1, Math.min(99, parseInt(i.q, 10) || 1)), p = Math.max(0, Math.min(100000, Number(i.p) || 0));
      total += q * p;
      return '- ' + clean(i.n, 60) + (i.l ? ' (' + clean(i.l, 20) + ')' : '') + ' x' + q + ' = \u20B9' + q * p;
    }).join('\n');
    if (!address || !items.length || BAD.test(address) || BAD.test(lines)) return res.status(400).json({ ok: false });
    embed = { title: 'New Website Order', color: 13112366, fields: [
      { name: 'Customer', value: name, inline: true }, { name: 'Phone', value: phone, inline: true },
      { name: 'Address', value: address }, { name: 'Items', value: lines.slice(0, 1000) },
      { name: 'Estimated Total', value: '\u20B9' + total + ' (+ delivery)' }] };
  } else if (type === 'contact') {
    const email = clean(d.email, 120), message = clean(d.message, 1000);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || BAD.test(message) || BAD.test(email)) return res.status(400).json({ ok: false });
    embed = { title: 'New Contact Enquiry', color: 13112366, fields: [
      { name: 'Name', value: name, inline: true }, { name: 'Phone', value: phone, inline: true },
      { name: 'Email', value: email }, { name: 'Message', value: message || '(none)' }] };
  } else return res.status(400).json({ ok: false });

  try {
    const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowed_mentions: { parse: [] }, embeds: [embed] }) });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) { return res.status(502).json({ ok: false }); }
};
