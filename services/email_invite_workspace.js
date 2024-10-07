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

export const sendInvitationEmail_workspace = (recipientEmail, inviteLink, role, workspaceName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Invitation to join ${workspaceName} on Collab-On`,
        text: `You have been invited to join the workspace "${workspaceName}" as an ${role} on Collab-On. Click the following link to join: ${inviteLink}`,
        html: `
            <p>You have been invited to join the workspace <strong>${workspaceName}</strong> as an <strong>${role}</strong> on Collab-On.</p>
            <p>Click the following link to join:</p>
            <a href="${inviteLink}">Join Now</a>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};
