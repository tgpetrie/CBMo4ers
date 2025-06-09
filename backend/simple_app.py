from flask import Flask, jsonify
from flask_cors import CORS
import requests
import threading
import time
from collections import defaultdict
import random

app = Flask(__name__)
CORS(app)

# Simple in-memory storage
live_prices = {}
price_history = defaultdict(list)  # symbol -> [(timestamp, price), ...]

def fetch_coinbase_prices():
    """Fetch current prices from Coinbase API"""
    try:
        # Get top 20 crypto symbols
        symbols = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD', 'DOT-USD', 
                  'MATIC-USD', 'AVAX-USD', 'LINK-USD', 'UNI-USD', 'DOGE-USD',
                  'XRP-USD', 'LTC-USD', 'BCH-USD', 'ALGO-USD', 'ATOM-USD']
        
        for symbol in symbols:
            try:
                url = f"https://api.exchange.coinbase.com/products/{symbol}/ticker"
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    price = float(data['price'])
                    live_prices[symbol] = price
                    
                    # Store price history (keep last 10 entries per symbol)
                    timestamp = time.time()
                    price_history[symbol].append((timestamp, price))
                    if len(price_history[symbol]) > 10:
                        price_history[symbol].pop(0)
                        
                    print(f"Updated {symbol}: ${price}")
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
                
    except Exception as e:
        print(f"Error in fetch_coinbase_prices: {e}")

def price_updater():
    """Background thread to update prices every 30 seconds"""
    while True:
        print("Fetching latest prices...")
        fetch_coinbase_prices()
        time.sleep(30)  # Update every 30 seconds

@app.route('/top-gainers')
def top_gainers():
    """Get top gainers over 3 minutes"""
    results = []
    current_time = time.time()
    three_minutes_ago = current_time - (3 * 60)
    
    for symbol, current_price in live_prices.items():
        if symbol in price_history and len(price_history[symbol]) >= 2:
            # Find price from ~3 minutes ago
            old_price = None
            for timestamp, price in price_history[symbol]:
                if timestamp <= three_minutes_ago:
                    old_price = price
                    break
            
            # If no price from 3 min ago, use oldest available
            if old_price is None and price_history[symbol]:
                old_price = price_history[symbol][0][1]
            
            if old_price and old_price > 0:
                gain_pct = ((current_price - old_price) / old_price) * 100
                results.append({
                    "symbol": symbol.replace('-USD', ''),
                    "current": round(current_price, 4),
                    "previous": round(old_price, 4),
                    "gain": round(gain_pct, 2)
                })
    
    # Sort by gain percentage
    results.sort(key=lambda x: x['gain'], reverse=True)
    return jsonify(results[:10])

@app.route('/top-losers')
def top_losers():
    """Get top losers over 3 minutes"""
    results = []
    current_time = time.time()
    three_minutes_ago = current_time - (3 * 60)
    
    for symbol, current_price in live_prices.items():
        if symbol in price_history and len(price_history[symbol]) >= 2:
            # Find price from ~3 minutes ago
            old_price = None
            for timestamp, price in price_history[symbol]:
                if timestamp <= three_minutes_ago:
                    old_price = price
                    break
            
            # If no price from 3 min ago, use oldest available
            if old_price is None and price_history[symbol]:
                old_price = price_history[symbol][0][1]
            
            if old_price and old_price > 0:
                gain_pct = ((current_price - old_price) / old_price) * 100
                results.append({
                    "symbol": symbol.replace('-USD', ''),
                    "current": round(current_price, 4),
                    "previous": round(old_price, 4),
                    "gain": round(gain_pct, 2)
                })
    
    # Sort by gain percentage (ascending to get losers)
    results.sort(key=lambda x: x['gain'])
    return jsonify(results[:10])

@app.route('/24h-gainers')
def top_24h():
    """Get 24h gainers with Coinbase URLs"""
    results = []
    
    for symbol in list(live_prices.keys())[:10]:
        try:
            # Get 24h stats from Coinbase
            url = f"https://api.exchange.coinbase.com/products/{symbol}/stats"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                open_price = float(data.get("open", 0))
                current_price = live_prices.get(symbol, 0)
                
                if open_price > 0 and current_price > 0:
                    gain = ((current_price - open_price) / open_price) * 100
                    results.append({
                        "symbol": symbol.replace('-USD', ''),
                        "gain": round(gain, 2),
                        "url": f"https://www.coinbase.com/price/{symbol.split('-')[0].lower()}"
                    })
        except Exception as e:
            print(f"Error fetching 24h stats for {symbol}: {e}")
    
    results.sort(key=lambda x: x["gain"], reverse=True)
    return jsonify(results[:10])

@app.route('/health')
def health():
    return jsonify({
        "status": "ok", 
        "live_prices_count": len(live_prices),
        "price_history_count": len(price_history)
    })

if __name__ == '__main__':
    # Start price updater thread
    print("Starting price updater thread...")
    threading.Thread(target=price_updater, daemon=True).start()
    
    # Initial price fetch
    print("Fetching initial prices...")
    fetch_coinbase_prices()
    
    print("Starting price updater thread...")
    # Start the price updater thread
    thread = threading.Thread(target=price_updater, daemon=True)
    thread.start()
    
    print("Starting Flask server on port 8001...")
    app.run(debug=True, port=8001, use_reloader=False)
