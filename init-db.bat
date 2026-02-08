@echo off
echo Initializing NeuroQuery Database...
echo.

:: Create default user and sample data
echo Creating demo user...
docker-compose exec backend python -c "
import sys
sys.path.append('/app')
from app import create_app
from app.database import db
from app.models import User
from werkzeug.security import generate_password_hash

app = create_app()
with app.app_context():
    # Create demo user if not exists
    demo_user = User.query.filter_by(email='demo@neuroquery.com').first()
    if not demo_user:
        demo_user = User(
            email='demo@neuroquery.com',
            name='Demo User',
            password_hash=generate_password_hash('demo123')
        )
        db.session.add(demo_user)
        db.session.commit()
        print('Demo user created: demo@neuroquery.com / demo123')
    else:
        print('Demo user already exists')
"

echo.
echo Database initialized successfully!
echo You can now login with:
echo   Email: demo@neuroquery.com
echo   Password: demo123
echo.
pause