export class UserAlreadyExistError extends Error {
	constructor(email: string) {
		super(`User with email: ${email} already exists`);
		this.name = "UserAlreadyExistError";
	}
}
