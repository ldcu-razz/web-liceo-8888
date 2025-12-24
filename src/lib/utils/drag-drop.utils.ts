export type DraggableOptions<T = unknown> = {
	data: T;
	onDragStart?: (data: T) => void;
	onDragEnd?: () => void;
};

export type DroppableOptions<T = unknown> = {
	onDrop?: (data: T, dropZoneId: string) => void;
	onDragOver?: () => void;
	onDragLeave?: () => void;
	dropZoneId: string;
};

/**
 * Action to make an element draggable
 * @param node - The HTML element to make draggable
 * @param options - Draggable configuration options
 */
export const draggable = <T = unknown>(node: HTMLElement, options: DraggableOptions<T>) => {
	let currentOptions = options;

	const handleDragStart = (e: DragEvent) => {
		if (!e.dataTransfer) return;

		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.dropEffect = 'move';

		// Store the data being dragged
		e.dataTransfer.setData('application/json', JSON.stringify(currentOptions.data));

		// Add visual feedback
		node.classList.add('dragging');
		node.style.opacity = '0.5';

		currentOptions.onDragStart?.(currentOptions.data);
	};

	const handleDragEnd = () => {
		// Remove visual feedback
		node.classList.remove('dragging');
		node.style.opacity = '1';

		currentOptions.onDragEnd?.();
	};

	// Make element draggable
	node.setAttribute('draggable', 'true');
	node.style.cursor = 'grab';

	// Add event listeners
	node.addEventListener('dragstart', handleDragStart);
	node.addEventListener('dragend', handleDragEnd);

	return {
		update(newOptions: DraggableOptions<T>) {
			currentOptions = newOptions;
		},
		destroy() {
			node.removeEventListener('dragstart', handleDragStart);
			node.removeEventListener('dragend', handleDragEnd);
			node.removeAttribute('draggable');
		}
	};
};

/**
 * Action to make an element a drop zone
 * @param node - The HTML element to make a drop zone
 * @param options - Droppable configuration options
 */
export const droppable = <T = unknown>(node: HTMLElement, options: DroppableOptions<T>) => {
	let currentOptions = options;
	let dragCounter = 0;

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		dragCounter++;

		if (dragCounter === 1) {
			node.classList.add('drag-over');
			currentOptions.onDragOver?.();
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		dragCounter--;

		if (dragCounter === 0) {
			node.classList.remove('drag-over');
			currentOptions.onDragLeave?.();
		}
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		dragCounter = 0;

		node.classList.remove('drag-over');

		if (!e.dataTransfer) return;

		try {
			const data = JSON.parse(e.dataTransfer.getData('application/json')) as T;
			currentOptions.onDrop?.(data, currentOptions.dropZoneId);
		} catch (error) {
			console.error('Error parsing drag data:', error);
		}
	};

	// Add event listeners
	node.addEventListener('dragenter', handleDragEnter);
	node.addEventListener('dragover', handleDragOver);
	node.addEventListener('dragleave', handleDragLeave);
	node.addEventListener('drop', handleDrop);

	return {
		update(newOptions: DroppableOptions<T>) {
			currentOptions = newOptions;
		},
		destroy() {
			node.removeEventListener('dragenter', handleDragEnter);
			node.removeEventListener('dragover', handleDragOver);
			node.removeEventListener('dragleave', handleDragLeave);
			node.removeEventListener('drop', handleDrop);
		}
	};
};

