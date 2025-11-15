export function SafeString(value: string | undefined | null, defaultValue: string): string {
    if (value != null && value != undefined) return value;
    return defaultValue;
}