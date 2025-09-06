import { useMutation } from '@tanstack/react-query';
import {
  authenticate,
  generateOtp,
  markNotificationAsRead,
  refreshToken,
  register,
  updatePushToken,
  verifyOtp,
} from './authentication';

export const useAuthenticateMutation = (options) => useMutation(authenticate(options));
export const useGenerateOtpMutation = (options) => useMutation(generateOtp(options));
export const useRefreshTokenMutation = () => useMutation(refreshToken());
export const useRegisterMutation = (options) => useMutation(register(options));
export const useVerifyOtpMutation = (options) => useMutation(verifyOtp(options));
export const useUpdatePushTokenMutation = (options) => useMutation(updatePushToken(options));
export const useMarkNotificationAsReadMutation = (options) =>
  useMutation(markNotificationAsRead(options));
