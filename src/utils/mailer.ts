import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {

  const verificationLink = `http://localhost:3333/auth/verify/${token}`;

  await resend.emails.send({
    from: "Sistema <onboarding@resend.dev>",
    to: email,
    subject: "Verifique sua conta",
    html: `
      <h2>Confirmação de Email</h2>
      <p>Clique no link abaixo para verificar sua conta:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  });

}