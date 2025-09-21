import en from '@app/shared/constants/messages/errors/en';
import id from '@app/shared/constants/messages/errors/id';

const messageSources: Record<string, Record<string, string>> = { en, id };
export function messages(lang: string): Record<string, string> {
    return messageSources[lang] || messageSources['en'];
}