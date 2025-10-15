import nodemailer from 'nodemailer';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

// Email template interface
interface PasswordResetEmailData {
  to: string;
  name?: string;
  resetLink: string;
  expiryTime: number; // in minutes
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): nodemailer.Transporter {
    // You can configure different email providers here
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    };

    return nodemailer.createTransporter({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
  }

  private generatePasswordResetHTML(data: PasswordResetEmailData): string {
    const { name, resetLink, expiryTime } = data;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Rebbie Vault</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-top: 40px;
            margin-bottom: 40px;
          }
          .header {
            text-align: center;
            padding: 30px 0;
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            color: white;
            border-radius: 12px 12px 0 0;
            margin: -20px -20px 30px -20px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content {
            padding: 0 20px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .reset-button:hover {
            transform: translateY(-2px);
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .expiry-notice {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
          }
          .security-notice {
            background-color: #fee2e2;
            border: 1px solid #fca5a5;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
          .link-text {
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            word-break: break-all;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ Rebbie Vault</h1>
            <p>Password Reset Request</p>
          </div>

          <div class="content">
            <div class="greeting">
              Hello${name ? ` ${name}` : ''},
            </div>

            <div class="message">
              We received a request to reset your password for your Rebbie Vault account. If you didn't make this request, you can safely ignore this email.
            </div>

            <div class="button-container">
              <a href="${resetLink}" class="reset-button">
                Reset Your Password
              </a>
            </div>

            <div class="expiry-notice">
              <strong>⏰ Important:</strong> This password reset link will expire in <strong>${expiryTime} minutes</strong> for security reasons.
            </div>

            <div class="message">
              If the button above doesn't work, you can copy and paste the following link into your browser:
            </div>

            <div class="link-text">
              ${resetLink}
            </div>

            <div class="security-notice">
              <strong>🔒 Security Tip:</strong> If you didn't request this password reset, please secure your account by changing your password immediately and consider enabling two-factor authentication.
            </div>
          </div>

          <div class="footer">
            <p>
              This email was sent from Rebbie Vault.<br>
              If you have any questions, please contact our support team.
            </p>
            <p>
              © ${new Date().getFullYear()} Rebbie Vault. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePasswordResetText(data: PasswordResetEmailData): string {
    const { name, resetLink, expiryTime } = data;

    return `
Password Reset Request - Rebbie Vault

Hello${name ? ` ${name}` : ''},

We received a request to reset your password for your Rebbie Vault account. If you didn't make this request, you can safely ignore this email.

To reset your password, click on the following link or copy and paste it into your browser:
${resetLink}

IMPORTANT: This password reset link will expire in ${expiryTime} minutes for security reasons.

If you didn't request this password reset, please secure your account by changing your password immediately.

Best regards,
The Rebbie Vault Team

© ${new Date().getFullYear()} Rebbie Vault. All rights reserved.
    `.trim();
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: 'Rebbie Vault',
          address: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@rebbievault.com'
        },
        to: data.to,
        subject: '🔐 Password Reset Request - Rebbie Vault',
        text: this.generatePasswordResetText(data),
        html: this.generatePasswordResetHTML(data),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
const emailService = new EmailService();

export default emailService;
export { EmailService, type PasswordResetEmailData };