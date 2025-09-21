export function translateMessage(
    source: Record<string, string>,
    key: string,
    params: Record<string, string | number> = {}
): string {
    const template = source[key] || source['default'] || 'Validation failed';
    return template.replace(/\$\{(\w+)\}/g, (_, k) => String(params[k] ?? ''));
}