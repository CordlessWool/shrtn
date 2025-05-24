import dns from 'node:dns/promises';
import { is } from 'valibot';

export const isPrivateIPv4 = (ip: string) =>
	isIPv4InRange(ip, '10.0.0.0', 8) ||
	isIPv4InRange(ip, '172.16.0.0', 12) ||
	isIPv4InRange(ip, '192.168.0.0', 16) ||
	isIPv4InRange(ip, '169.254.0.0', 16) ||
	isIPv4InRange(ip, '127.0.0.0', 8) ||
	isIPv4InRange(ip, '100.64.0.0', 10) ||
	isIPv4InRange(ip, '169.254.0.0', 16) ||
	isIPv4InRange(ip, '0.0.0.0', 8);

export const isPrivateIPv6 = (ip: string) =>
	isIPv6InRange(ip, '::1', 128) ||
	isIPv6InRange(ip, 'fe80::', 10) ||
	isIPv6InRange(ip, 'fc00::', 7) ||
	isIPv6InRange(ip, 'fec0::', 10);

export const isPublicLink = async (link: string) => {
	const { hostname } = new URL(link);
	const records = await dns.lookup(hostname, { all: true });
	for (const record of records) {
		if (record.family === 4) {
			return !isPrivateIPv4(record.address);
		}
		if (record.family === 6) {
			return !isPrivateIPv6(record.address);
		}
	}

	return false;
};

const ipv4ToHex = (ip: string) =>
	ip
		.split('.')
		.map((part) => parseInt(part, 10))
		.reduce((acc, part, index) => acc + part * Math.pow(0x100, 3 - index), 0);

export const isIPv4InRange = (ip: string, ipNet: string, subnetSize: number) => {
	const ipHex = ipv4ToHex(ip) >>> (32 - subnetSize);
	const netHex = ipv4ToHex(ipNet) >>> (32 - subnetSize);

	return ipHex === netHex;
};

const ipv6ToHex = (ip: string) =>
	ip
		.split(':')
		.reduce((acc, part, index, arr) => {
			if (part === '' && index !== arr.length - 1) {
				const missingParts = 8 - (arr.length - 1);
				for (let i = 0; i < missingParts; i++) {
					acc.push(0);
				}
			} else if (part === '') {
				acc.push(0);
			} else {
				acc.push(parseInt(part, 16));
			}
			return acc;
		}, [] as number[])
		.reduce((acc, part, index) => acc + part * Math.pow(0x10000, 7 - index), 0);

export const isIPv6InRange = (ip: string, ipNet: string, subnetSize: number) => {
	const hexPositions = Math.ceil(subnetSize / 8);
	let mask: number = 0;
	for (let i = 0; i < hexPositions * 8; i++) {
		mask = mask << 1;
		if (i < subnetSize) {
			mask += 1;
		}
	}
	const ipHex = ipv6ToHex(ip).toString(16).slice(0, hexPositions);
	const netHex = ipv6ToHex(ipNet).toString(16).slice(0, hexPositions);
	return (parseInt(ipHex, 16) & mask) === (parseInt(netHex, 16) & mask);
};
