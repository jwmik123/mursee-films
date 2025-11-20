import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, projectType, budget, message } = body;

    // Validate required fields
    if (!name || !email || !projectType || !budget) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Mursee Films <send@contact.mursee.nl>", // Replace with your verified domain
      to: ["info@mursee.nl"], // Replace with your email
      cc: [email],
      replyTo: ["info@mursee.nl"],
      subject: `Nieuwe projectaanvraag van ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Nieuwe Projectaanvraag
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Contactgegevens:</h3>
            <p style="margin: 5px 0;"><strong>Naam:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>E-mail:</strong> ${email}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Projectdetails:</h3>
            <p style="margin: 5px 0;"><strong>Type project:</strong> ${projectType}</p>
            <p style="margin: 5px 0;"><strong>Budget:</strong> ${budget}</p>
          </div>

          ${
            message
              ? `
            <div style="margin: 20px 0;">
              <h3 style="color: #555; margin-bottom: 5px;">Bericht:</h3>
              <p style="margin: 5px 0; padding: 15px; background-color: #f5f5f5; border-left: 3px solid #000;">
                ${message.replace(/\n/g, "<br>")}
              </p>
            </div>
          `
              : ""
          }

          <div style="margin: 30px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              Dit bericht is verzonden via het contactformulier op de Mursee Films website.
            </p>
          </div>
        </div>
      `,
      text: `
        Nieuwe Projectaanvraag

        Contactgegevens:
        Naam: ${name}
        E-mail: ${email}

        Projectdetails:
        Type project: ${projectType}
        Budget: ${budget}

        ${message ? `Bericht:\n${message}` : ""}

        Dit bericht is verzonden via het contactformulier op de Mursee Films website.
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Send auto-reply to the user
    try {
      await resend.emails.send({
        from: "Mursee Films <send@mursee.nl>",
        to: [email],
        subject: "Bedankt voor je projectaanvraag - Mursee Films",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Bedankt voor je projectaanvraag!
          </h2>
          
          <p style="margin: 20px 0; line-height: 1.6;">
            Hallo ${name},
          </p>

          <p style="margin: 20px 0; line-height: 1.6;">
            Bedankt voor je interesse in Mursee Films. We hebben je projectaanvraag ontvangen en zullen zo snel mogelijk contact met je opnemen.
          </p>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 3px solid #000;">
            <h3 style="margin-top: 0; color: #555;">Jouw projectdetails:</h3>
            <p style="margin: 5px 0;"><strong>Type project:</strong> ${projectType}</p>
            <p style="margin: 5px 0;"><strong>Budget:</strong> ${budget}</p>
            ${message ? `<p style="margin: 5px 0;"><strong>Bericht:</strong> ${message}</p>` : ""}
          </div>

          <p style="margin: 20px 0; line-height: 1.6;">
            We streven ernaar om binnen 24 uur te reageren op alle aanvragen. Heb je vragen in de tussentijd? Stuur gerust een e-mail naar info@mursee.nl of bel ons.
          </p>

          <p style="margin: 20px 0; line-height: 1.6;">
            Met vriendelijke groet,<br>
            Het team van Mursee Films
          </p>

          <div style="margin: 30px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              Dit is een automatisch gegenereerd bericht. Gelieve niet te reageren op deze e-mail.
            </p>
          </div>
        </div>
      `,
      text: `
        Bedankt voor je projectaanvraag!

        Hallo ${name},

        Bedankt voor je interesse in Mursee Films. We hebben je projectaanvraag ontvangen en zullen zo snel mogelijk contact met je opnemen.

        Jouw projectdetails:
        Type project: ${projectType}
        Budget: ${budget}
        ${message ? `Bericht: ${message}` : ""}

        We streven ernaar om binnen 24 uur te reageren op alle aanvragen. Heb je vragen in de tussentijd? Stuur gerust een e-mail naar info@mursee.nl of bel ons.

        Met vriendelijke groet,
        Het team van Mursee Films

        Dit is een automatisch gegenereerd bericht. Gelieve niet te reageren op deze e-mail.
      `,
      });
    } catch (autoReplyError) {
      // Log the error but don't fail the request since main email was sent
      console.error("Auto-reply email failed:", autoReplyError);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
