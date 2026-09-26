export function  parseGreenCookie (value: string | undefined) {
    if (!value) return null;

    const parts = value.split(",").map((part) => part.trim());

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return null;
    }

    return {
        idInstance: parts[0],
        apiTokenInstance: parts[1],
    };
}
