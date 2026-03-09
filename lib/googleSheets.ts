import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// In a real app, these would come from environment variables
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Mock Data Store for Demo Purposes (when no credentials provided)
const MOCK_DB: Record<string, any[]> = {
  users: [
    { id: 'u1', email: 'admin@example.com', password: 'password', role: 'SuperAdmin', tenantId: 'org1', name: 'Admin User' },
    { id: 'u2', email: 'manager@example.com', password: 'password', role: 'WarehouseManager', tenantId: 'org1', name: 'Manager User' },
  ],
  organizations: [
    { id: 'org1', name: 'Demo Corp', status: 'active' }
  ],
  products: [
    { id: 'p1', sku: 'SKU-001', name: 'Widget A', category: 'Electronics', price: 100, tenantId: 'org1' },
    { id: 'p2', sku: 'SKU-002', name: 'Gadget B', category: 'Home', price: 50, tenantId: 'org1' },
  ],
  inventory: [
    { id: 'i1', productId: 'p1', warehouseId: 'w1', quantity: 100, reserved: 10, available: 90, tenantId: 'org1' },
    { id: 'i2', productId: 'p2', warehouseId: 'w1', quantity: 200, reserved: 0, available: 200, tenantId: 'org1' },
  ],
  orders: [
    { id: 'o1', customerId: 'c1', status: 'pending', total: 500, createdAt: new Date().toISOString(), tenantId: 'org1' },
  ],
  asn: [],
  receiving: [],
  picking: [],
  shipping: [],
};

export async function getDoc() {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.warn("Google Sheets credentials missing. Using Mock DB.");
    return null;
  }

  const serviceAccountAuth = new JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

export async function getSheetData(sheetName: string) {
  const doc = await getDoc();
  
  if (!doc) {
    return MOCK_DB[sheetName] || [];
  }

  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) return [];
  
  const rows = await sheet.getRows();
  return rows.map(row => row.toObject());
}

export async function addRow(sheetName: string, data: any) {
  const doc = await getDoc();

  if (!doc) {
    if (!MOCK_DB[sheetName]) MOCK_DB[sheetName] = [];
    MOCK_DB[sheetName].push(data);
    return data;
  }

  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) throw new Error(`Sheet ${sheetName} not found`);
  
  await sheet.addRow(data);
  return data;
}
