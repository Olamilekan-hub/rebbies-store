
// Type definitions
export interface CategoryMenuItem {
  id: number;
  title: string;
  src: string;
  href: string;
}

export const categoryMenuList: CategoryMenuItem[] = [
  {
    id: 1,
    title: "Skincare",
    src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    href: "/shop/skincare"
  },
  {
    id: 2,
    title: "Hair Care",
    src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    href: "/shop/hair-care"
  },
  {
    id: 3,
    title: "Makeup",
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    href: "/shop/makeup"
  },
  {
    id: 4,
    title: "Jewelry",
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    href: "/shop/jewelry"
  },
  {
    id: 5,
    title: "Accessories",
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    href: "/shop/accessories"
  },
  {
    id: 6,
    title: "Fragrances",
    src: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    href: "/shop/fragrances"
  },
  {
    id: 7,
    title: "Body Care",
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    href: "/shop/body-care"
  },
  {
    id: 8,
    title: "Natural Products",
    src: "https://images.unsplash.com/photo-1608301171486-c4b91ede0c69?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    href: "/shop/natural"
  }
];

export const incentives = [
  {
    name: "Free Shipping Nationwide",
    description:
      "Free delivery across Nigeria for orders above ₦15,000. Same-day delivery available in Lagos.",
    imageSrc: "/shipping icon.png",
  },
  {
    name: "Beauty Expert Support",
    description:
      "Get personalized beauty advice from our certified consultants. WhatsApp us anytime!",
    imageSrc: "/support icon.png",
  },
  {
    name: "Authentic Products Only",
    description:
      "100% genuine beauty products sourced directly from trusted suppliers worldwide.",
    imageSrc: "/fast shopping icon.png",
  },
];

export const navigation = {
  sale: [
    { name: "Beauty Deals", href: "/shop?filter=sale" },
    { name: "New Arrivals", href: "/shop?filter=new" },
    { name: "Beauty Loyalty Program", href: "/loyalty" },
  ],
  about: [
    { name: "About Rebbie's Store", href: "/about" },
    { name: "Our Beauty Mission", href: "/mission" },
    { name: "Become a Brand Partner", href: "/partners" },
  ],
  buy: [
    { name: "Beauty Rewards Card", href: "/rewards" },
    { name: "Terms Of Use", href: "/legal" },
    { name: "Privacy Policy", href: "/legal" },
    { name: "Return Policy", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
  ],
  help: [
    { name: "Contact Beauty Experts", href: "/contact" },
    { name: "Beauty Guide & Tips", href: "/beauty-guide" },
    { name: "FAQ", href: "/faq" },
  ],
};

export const isValidNameOrLastname = (input: string) => {
  // Simple name or lastname regex format check
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(input);
};

export const isValidEmailAddressFormat = (input: string) => {
  // simple email address format check
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(input);
};

export const isValidCardNumber = (input: string) => {
  // Remove all non-digit characters
  const cleanedInput = input.replace(/[^0-9]/g, "");
  
  // Check if the cleaned input has valid length (13-19 digits)
  if (!/^\d{13,19}$/.test(cleanedInput)) {
    return false;
  }
  
  // Implement Luhn algorithm for credit card validation
  return luhnCheck(cleanedInput);
};

/**
 * Luhn algorithm implementation for credit card validation
 * @param cardNumber - The credit card number as a string
 * @returns boolean - true if the card number is valid according to Luhn algorithm
 */
const luhnCheck = (cardNumber: string): boolean => {
  let sum = 0;
  let isEven = false;
  
  // Process digits from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Enhanced credit card validation with card type detection
 * @param input - The credit card number as a string
 * @returns object with validation result and card type
 */
export const validateCreditCard = (input: string) => {
  const cleanedInput = input.replace(/[^0-9]/g, "");
  
  // Basic length and format check
  if (!/^\d{13,19}$/.test(cleanedInput)) {
    return {
      isValid: false,
      cardType: 'unknown',
      error: 'Invalid card number format'
    };
  }
  
  // Luhn algorithm check
  if (!luhnCheck(cleanedInput)) {
    return {
      isValid: false,
      cardType: 'unknown',
      error: 'Invalid card number (Luhn check failed)'
    };
  }
  
  // Detect card type based on BIN (Bank Identification Number)
  const cardType = detectCardType(cleanedInput);
  
  return {
    isValid: true,
    cardType,
    error: null
  };
};

/**
 * Detect credit card type based on BIN patterns
 * @param cardNumber - The credit card number as a string
 * @returns string - The detected card type
 */
const detectCardType = (cardNumber: string): string => {
  const firstDigit = cardNumber[0];
  const firstTwoDigits = cardNumber.substring(0, 2);
  const firstFourDigits = cardNumber.substring(0, 4);
  const firstThreeDigits = cardNumber.substring(0, 3);
  
  // Visa: starts with 4
  if (firstDigit === '4') {
    return 'visa';
  }
  
  // Mastercard: starts with 5 or 2
  if (firstDigit === '5' || (firstTwoDigits >= '22' && firstTwoDigits <= '27')) {
    return 'mastercard';
  }
  
  // American Express: starts with 34 or 37
  if (firstTwoDigits === '34' || firstTwoDigits === '37') {
    return 'amex';
  }
  
  // Discover: starts with 6011, 65, or 644-649
  if (firstFourDigits === '6011' || firstTwoDigits === '65' || 
      (firstThreeDigits >= '644' && firstThreeDigits <= '649')) {
    return 'discover';
  }
  
  // Diners Club: starts with 300-305, 36, or 38
  if ((firstThreeDigits >= '300' && firstThreeDigits <= '305') || 
      firstTwoDigits === '36' || firstTwoDigits === '38') {
    return 'diners';
  }
  
  // JCB: starts with 35
  if (firstTwoDigits === '35') {
    return 'jcb';
  }
  
  return 'unknown';
};

export const isValidCreditCardExpirationDate = (input: string) => {
  // simple expiration date format check
  const regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  return regex.test(input);
};

export const isValidCreditCardCVVOrCVC = (input: string) => {
  // simple CVV or CVC format check
  const regex = /^[0-9]{3,4}$/;
  return regex.test(input);
};
