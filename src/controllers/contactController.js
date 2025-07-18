// controllers/contactController.js
const nodemailer = require("nodemailer");

exports.sendCounsellingRequest = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2b9e4956234d54",
        pass: "eb805c92a112f7",
      },
    });
    // Email options
    await transporter.sendMail({
      from: `"Franchise Church" <no-reply@franchiselagos.org>`,
      to: "counselling@franchiselagos.org", // Or Mailtrap test inbox
      subject: `New Counselling Request from ${name}`,
      html: `
        <h2>New Counselling Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject || "Not specified"}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error("❌ Mailtrap Error:", err);
    res
      .status(500)
      .json({ error: "Failed to send email", detail: err.message });
  }
};
