function debounce<T extends unknown[]>(
    func: (...args: T) => void,
    wait: number
): (...args: T) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: T): void {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default debounce;