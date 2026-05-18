from sqlalchemy import create_engine, text
from database import DATABASE_URL

def check_enum():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        try:
            res = conn.execute(text("SELECT n.nspname as schema, t.typname as type, e.enumlabel as value FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'construction_plan_type' ORDER BY schema, type, e.enumsortorder;"))
            print("Enum values for construction_plan_type:")
            for row in res:
                print(f" - {row[2]}")
        except Exception as e:
            print(f"Error checking enum: {e}")

if __name__ == "__main__":
    check_enum()
