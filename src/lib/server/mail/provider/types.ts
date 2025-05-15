export type MailData = { from: string; to: string; subject: string; html: string };

export type MailProvider = {
	mail: (data: MailData) => Promise<void>;
};
