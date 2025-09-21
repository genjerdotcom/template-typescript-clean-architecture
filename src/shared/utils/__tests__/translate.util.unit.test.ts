import { translateMessage } from '@app/shared/utils/translate.util';

describe('translateMessage', () => {
    const messages = {
        greeting: 'Hello, ${name}!',
        ageInfo: 'You are ${age} years old.',
        default: 'Default message.',
    };

    it('should replace variables in the message', () => {
        const result = translateMessage(messages, 'greeting', { name: 'John' });
        expect(result).toBe('Hello, John!');
    });

    it('should handle multiple variables in the message', () => {
        const result = translateMessage(messages, 'ageInfo', { age: 30 });
        expect(result).toBe('You are 30 years old.');
    });

    it('should return default message if key not found', () => {
        const result = translateMessage(messages, 'notExist');
        expect(result).toBe('Default message.');
    });

    it('should fallback to hardcoded message if key and default not found', () => {
        const result = translateMessage({}, 'unknown');
        expect(result).toBe('Validation failed');
    });

    it('should replace missing params with empty string', () => {
        const result = translateMessage(messages, 'greeting', {});
        expect(result).toBe('Hello, !');
    });

    it('should ignore extra parameters not used in the template', () => {
        const result = translateMessage(messages, 'greeting', { name: 'Alice', unused: 123 });
        expect(result).toBe('Hello, Alice!');
    });
});
