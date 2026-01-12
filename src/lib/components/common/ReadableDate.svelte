<script lang="ts">
	interface Props {
		date: string | Date;
	}

	let { date }: Props = $props();

	function formatDate(inputDate: string | Date): string {
		const now = new Date();
		const past = new Date(inputDate);
		const diffInMs = now.getTime() - past.getTime();
		const diffInSeconds = Math.floor(diffInMs / 1000);
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);
		const diffInWeeks = Math.floor(diffInDays / 7);
		const diffInMonths = Math.floor(diffInDays / 30);

		if (diffInSeconds < 60) {
			if (diffInSeconds === 0) {
				return 'Just now';
			}
			return `${diffInSeconds} seconds ago`;
		} else if (diffInMinutes < 60) {
			return `${diffInMinutes} minutes ago`;
		} else if (diffInDays < 1) {
			return `${diffInHours} hours ago`;
		} else if (diffInDays < 7) {
			return `${diffInDays} days ago`;
		} else if (diffInWeeks < 4) {
			return `${diffInWeeks} weeks ago`;
		} else if (diffInMonths < 12) {
			return `${diffInMonths} months ago`;
		} else {
			// Format as "Dec 13, 2025 at 8:30 PM"
			const months = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec'
			];
			const month = months[past.getMonth()];
			const day = past.getDate();
			const year = past.getFullYear();
			let hours = past.getHours();
			const minutes = past.getMinutes().toString().padStart(2, '0');
			const ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12 || 12;

			return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
		}
	}

	let formattedDate = $derived(formatDate(date));
</script>

<span>{formattedDate}</span>
