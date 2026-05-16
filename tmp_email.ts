import fetch from 'node-fetch';

async function testEmail() {
  const email = 'jshpusiness1@gmail.com';
  
  console.log('Sending welcome email test...');
  let res = await fetch('http://localhost:3000/api/send-welcome-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, displayName: 'Testni Uporabnik' })
  });
  let data = await res.json();
  console.log('Welcome email response:', data);

  console.log('Sending event created email test...');
  res = await fetch('http://localhost:3000/api/send-event-created-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, eventName: 'Testni Dogodek' })
  });
  data = await res.json();
  console.log('Event created email response:', data);
}

testEmail().catch(console.error);
