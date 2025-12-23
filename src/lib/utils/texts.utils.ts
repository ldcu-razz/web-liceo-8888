export function transformText(text: string): string {
	return text
		.replace(/[-_]/g, ' ')
		.split(/\s+/)
		.filter(word => word.length > 0)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}