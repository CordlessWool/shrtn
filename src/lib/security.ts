export const detectMisuse = (url: URL) => {
	const searchParams = new URLSearchParams(url.search);
	const hash = url.hash;
	return searchParams.size === 0 && hash === '';
};

export const isSecure = (url: URL) => {
	return detectMisuse(url);
};
