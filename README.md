# LapLend – Offline Laptop Rental & Inventory Management System

An individual React Native / Expo application inspired by the supplied University Laptop System backend.

## Features

- Home dashboard with inventory and rental statistics
- Laptop catalogue with dynamic SQLite data
- Search by laptop name, brand, serial number or specifications
- Filter by availability and category
- Laptop detail screen
- Create offline rental requests
- View rental history and filter by status
- Approve, reject and mark rentals as returned
- Add, edit and delete laptop inventory records
- Seed dataset of 12 sample laptops
- No backend server, public API, online database or internet connection required at runtime

## Technology

- React Native
- Expo
- JavaScript
- React Navigation (bottom tabs + native stack)
- Expo SQLite (local database)

## Requirements

Install Node.js LTS and Expo Go on an Android phone, or use an Android emulator.

## Run on Windows

1. Extract the ZIP file.
2. Open the `LapLend` folder in VS Code.
3. Open the terminal in that folder.
4. Install packages:

   ```powershell
   npm.cmd install
   ```

5. Start Expo:

   ```powershell
   npx.cmd expo start
   ```

6. Scan the QR code using Expo Go, or press `a` to open an Android emulator.

If Expo reports a dependency version mismatch, run:

```powershell
npx.cmd expo install --fix
```

Then restart Expo:

```powershell
npx.cmd expo start -c
```

## Local database

The app creates `laplend.db` on the device on first launch. It creates two tables:

### laptops
- id
- laptopName
- brand
- serialNumber
- specs
- category
- pricePerDay
- status
- imageEmoji
- description

### rentals
- id
- laptopId
- borrowerName
- borrowerEmail
- borrowDate
- returnDate
- status
- createdAt

The 12 sample laptop records in `src/data/seedData.js` are inserted only when the laptop table is empty. All later changes are stored in SQLite.

## Project structure

```text
LapLend/
├── App.js
├── app.json
├── package.json
├── README.md
└── src/
    ├── components/
    │   ├── common.js
    │   ├── LaptopCard.js
    │   └── theme.js
    ├── data/
    │   └── seedData.js
    ├── db/
    │   └── database.js
    ├── navigation/
    │   └── AppNavigator.js
    └── screens/
        ├── HomeScreen.js
        ├── CatalogScreen.js
        ├── LaptopDetailsScreen.js
        ├── RentScreen.js
        ├── RentalsScreen.js
        ├── ManageScreen.js
        └── LaptopFormScreen.js
```

## Notes for the ICA

- This is a mobile application, not a conversion that calls the old Express/MongoDB server.
- The old backend's laptop, user and reservation concepts informed the new local data structure and rental workflow.
- The sample inventory is newly created for this project. Replace it with your own dataset if your lecturer requires personally collected records.
- The rental approval actions are local demonstration workflow actions; they do not contact a real university administrator.
- This starter project is provided for learning and should be tested on your target device before submission.
