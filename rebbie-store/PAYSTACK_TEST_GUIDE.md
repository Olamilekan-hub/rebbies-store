# Paystack Local Testing Guide

## 🚀 Quick Start Testing

### 1. Update Environment Variables
Replace dummy values in `.env` with your actual Paystack test keys:
```env
PAYSTACK_SECRET_KEY="sk_test_your_actual_test_secret_key"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_your_actual_test_public_key"
```

### 2. Test Cards (Paystack Sandbox)
Use these test card numbers in your checkout:

**Successful Payments:**
- **Visa**: `4084084084084081`
- **Mastercard**: `5060666666666666666`
- **Verve**: `5061020000000000094`

**Test Details:**
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- PIN: `1234` (for Verve cards)

**Failed Payments (for testing error handling):**
- **Declined**: `4084084084084002`
- **Insufficient Funds**: `4084084084084003`

### 3. Testing Process

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Add products to cart** and go to checkout

3. **Fill out checkout form** with any test data:
   - Name: Test User
   - Email: test@example.com
   - Phone: +2348012345678
   - Address: Test Address, Lagos

4. **Click the Paystack payment button**

5. **Use test card numbers** above in the Paystack popup

6. **Test different scenarios:**
   - Successful payment
   - Failed payment
   - Cancelled payment

### 4. Webhook Testing (Optional)

For webhook testing, you'll need to expose your local server:

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Expose your local server:**
   ```bash
   ngrok http 3000
   ```

3. **Add webhook URL in Paystack Dashboard:**
   - Go to Settings → Webhooks
   - Add: `https://your-ngrok-url.ngrok.io/api/paystack/webhook`
   - Select events: `charge.success`, `charge.failed`

### 5. Expected Behavior

**Successful Payment:**
- ✅ Paystack popup closes
- ✅ Redirects to `/checkout/success`
- ✅ Shows payment details
- ✅ Cart is cleared
- ✅ Success toast notification

**Failed Payment:**
- ❌ Error message displayed
- ❌ User stays on checkout page
- ❌ Cart remains intact

### 6. Debugging Tips

**Check Browser Console** for any JavaScript errors

**Check Network Tab** for API call responses:
- `/api/paystack/initialize` should return `200` with payment data
- `/api/paystack/verify` should return `200` with verification data

**Check Server Logs** for any backend errors

### 7. Common Issues

**"Paystack configuration not found"**
- Ensure your `.env` file has the correct Paystack keys
- Restart your development server after updating `.env`

**Payment popup doesn't open**
- Check browser console for errors
- Ensure internet connection (Paystack script loads from CDN)
- Try a different browser

**Payment verification fails**
- Check if test keys are correctly set
- Ensure the reference matches between initialize and verify calls

### 8. Going Live

When ready for production:
1. Replace test keys with live keys from Paystack dashboard
2. Update webhook URLs to your production domain
3. Test with small amounts first
4. Set up proper error monitoring

## 🎯 Quick Test Checklist

- [ ] Paystack test keys added to `.env`
- [ ] Development server running
- [ ] Products added to cart
- [ ] Checkout form filled
- [ ] Test card payment successful
- [ ] Success page displays correctly
- [ ] Cart cleared after payment
- [ ] Error handling tested with declined card