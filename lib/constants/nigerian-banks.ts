/**
 * Nigerian banks with CBN/Paystack-compatible codes.
 * Curated list of major commercial banks for payment provider forms.
 */
export interface NigerianBank {
  code: string
  name: string
}

export const NIGERIAN_BANKS: NigerianBank[] = [
  { code: '000014', name: 'Access Bank' },
  { code: '000004', name: 'United Bank for Africa (UBA)' },
  { code: '000016', name: 'First Bank of Nigeria' },
  { code: '000013', name: 'Guaranty Trust Bank (GTBank)' },
  { code: '000015', name: 'Zenith Bank' },
  { code: '000007', name: 'Fidelity Bank' },
  { code: '000003', name: 'First City Monument Bank (FCMB)' },
  { code: '000001', name: 'Sterling Bank' },
  { code: '000002', name: 'Keystone Bank' },
  { code: '000010', name: 'Ecobank Nigeria' },
  { code: '000011', name: 'Unity Bank' },
  { code: '000017', name: 'Wema Bank' },
  { code: '000018', name: 'Union Bank' },
  { code: '000008', name: 'Polaris Bank' },
  { code: '000020', name: 'Heritage Bank' },
  { code: '000012', name: 'Stanbic IBTC Bank' },
  { code: '000006', name: 'Jaiz Bank' },
  { code: '000022', name: 'Suntrust Bank' },
  { code: '000023', name: 'Providus Bank' },
  { code: '000025', name: 'Titan Trust Bank' },
  { code: '000026', name: 'TAJ Bank' },
  { code: '000027', name: 'Globus Bank' },
  { code: '000029', name: 'Lotus Bank' },
  { code: '000030', name: 'Parallex Bank' },
  { code: '000031', name: 'Premium Trust Bank' },
  { code: '100004', name: 'OPay' },
  { code: '100033', name: 'PalmPay' },
  { code: '090267', name: 'Kuda Microfinance Bank' },
  { code: '090405', name: 'Moniepoint Microfinance Bank' },
  { code: '110028', name: 'Nomba' },
].sort((a, b) => a.name.localeCompare(b.name))
