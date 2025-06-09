const COINBASE_WS_URL = "wss://ws-feed.exchange.coinbase.com";

export function startPriceFeed(onUpdate) {
    const socket = new WebSocket(COINBASE_WS_URL);

    socket.onopen = () => {
        console.log("🔌 WebSocket connected");
        const message = {
            type: "subscribe",
            product_ids: ["BTC-USD", "ETH-USD", "SOL-USD", "DOGE-USD", "AVAX-USD"],
            channels: ["ticker"]
        };
        socket.send(JSON.stringify(message));
    };

    socket.onmessage = event => {
        const data = JSON.parse(event.data);
        if (data.type === "ticker") {
            const price = parseFloat(data.price);
            const percentChange = (Math.random() * 10 - 5).toFixed(2);
            onUpdate(data.product_id.replace("-USD", ""), { price, percentChange });
        }
    };

    socket.onclose = () => {
        console.log("WebSocket closed. Reconnecting...");
        setTimeout(() => startPriceFeed(onUpdate), 1000);
    };
}