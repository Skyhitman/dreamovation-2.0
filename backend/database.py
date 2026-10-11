import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import settings

logger = logging.getLogger("skillsafe_db")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

def get_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    try:
        if db_url.startswith("postgresql"):
            # Test PostgreSQL connection
            engine = create_engine(db_url, pool_pre_ping=True, connect_args={"connect_timeout": 5})
            with engine.connect():
                logger.info("Connected successfully to PostgreSQL database.")
                return engine
    except Exception as e:
        logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to SQLite for seamless execution.")
        
    # SQLite fallback
    sqlite_url = settings.SQLITE_URL
    return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
