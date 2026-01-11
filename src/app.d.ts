// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				userId: string;
				username: string;
				role: string;
				sessionId: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface PublicEnv {
		SUPABASE_URL: string;
		SUPABASE_ANON_KEY: string;
	}

	interface ImportMetaEnv extends PublicEnv {}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {};
