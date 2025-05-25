export interface Link {
	key: string;
	url: string;
	calls: number | null;
	callLimit: number | null;
	hasPassphrase: boolean;
	expiresAt: Date | null;
	createdAt: Date;
}
