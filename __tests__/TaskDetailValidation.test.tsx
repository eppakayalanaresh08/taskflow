import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TaskDetailScreen } from '../src/screens/TaskDetailScreen';
import { useTaskStore } from '../src/store/taskStore';

describe('TaskDetailScreen Form Validation', () => {
  beforeEach(async () => {
    await ReactTestRenderer.act(async () => {
      useTaskStore.setState({
        tasks: [],
        selectedTaskId: null,
        isCreatingNewTask: true,
        activeScreen: 'detail',
      });
    });
  });

  it('displays validation error if user tries to save an empty task title', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<TaskDetailScreen />);
    });

    const root = renderer.root;

    // Find Save button by testID
    const saveButton = root.findByProps({ testID: 'save-task-button' });

    // Trigger save with empty title
    await ReactTestRenderer.act(async () => {
      saveButton.props.onPress();
    });

    // Verify error message is rendered
    const errorNode = root.findByProps({ testID: 'validation-error-text' });
    expect(errorNode).toBeTruthy();

    // Verify no task was created in store
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it('successfully creates task and closes screen when title is valid', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<TaskDetailScreen />);
    });

    const root = renderer.root;

    // Find task title TextInput by testID
    const titleInput = root.findByProps({ testID: 'task-title-input' });

    // Enter title
    await ReactTestRenderer.act(async () => {
      titleInput.props.onChangeText('Ship TaskFlow v1.0 Production');
    });

    // Find Save button and press it
    const saveButton = root.findByProps({ testID: 'save-task-button' });

    await ReactTestRenderer.act(async () => {
      saveButton.props.onPress();
    });

    // Verify task was added to store
    const currentTasks = useTaskStore.getState().tasks;
    expect(currentTasks).toHaveLength(1);
    expect(currentTasks[0].title).toBe('Ship TaskFlow v1.0 Production');
    expect(currentTasks[0].isLocal).toBe(true);

    // Verify screen transitioned back to 'list'
    expect(useTaskStore.getState().activeScreen).toBe('list');
  });

  it('opens date picker when tapping date button and time picker when tapping time button', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<TaskDetailScreen />);
    });

    const root = renderer.root;

    // Find date and time buttons
    const dateFromBtn = root.findByProps({ testID: 'due-date-from-btn' });
    const timeFromBtn = root.findByProps({ testID: 'due-time-from-btn' });

    expect(dateFromBtn).toBeTruthy();
    expect(timeFromBtn).toBeTruthy();

    // Tap Date button
    await ReactTestRenderer.act(async () => {
      dateFromBtn.props.onPress();
    });

    // Verify native picker is mounted for date
    let picker = root.findByProps({ testID: 'native-date-time-picker' });
    expect(picker.props.mode).toBe('date');

    // Simulate selecting a date
    await ReactTestRenderer.act(async () => {
      picker.props.onChange({ type: 'set' }, new Date(2025, 8, 15));
    });

    // Tap Time button
    await ReactTestRenderer.act(async () => {
      timeFromBtn.props.onPress();
    });

    // Verify native picker is mounted for time
    picker = root.findByProps({ testID: 'native-date-time-picker' });
    expect(picker.props.mode).toBe('time');
  });
});
