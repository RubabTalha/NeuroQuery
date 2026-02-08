# For Linux

echo "🚀 Setting up NeuroQuery RAG Pipeline Platform"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data/uploads
mkdir -p data/sample_documents
mkdir -p logs

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration!"
fi

# Check for logo file
if [ ! -f "frontend/public/neuroquery-logo.png" ]; then
    echo "⚠️  Warning: Logo file not found at frontend/public/neuroquery-logo.png"
    echo "Please add your 500x500 PNG logo to this location."
    read -p "Continue without logo? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build the application
echo "🔨 Building Docker containers..."
docker-compose build

# Initialize database
echo "🗄️  Initializing database..."
docker-compose up -d db
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
docker-compose run --rm backend flask db init
docker-compose run --rm backend flask db migrate
docker-compose run --rm backend flask db upgrade

# Start all services
echo "🚀 Starting NeuroQuery services..."
docker-compose up -d

echo ""
echo "✅ Setup completed!"
echo ""
echo "🌐 Access NeuroQuery at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📊 Check service status with:"
echo "   docker-compose ps"
echo ""
echo "📝 View logs with:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services with:"
echo "   docker-compose down"