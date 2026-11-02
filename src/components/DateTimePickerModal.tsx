import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors, borderRadius } from '../theme';
import { Icon } from './Icon';

interface DateTimePickerModalProps {
  visible: boolean;
  mode: 'date' | 'time';
  initialValue: string; // e.g. '2025/09/02' or '09:24 AM'
  onConfirm: (value: string) => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
  visible,
  mode,
  initialValue,
  onConfirm,
  onClose,
}) => {
  // Parse initial date
  const parseInitialDate = () => {
    if (mode === 'date' && initialValue && initialValue.includes('/')) {
      const parts = initialValue.split('/');
      return {
        year: parseInt(parts[0], 10) || 2025,
        month: (parseInt(parts[1], 10) || 9) - 1, // 0-indexed
        day: parseInt(parts[2], 10) || 2,
      };
    }
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };
  };

  // Parse initial time
  const parseInitialTime = () => {
    if (mode === 'time' && initialValue) {
      const isPM = initialValue.toUpperCase().includes('PM');
      const clean = initialValue.replace(/AM|PM/gi, '').trim();
      const [h, m] = clean.split(':');
      let hourNum = parseInt(h, 10);
      if (isNaN(hourNum)) hourNum = 9;
      let period: 'AM' | 'PM' = isPM ? 'PM' : 'AM';
      if (hourNum > 12) {
        hourNum = hourNum % 12 || 12;
        period = 'PM';
      } else if (hourNum === 0) {
        hourNum = 12;
        period = 'AM';
      }
      return {
        hour: String(hourNum).padStart(2, '0'),
        minute: m ? m.padStart(2, '0') : '24',
        period,
      };
    }
    return {
      hour: '09',
      minute: '24',
      period: 'AM' as 'AM' | 'PM',
    };
  };

  const initialD = parseInitialDate();
  const initialT = parseInitialTime();

  // Date State
  const [currentYear, setCurrentYear] = useState(initialD.year);
  const [currentMonth, setCurrentMonth] = useState(initialD.month);
  const [selectedDay, setSelectedDay] = useState(initialD.day);

  // Time State
  const [selectedHour, setSelectedHour] = useState(initialT.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialT.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(initialT.period);

  // Synchronize state when modal becomes visible or value changes
  useEffect(() => {
    if (visible) {
      if (mode === 'date') {
        const d = parseInitialDate();
        setCurrentYear(d.year);
        setCurrentMonth(d.month);
        setSelectedDay(d.day);
      } else {
        const t = parseInitialTime();
        setSelectedHour(t.hour);
        setSelectedMinute(t.minute);
        setSelectedPeriod(t.period);
      }
    }
  }, [visible, initialValue, mode]);

  // Calculate days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // First day of month offset
  const getFirstDayOffset = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleConfirmDate = () => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(selectedDay).padStart(2, '0');
    onConfirm(`${currentYear}/${formattedMonth}/${formattedDay}`);
    onClose();
  };

  const handleConfirmTime = () => {
    onConfirm(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
    onClose();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startOffset = getFirstDayOffset(currentYear, currentMonth);

  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const baseMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const minutesList = Array.from(new Set([...baseMinutes, selectedMinute])).sort();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogContainer}>
              {mode === 'date' ? (
                /* Interactive Date Calendar Picker */
                <View style={styles.pickerContent}>
                  {/* Header: Month and Year navigation */}
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity
                      onPress={handlePrevMonth}
                      style={styles.navArrowBtn}
                    >
                      <Icon name="back" size={16} color="#334155" />
                    </TouchableOpacity>

                    <Text style={styles.monthYearTitle}>
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </Text>

                    <TouchableOpacity
                      onPress={handleNextMonth}
                      style={styles.navArrowBtn}
                    >
                      <View style={{ transform: [{ rotate: '180deg' }] }}>
                        <Icon name="back" size={16} color="#334155" />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Day of Week Headers */}
                  <View style={styles.weekDaysRow}>
                    {DAYS_OF_WEEK.map((d, i) => (
                      <Text key={i} style={styles.weekDayText}>
                        {d}
                      </Text>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View style={styles.daysGrid}>
                    {/* Empty offset spaces */}
                    {Array.from({ length: startOffset }).map((_, i) => (
                      <View key={`empty_${i}`} style={styles.dayCell} />
                    ))}

                    {/* Day numbers */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNumber = i + 1;
                      const isSelected = dayNumber === selectedDay;
                      return (
                        <TouchableOpacity
                          key={`day_${dayNumber}`}
                          style={[
                            styles.dayCell,
                            isSelected && styles.dayCellSelected,
                          ]}
                          onPress={() => setSelectedDay(dayNumber)}
                        >
                          <Text
                            style={[
                              styles.dayNumberText,
                              isSelected && styles.dayNumberTextSelected,
                            ]}
                          >
                            {dayNumber}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={onClose}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmBtn}
                      onPress={handleConfirmDate}
                    >
                      <Text style={styles.confirmBtnText}>Set Date</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* Interactive Time Picker */
                <View style={styles.pickerContent}>
                  <Text style={styles.timePickerTitle}>Select Time</Text>

                  {/* Time Display */}
                  <View style={styles.timePreviewBox}>
                    <Text style={styles.timePreviewText}>
                      {selectedHour}:{selectedMinute} {selectedPeriod}
                    </Text>
                  </View>

                  {/* Period Toggle (AM / PM) */}
                  <View style={styles.periodRow}>
                    <TouchableOpacity
                      style={[
                        styles.periodBtn,
                        selectedPeriod === 'AM' && styles.periodBtnActive,
                      ]}
                      onPress={() => setSelectedPeriod('AM')}
                    >
                      <Text
                        style={[
                          styles.periodBtnText,
                          selectedPeriod === 'AM' && styles.periodBtnTextActive,
                        ]}
                      >
                        AM
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.periodBtn,
                        selectedPeriod === 'PM' && styles.periodBtnActive,
                      ]}
                      onPress={() => setSelectedPeriod('PM')}
                    >
                      <Text
                        style={[
                          styles.periodBtnText,
                          selectedPeriod === 'PM' && styles.periodBtnTextActive,
                        ]}
                      >
                        PM
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Hour Selection Chips */}
                  <Text style={styles.timeSubHeading}>Hour</Text>
                  <View style={styles.chipsWrap}>
                    {hoursList.map(h => {
                      const isSelected = selectedHour === h;
                      return (
                        <TouchableOpacity
                          key={h}
                          style={[
                            styles.timeChip,
                            isSelected && styles.timeChipActive,
                          ]}
                          onPress={() => setSelectedHour(h)}
                        >
                          <Text
                            style={[
                              styles.timeChipText,
                              isSelected && styles.timeChipTextActive,
                            ]}
                          >
                            {h}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Minute Selection Chips */}
                  <Text style={styles.timeSubHeading}>Minute</Text>
                  <View style={styles.chipsWrap}>
                    {minutesList.map(m => {
                      const isSelected = selectedMinute === m;
                      return (
                        <TouchableOpacity
                          key={m}
                          style={[
                            styles.timeChip,
                            isSelected && styles.timeChipActive,
                          ]}
                          onPress={() => setSelectedMinute(m)}
                        >
                          <Text
                            style={[
                              styles.timeChipText,
                              isSelected && styles.timeChipTextActive,
                            ]}
                          >
                            {m}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={onClose}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmBtn}
                      onPress={handleConfirmTime}
                    >
                      <Text style={styles.confirmBtnText}>Set Time</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    padding: 20,
  },
  pickerContent: {
    width: '100%',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthYearTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  navArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 6,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: '#2563EB',
  },
  dayNumberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  dayNumberTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 12,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: borderRadius.pill,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timePickerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  timePreviewBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  timePreviewText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 1,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  periodBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  periodBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  periodBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timeSubHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  timeChip: {
    width: 44,
    height: 32,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  timeChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  timeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

