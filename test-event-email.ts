import fetch from 'node-fetch';
fetch('http://localhost:3000/api/send-event-created-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'info@kliksy.si', eventName: 'Testni Dogodek' })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
