# Email Service Setup Guide

This guide explains how to configure the email service for password reset functionality in Rebbie's Store.

## 📧 Email Service Overview

The application uses Nodemailer to send password reset emails with professional HTML templates. The email service supports multiple SMTP providers and includes security features.

## 🔧 Configuration

### Environment Variables

Add these variables to your `.env.local` file:

```env
# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@rebbievault.com"
```

## 📧 Supported Email Providers

### 1. Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Configure environment variables**:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-16-character-app-password"
   ```

### 2. SendGrid Setup

1. **Create SendGrid account** at [sendgrid.com](https://sendgrid.com)
2. **Generate API Key** in Settings → API Keys
3. **Configure environment variables**:
   ```env
   SMTP_HOST="smtp.sendgrid.net"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="apikey"
   SMTP_PASS="your-sendgrid-api-key"
   ```

### 3. Amazon SES Setup

1. **Set up Amazon SES** in AWS Console
2. **Verify your domain/email**
3. **Create SMTP credentials**
4. **Configure environment variables**:
   ```env
   SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-ses-smtp-username"
   SMTP_PASS="your-ses-smtp-password"
   ```

### 4. Custom SMTP Server

For any other SMTP provider:
```env
SMTP_HOST="your-smtp-host.com"
SMTP_PORT="587"  # or 465 for secure
SMTP_SECURE="false"  # or "true" for port 465
SMTP_USER="your-username"
SMTP_PASS="your-password"
```

## 🎨 Email Template Features

The password reset email includes:

- **Professional Design**: Purple theme matching Rebbie Vault branding
- **Responsive Layout**: Works on all devices
- **Security Features**: Clear expiry time and security warnings
- **Accessible**: Both HTML and plain text versions
- **Brand Consistency**: Rebbie Vault logo and colors

## 🔐 Security Features

- **Token Expiry**: 15-minute expiration for reset tokens
- **Rate Limiting**: 3 attempts per 15 minutes per IP
- **Secure Tokens**: 32-character cryptographically secure tokens
- **No Email Disclosure**: Doesn't reveal if email exists
- **Security Warnings**: Alerts users about unauthorized requests

## 🧪 Testing Email Service

### Development Testing

For development, you can:

1. **Use Gmail** with app passwords (recommended for testing)
2. **Use Mailtrap** for email testing without sending real emails:
   ```env
   SMTP_HOST="smtp.mailtrap.io"
   SMTP_PORT="2525"
   SMTP_SECURE="false"
   SMTP_USER="your-mailtrap-username"
   SMTP_PASS="your-mailtrap-password"
   ```

### Production Testing

1. **Verify email service connection**:
   ```javascript
   import emailService from '@/lib/emailService';
   await emailService.verifyConnection();
   ```

2. **Check server logs** for email sending status
3. **Test with real email addresses**

## 📝 Email Content Customization

To modify the email template, edit `/lib/emailService.ts`:

```typescript
private generatePasswordResetHTML(data: PasswordResetEmailData): string {
  // Customize HTML template here
}

private generatePasswordResetText(data: PasswordResetEmailData): string {
  // Customize plain text template here
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failed**:
   - Check username/password
   - Ensure app passwords are used for Gmail
   - Verify 2FA is enabled for Gmail

2. **Connection Timeout**:
   - Check SMTP host and port
   - Verify firewall settings
   - Try different port (465 vs 587)

3. **Emails Not Delivered**:
   - Check spam folder
   - Verify sender email is authorized
   - Check provider's sending limits

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV="development"
```

This will show detailed email sending logs in the console.

## 🚀 Production Recommendations

1. **Use Professional Email Service**: SendGrid, Amazon SES, or Mailgun
2. **Set Up SPF/DKIM Records**: For better deliverability
3. **Monitor Email Metrics**: Track delivery rates and bounces
4. **Use Dedicated IP**: For high-volume sending
5. **Implement Email Templates**: For consistent branding

## 📊 Email Service Monitoring

The service logs important events:
- Email sending success/failure
- Connection verification
- Rate limiting triggers

Monitor these logs for email service health in production.

---

## Support

For email service issues:
1. Check environment variables
2. Verify SMTP provider settings
3. Review server logs
4. Test with email service verification

The email service is designed to fail gracefully - if emails can't be sent, the API will still return success for security reasons, but errors will be logged for debugging.