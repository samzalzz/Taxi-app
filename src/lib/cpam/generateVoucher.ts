import { prisma } from '@/persistence/client';
import { Booking } from '@prisma/client';

/**
 * Generate a unique voucher number in format: CPAM-YYYY-MM-XXXXXXXX
 */
function generateVoucherNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `CPAM-${year}-${month}-${randomId}`;
}

/**
 * Create a CPAM transport voucher for a completed booking
 */
export async function createCpamVoucher(booking: any) {
  try {
    if (!booking.isCpam || !booking.driverId) {
      throw new Error('Booking must be CPAM and have an assigned driver');
    }

    const driver = await prisma.driver.findUnique({
      where: { id: booking.driverId },
      include: { user: true, vehicle: true },
    });

    if (!driver) {
      throw new Error('Driver not found');
    }

    const voucherNumber = generateVoucherNumber();

    const voucher = await prisma.cpamTransportVoucher.create({
      data: {
        bookingId: booking.id,
        voucherNumber,
        pickupAddress: booking.pickupAddress,
        dropoffAddress: booking.dropoffAddress,
        distance: booking.distance,
        tripDate: booking.pickupAt || new Date(),
        driverName: driver.user.name,
        vehiclePlate: driver.vehicle?.plateNumber || 'N/A',
        price: booking.price,
        status: 'PENDING',
      },
    });

    return voucher;
  } catch (error) {
    console.error('[createCpamVoucher]', error);
    throw error;
  }
}

/**
 * Generate PDF content for a CPAM voucher
 */
export function generateVoucherPDF(voucher: any): string {
  // Simple HTML-to-text representation of the voucher
  const date = new Date(voucher.tripDate).toLocaleDateString('fr-FR');
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      max-width: 800px;
    }
    .header {
      border-bottom: 2px solid #1a5f7a;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1a5f7a;
    }
    .subtitle {
      color: #666;
      margin-top: 5px;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-left: 4px solid #ffc107;
    }
    .label {
      font-weight: bold;
      color: #333;
    }
    .value {
      margin-left: 10px;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #1a5f7a;
      color: white;
      padding: 10px;
      text-align: left;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #999;
      text-align: center;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Bon de Transport Médical - CPAM</div>
    <div class="subtitle">Taxi Leblanc - Transports Médicalisés</div>
  </div>

  <div class="section">
    <div><span class="label">N° de Bon:</span> <span class="value">${voucher.voucherNumber}</span></div>
    <div><span class="label">Date du transport:</span> <span class="value">${date}</span></div>
  </div>

  <div class="section">
    <h3>Trajet</h3>
    <table>
      <tr>
        <th>Point de départ</th>
        <th>Destination</th>
        <th>Distance</th>
        <th>Prix</th>
      </tr>
      <tr>
        <td>${voucher.pickupAddress}</td>
        <td>${voucher.dropoffAddress}</td>
        <td>${voucher.distance.toFixed(1)} km</td>
        <td>${voucher.price.toFixed(2)} €</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h3>Véhicule et Chauffeur</h3>
    <div><span class="label">Chauffeur:</span> <span class="value">${voucher.driverName}</span></div>
    <div><span class="label">Immatriculation:</span> <span class="value">${voucher.vehiclePlate}</span></div>
  </div>

  <div class="section">
    <h3>Référence Médicale</h3>
    ${
      voucher.prescriptionRef
        ? `<div><span class="label">Référence Ordonnance:</span> <span class="value">${voucher.prescriptionRef}</span></div>`
        : ''
    }
    ${
      voucher.patientName
        ? `<div><span class="label">Patient:</span> <span class="value">${voucher.patientName}</span></div>`
        : ''
    }
    ${
      voucher.cpamOrganism
        ? `<div><span class="label">Organisme CPAM:</span> <span class="value">${voucher.cpamOrganism}</span></div>`
        : ''
    }
  </div>

  <div class="footer">
    <p>Ce bon de transport a été généré automatiquement le ${new Date().toLocaleDateString(
      'fr-FR',
      { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    )}</p>
    <p>Taxi Leblanc - Tous droits réservés</p>
  </div>
</body>
</html>
  `;

  return html;
}
