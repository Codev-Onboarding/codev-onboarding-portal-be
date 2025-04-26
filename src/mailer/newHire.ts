import { transporter } from "./transporter";

export const welcomeEmail = async (email: string, name: string, password: string) => {
	try {
		const mailOptions = {
			from: "cdvonboarding@gmail.com",
			to: email,
			subject: "Welcome New Hire!",
			html: `<h1 style="color: #212529; font-family: 'Open Sans', sans-serif">Hello ${name} we're glad you're here!</h1>
			<p style="font-family: 'Open Sans', sans-serif">You can use your temporary password to log in to your account.</p>
			<div style="background-color: #f8f9fa; padding: 1rem; border-radius: 0.5rem">${password}</div>
			`,
		};
		const info = await transporter.sendMail(mailOptions);
		console.log("Welcome email sent successfully", info.response);
	} catch (error) {
		console.log("Error sending welcome email", error);
	}
};
