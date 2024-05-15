import {
  Decoration,
  DecorationSet,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@uiw/react-codemirror';

const wrapperClasses = [
  'relative',
  'box-border',
  'whitespace-nowrap',
  'rounded',
  'border',
  'border-solid',
  'font-medium',
  'bg-gray-900',
  'bg-opacity-10',
  'text-gray-900',
  'border-gray-300',
  'jss100',
  'px-1',
  'py-0.5',
  'rounded',
];

class MacroPlaceholderWidget extends WidgetType {
  value: string;
  constructor(value: string) {
    super();
    this.value = value;
  }

  toDOM(): HTMLElement {
    const placeholder = document.createElement('span');
    placeholder.classList.add(...wrapperClasses);
    placeholder.textContent = this.value;
    return placeholder;
  }
}

class InternalPlaceholderWidget extends WidgetType {
  value: string;
  functionValue: string;

  constructor(initValues: RegExpExecArray) {
    super();
    this.value = initValues[1];
    this.functionValue = initValues[2];
  }

  toDOM(view: EditorView): HTMLElement {
    const wrapper = document.createElement('span');
    wrapper.textContent = this.value;

    const input = document.createElement('input');
    const handler = document.createElement('span');
    const separator = document.createElement('span');

    separator.classList.add(
      'w-0.5',
      'mx-2',
	  'my-0',
      'inline-block',
      'h-4',
      'bg-gray-900',
      'bg-opacity-30',
      'jss29'
    );

    handler.addEventListener('click', (event) => {
      event.preventDefault();
      wrapper.removeChild(handler);
      wrapper.appendChild(input);
      input.focus();
    });

    handler.textContent = this.functionValue;

    input.classList.add('w-16');
    input.value = this.functionValue;

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const newValue = (event.target as HTMLInputElement).value || 'x';

        const selectionRange = view.state.selection.ranges[0];
        const transaction = view.state.update({
          changes: {
            from: selectionRange.from - (2 + this.functionValue.length),
            to: selectionRange.to - 2,
            insert: newValue,
          },
        });
        view.dispatch(transaction);
        this.functionValue = newValue;

        input.blur();
        wrapper.removeChild(input);
        wrapper.appendChild(handler);
      }
    });

    wrapper.appendChild(separator);
    wrapper.appendChild(handler);
    wrapper.classList.add(...wrapperClasses);
    return wrapper;
  }
}

const macroPlaceholderMatcher = new MatchDecorator({
  regexp: /\[\[(?![^[\]]+]]{{[^{}]*}})([\w\s]+)\]\]/g,
  decoration: (match: RegExpExecArray) =>
    Decoration.replace({
      widget: new MacroPlaceholderWidget(match[1]),
    }),
});

const internalPlaceholderMatcher = new MatchDecorator({
  regexp: /\[\[([^[\]]+)\]\]{{([^{}]*)}}/g,
  decoration: (match: RegExpExecArray) =>
    Decoration.replace({
      widget: new InternalPlaceholderWidget(match),
    }),
});

const withInternalPlaceholders = ViewPlugin.fromClass(
  class {
    internalPlaceholderMatcher: DecorationSet;
    constructor(view: EditorView) {
      this.internalPlaceholderMatcher =
        internalPlaceholderMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.internalPlaceholderMatcher = internalPlaceholderMatcher.updateDeco(
        update,
        this.internalPlaceholderMatcher
      );
    }
  },
  {
    decorations: (instance) => instance.internalPlaceholderMatcher,
    eventHandlers: {},
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        return (
          view.plugin(plugin)?.internalPlaceholderMatcher || Decoration.none
        );
      }),
  }
);

const macroPlaceholders = ViewPlugin.fromClass(
  class {
    macroPlaceholders: DecorationSet;
    constructor(view: EditorView) {
      this.macroPlaceholders = macroPlaceholderMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.macroPlaceholders = macroPlaceholderMatcher.updateDeco(
        update,
        this.macroPlaceholders
      );
    }
  },
  {
    decorations: (instance) => instance.macroPlaceholders,
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        return view.plugin(plugin)?.macroPlaceholders || Decoration.none;
      }),
  }
);

export { macroPlaceholders, withInternalPlaceholders };
