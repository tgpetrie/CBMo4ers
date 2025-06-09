import os
from dotenv import load_dotenv
from app.app import create_app

load_dotenv()

config=os.getenv('FLASK_ENV') or 'development'

app = create_app(config)

if __name__ == "__main__":
    # bind to port 8001 instead of default 8000
    app.run(host="0.0.0.0", port=8001, debug=(config == 'development'))
