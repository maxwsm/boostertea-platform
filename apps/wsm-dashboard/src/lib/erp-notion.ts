/**
 * TITAN OMNI-CHANNEL ERP: Notion Integration SDK (Part 2 — Advanced ERP)
 * Maps to DB11-DB17 (Production, Warehouse, Logistics, AR/AP, Taxes)
 */

export const erpPayloads = {
  // ==========================================
  // DB11: Production Orders
  // ==========================================
  db11CreateOrder: (orderNum: string, productId: string, brandId: string, plannedQty: number) => ({
    parent: { database_id: process.env.NOTION_PRODUCTION_DB_ID || '' },
    properties: {
      "Order Number": { title: [{ text: { content: orderNum } }] },
      "Product": { relation: [{ id: productId }] },
      "Brand": { relation: [{ id: brandId }] },
      "Planned Qty L": { number: plannedQty },
      "Status": { select: { name: "PLANNED" } },
      "Planned Start": { date: { start: new Date().toISOString().split('T')[0] } },
      "QC Passed": { checkbox: false },
    }
  }),

  db11CompleteOrder: (actualQty: number, cogsPerL: number) => ({
    properties: {
      "Status": { select: { name: "COMPLETED" } },
      "Actual Qty L": { number: actualQty },
      "Actual End": { date: { start: new Date().toISOString().split('T')[0] } },
      "QC Passed": { checkbox: true },
      "COGS per L": { number: cogsPerL },
      "Total COGS UAH": { number: parseFloat((actualQty * cogsPerL).toFixed(2)) }
    }
  }),

  // ==========================================
  // DB13: Warehouse / Inventory
  // ==========================================
  db13DeductInventory: (currentAvailable: number, deductionQty: number) => ({
    properties: {
      "Qty Available": { number: currentAvailable - deductionQty },
      "Last Movement": { date: { start: new Date().toISOString().split('T')[0] } }
    }
  }),

  // ==========================================
  // DB14: Logistics / Shipments
  // ==========================================
  db14CreateShipment: (shipmentNum: string, ttnNumber: string) => ({
    parent: { database_id: process.env.NOTION_LOGISTICS_DB_ID || '' },
    properties: {
      "Shipment Number": { title: [{ text: { content: shipmentNum } }] },
      "Type": { select: { name: "B2C_NOVA_POSHTA" } },
      "Status": { select: { name: "DISPATCHED" } },
      "Carrier": { select: { name: "NOVA_POSHTA" } },
      "Nova Poshta EN": { rich_text: [{ text: { content: ttnNumber } }] },
      "Ship Date": { date: { start: new Date().toISOString().split('T')[0] } },
    }
  }),

  // ==========================================
  // DB16: AR / AP (Дебітори / Кредитори)
  // ==========================================
  db16RecordPayment: (amount: number, payRef: string) => ({
    properties: {
      "Paid UAH": { number: amount },
      "Payment Date": { date: { start: new Date().toISOString().split('T')[0] } },
      "Payment Reference": { rich_text: [{ text: { content: payRef } }] },
      "Status": { select: { name: "PAID" } }
    }
  }),

  // ==========================================
  // DB17: Tax Reporting (ДПС)
  // ==========================================
  db17AuditTaxStatus: (status: string) => ({
    properties: {
      "Status": { select: { name: status } } // PENDING -> PREPARED -> SUBMITTED -> ACCEPTED
    }
  })
};

/**
 * Executes PATCH request to Notion API
 */
export async function notionUpdateERP(pageId: string, properties: any) {
  const token = process.env.NOTION_INTEGRATION_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });
    return res.json();
  } catch (e: any) {
    console.error('[Notion ERP Update Error]', e.message);
    return null;
  }
}
