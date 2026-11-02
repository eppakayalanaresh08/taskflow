import {
  to12HourFormat,
  parseTimeString,
  formatTimeToString,
} from '../src/utils/nativePickerService';
import { useTaskStore } from '../src/store/taskStore';

describe('12-Hour Time Format and Normalization', () => {
  describe('to12HourFormat', () => {
    it('corrects malformed 24h PM strings', () => {
      expect(to12HourFormat('19:34 PM')).toBe('07:34 PM');
      expect(to12HourFormat('18:00 PM')).toBe('06:00 PM');
      expect(to12HourFormat('17:00 PM')).toBe('05:00 PM');
      expect(to12HourFormat('14:00 PM')).toBe('02:00 PM');
      expect(to12HourFormat('16:00 PM')).toBe('04:00 PM');
      expect(to12HourFormat('14:30 PM')).toBe('02:30 PM');
      expect(to12HourFormat('15:00 PM')).toBe('03:00 PM');
    });

    it('corrects standard 24h military time strings to 12h format', () => {
      expect(to12HourFormat('19:34')).toBe('07:34 PM');
      expect(to12HourFormat('13:15')).toBe('01:15 PM');
      expect(to12HourFormat('00:45')).toBe('12:45 AM');
      expect(to12HourFormat('09:30')).toBe('09:30 AM');
      expect(to12HourFormat('12:00')).toBe('12:00 PM');
    });

    it('preserves valid 12-hour AM/PM strings with proper padding', () => {
      expect(to12HourFormat('09:24 AM')).toBe('09:24 AM');
      expect(to12HourFormat('11:00 AM')).toBe('11:00 AM');
      expect(to12HourFormat('12:00 PM')).toBe('12:00 PM');
      expect(to12HourFormat('12:00 AM')).toBe('12:00 AM');
      expect(to12HourFormat('7:05 am')).toBe('07:05 AM');
    });

    it('provides fallback for empty or undefined input', () => {
      expect(to12HourFormat(undefined)).toBe('09:00 AM');
      expect(to12HourFormat('')).toBe('09:00 AM');
    });
  });

  describe('parseTimeString and formatTimeToString', () => {
    it('parses and formats 12-hour AM times', () => {
      const date = parseTimeString('09:24 AM');
      expect(date.getHours()).toBe(9);
      expect(date.getMinutes()).toBe(24);
      expect(formatTimeToString(date)).toBe('09:24 AM');
    });

    it('parses and formats 12-hour PM times', () => {
      const date = parseTimeString('07:34 PM');
      expect(date.getHours()).toBe(19);
      expect(date.getMinutes()).toBe(34);
      expect(formatTimeToString(date)).toBe('07:34 PM');
    });

    it('correctly handles noon (12:00 PM)', () => {
      const date = parseTimeString('12:00 PM');
      expect(date.getHours()).toBe(12);
      expect(date.getMinutes()).toBe(0);
      expect(formatTimeToString(date)).toBe('12:00 PM');
    });

    it('correctly handles midnight (12:00 AM)', () => {
      const date = parseTimeString('12:00 AM');
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(formatTimeToString(date)).toBe('12:00 AM');
    });

    it('handles legacy malformed "19:34 PM" string gracefully', () => {
      const date = parseTimeString('19:34 PM');
      expect(date.getHours()).toBe(19);
      expect(date.getMinutes()).toBe(34);
      expect(formatTimeToString(date)).toBe('07:34 PM');
    });
  });

  describe('TaskStore integration with 12-hour format', () => {
    it('creates a task with normalized 12-hour times even if passed 24h/malformed strings', () => {
      const task = useTaskStore.getState().createTask({
        title: 'Review Q4 projections',
        category: 'Work',
        priority: 'High',
        dueTimeFrom: '14:00 PM',
        dueTimeTo: '19:34 PM',
      });

      expect(task.dueTimeFrom).toBe('02:00 PM');
      expect(task.dueTimeTo).toBe('07:34 PM');
    });
  });
});

