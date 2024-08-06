import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendInvitationEmail = (recipientEmail, inviteLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Invitation to join Project on Collab-On',
        text: `You have been invited to join your team on Collab-On. Click the following link to join: ${inviteLink}`,
        html: `<p>You have been invited to join our Project Management system. Click the following link to join:</p><a href="${inviteLink}">Join Now</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};
