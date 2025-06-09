from app.app import create_app

app = create_app('production')
# If run via Flask CLI default port, set FLASK_RUN_PORT=8001 to use port 8001
