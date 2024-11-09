# Mutant DNA Checker

## Prerequisites

- **Node.js** (v14 or higher)

- **Firebase CLI** (for emulating Firebase services locally)

- **Yarn** or **npm** (for package management)

### Step 1: Clone the repository

```bash
git clone https://github.com/espinozajuan/mutant-api.git
cd mutant-api
```

### Step 2: Set Up Firebase Functions

```bash
cd api/functions
npm install
```

### Step 3: Set Up the Frontend

```bash
cd frontend
npm install
```

### Step 3: Set Up environment variables

```bash
//  Create  a  .env  file  inside  frontend  folder
NEXT_PUBLIC_MUTANT_URL=http://localhost:5001/meli-api-61b43/us-central1/mutant
NEXT_PUBLIC_STATS_URL=http://localhost:5001/meli-api-61b43/us-central1/stats
```

### Step 5: Start Firebase Emulators

```bash
cd api/functions
firebase emulators:start
```

### Step 6: Run the frontend

```bash
cd frontend
npm run dev
```

### Step 7: Check the DB

```bash
# After running the firebase emulator you can go to:

http://localhost:4000/firestore

# to check the DB
```

### Additional information:

Stats API URL: [https://stats-454vjqaszq-uc.a.run.app](https://stats-454vjqaszq-uc.a.run.app)

Mutant API URL: [https://mutant-454vjqaszq-uc.a.run.app](https://mutant-454vjqaszq-uc.a.run.app)

### Vercel deployment link: [Click me](https://mutant-api-three.vercel.app/)
