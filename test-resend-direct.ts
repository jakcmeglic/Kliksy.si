import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
async function test() {
  const { data, error } = await resend.emails.send({
    from: "Kliksy Podpora <info@kliksy.si>",
    replyTo: "info@kliksy.si",
    to: "info@kliksy.si",
    subject: "Vaš dogodek pri Kliksy je uspešno ustvarjen!",
    html: "<p>Test</p>"
  });
  console.log("Data:", data, "Error:", error);
}
test().catch(console.error);
