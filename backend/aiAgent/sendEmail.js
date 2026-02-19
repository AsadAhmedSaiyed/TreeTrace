import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({email,subject,body}) => {
  console.log("Sending email...");
  try{
    const { data, error } = await resend.emails.send({
    from: "TreeTrace <notifications@treetrace.tech>",
    to: [email],
    subject: subject,
    html: `<div>${body}</div>`,
  });

 if (error) {
      console.error("❌ Resend API returned an error:", error);
      return { status: "error", message: error.message }; 
    }

  console.log({ data });
  return {status:"success", message: "Email sent"};
  }catch(e){
    console.error("Resend API Error : ",e);
    return {status: "error" , message:e.message};
  }
};

export default sendEmail;
