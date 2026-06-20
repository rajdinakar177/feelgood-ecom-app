
import  { brevo } from "@/app/lib/brevo"
interface SendEmailProps {
  email: string;
  subject: string;
  htmlContent: string;
}

export const sendEmail = async ({
  email,
  subject,
  htmlContent,
}: SendEmailProps) => {
  return await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.ADMIN_EMAIL!,
      name: "SRADA",
    },

    to: [{ email }],

    subject,

    htmlContent,
  });
};