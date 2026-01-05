import { execSync } from 'child_process';

async function globalSetup() {
  // Seed the test database with users before running tests
  process.env.MONGODB_URI = 'mongodb://localhost:27017/cotitra-test';
  console.log('Seeding test database...');
  try {
    execSync('npm run seed:users', {
      env: { ...process.env, MONGODB_URI: 'mongodb://localhost:27017/cotitra-test' },
      stdio: 'inherit',
    });
    console.log('✅ Test database seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed test database:', error);
    // Don't fail completely, the tests might still work if the DB already has data
  }
}

export default globalSetup;
