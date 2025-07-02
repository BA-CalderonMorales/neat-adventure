import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type CreateUser = z.infer<typeof CreateUserSchema>;