import rateLimit from 'express-rate-limit'

const baseOptions = {
  standardHeaders: true,
  legacyHeaders: false,
}

export const otpSendLimiter = rateLimit({
  ...baseOptions,
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many OTP send requests. Please try again later.',
    },
  },
})

export const otpVerifyLimiter = rateLimit({
  ...baseOptions,
  windowMs: 10 * 60 * 1000,
  max: 40,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many OTP verify requests. Please try again later.',
    },
  },
})

export const signedUploadLimiter = rateLimit({
  ...baseOptions,
  windowMs: 5 * 60 * 1000,
  max: 120,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many signed upload requests. Please try again later.',
    },
  },
})

export const writeActionLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  max: 300,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Write request rate exceeded. Please retry shortly.',
    },
  },
})
