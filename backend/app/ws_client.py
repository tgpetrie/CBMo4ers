import asyncio
import aiohttp
import threading
import time
from coinbase.wallet.client import Client
import os

# Shared dict updated by WebSocket client
live_prices = {}

async def get_usd_pairs():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.exchange.coinbase.com/products") as resp:
            products = await resp.json()
            return [p["id"] for p in products if p.get("quote_currency") == "USD"]

async def _ws_loop():
    pairs = await get_usd_pairs()
    subscribe = {
        "type": "subscribe",
        "channels": [{"name": "ticker", "product_ids": pairs}]
    }
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect("wss://ws-feed.exchange.coinbase.com") as ws:
            await ws.send_json(subscribe)
            async for msg in ws:
                if msg.type.name == "TEXT":
                    data = msg.json()
                    if data.get("type") == "ticker":
                        try:
                            live_prices[data["product_id"]] = float(data["price"])
                        except (KeyError, ValueError, TypeError):
                            pass

def start_ws_loop():
    asyncio.run(_ws_loop())

# Launch on import
threading.Thread(target=start_ws_loop, daemon=True).start()
