<script lang="ts" module>
	import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
	import { Button } from '../ui/button';
	import { Bold, Code, Italic, Quote, SendIcon, Strikethrough, Underline } from '@lucide/svelte';
	import { onMount, tick } from 'svelte';
	import { cn } from '$lib/utils';
	import type { MentionedUsers, Users } from '$lib/models/users/users.type';
	import { allUsersStore } from '$lib/store/users.store';
	import { meStore } from '$lib/store/me.store';
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';
	import { Label } from '../ui/label';
	import { Checkbox } from '../ui/checkbox';

	export type Props = {
		value?: string;
		visibleToReporter?: boolean;
		className?: string;
		placeholder?: string;
		hideAvatar?: boolean;
		mentionedUsers?: MentionedUsers[];
		showVisibleToReporterCheckbox?: boolean;
		showSubmitButton?: boolean;
		onBlur?: () => void;
		onSubmit?: (value: string, mentionedUsers?: MentionedUsers[]) => void;
	};
</script>

<script lang="ts">
	let {
		value = $bindable(''),
		visibleToReporter = $bindable(false),
		className,
		placeholder = 'Write',
		hideAvatar = false,
		mentionedUsers = $bindable<MentionedUsers[]>([]),
		showVisibleToReporterCheckbox = false,
		showSubmitButton = false,
		onSubmit,
		onBlur
	}: Props = $props();

	let me = $derived($meStore);

	let avatar = useSignedUrl(() => me?.avatar);

	let userNameInitial = $derived(
		`${me?.firstname?.slice(0, 1).toUpperCase() ?? ''}${me?.lastname?.slice(0, 1).toUpperCase() ?? ''}`
	);

	let editorRef: HTMLDivElement | null = null;

	let editorContainerRef: HTMLDivElement | null = null;

	let isCommentEmpty = $derived(value?.trim() === '');

	const HISTORY_LIMIT = 50;
	const MAX_MENTION_SUGGESTIONS = 5;

	let history = $state<string[]>([value ?? '']);
	let historyIndex = $state(0);
	let isApplyingHistory = false;
	let toolbarState = $state({
		bold: false,
		italic: false,
		underline: false,
		strike: false
	});

	let mentionQuery = $state('');
	let mentionPopoverOpen = $state(false);
	let mentionHighlightIndex = $state(0);
	let mentionPosition = $state({ left: 0, top: 0 });

	let users = $derived($allUsersStore);
	let filteredMentionUsers = $derived.by(() => {
		const term = mentionQuery.trim().toLowerCase();
		const results = term
			? users.filter((user) => {
					const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
					return user.username.toLowerCase().includes(term) || fullName.includes(term);
				})
			: users;

		return results.slice(0, MAX_MENTION_SUGGESTIONS);
	});

	function handleToolbarMouseDown(event: MouseEvent) {
		event.preventDefault();
	}

	function resetToolbarState() {
		toolbarState = { bold: false, italic: false, underline: false, strike: false };
	}

	function attachEditor(node: HTMLDivElement) {
		editorRef = node;
		return () => {
			if (editorRef === node) editorRef = null;
		};
	}

	function attachEditorContainer(node: HTMLDivElement) {
		editorContainerRef = node;
		return () => {
			if (editorContainerRef === node) editorContainerRef = null;
		};
	}

	function selectionIsInEditor(selection: Selection | null) {
		if (!selection || !editorRef) return false;
		const { anchorNode, focusNode } = selection;
		if (!anchorNode || !focusNode) return false;
		return editorRef.contains(anchorNode) && editorRef.contains(focusNode);
	}

	function getTextBeforeCaret(selection: Selection) {
		if (!editorRef || selection.rangeCount === 0) return '';

		const range = selection.getRangeAt(0).cloneRange();
		range.collapse(true);
		range.setStart(editorRef, 0);
		return range.toString();
	}

	function updateMentionTriggerPosition(selection: Selection) {
		if (!editorContainerRef || selection.rangeCount === 0) return;
		const range = selection.getRangeAt(0).cloneRange();
		range.collapse(true);
		const rect = range.getBoundingClientRect();
		const containerRect = editorContainerRef.getBoundingClientRect();
		mentionPosition = {
			left: rect.left - containerRect.left,
			top: rect.bottom - containerRect.top
		};
	}

	function closeMentionPopover() {
		mentionPopoverOpen = false;
		mentionQuery = '';
		mentionHighlightIndex = 0;
	}

	function handleMentionDetection() {
		const selection = window.getSelection();

		if (!selection || selection.rangeCount === 0 || !selectionIsInEditor(selection)) {
			closeMentionPopover();
			return;
		}

		const textBefore = getTextBeforeCaret(selection);
		const atIndex = textBefore.lastIndexOf('@');

		if (atIndex === -1) {
			closeMentionPopover();
			return;
		}

		const charBefore = atIndex > 0 ? textBefore[atIndex - 1] : '';
		if (charBefore && !/[\s\u00A0]/.test(charBefore)) {
			closeMentionPopover();
			return;
		}

		const query = textBefore.slice(atIndex + 1);

		if (/[\s\u00A0]/.test(query)) {
			closeMentionPopover();
			return;
		}

		const isNewQuery = query !== mentionQuery || !mentionPopoverOpen;

		mentionQuery = query;
		if (isNewQuery) {
			mentionHighlightIndex = 0;
		}
		mentionPopoverOpen = true;
		updateMentionTriggerPosition(selection);
	}

	function handleSelectionChangeEvent() {
		refreshToolbarState();
		handleMentionDetection();
	}

	function createMentionNode(user: Users) {
		const mentionNode = document.createElement('span');
		const displayName = `${user.firstname} ${user.lastname}`.trim();
		mentionNode.textContent = `@${displayName}`;
		mentionNode.dataset.mentionId = user.id;
		mentionNode.dataset.username = user.username;
		mentionNode.dataset.firstname = user.firstname;
		mentionNode.dataset.lastname = user.lastname;
		mentionNode.className =
			'mention-chip inline-flex items-center gap-1 rounded-sm bg-blue-50 px-1 text-xs font-semibold text-blue-700';
		mentionNode.contentEditable = 'false';
		return mentionNode;
	}

	function syncMentionedUsersFromDOM() {
		if (!editorRef) return;

		const nodes = editorRef.querySelectorAll<HTMLElement>('[data-mention-id]');
		const uniqueMentions: Record<string, MentionedUsers> = {};

		nodes.forEach((node) => {
			const id = node.dataset.mentionId;
			if (!id || uniqueMentions[id]) return;

			const mappedUser = users.find((user) => user.id === id);

			uniqueMentions[id] = {
				id,
				firstname: node.dataset.firstname ?? mappedUser?.firstname ?? '',
				lastname: node.dataset.lastname ?? mappedUser?.lastname ?? '',
				username: node.dataset.username ?? mappedUser?.username ?? ''
			};
		});

		mentionedUsers = Object.values(uniqueMentions);

		if (mentionPopoverOpen && filteredMentionUsers.length === 0) {
			closeMentionPopover();
		}
	}

	function selectMentionUser(user: Users) {
		const selection = window.getSelection();

		if (!editorRef || !selection || selection.rangeCount === 0) return;

		const range = selection.getRangeAt(0);
		let startContainer: Node = range.startContainer;
		let startOffset = range.startOffset;

		if (startContainer.nodeType !== Node.TEXT_NODE && startContainer.childNodes.length > 0) {
			const candidateIndex = Math.max(0, startOffset - 1);
			const candidate = startContainer.childNodes[candidateIndex] ?? startContainer.childNodes[0];

			if (candidate?.nodeType === Node.TEXT_NODE) {
				startContainer = candidate;
				startOffset = (candidate as Text).data.length;
			}
		}

		if (startContainer.nodeType !== Node.TEXT_NODE) return;

		const textNode = startContainer as Text;
		const mentionTextLength = mentionQuery.length + 1;
		const start = Math.max(0, startOffset - mentionTextLength);

		const mentionRange = document.createRange();
		mentionRange.setStart(textNode, start);
		mentionRange.setEnd(textNode, startOffset);
		mentionRange.deleteContents();

		const mentionNode = createMentionNode(user);
		const spaceNode = document.createTextNode('\u00A0');
		const fragment = document.createDocumentFragment();
		fragment.appendChild(mentionNode);
		fragment.appendChild(spaceNode);

		mentionRange.insertNode(fragment);

		const newRange = document.createRange();
		newRange.setStartAfter(spaceNode);
		newRange.collapse(true);

		selection.removeAllRanges();
		selection.addRange(newRange);

		closeMentionPopover();
		updateValueFromEditor();
		refreshToolbarState();
	}

	function refreshToolbarState() {
		const selection = window.getSelection();

		if (!selection || selection.isCollapsed || !selectionIsInEditor(selection)) {
			resetToolbarState();
			return;
		}

		toolbarState = {
			bold: document.queryCommandState('bold'),
			italic: document.queryCommandState('italic'),
			underline: document.queryCommandState('underline'),
			strike: document.queryCommandState('strikeThrough')
		};
	}

	function updateValueFromEditor() {
		if (!editorRef) return;
		value = editorRef.innerHTML;
		syncMentionedUsersFromDOM();
		recordHistory(value);
		refreshToolbarState();
	}

	function handleInput() {
		updateValueFromEditor();
		handleMentionDetection();
	}

	function submitComment() {
		const sanitizedValue = value.trim();

		if (!sanitizedValue) return;

		onSubmit?.(sanitizedValue, mentionedUsers);
		value = '';
		mentionedUsers = [];
		history = [''];
		historyIndex = 0;
		visibleToReporter = false;
		closeMentionPopover();
		resetToolbarState();
	}

	function wrapSelectionWith(tagName: 'code') {
		const selection = window.getSelection();

		if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

		const range = selection.getRangeAt(0);

		if (!editorRef?.contains(range.commonAncestorContainer)) return;

		const wrapper = document.createElement(tagName);
		wrapper.textContent = range.toString();

		range.deleteContents();
		range.insertNode(wrapper);
		range.setStartAfter(wrapper);
		range.collapse(true);

		selection.removeAllRanges();
		selection.addRange(range);
	}

	function applyFormat(format: 'bold' | 'italic' | 'underline' | 'quote' | 'code' | 'strike') {
		if (!editorRef) return;

		editorRef.focus();

		if (format === 'quote') {
			document.execCommand('formatBlock', false, 'blockquote');
		} else if (format === 'strike') {
			document.execCommand('strikeThrough');
		} else if (format === 'code') {
			wrapSelectionWith('code');
		} else {
			document.execCommand(format);
		}

		updateValueFromEditor();
		refreshToolbarState();
	}

	function handleKeyDown(event: KeyboardEvent) {
		const meta = event.metaKey || event.ctrlKey;
		const key = event.key.toLowerCase();

		// Shift+Enter always submits the comment
		if (event.key === 'Enter' && event.shiftKey && !meta) {
			event.preventDefault();
			event.stopPropagation();
			closeMentionPopover();
			submitComment();
			return;
		}

		if (mentionPopoverOpen) {
			if (key === 'arrowdown' && filteredMentionUsers.length > 0) {
				event.preventDefault();
				event.stopPropagation();
				mentionHighlightIndex = (mentionHighlightIndex + 1) % filteredMentionUsers.length;
				return;
			}

			if (key === 'arrowup' && filteredMentionUsers.length > 0) {
				event.preventDefault();
				event.stopPropagation();
				mentionHighlightIndex =
					(mentionHighlightIndex - 1 + filteredMentionUsers.length) % filteredMentionUsers.length;
				return;
			}

			if (key === 'enter' && !event.shiftKey) {
				event.preventDefault();
				event.stopPropagation();
				const user = filteredMentionUsers[mentionHighlightIndex];
				if (user) selectMentionUser(user);
				return;
			}

			if (key === 'escape') {
				event.preventDefault();
				event.stopPropagation();
				closeMentionPopover();
				return;
			}
		}

		if (meta && key === 'z' && !event.shiftKey) {
			event.preventDefault();
			event.stopPropagation();
			undo();
			return;
		}

		if ((meta && key === 'y') || (meta && key === 'z' && event.shiftKey)) {
			event.preventDefault();
			event.stopPropagation();
			redo();
			return;
		}

		if (meta && key === 'b') {
			event.preventDefault();
			event.stopPropagation();
			applyFormat('bold');
			return;
		}

		if (meta && key === 'i') {
			event.preventDefault();
			event.stopPropagation();
			applyFormat('italic');
			return;
		}

		if (meta && key === 'u') {
			event.preventDefault();
			event.stopPropagation();
			applyFormat('underline');
			return;
		}

		// Enter without shift creates a new line (default contenteditable behavior)
		// No need to handle it explicitly - just let the default happen
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (!mentionPopoverOpen) return;

		// avoid selectionchange re-computing on held arrow keys
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
		}
	}

	function handleEditorKeyUp(event: KeyboardEvent) {
		handleKeyUp(event);
		refreshToolbarState();
		handleMentionDetection();
	}

	onMount(async () => {
		await tick();
		syncMentionedUsersFromDOM();
	});

	$effect(() => {
		if (!editorRef) return;
		const desired = value ?? '';
		if (editorRef.innerHTML !== desired) {
			editorRef.innerHTML = desired;
			moveCaretToEnd(editorRef);
		}
	});

	function recordHistory(snapshot: string) {
		if (isApplyingHistory) return;

		const current = history[historyIndex];
		if (current === snapshot) return;

		let next = history.slice(0, historyIndex + 1);
		next.push(snapshot);

		if (next.length > HISTORY_LIMIT) {
			next = next.slice(next.length - HISTORY_LIMIT);
		}

		history = next;
		historyIndex = history.length - 1;
	}

	async function applyHistoryValue(snapshot: string) {
		isApplyingHistory = true;
		value = snapshot;
		await tick();
		if (editorRef) {
			moveCaretToEnd(editorRef);
			syncMentionedUsersFromDOM();
		}
		isApplyingHistory = false;
	}

	function undo() {
		if (historyIndex <= 0) return;
		historyIndex -= 1;
		applyHistoryValue(history[historyIndex]);
	}

	function redo() {
		if (historyIndex >= history.length - 1) return;
		historyIndex += 1;
		applyHistoryValue(history[historyIndex]);
	}

	function moveCaretToEnd(element: HTMLElement) {
		const selection = window.getSelection();
		if (!selection) return;

		const range = document.createRange();
		range.selectNodeContents(element);
		range.collapse(false);

		selection.removeAllRanges();
		selection.addRange(range);
	}

	function handleBlur() {
		closeMentionPopover();
		onBlur?.();
	}
</script>

<svelte:window on:selectionchange={handleSelectionChangeEvent} />

<div class="flex gap-2">
	{#if !hideAvatar}
		<Avatar class="size-8 border border-gray-200">
			<AvatarImage src={avatar.url} />
			<AvatarFallback class="text-sm font-semibold">{userNameInitial}</AvatarFallback>
		</Avatar>
	{/if}

	<div class="relative flex-1" {@attach attachEditorContainer}>
		<div
			class="flex items-center justify-between rounded-t-md border border-b-0 border-gray-200 bg-white p-1"
		>
			<div class="ml-2 text-sm text-gray-500">
				{placeholder}
			</div>
			<div
				class="flex items-center gap-1"
				role="toolbar"
				tabindex={-1}
				aria-label="Formatting toolbar"
				onmousedown={handleToolbarMouseDown}
			>
				<Button
					variant="ghost"
					size="sm"
					class={cn('p-0', toolbarState.bold ? 'bg-gray-100 text-gray-900' : '')}
					onclick={() => applyFormat('bold')}
					aria-label="Bold (Ctrl/Cmd + B)"
				>
					<Bold class="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					class={toolbarState.italic ? 'bg-gray-100 text-gray-900' : ''}
					onclick={() => applyFormat('italic')}
					aria-label="Italic (Ctrl/Cmd + I)"
				>
					<Italic class="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					class={toolbarState.underline ? 'bg-gray-100 text-gray-900' : ''}
					onclick={() => applyFormat('underline')}
					aria-label="Underline (Ctrl/Cmd + U)"
				>
					<Underline class="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					class={toolbarState.strike ? 'bg-gray-100 text-gray-900' : ''}
					onclick={() => applyFormat('strike')}
					aria-label="Strikethrough"
				>
					<Strikethrough class="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					onclick={() => applyFormat('quote')}
					aria-label="Quote"
				>
					<Quote class="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					onclick={() => applyFormat('code')}
					aria-label="Code"
				>
					<Code class="size-4" />
				</Button>
			</div>
		</div>

		{#if mentionPopoverOpen}
			<div
				class="absolute z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white shadow-sm"
				style={`left:${mentionPosition.left}px; top:${mentionPosition.top}px;`}
			>
				<div class="p-1">
					{#if filteredMentionUsers.length === 0}
						<p class="px-2 py-1 text-xs text-gray-500">No users found</p>
					{:else}
						<ul class="max-h-48 overflow-auto" role="listbox">
							{#each filteredMentionUsers as user, index (user.id)}
								<li>
									<button
										type="button"
										class={cn(
											'flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-2 text-left text-xs hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:outline-none',
											index === mentionHighlightIndex ? 'bg-gray-100' : ''
										)}
										role="option"
										aria-selected={index === mentionHighlightIndex}
										onclick={() => selectMentionUser(user)}
										onmouseenter={() => (mentionHighlightIndex = index)}
									>
										<div class="flex items-center gap-1.5">
											<Avatar class="size-4 border border-gray-200">
												<AvatarImage src={user.avatar} />
												<AvatarFallback class="text-[10px]"
													>{user.firstname.slice(0, 1).toUpperCase()}{user.lastname
														.slice(0, 1)
														.toUpperCase()}</AvatarFallback
												>
											</Avatar>
											<span class="text-xs">{user.firstname} {user.lastname}</span>
										</div>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{/if}

		<div
			class={cn(
				'rich-comment-editor max-h-[300px] min-h-[120px] w-full overflow-y-auto rounded-b-md border border-gray-200 bg-white px-3 py-2 text-sm leading-6 break-word whitespace-pre-line outline-none focus-visible:border-gray-300',
				className
			)}
			contenteditable="true"
			role="textbox"
			tabindex={0}
			aria-label="Add a comment"
			{@attach attachEditor}
			oninput={handleInput}
			onkeydown={handleKeyDown}
			onkeyup={handleEditorKeyUp}
			onmouseup={() => {
				refreshToolbarState();
				handleMentionDetection();
			}}
			onblur={handleBlur}
			spellcheck="true"
		></div>
		<div class="mt-2 flex items-center justify-between gap-2">
			{#if showVisibleToReporterCheckbox}
				<div class="flex items-center gap-3">
					<Checkbox
						id="visible-to-everyone"
						class="border-gray-400"
						bind:checked={visibleToReporter}
					/>
					<Label for="visible-to-everyone" class="text-sm font-normal text-gray-500"
						>Visible to reporter</Label
					>
				</div>
			{/if}
			{#if showSubmitButton}
				<div class="ml-auto">
					<Button variant="secondary" size="sm" disabled={isCommentEmpty} onclick={submitComment}>
						<SendIcon class="size-4" />
						Send
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.rich-comment-editor:empty:before {
		content: attr(data-placeholder);
		color: #9ca3af;
		pointer-events: none;
	}
</style>
