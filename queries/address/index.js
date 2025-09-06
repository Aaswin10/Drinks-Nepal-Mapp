import { useMutation } from '@tanstack/react-query';
import { deleteAddress, editAddress, submitAddress } from './address';

export const useSubmitAddressMutation = (options) =>
  useMutation(submitAddress(options));

export const useEditAddressMutation = (options) =>
  useMutation(editAddress(options));

export const useDeleteAddressMutation = (options) => 
  useMutation(deleteAddress(options));