import { describe, expect, it } from 'vitest';
import { isPrivateAddress } from '../server/isPrivateAddress.js';

describe('isPrivateAddress', () => {
  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.0.10',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '224.0.0.1',
  ])('blocks private IPv4 address %s', (address) => {
    expect(isPrivateAddress(address)).toBe(true);
  });

  it.each(['8.8.8.8', '172.32.0.1', '93.184.216.34'])('allows public IPv4 address %s', (address) => {
    expect(isPrivateAddress(address)).toBe(false);
  });

  it.each(['::1', '::', 'fc00::1', 'fd12:3456::1', 'fe80::1', 'ff02::1'])(
    'blocks private IPv6 address %s',
    (address) => {
      expect(isPrivateAddress(address)).toBe(true);
    },
  );

  it.each(['::ffff:127.0.0.1', '::ffff:7f00:1', '::ffff:10.0.0.1'])(
    'blocks IPv4-mapped private address %s',
    (address) => {
      expect(isPrivateAddress(address)).toBe(true);
    },
  );

  it('allows a public IPv6 address', () => {
    expect(isPrivateAddress('2606:4700:4700::1111')).toBe(false);
  });

  it('treats anything that is not an IP address as unsafe', () => {
    expect(isPrivateAddress('example.com')).toBe(true);
  });
});
