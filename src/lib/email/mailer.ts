import nodemailer from 'nodemailer';
import { interpolateTemplate, TemplateVars } from './templateUtils';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  toEmail: string,
  rawToken: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const resetUrl = `${appUrl}/reinitialisation?token=${rawToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'Taxi Leblanc <noreply@taxi-leblanc.fr>',
    to: toEmail,
    subject: 'Réinitialisation de votre mot de passe — Taxi Leblanc',
    text: `Bonjour,\n\nVous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur ce lien pour continuer :\n${resetUrl}\n\nCe lien expire dans 1 heure et ne peut être utilisé qu'une seule fois.\n\nSi vous n'avez pas fait cette demande, ignorez cet email.\n\n— Taxi Leblanc`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body style="font-family: sans-serif; background:#0f0f0f; color:#e5e5e5; margin:0; padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#1a1a1a; border-radius:12px; padding:40px;">
          <tr>
            <td>
              <h1 style="color:#f5c518; font-size:22px; margin:0 0 8px; font-weight:600;">Taxi Leblanc</h1>
              <p style="color:#9ca3af; font-size:13px; margin:0 0 32px;">Votre taxi de route en Île-de-France</p>

              <h2 style="font-size:18px; color:#e5e5e5; margin:0 0 16px; font-weight:600;">Réinitialisation du mot de passe</h2>
              <p style="color:#d1d5db; line-height:1.6; margin:0 0 24px; font-size:15px;">
                Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
              </p>

              <div style="text-align:center; margin:0 0 24px;">
                <a href="${resetUrl}"
                   style="display:inline-block; background:#f5c518; color:#0f0f0f; font-weight:700;
                          text-decoration:none; padding:14px 28px; border-radius:8px; font-size:15px;
                          border:none; cursor:pointer; transition:background 0.2s;">
                  Réinitialiser mon mot de passe
                </a>
              </div>

              <p style="color:#6b7280; font-size:12px; margin:24px 0 0; line-height:1.6; background:#111827; padding:16px; border-radius:8px;">
                ⏱️ <strong style="color:#e5e5e5;">Ce lien expire dans 1 heure</strong> et ne peut être utilisé qu'une seule fois.<br>
                🔒 Si vous n'avez pas fait cette demande, ignorez cet email.
              </p>

              <hr style="border:none; border-top:1px solid #2a2a2a; margin:32px 0 16px;">
              <p style="color:#4b5563; font-size:11px; margin:0; text-align:center;">
                © 2024 Taxi Leblanc. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

export async function sendBookingConfirmationEmail(
  toEmail: string,
  clientName: string,
  booking: {
    id: string;
    pickupAddress: string;
    dropoffAddress: string;
    price: number;
    distance: number;
    scheduledAt: Date | null;
    createdAt: Date;
  },
  template: {
    subject: string;
    body: string;
    signature: string;
  }
): Promise<void> {
  // Format booking date
  const bookingDate = booking.scheduledAt ?? booking.createdAt;
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(bookingDate);

  // Build template variables
  const vars: TemplateVars = {
    clientName,
    pickupAddress: booking.pickupAddress,
    dropoffAddress: booking.dropoffAddress,
    price: booking.price.toFixed(2),
    bookingId: booking.id.slice(-8).toUpperCase(),
    date: formattedDate,
    distance: booking.distance.toFixed(1),
    signature: template.signature,
  };

  // Interpolate subject and body
  const subject = interpolateTemplate(template.subject, vars);
  const body = interpolateTemplate(template.body, vars);

  // Convert newlines to <br> for HTML version
  const htmlBody = body.replace(/\n/g, '<br>');

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'Taxi Leblanc <noreply@taxi-leblanc.fr>',
    to: toEmail,
    subject,
    text: body,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body style="font-family: sans-serif; background:#0f0f0f; color:#e5e5e5; margin:0; padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#1a1a1a; border-radius:12px; padding:40px;">
          <tr>
            <td>
              <h1 style="color:#f5c518; font-size:22px; margin:0 0 8px; font-weight:600;">Taxi Leblanc</h1>
              <p style="color:#9ca3af; font-size:13px; margin:0 0 32px;">Votre taxi de route en Île-de-France</p>

              <div style="color:#d1d5db; line-height:1.7; margin:0 0 24px; font-size:15px; white-space: pre-wrap;">
                ${htmlBody}
              </div>

              <hr style="border:none; border-top:1px solid #2a2a2a; margin:32px 0 16px;">
              <p style="color:#4b5563; font-size:11px; margin:0;">
                © 2024 Taxi Leblanc. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

export async function sendGuestBookingConfirmationEmail(
  toEmail: string,
  guestName: string,
  booking: {
    id: string;
    reservationCode: string | null;
    pickupAddress: string;
    dropoffAddress: string;
    price: number;
    distance: number;
    scheduledAt: Date | null;
    createdAt: Date;
  },
  reservationCode: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const trackingUrl = `${appUrl}/suivi?code=${reservationCode}&email=${encodeURIComponent(toEmail)}`;

  // Format booking date
  const bookingDate = booking.scheduledAt ?? booking.createdAt;
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(bookingDate);

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'Taxi Leblanc <noreply@taxi-leblanc.fr>',
    to: toEmail,
    subject: 'Votre réservation Taxi Leblanc est confirmée',
    text: `Bonjour ${guestName},\n\nVotre réservation a été enregistrée !\n\nVotre code de réservation:\n${reservationCode}\n\nDépart: ${booking.pickupAddress}\nArrivée: ${booking.dropoffAddress}\nDate: ${formattedDate}\nDistance: ${booking.distance.toFixed(1)} km\nPrix: ${booking.price.toFixed(2)} €\n\nConservez ce code — il vous permettra de retrouver votre réservation sur ${appUrl}/suivi\n\nMerci de votre confiance.\n\n— Taxi Leblanc`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body style="font-family: sans-serif; background:#0f0f0f; color:#e5e5e5; margin:0; padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#1a1a1a; border-radius:12px; padding:40px;">
          <tr>
            <td>
              <h1 style="color:#f5c518; font-size:22px; margin:0 0 8px; font-weight:600;">Taxi Leblanc</h1>
              <p style="color:#9ca3af; font-size:13px; margin:0 0 32px;">Votre taxi de route en Île-de-France</p>

              <h2 style="font-size:18px; color:#e5e5e5; margin:0 0 16px; font-weight:600;">Réservation confirmée ✓</h2>
              <p style="color:#d1d5db; line-height:1.6; margin:0 0 24px; font-size:15px;">
                Bonjour ${guestName},
              </p>

              <p style="color:#d1d5db; line-height:1.6; margin:0 0 32px; font-size:15px;">
                Votre réservation a été enregistrée. Voici votre code de réservation :
              </p>

              <!-- Code Block -->
              <div style="text-align:center; margin:0 0 32px;">
                <div style="display:inline-block; border:2px solid #f5c518; border-radius:12px; padding:24px 32px; background:#111827;">
                  <p style="color:#f5c518; font-size:36px; font-weight:700; margin:0; font-family:'Courier New', monospace; letter-spacing:8px;">
                    ${reservationCode}
                  </p>
                </div>
              </div>

              <!-- Trip Summary -->
              <div style="background:#111827; border-left:3px solid #f5c518; padding:16px; border-radius:8px; margin:0 0 24px;">
                <p style="color:#9ca3af; font-size:12px; text-transform:uppercase; margin:0 0 8px; font-weight:600;">Résumé de votre trajet</p>
                <p style="color:#d1d5db; margin:8px 0; font-size:14px;">
                  <strong style="color:#e5e5e5;">Départ:</strong> ${booking.pickupAddress}
                </p>
                <p style="color:#d1d5db; margin:8px 0; font-size:14px;">
                  <strong style="color:#e5e5e5;">Arrivée:</strong> ${booking.dropoffAddress}
                </p>
                <p style="color:#d1d5db; margin:8px 0; font-size:14px;">
                  <strong style="color:#e5e5e5;">Date:</strong> ${formattedDate}
                </p>
                <p style="color:#d1d5db; margin:8px 0; font-size:14px;">
                  <strong style="color:#e5e5e5;">Distance:</strong> ${booking.distance.toFixed(1)} km
                </p>
                <p style="color:#d1d5db; margin:8px 0; font-size:14px;">
                  <strong style="color:#e5e5e5;">Prix:</strong> ${booking.price.toFixed(2)} €
                </p>
              </div>

              <div style="text-align:center; margin:0 0 24px;">
                <a href="${trackingUrl}"
                   style="display:inline-block; background:#f5c518; color:#0f0f0f; font-weight:700;
                          text-decoration:none; padding:14px 28px; border-radius:8px; font-size:15px;
                          border:none; cursor:pointer; transition:background 0.2s;">
                  Suivre ma réservation →
                </a>
              </div>

              <p style="color:#6b7280; font-size:12px; margin:24px 0 0; line-height:1.6; background:#111827; padding:16px; border-radius:8px;">
                💾 <strong style="color:#e5e5e5;">Conservez ce code</strong> — il vous permettra de retrouver votre réservation.<br>
                🔗 Lien direct: <a href="${trackingUrl}" style="color:#f5c518; text-decoration:none;">${appUrl}/suivi</a>
              </p>

              <hr style="border:none; border-top:1px solid #2a2a2a; margin:32px 0 16px;">
              <p style="color:#4b5563; font-size:11px; margin:0; text-align:center;">
                © 2024 Taxi Leblanc. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
