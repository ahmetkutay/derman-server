import nodemailer from 'nodemailer';
import config from "../config/config";

export function generateRandomText(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomText = '';
    for (let i = 0; i < length; i++) {
        randomText += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomText;
}

export async function sendConfirmMail(to: string, first_name:string,last_name:string, verificationToken: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.email,
            pass: config.email.password
        }
    });

    const subject = '[Action Required] DermanApp Email Confirm';
    const text = `Your verification token is: ${verificationToken}`;
    const html = `
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2>Hi ${first_name} ${last_name}</h2>
            <p>Thank you for registering with DermanApp!</p>
            <p>Your verification token is:</p>
            <h3 style="color: #2E86C1;">${verificationToken}</h3>
            <p>Please use this token to complete your registration.</p>
        </div>
    `;

    const mailOptions = {
        from: config.email.email,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email: %s', error);
    }
}

export async function sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    //TODO create a mail template
}