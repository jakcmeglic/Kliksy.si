import fetch from 'node-fetch';
fetch('http://localhost:3000/api/send-event-created-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'jshpbusiness1@gmail.com', eventName: 'Zalina Poroka' })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
