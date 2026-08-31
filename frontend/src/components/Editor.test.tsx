import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Editor from './Editor';
import * as monaco from 'monaco-editor';

jest.mock('monaco-editor', () => {
  const model = { dispose: jest.fn() };
  const editor = {
    dispose: jest.fn(),
    getModel: jest.fn().mockReturnValue(model),
    setModel: jest.fn(),
  };
  return {
    editor: {
      create: jest.fn().mockReturnValue(editor),
    },
    languages: {
      register: jest.fn(),
      registerCompletionItemProvider: jest.fn(),
    },
  };
});

describe('Editor', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('creates a Monaco editor on mount', () => {
    render(<Editor value="const x = 1;" language="rust" />);
    expect(monaco.editor.create).toHaveBeenCalledTimes(1);
  });

  it('disposes the editor and model on unmount', () => {
    const { unmount } = render(<Editor value="const x = 1;" language="rust" />);

    const createMock = monaco.editor.create as jest.Mock;
    const editorInstance = createMock.mock.results[0].value;

    expect(editorInstance.getModel).toHaveBeenCalled();
    const modelInstance = editorInstance.getModel();

    expect(editorInstance.dispose).not.toHaveBeenCalled();
    expect(modelInstance.dispose).not.toHaveBeenCalled();

    unmount();

    expect(editorInstance.dispose).toHaveBeenCalledTimes(1);
    expect(modelInstance.dispose).toHaveBeenCalledTimes(1);
  });
});