import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email,emailContent) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Hello World",
    html: `<strong>${emailContent}</strong>`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};

export default sendEmail;
