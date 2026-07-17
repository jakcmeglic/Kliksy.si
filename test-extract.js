const url = "https://firebasestorage.googleapis.com/v0/b/nova-305de.appspot.com/o/events%2FVB764iB8n2c27kC5v51q%2Fphotos%2F49222984.heic?alt=media&token=3d9b207f11-bd7b-4571-a53f-935a9171282f";
const decoded = decodeURIComponent(url);
const match = decoded.match(/\/o\/(.*?)\?/);
console.log(match ? match[1] : null);
