import { useState, useEffect, useRef } from "react";

/**
 * Custom hook that behaves like `useState` but allows passing a callback
 * that runs after the state has been updated.
 */
export function useStateWithCallback<T>(
	initialValue: T
): [T, (newValue: T, callback?: (state: T) => void) => void] {
	const [state, setState] = useState<T>(initialValue);
	const callbackRef = useRef<((state: T) => void) | null>(null);

	useEffect(() => {
		if (callbackRef.current) {
			callbackRef.current(state);
			callbackRef.current = null;
		}
	}, [state]);

	const setStateCallback = (newValue: T, callback?: (state: T) => void) => {
		if (callback) {
			callbackRef.current = callback;
		}
		setState(newValue);
	};

	return [state, setStateCallback];
}

