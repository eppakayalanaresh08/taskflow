/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

import { AIAssistantScreen } from '../src/screens/PlaceholderTabs';
import { AIAssistantModal } from '../src/components/AIAssistantModal';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('renders AIAssistantScreen with clean input and generator correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<AIAssistantScreen />);
  });

  const root = renderer!.root;
  const headerNode = root.findByProps({ title: 'AI Assistant' });
  expect(headerNode).toBeTruthy();
  const inputNode = root.findByProps({ testID: 'ai-prompt-input' });
  expect(inputNode).toBeTruthy();
});

test('renders AIAssistantModal separately correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <AIAssistantModal visible={true} onClose={() => {}} />
    );
  });

  const root = renderer!.root;
  const titleNode = root.findByProps({ children: 'AI Task Breakdown' });
  expect(titleNode).toBeTruthy();
});
