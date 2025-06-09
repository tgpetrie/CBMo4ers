import time
import threading
from collections import deque
from app.ws_client import live_prices

# Store (timestamp, price_dict) every 3 minutes
price_snapshots = deque(maxlen=100)

def snapshot_prices():
    while True:
        snapshot = {k: v for k, v in live_prices.items()}
        price_snapshots.append((time.time(), snapshot))
        time.sleep(180)  # every 3 minutes

def get_top_gainers():
    if len(price_snapshots) < 2:
        return []

    latest_snapshot = price_snapshots[-1][1]
    oldest_snapshot = price_snapshots[0][1]

    gainers = []
    for symbol, current in latest_snapshot.items():
        previous = oldest_snapshot.get(symbol)
        if previous and previous > 0:
            gain_pct = ((current - previous) / previous) * 100
            gainers.append({
                "symbol": symbol,
                "current": round(current, 4),
                "previous": round(previous, 4),
                "gain": round(gain_pct, 2)
            })

    gainers.sort(key=lambda x: x["gain"], reverse=True)
    return gainers[:10]

# Start the snapshot thread
threading.Thread(target=snapshot_prices, daemon=True).start()
