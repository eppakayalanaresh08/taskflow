import { Platform, NativeModules } from 'react-native';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';

export function parseDateString(dateStr: string): Date {
  if (dateStr && dateStr.includes('/')) {
    const [y, m, d] = dateStr.split('/').map(v => parseInt(v, 10));
    if (y && m && d) {
      return new Date(y, m - 1, d);
    }
  }
  return new Date();
}

export function formatDateToString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

/**
 * Converts any time string into standard 12-hour format ('hh:mm AM/PM').
 * Handles 24h times ('19:34' -> '07:34 PM'), malformed values ('19:34 PM' -> '07:34 PM'),
 * and standard 12h times ('7:34 pm' -> '07:34 PM').
 */
export function to12HourFormat(timeStr?: string): string {
  if (!timeStr) return '09:00 AM';
  const isPM = timeStr.toUpperCase().includes('PM');
  const isAM = timeStr.toUpperCase().includes('AM');
  const clean = timeStr.replace(/AM|PM/gi, '').trim();
  const [hStr, mStr] = clean.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10) || 0;
  if (isNaN(h)) h = 9;

  let period: 'AM' | 'PM' = 'AM';

  if (isPM) {
    period = 'PM';
    if (h > 12) {
      h = h % 12 || 12;
    } else if (h === 0) {
      h = 12;
    }
  } else if (isAM) {
    period = 'AM';
    if (h > 12) {
      h = h % 12 || 12;
    } else if (h === 0) {
      h = 12;
    }
  } else {
    // 24-hour time without AM/PM indicator (e.g. "19:34", "14:00", "00:30")
    if (h >= 12) {
      period = 'PM';
      h = h % 12 || 12;
    } else {
      period = 'AM';
      if (h === 0) h = 12;
    }
  }

  const displayH = String(h).padStart(2, '0');
  const displayM = String(m).padStart(2, '0');
  return `${displayH}:${displayM} ${period}`;
}

export function parseTimeString(timeStr: string): Date {
  const d = new Date();
  if (timeStr) {
    const isPM = timeStr.toUpperCase().includes('PM');
    const isAM = timeStr.toUpperCase().includes('AM');
    const clean = timeStr.replace(/AM|PM/gi, '').trim();
    const [h, m] = clean.split(':').map(v => parseInt(v, 10));
    let hours = isNaN(h) ? 9 : h;
    let minutes = isNaN(m) ? 0 : m;

    if (hours > 12) {
      // 24h format (e.g. 19 or legacy 19:34 PM)
      hours = hours % 24;
    } else if (isPM) {
      if (hours < 12) hours += 12;
    } else if (isAM) {
      if (hours === 12) hours = 0;
    }

    d.setHours(hours);
    d.setMinutes(minutes);
    d.setSeconds(0);
    d.setMilliseconds(0);
  }
  return d;
}

export function formatTimeToString(date: Date): string {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');
  return `${displayHours}:${minutes} ${period}`;
}

/**
 * Checks whether native Android Date/Time picker module is registered in the native binary.
 */
export function hasNativeAndroidPickerSupport(): boolean {
  if (Platform.OS !== 'android') return false;
  const nm = NativeModules as any;
  return Boolean(
    nm && (nm.RNDatePicker || nm.RNTimePicker || nm.RNMaterialDatePicker || nm.RNMaterialTimePicker)
  );
}

/**
 * Opens native Android DatePicker or immediately calls fallback in-app modal.
 */
export function openNativeDatePicker(
  currentDateStr: string,
  onDateSelected: (newDateStr: string) => void,
  onFallback: () => void
) {
  if (Platform.OS === 'android' && hasNativeAndroidPickerSupport()) {
    try {
      if (DateTimePickerAndroid && typeof DateTimePickerAndroid.open === 'function') {
        let isHandled = false;
        DateTimePickerAndroid.open({
          value: parseDateString(currentDateStr),
          mode: 'date',
          display: 'default',
          onChange: (event: DateTimePickerEvent, selectedDate?: Date) => {
            isHandled = true;
            if (event.type === 'set' && selectedDate) {
              onDateSelected(formatDateToString(selectedDate));
            }
          },
          onError: (err: any) => {
            if (!isHandled) {
              isHandled = true;
              console.warn('Native DatePicker error, falling back to calendar modal:', err);
              onFallback();
            }
          },
        });
        return;
      }
    } catch (err) {
      console.warn('Native DateTimePickerAndroid sync exception, opening fallback:', err);
    }
  }

  // iOS or Fallback
  onFallback();
}

/**
 * Opens native Android TimePicker or immediately calls fallback in-app modal.
 */
export function openNativeTimePicker(
  currentTimeStr: string,
  onTimeSelected: (newTimeStr: string) => void,
  onFallback: () => void
) {
  if (Platform.OS === 'android' && hasNativeAndroidPickerSupport()) {
    try {
      if (DateTimePickerAndroid && typeof DateTimePickerAndroid.open === 'function') {
        let isHandled = false;
        DateTimePickerAndroid.open({
          value: parseTimeString(currentTimeStr),
          mode: 'time',
          is24Hour: false,
          display: 'default',
          onChange: (event: DateTimePickerEvent, selectedDate?: Date) => {
            isHandled = true;
            if (event.type === 'set' && selectedDate) {
              onTimeSelected(formatTimeToString(selectedDate));
            }
          },
          onError: (err: any) => {
            if (!isHandled) {
              isHandled = true;
              console.warn('Native TimePicker error, falling back to time modal:', err);
              onFallback();
            }
          },
        });
        return;
      }
    } catch (err) {
      console.warn('Native DateTimePickerAndroid sync exception, opening fallback:', err);
    }
  }

  // iOS or Fallback
  onFallback();
}
