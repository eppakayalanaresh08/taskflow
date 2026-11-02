import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TaskCard } from '../src/components/TaskCard';
import { Task } from '../src/types/task';

describe('TaskCard Component', () => {
  const mockTask: Task = {
    id: 101,
    title: 'Review Q2 marketing plan',
    completed: false,
    category: 'Work',
    priority: 'High',
    estimatedTime: '15m',
    subtasks: [
      { id: 'st_1', title: 'Check conversion metrics', completed: true },
      { id: 'st_2', title: 'Prepare slide deck', completed: false },
    ],
    attachments: [],
    createdAt: '2025-09-02T10:00:00Z',
    updatedAt: '2025-09-02T10:00:00Z',
  };

  it('renders task title, category, and estimated time badge correctly', () => {
    const handlePress = jest.fn();
    const handleToggle = jest.fn();

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TaskCard
          task={mockTask}
          onPress={handlePress}
          onToggleStatus={handleToggle}
        />
      );
    });

    const root = renderer!.root;
    // Verify title text exists
    const titleNode = root.findByProps({ children: 'Review Q2 marketing plan' });
    expect(titleNode).toBeTruthy();

    // Verify time badge text exists
    const timeNode = root.findByProps({ children: '15m' });
    expect(timeNode).toBeTruthy();

    // Verify subtask count text exists
    const subtaskNode = root.findByProps({ children: ' • 1/2' });
    expect(subtaskNode).toBeTruthy();
  });

  it('calls onToggleStatus when the checkbox is pressed', () => {
    const handlePress = jest.fn();
    const handleToggle = jest.fn();

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TaskCard
          task={mockTask}
          onPress={handlePress}
          onToggleStatus={handleToggle}
        />
      );
    });

    const root = renderer!.root;
    // Find checkbox TouchableOpacity
    const checkbox = root.findByProps({
      accessibilityRole: 'checkbox',
    });

    ReactTestRenderer.act(() => {
      checkbox.props.onPress();
    });

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(101);
  });

  it('calls onPress when the card body is pressed', () => {
    const handlePress = jest.fn();
    const handleToggle = jest.fn();

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TaskCard
          task={mockTask}
          onPress={handlePress}
          onToggleStatus={handleToggle}
        />
      );
    });

    const root = renderer!.root;
    // Card main TouchableOpacity
    const cardButton = root.findByProps({
      accessibilityRole: 'button',
    });

    ReactTestRenderer.act(() => {
      cardButton.props.onPress();
    });

    expect(handlePress).toHaveBeenCalledTimes(1);
    expect(handlePress).toHaveBeenCalledWith(101);
  });

  it('renders checkmark when task is completed', () => {
    const completedTask: Task = {
      ...mockTask,
      completed: true,
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TaskCard
          task={completedTask}
          onPress={jest.fn()}
          onToggleStatus={jest.fn()}
        />
      );
    });

    const root = renderer!.root;
    const checkmark = root.findByProps({ name: 'check' });
    expect(checkmark).toBeTruthy();
  });
});
