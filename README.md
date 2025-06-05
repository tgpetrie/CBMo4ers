# Coinbase Movers Fullstack App

## Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Frontend (React + Tailwind)
```bash
cd frontend
npm install
npm run dev
```

- Backend URL: http://localhost:8000
- Frontend URL: http://localhost:5173

## Environment Variables

The Coinbase client requires API credentials for authenticated endpoints.
Set the following variables before starting the backend:

```bash
export COINBASE_API_KEY=your_key
export COINBASE_API_SECRET=your_secret
```
