import keys from "./keys";
import { Resend } from "resend";

const resend = new Resend(keys.resendApiKey);

export const sendEmail = async (
	to: string | string[],
	subject: string,
	html: string
) => {
	const finalTo =
		process.env.NODE_ENV === "development" ? "delivered@resend.dev" : to;

	try {
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: finalTo,
			subject,
			html,
		});
		console.log(`Email sent to: ${finalTo}`);
	} catch (error) {
		console.error("Error sending email:", error);
		throw new Error("Email sending failed");
	}
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
	const html = `
		<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
     body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #0078d7;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background: #f9f9f9;
      font-size: 12px;
      color: #777777;
    }
    .button {
      display: inline-block;
      background: #0078d7;
      color: white;
      padding: 10px 20px;
      margin: 20px 0;
      border-radius: 5px;
      text-decoration: none;
    }
    .button:hover {
      background: #005bb5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>
        You requested to reset your password. Click the button below to reset it:
      </p>
      <a href="${resetLink}" target="_blank" class="button">Reset Password</a>
      <p>
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      <p>
        You're receiving this email because you signed up for our service.
      </p>
      <p>
        © 2025 TeamBuilder LoL. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
	`;
	await sendEmail(to, "Password Reset Request", html);
};

export const sendPasswordChangedEmail = async (to: string) => {
	const html = `
	<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Changed</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #0078d7;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background: #f9f9f9;
      font-size: 12px;
      color: #777777;
    }
    .link {
      color: #0078d7;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Changed</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>
        We wanted to let you know that your password has been successfully changed. 
        If you didn't make this change, please contact our support team immediately.
      </p>
      <p>
        For your security, if you suspect any unauthorized activity, 
        please reset your password <a href="https://example.com/reset-password" class="link">here</a>.
      </p>
      <p>
        If everything looks good, no further action is required.
      </p>
    </div>
    <div class="footer">
      <p>
        You're receiving this email because you're a registered user of our service.
      </p>
      <p>
        © 2025 TeamBuilder LoL. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
	await sendEmail(to, "Password Changed", html);
};
