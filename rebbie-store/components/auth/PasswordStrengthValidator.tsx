import React from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

interface PasswordStrengthValidatorProps {
  password: string;
  showValidation: boolean;
}

interface ValidationRule {
  test: (password: string) => boolean;
  message: string;
}

const PasswordStrengthValidator: React.FC<PasswordStrengthValidatorProps> = ({
  password,
  showValidation
}) => {
  const validationRules: ValidationRule[] = [
    {
      test: (pwd) => pwd.length >= 8,
      message: 'At least 8 characters long'
    },
    {
      test: (pwd) => /[a-z]/.test(pwd),
      message: 'Contains lowercase letter (a-z)'
    },
    {
      test: (pwd) => /[A-Z]/.test(pwd),
      message: 'Contains uppercase letter (A-Z)'
    },
    {
      test: (pwd) => /\d/.test(pwd),
      message: 'Contains number (0-9)'
    },
    {
      test: (pwd) => /[@$!%*?&]/.test(pwd),
      message: 'Contains special character (@$!%*?&)'
    },
    {
      test: (pwd) => {
        const commonPasswords = [
          'password', '123456', 'qwerty', 'abc123', 'password123',
          'admin', 'letmein', 'welcome', 'monkey', 'dragon'
        ];
        return !commonPasswords.includes(pwd.toLowerCase());
      },
      message: 'Not a common weak password'
    }
  ];

  const getPasswordStrength = () => {
    const passedRules = validationRules.filter(rule => rule.test(password)).length;
    const percentage = (passedRules / validationRules.length) * 100;

    if (percentage < 50) return { strength: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (percentage < 80) return { strength: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    return { strength: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  const isPasswordStrong = () => {
    return validationRules.every(rule => rule.test(password));
  };

  if (!showValidation) return null;

  const { strength, color, text } = getPasswordStrength();
  const passedRules = validationRules.filter(rule => rule.test(password)).length;

  return (
    <div className="mt-3 space-y-3">
      {/* Password Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Strength
          </span>
          <span className={`text-sm font-medium ${
            strength === 'weak' ? 'text-red-600 dark:text-red-400' :
            strength === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
            'text-green-600 dark:text-green-400'
          }`}>
            {text}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${(passedRules / validationRules.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Validation Rules */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password Requirements:
        </span>
        <ul className="space-y-1">
          {validationRules.map((rule, index) => {
            const isValid = rule.test(password);
            return (
              <li key={index} className="flex items-center gap-2 text-sm">
                {isValid ? (
                  <AiOutlineCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <AiOutlineClose className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
                <span className={`${
                  isValid
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {rule.message}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export { PasswordStrengthValidator };
export default PasswordStrengthValidator;