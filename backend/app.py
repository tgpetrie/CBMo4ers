from flask import Flask, jsonify
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import aiohttp
import asyncio
import threading
import os

app = Flask(__name__)
CORS(app)

live_prices = {}
snapshots_3min = {}
cached_24h = []

lock = asyncio.Lock()

async def get_usd_pairs():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.exchange.coinbase.com/products") as resp:
            pairs = await resp.json()
            return [p['id'] for p in pairs if p['quote_currency'] == 'USD']

async def coinbase_ws():
    pairs = await get_usd_pairs()
    url = "wss://ws-feed.exchange.coinbase.com"
    msg = {
        "type": "subscribe",
        "channels": [{"name": "ticker", "product_ids": pairs}]
    }
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(url) as ws:
            await ws.send_json(msg)
            async for msg in ws:
                if msg.type.name == "TEXT":
                    data = msg.json()
                    if data.get("type") == "ticker":
                        symbol = data.get("product_id")
                        price = data.get("price")
                        if symbol and price:
                            async with lock:
                                live_prices[symbol] = float(price)

async def snapshot_updater():
    async with lock:
        snapshots_3min.clear()
        snapshots_3min.update(live_prices)

async def cache_24h_gainers():
    temp = []
    async with aiohttp.ClientSession() as session:
        for symbol in list(live_prices.keys())[:50]:
            url = f"https://api.exchange.coinbase.com/products/{symbol}/stats"
            try:
                async with session.get(url) as r:
                    data = await r.json()
                    open_price = float(data.get("open", 0))
                    current_price = live_prices.get(symbol, 0)
                    if open_price > 0 and current_price > 0:
                        gain = ((current_price - open_price) / open_price) * 100
                        temp.append({
                            "symbol": symbol,
                            "gain": round(gain, 4),
                            "url": f"https://www.coinbase.com/price/{symbol.split('-')[0].lower()}"
                        })
            except Exception:
                continue
    temp.sort(key=lambda x: x["gain"], reverse=True)
    async with lock:
        cached_24h.clear()
        cached_24h.extend(temp[:10])

def run_async_tasks(loop):
    asyncio.set_event_loop(loop)
    loop.run_until_complete(asyncio.gather(coinbase_ws()))

@app.route('/top-gainers')
def top_gainers():
    results = []
    for symbol, current in live_prices.items():
        old = snapshots_3min.get(symbol)
        if old and old > 0:
            gain = ((current - old) / old) * 100
            results.append({
                "symbol": symbol,
                "current": current,
                "previous": old,
                "gain": round(gain, 4)
            })
    top = sorted(results, key=lambda x: x['gain'], reverse=True)[:10]
    return jsonify(top)

@app.route('/24h-gainers')
def top_24h():
    return jsonify(cached_24h)

# Background job setup
scheduler = BackgroundScheduler()
# snapshot_updater runs every 3 minutes
scheduler.add_job(lambda: asyncio.run(snapshot_updater()), 'interval', minutes=3)
# cache 24h gainers every 60s
scheduler.add_job(lambda: asyncio.run(cache_24h_gainers()), 'interval', seconds=60)
# start scheduler
scheduler.start()

# initial run to populate snapshots immediately
asyncio.run(snapshot_updater())
asyncio.run(cache_24h_gainers())

loop = asyncio.new_event_loop()
threading.Thread(target=run_async_tasks, args=(loop,), daemon=True).start()

if __name__ == '__main__':
    app.run(debug=True, port=8001)
