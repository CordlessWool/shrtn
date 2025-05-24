import dns from 'node:dns/promises';

export const isPrivateLink = async (link: string) => {
	const { hostname } = new URL(link);
	const records = await dns.lookup(hostname, { all: true });

	if (!records.length) return false;

	for (const record of records) {
		if (record.family === 4 && record.address.startsWith('192.168.')) return true;
		if (record.family === 6 && record.address.startsWith('fe80::')) return true;
	}

	return false;
};

const ipv4ToHex = (ip: string) =>
	ip
		.split('.')
		.map((part) => parseInt(part, 10))
		.reduce((acc, part, index) => acc + part * Math.pow(256, 3 - index), 0);

export const isIPInSubnet = (ip: string, range: string) => {
	const [start, end] = range.split('-').map((part) => parseInt(part, 16));
	const ipNum = parseInt(ip.replace(/\./g, ''), 16);
	return ipNum >= start && ipNum <= end;
};
export type IPv4 = `${number}.${number}.${number}.${number}`;
export type IPv6 =
	`${string}:${string}:${string}:${string}:${string}:${string}:${string}:${string}`;
export const isIPv4InRange = (ip: string, ipNet: string, subnetSize: number) => {
	const ipHex = ipv4ToHex(ip) >>> (32 - subnetSize);
	const netHex = ipv4ToHex(ipNet) >>> (32 - subnetSize);

	return ipHex === netHex;
};
