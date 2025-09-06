import { View, TouchableOpacity } from 'react-native';
import React from 'react';

import { theme } from '../constants';
import { svg } from '../svg';

const PaymentSystem = ({ paymentSystem }) => {
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.COLORS.lightBlue1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {paymentSystem === 'Apple Pay' && <svg.ApplePay />}
        {paymentSystem === 'Pay Pal' && <svg.PayPal />}
        {paymentSystem === 'Payoneer' && <svg.Payoneer />}
      </View>
      {paymentSystem === 'Apple Pay' && <svg.PaymentEdit />}
      {paymentSystem === 'Pay Pal' && <svg.PaymentEdit />}
      {paymentSystem === 'Payoneer' && <svg.PaymentPlus />}
    </TouchableOpacity>
  );
};

export default PaymentSystem;
