from sqlalchemy import create_engine, inspect
from database import DATABASE_URL

def check_columns():
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    
    for table in ['construction_plans', 'construction_log_photos']:
        columns = [c['name'] for c in inspector.get_columns(table)]
        print(f"Table {table} columns: {columns}")
        if 'public_id' in columns:
            print(f"  SUCCESS: public_id exists in {table}")
        else:
            print(f"  FAILURE: public_id MISSING in {table}")

if __name__ == "__main__":
    check_columns()
