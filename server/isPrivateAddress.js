import { isIPv4, isIPv6 } from 'node:net';

function isPrivateIPv4(address) {
  const [a, b] = address.split('.').map(Number);

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIPv6(address) {
  if (address === '::' || address === '::1') {
    return true;
  }

  if (/^(fc|fd|fe[89ab]|ff)/.test(address)) {
    return true;
  }

  if (address.startsWith('::ffff:')) {
    const mapped = address.slice('::ffff:'.length);

    if (isIPv4(mapped)) {
      return isPrivateIPv4(mapped);
    }

    const [high, low] = mapped.split(':').map((group) => parseInt(group, 16));

    return isPrivateIPv4(`${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`);
  }

  return false;
}

export function isPrivateAddress(address) {
  const normalized = address.toLowerCase();

  if (isIPv4(normalized)) {
    return isPrivateIPv4(normalized);
  }

  if (isIPv6(normalized)) {
    return isPrivateIPv6(normalized);
  }

  return true;
}
