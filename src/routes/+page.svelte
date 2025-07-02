<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Home } from 'lucide-svelte';
</script>

<div class="container mx-auto p-8">
	<div class="flex items-center gap-4 mb-8">
		<Home class="h-8 w-8 text-primary" />
		<h1 class="text-4xl font-bold">Neat Adventure</h1>
	</div>
	
	<div class="space-y-4">
		<p class="text-lg text-muted-foreground">
			A SvelteKit project scaffold following TDD principles and modern best practices.
		</p>
		
		<div class="flex gap-4">
			<Button variant="default">Get Started</Button>
			<Button variant="outline">Learn More</Button>
		</div>
	</div>
	
	<div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="p-6 border rounded-lg">
			<h3 class="text-xl font-semibold mb-2">TypeScript First</h3>
			<p class="text-muted-foreground">Strict TypeScript configuration with Zod schemas for runtime validation.</p>
		</div>
		
		<div class="p-6 border rounded-lg">
			<h3 class="text-xl font-semibold mb-2">Test-Driven Development</h3>
			<p class="text-muted-foreground">Vitest and Testing Library setup for comprehensive testing.</p>
		</div>
		
		<div class="p-6 border rounded-lg">
			<h3 class="text-xl font-semibold mb-2">Modern UI</h3>
			<p class="text-muted-foreground">shadcn-svelte components with Tailwind CSS styling.</p>
		</div>
	</div>
</div>
