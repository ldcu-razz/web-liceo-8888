<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupInput } from '$lib/components/ui/input-group';
	import { SearchIcon } from '@lucide/svelte';
	import TicketItem from './TicketItem.svelte';
	import {
		TicketsPrioritiesSchema,
		TicketStatusesSchema
	} from '$lib/models/tickets/tickets.schema';
	import type { GetTicket } from '$lib/models/tickets/tickets.type';
	import { STUDENT_TICKETS_ID } from '$lib/constants';
	import { goto } from '$app/navigation';

	let searchQuery = $state('');

	let tickets = $state<GetTicket[]>([
		{
			id: '1',
			title: 'Ticket 1',
			description: 'Description 1',
			status: TicketStatusesSchema.enum.in_progress,
			priority: TicketsPrioritiesSchema.enum.low,
			category_id: '1',
			code: '123456',
			category: {
				id: '1',
				name: 'Category 1'
			},
			current_department_assigned: {
				id: '1',
				name: 'Department 1',
				abbv: 'DEPT'
			},
			current_user_assigned: {
				id: '1',
				firstname: 'John',
				lastname: 'Doe',
				avatar: 'https://github.com/shadcn.png'
			},
			reported_by: {
				id: '1',
				firstname: 'John',
				lastname: 'Doe',
				avatar: 'https://github.com/shadcn.png'
			},
			files: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		},
		{
			id: '2',
			title: 'Ticket 2',
			description: 'Description 2',
			status: TicketStatusesSchema.enum.backlog,
			priority: TicketsPrioritiesSchema.enum.low,
			category_id: '1',
			code: '123456',
			category: {
				id: '1',
				name: 'Category 1'
			},
			current_department_assigned: {
				id: '1',
				name: 'Department 1',
				abbv: 'DEPT'
			},
			current_user_assigned: {
				id: '1',
				firstname: 'John',
				lastname: 'Doe',
				avatar: 'https://github.com/shadcn.png'
			},
			reported_by: {
				id: '1',
				firstname: 'John',
				lastname: 'Doe',
				avatar: 'https://github.com/shadcn.png'
			},
			files: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	]);

	function handleClickTicket(id: string) {
		goto(STUDENT_TICKETS_ID.replace('{id}', id));
	}
</script>

<section>
	<div class="align-center mt-4 flex flex-col gap-3 px-4 pt-3">
		<h3 class="text-2xl font-semibold">Tickets</h3>
		<InputGroup class="bg-white py-5">
			<InputGroupAddon>
				<SearchIcon class="size-4" />
			</InputGroupAddon>
			<InputGroupInput bind:value={searchQuery} placeholder="Search ticket" />
		</InputGroup>
	</div>

	<div class="mt-4 flex flex-col">
		{#each tickets as ticket, index}
			{@const isLastItem = index === tickets.length - 1}
			<TicketItem {ticket} {isLastItem} onClickTicket={handleClickTicket} />
		{:else}
			<div class="flex justify-center items-center h-full">
				<p class="text-gray-500">No tickets found</p>
			</div>
		{/each}
	</div>
</section>
