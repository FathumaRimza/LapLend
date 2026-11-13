import { SEED_LAPTOPS } from '../data/seedData';

let laptops = [...SEED_LAPTOPS];
let rentals = [];

export async function getDatabase() {
  return null;
}

export async function initDatabase() {
  return null;
}

export async function getLaptops() {
  return laptops;
}

export async function getLaptopById(id) {
  return laptops.find((laptop) => laptop.id === id) || null;
}

export async function saveLaptop(laptop) {
  if (laptop.id) {
    laptops = laptops.map((item) =>
      item.id === laptop.id ? { ...item, ...laptop } : item
    );
  } else {
    laptops.push({
      ...laptop,
      id: `LAP${Date.now()}`,
      imageEmoji: '💻',
    });
  }
}

export async function deleteLaptop(id) {
  if (rentals.some((r) => r.laptopId === id && ['pending', 'approved'].includes(r.status))) {
    throw new Error('This laptop has an active rental and cannot be deleted.');
  }
  laptops = laptops.filter((laptop) => laptop.id !== id);
}

export async function createRental(data) {
  const laptop = await getLaptopById(data.laptopId);

  if (!laptop) throw new Error('Laptop not found.');
  if (laptop.status !== 'available') throw new Error('This laptop is not currently available.');

  const id = `REN${Date.now()}`;

  rentals.push({
    ...data,
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });

  laptops = laptops.map((item) =>
    item.id === data.laptopId ? { ...item, status: 'reserved' } : item
  );

  return id;
}

export async function getRentals() {
  return rentals.map((rental) => {
    const laptop = laptops.find((item) => item.id === rental.laptopId);
    return {
      ...rental,
      laptopName: laptop?.laptopName,
      brand: laptop?.brand,
      serialNumber: laptop?.serialNumber,
      pricePerDay: laptop?.pricePerDay,
    };
  });
}

export async function updateRentalStatus(id, status) {
  const rental = rentals.find((item) => item.id === id);
  if (!rental) throw new Error('Rental record not found.');

  rental.status = status;

  if (['approved', 'rejected', 'returned', 'cancelled'].includes(status)) {
    laptops = laptops.map((item) =>
      item.id === rental.laptopId
        ? {
            ...item,
            status: status === 'approved' ? 'borrowed' : 'available',
          }
        : item
    );
  }
}

export async function getDashboardStats() {
  return {
    laptops: laptops.length,
    available: laptops.filter((l) => l.status === 'available').length,
    active: rentals.filter((r) => ['pending', 'approved'].includes(r.status)).length,
    returned: rentals.filter((r) => r.status === 'returned').length,
  };
}