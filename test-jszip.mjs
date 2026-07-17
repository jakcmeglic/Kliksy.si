import JSZip from 'jszip';
const zip = new JSZip();
zip.generateAsync({ type: 'blob' }).then(console.log).catch(console.error);
