export function shortenUrl(url: string, length?: number) {
    length = length || 60;
    const off = (length * 5) / 12;
    return url.length > length
        ? url.slice(0, off) + "..." + url.slice(-off)
        : url;
}
