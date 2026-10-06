/**
 * Generate bcrypt password hashes for sample users
 * Run: node backend/src/scripts/generate-password-hashes.js
 */
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const passwords = {
  'admin123': 'Admin account password',
  'pharma123': 'Pharmacist account password',
  'view123': 'Viewer account password'
};

async function generateHashes() {
  console.log('\n🔐 Generating password hashes...\n');
  
  for (const [password, description] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    console.log(`Password: ${password} (${description})`);
    console.log(`Hash: ${hash}\n`);
  }
  
  console.log('✅ Hash generation complete!\n');
}

generateHashes().catch(console.error);
