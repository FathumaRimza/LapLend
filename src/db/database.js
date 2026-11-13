import * as SQLite from 'expo-sqlite';
import { SEED_LAPTOPS } from '../data/seedData';

let database;

export async function getDatabase() {
  if (!database) database = await SQLite.openDatabaseAsync('laplend.db');
  return database;
}

export async function initDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS laptops (
      id TEXT PRIMARY KEY NOT NULL,
      laptopName TEXT NOT NULL,
      brand TEXT NOT NULL,
      serialNumber TEXT NOT NULL UNIQUE,
      specs TEXT,
      category TEXT,
      pricePerDay REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'available',
      imageEmoji TEXT DEFAULT '💻',
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS rentals (
      id TEXT PRIMARY KEY NOT NULL,
      laptopId TEXT NOT NULL,
      borrowerName TEXT NOT NULL,
      borrowerEmail TEXT NOT NULL,
      borrowDate TEXT NOT NULL,
      returnDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (laptopId) REFERENCES laptops(id)
    );
  `);

  const result = await db.getFirstAsync('SELECT COUNT(*) AS count FROM laptops');
  if (result.count === 0) {
    for (const laptop of SEED_LAPTOPS) {
      await db.runAsync(
        `INSERT INTO laptops
        (id, laptopName, brand, serialNumber, specs, category, pricePerDay, status, imageEmoji, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        laptop.id, laptop.laptopName, laptop.brand, laptop.serialNumber,
        laptop.specs, laptop.category, laptop.pricePerDay, laptop.status,
        laptop.imageEmoji, laptop.description
      );
    }
  }
  return db;
}

export async function getLaptops() {
  const db = await getDatabase();
  return db.getAllAsync('SELECT * FROM laptops ORDER BY brand, laptopName');
}

export async function getLaptopById(id) {
  const db = await getDatabase();
  return db.getFirstAsync('SELECT * FROM laptops WHERE id = ?', id);
}

export async function saveLaptop(laptop) {
  const db = await getDatabase();
  if (laptop.id) {
    await db.runAsync(
      `UPDATE laptops SET laptopName=?, brand=?, serialNumber=?, specs=?, category=?,
       pricePerDay=?, status=?, description=? WHERE id=?`,
      laptop.laptopName, laptop.brand, laptop.serialNumber, laptop.specs,
      laptop.category, Number(laptop.pricePerDay), laptop.status,
      laptop.description, laptop.id
    );
  } else {
    const id = `LAP${Date.now().toString().slice(-7)}`;
    await db.runAsync(
      `INSERT INTO laptops
       (id, laptopName, brand, serialNumber, specs, category, pricePerDay, status, imageEmoji, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, laptop.laptopName, laptop.brand, laptop.serialNumber, laptop.specs,
      laptop.category, Number(laptop.pricePerDay), laptop.status, '💻', laptop.description
    );
  }
}

export async function deleteLaptop(id) {
  const db = await getDatabase();
  const used = await db.getFirstAsync(
    "SELECT COUNT(*) AS count FROM rentals WHERE laptopId=? AND status IN ('pending','approved')", id
  );
  if (used.count > 0) throw new Error('This laptop has an active rental and cannot be deleted.');
  await db.runAsync('DELETE FROM laptops WHERE id=?', id);
}

export async function createRental(data) {
  const db = await getDatabase();
  const laptop = await getLaptopById(data.laptopId);
  if (!laptop) throw new Error('Laptop not found.');
  if (laptop.status !== 'available') throw new Error('This laptop is not currently available.');

  const id = `REN${Date.now().toString().slice(-8)}`;
  await db.runAsync(
    `INSERT INTO rentals (id, laptopId, borrowerName, borrowerEmail, borrowDate, returnDate, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
    id, data.laptopId, data.borrowerName, data.borrowerEmail,
    data.borrowDate, data.returnDate, new Date().toISOString()
  );
  await db.runAsync("UPDATE laptops SET status='reserved' WHERE id=?", data.laptopId);
  return id;
}

export async function getRentals() {
  const db = await getDatabase();
  return db.getAllAsync(`
    SELECT rentals.*, laptops.laptopName, laptops.brand, laptops.serialNumber, laptops.pricePerDay
    FROM rentals JOIN laptops ON rentals.laptopId = laptops.id
    ORDER BY rentals.createdAt DESC
  `);
}

export async function updateRentalStatus(id, status) {
  const db = await getDatabase();
  const rental = await db.getFirstAsync('SELECT * FROM rentals WHERE id=?', id);
  if (!rental) throw new Error('Rental record not found.');

  await db.runAsync('UPDATE rentals SET status=? WHERE id=?', status, id);
  if (status === 'approved') {
    await db.runAsync("UPDATE laptops SET status='borrowed' WHERE id=?", rental.laptopId);
  } else if (status === 'rejected' || status === 'returned' || status === 'cancelled') {
    await db.runAsync("UPDATE laptops SET status='available' WHERE id=?", rental.laptopId);
  }
}

export async function getDashboardStats() {
  const db = await getDatabase();
  const laptops = await db.getFirstAsync('SELECT COUNT(*) AS total FROM laptops');
  const available = await db.getFirstAsync("SELECT COUNT(*) AS total FROM laptops WHERE status='available'");
  const active = await db.getFirstAsync("SELECT COUNT(*) AS total FROM rentals WHERE status IN ('pending','approved')");
  const returned = await db.getFirstAsync("SELECT COUNT(*) AS total FROM rentals WHERE status='returned'");
  return { laptops: laptops.total, available: available.total, active: active.total, returned: returned.total };
}
