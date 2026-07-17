import qs from 'node:querystring';

const str = 'url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fnova-305de.appspot.com%2Fo%2Fevents%252FVB764iB8n2c27kC5v51q%252Fphotos%252F49222984.heic%3Falt%3Dmedia%26token%3D3d9b207f11-bd7b-4571-a53f-935a9171282f';
const parsed = qs.parse(str);
console.log(parsed.url);
