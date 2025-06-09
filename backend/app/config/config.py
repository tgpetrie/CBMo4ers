import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///:memory:")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    # if you prefer a file-based DB in dev, you can override:
    # SQLALCHEMY_DATABASE_URI = os.getenv("DEV_DATABASE_URL", "sqlite:///dev.db")

class ProductionConfig(Config):
    """Production configuration."""
    # set your real production DB URI in the env var DATABASE_URL
    pass

def get_config_by_name(name: str):
    return {
        "development": DevelopmentConfig,
        "production":  ProductionConfig,
    }[name]
