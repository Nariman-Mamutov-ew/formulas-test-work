import { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { Tag } from '../client/getSuggestions';

const customComplitions =
  (tags: Array<Tag>) =>
  (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/\w*/);
    if (word) {
      if (word.from === word.to && !context.explicit) {
        return null;
      } else {
        return {
          from: word.from,
          options: [
            { label: 'SUM', type: 'function', apply: '[[SUM]]()' },
            { label: 'TEMP', type: 'function', apply: '[[TEMP]]{{x}}' },
            {
              label: 'SOME_CONSTANT',
              type: 'constant',
              apply: `[[SOME_CONSTANT]]`,
            },
            ...tags.map((item) => ({
              label: item.name,
              apply: `[[${item.name}]]`,
            })),
          ],
        };
      }
    } else {
      return null;
    }
  };

export { customComplitions };
