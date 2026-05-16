import { sendFollowUpEmail } from './src/cronService.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// simple mock of process.env setup
const envContent = fs.readFileSync('.env', 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
});

async function run() {
  await sendFollowUpEmail('jshpbusiness1@gmail.com');
  console.log('Done!');
}
run().catch(console.error);
