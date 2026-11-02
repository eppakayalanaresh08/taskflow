import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export type IconName =
  | 'search'
  | 'sort'
  | 'check'
  | 'circle'
  | 'checked-circle'
  | 'work'
  | 'personal'
  | 'study'
  | 'health'
  | 'clock'
  | 'fire'
  | 'leaf'
  | 'sparkle'
  | 'back'
  | 'plus'
  | 'calendar'
  | 'pdf'
  | 'doc'
  | 'video'
  | 'image'
  | 'camera'
  | 'trash'
  | 'close'
  | 'chevron-down'
  | 'tab-today'
  | 'tab-tasks'
  | 'tab-plan'
  | 'tab-focus'
  | 'tab-settings'
  | 'refresh'
  | 'warning'
  | 'tag';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = '#1E293B',
  style,
}) => {
  const containerStyle = [styles.iconBox, { width: size, height: size }, style];

  switch (name) {
    case 'search':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.searchCircle,
              {
                width: size * 0.65,
                height: size * 0.65,
                borderRadius: size * 0.35,
                borderColor: color,
                borderWidth: 1.8,
              },
            ]}
          />
          <View
            style={[
              styles.searchHandle,
              {
                width: size * 0.35,
                height: 2,
                backgroundColor: color,
                bottom: 1,
                right: 0,
              },
            ]}
          />
        </View>
      );

    case 'sort':
      return (
        <View style={[containerStyle, styles.sortContainer]}>
          {/* Up arrow */}
          <View style={styles.arrowColumn}>
            <View
              style={[
                styles.arrowUpHead,
                { borderBottomColor: color, borderLeftWidth: 3, borderRightWidth: 3, borderBottomWidth: 4 },
              ]}
            />
            <View style={[styles.arrowStem, { width: 1.8, height: size * 0.45, backgroundColor: color }]} />
          </View>
          {/* Down arrow */}
          <View style={styles.arrowColumn}>
            <View style={[styles.arrowStem, { width: 1.8, height: size * 0.45, backgroundColor: color }]} />
            <View
              style={[
                styles.arrowDownHead,
                { borderTopColor: color, borderLeftWidth: 3, borderRightWidth: 3, borderTopWidth: 4 },
              ]}
            />
          </View>
        </View>
      );

    case 'check':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.checkVector,
              {
                width: size * 0.42,
                height: size * 0.72,
                borderBottomColor: color,
                borderRightColor: color,
                borderBottomWidth: 2.2,
                borderRightWidth: 2.2,
                marginBottom: size * 0.12,
              },
            ]}
          />
        </View>
      );

    case 'circle':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.circleRing,
              {
                width: size * 0.85,
                height: size * 0.85,
                borderRadius: size * 0.45,
                borderColor: color,
                borderWidth: 1.8,
              },
            ]}
          />
        </View>
      );

    case 'checked-circle':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.circleRing,
              {
                width: size * 0.9,
                height: size * 0.9,
                borderRadius: size * 0.45,
                backgroundColor: color,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <View
              style={[
                styles.checkVector,
                {
                  width: size * 0.35,
                  height: size * 0.6,
                  borderBottomColor: '#FFFFFF',
                  borderRightColor: '#FFFFFF',
                  borderBottomWidth: 2,
                  borderRightWidth: 2,
                  marginBottom: 1,
                },
              ]}
            />
          </View>
        </View>
      );

    case 'work':
      return (
        <View style={containerStyle}>
          {/* Briefcase Handle */}
          <View
            style={[
              styles.briefcaseHandle,
              {
                width: size * 0.42,
                height: size * 0.22,
                borderTopColor: color,
                borderLeftColor: color,
                borderRightColor: color,
                borderWidth: 1.6,
                borderBottomWidth: 0,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              },
            ]}
          />
          {/* Briefcase Body */}
          <View
            style={[
              styles.briefcaseBody,
              {
                width: size * 0.9,
                height: size * 0.62,
                borderRadius: 3,
                borderColor: color,
                borderWidth: 1.8,
                alignItems: 'center',
              },
            ]}
          >
            {/* Latch */}
            <View style={[styles.briefcaseLatch, { backgroundColor: color }]} />
          </View>
        </View>
      );

    case 'personal':
      return (
        <View style={[containerStyle, styles.personalContainer]}>
          {/* User Head */}
          <View
            style={[
              styles.userHead,
              {
                width: size * 0.44,
                height: size * 0.44,
                borderRadius: size * 0.22,
                backgroundColor: color,
                marginBottom: 2,
              },
            ]}
          />
          {/* User Body */}
          <View
            style={[
              styles.userBody,
              {
                width: size * 0.82,
                height: size * 0.38,
                borderTopLeftRadius: size * 0.4,
                borderTopRightRadius: size * 0.4,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      );

    case 'study':
      return (
        <View style={[containerStyle, styles.studyContainer]}>
          <View style={[styles.bookPage, { borderColor: color }]} />
          <View style={[styles.bookSpine, { backgroundColor: color }]} />
          <View style={[styles.bookPage, { borderColor: color }]} />
        </View>
      );

    case 'plus':
      return (
        <View style={containerStyle}>
          <View style={[styles.plusHorizontal, { width: size * 0.75, height: 2, backgroundColor: color }]} />
          <View style={[styles.plusVertical, { width: 2, height: size * 0.75, backgroundColor: color }]} />
        </View>
      );

    case 'close':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.crossBar,
              { width: size * 0.7, height: 2, backgroundColor: color, transform: [{ rotate: '45deg' }] },
            ]}
          />
          <View
            style={[
              styles.crossBar,
              { width: size * 0.7, height: 2, backgroundColor: color, transform: [{ rotate: '-45deg' }] },
            ]}
          />
        </View>
      );

    case 'back':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.backChevron,
              {
                width: size * 0.45,
                height: size * 0.45,
                borderLeftColor: color,
                borderTopColor: color,
                borderLeftWidth: 2.2,
                borderTopWidth: 2.2,
                marginLeft: 2,
              },
            ]}
          />
        </View>
      );

    case 'chevron-down':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.chevronDownVector,
              {
                width: size * 0.45,
                height: size * 0.45,
                borderBottomColor: color,
                borderRightColor: color,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                marginTop: -2,
              },
            ]}
          />
        </View>
      );

    case 'sparkle':
      return (
        <View style={containerStyle}>
          <View style={[styles.sparkleDiamond, { width: size * 0.55, height: size * 0.55, backgroundColor: color }]} />
          <View
            style={[
              styles.sparkleDiamond,
              {
                width: size * 0.55,
                height: size * 0.55,
                backgroundColor: color,
                transform: [{ rotate: '45deg' }],
              },
            ]}
          />
        </View>
      );

    case 'clock':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.circleRing,
              {
                width: size * 0.85,
                height: size * 0.85,
                borderRadius: size * 0.45,
                borderColor: color,
                borderWidth: 1.8,
              },
            ]}
          >
            <View style={[styles.clockCenterDot, { backgroundColor: color }]} />
            <View style={[styles.clockMinuteHand, { height: size * 0.28, backgroundColor: color }]} />
            <View style={[styles.clockHourHand, { width: size * 0.22, backgroundColor: color }]} />
          </View>
        </View>
      );

    case 'trash':
      return (
        <View style={[containerStyle, styles.trashContainer]}>
          <View style={[styles.trashLid, { width: size * 0.8, height: 1.8, backgroundColor: color }]} />
          <View
            style={[
              styles.trashBody,
              {
                width: size * 0.65,
                height: size * 0.62,
                borderColor: color,
                borderWidth: 1.6,
                borderTopWidth: 0,
                borderBottomLeftRadius: 2.5,
                borderBottomRightRadius: 2.5,
              },
            ]}
          />
        </View>
      );

    case 'refresh':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.refreshCircle,
              {
                width: size * 0.75,
                height: size * 0.75,
                borderRadius: size * 0.38,
                borderTopColor: color,
                borderLeftColor: color,
                borderRightColor: color,
                borderBottomColor: 'transparent',
                borderWidth: 2,
              },
            ]}
          />
          <View
            style={[
              styles.refreshArrowHead,
              {
                borderLeftColor: color,
                borderTopWidth: 3,
                borderBottomWidth: 3,
                borderLeftWidth: 4,
              },
            ]}
          />
        </View>
      );

    case 'tab-today':
      return (
        <View style={containerStyle}>
          <View style={[styles.sparkleDiamond, { width: size * 0.5, height: size * 0.5, backgroundColor: color }]} />
          <View
            style={[
              styles.sparkleDiamond,
              {
                width: size * 0.5,
                height: size * 0.5,
                backgroundColor: color,
                transform: [{ rotate: '45deg' }],
              },
            ]}
          />
        </View>
      );

    case 'tab-tasks':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.clipboardOutline,
              {
                width: size * 0.75,
                height: size * 0.85,
                borderColor: color,
                borderWidth: 1.8,
                borderRadius: 2.5,
                padding: 2,
              },
            ]}
          >
            <View style={[styles.clipBar, { width: size * 0.4, height: 2, backgroundColor: color }]} />
            <View style={[styles.taskLine, { width: '80%', height: 1.6, backgroundColor: color, marginTop: 3 }]} />
            <View style={[styles.taskLine, { width: '60%', height: 1.6, backgroundColor: color, marginTop: 2 }]} />
          </View>
        </View>
      );

    case 'tab-plan':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.calendarBox,
              {
                width: size * 0.8,
                height: size * 0.8,
                borderColor: color,
                borderWidth: 1.8,
                borderRadius: 3,
              },
            ]}
          >
            <View style={[styles.calendarTopBar, { backgroundColor: color }]} />
            <View style={styles.calendarDotsRow}>
              <View style={[styles.calDot, { backgroundColor: color }]} />
              <View style={[styles.calDot, { backgroundColor: color }]} />
            </View>
          </View>
        </View>
      );

    case 'tab-focus':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.circleRing,
              {
                width: size * 0.85,
                height: size * 0.85,
                borderRadius: size * 0.45,
                borderColor: color,
                borderWidth: 1.8,
              },
            ]}
          >
            <View
              style={[
                styles.circleRing,
                {
                  width: size * 0.45,
                  height: size * 0.45,
                  borderRadius: size * 0.25,
                  borderColor: color,
                  borderWidth: 1.6,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
            </View>
          </View>
        </View>
      );

    case 'tab-settings':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.circleRing,
              {
                width: size * 0.8,
                height: size * 0.8,
                borderRadius: size * 0.4,
                borderWidth: 2.2,
                borderColor: color,
                borderStyle: 'dashed',
              },
            ]}
          >
            <View
              style={{
                width: size * 0.3,
                height: size * 0.3,
                borderRadius: size * 0.15,
                borderWidth: 1.6,
                borderColor: color,
              }}
            />
          </View>
        </View>
      );

    case 'camera':
    case 'image':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.cameraOutline,
              {
                width: size * 0.85,
                height: size * 0.65,
                borderColor: color,
                borderWidth: 1.8,
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <View
              style={{
                width: size * 0.35,
                height: size * 0.35,
                borderRadius: size * 0.18,
                borderWidth: 1.6,
                borderColor: color,
              }}
            />
          </View>
        </View>
      );

    case 'pdf':
    case 'doc':
      return (
        <View style={containerStyle}>
          <View
            style={[
              styles.docOutline,
              {
                width: size * 0.72,
                height: size * 0.9,
                borderColor: color,
                borderWidth: 1.8,
                borderRadius: 2,
                padding: 2,
              },
            ]}
          >
            <View style={{ width: '70%', height: 1.8, backgroundColor: color, marginTop: 2 }} />
            <View style={{ width: '85%', height: 1.8, backgroundColor: color, marginTop: 2 }} />
          </View>
        </View>
      );

    case 'warning':
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: size * 0.4,
              borderRightWidth: size * 0.4,
              borderBottomWidth: size * 0.8,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            }}
          />
        </View>
      );

    case 'fire':
    case 'leaf':
    case 'tag':
    default:
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.5,
              height: size * 0.5,
              borderRadius: size * 0.25,
              backgroundColor: color,
            }}
          />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  searchCircle: {
    position: 'absolute',
    top: 1,
    left: 1,
  },
  searchHandle: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
  },
  arrowColumn: {
    alignItems: 'center',
  },
  arrowUpHead: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowDownHead: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowStem: {
    borderRadius: 1,
  },
  checkVector: {
    transform: [{ rotate: '45deg' }],
  },
  circleRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  briefcaseHandle: {
    marginBottom: -1,
    zIndex: 1,
  },
  briefcaseBody: {
    backgroundColor: 'transparent',
  },
  briefcaseLatch: {
    width: 4,
    height: 2.5,
    borderRadius: 1,
    marginTop: -1,
  },
  personalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userHead: {},
  userBody: {},
  studyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookPage: {
    width: 7,
    height: 12,
    borderWidth: 1.6,
    borderRadius: 1,
  },
  bookSpine: {
    width: 2,
    height: 12,
  },
  plusHorizontal: {
    position: 'absolute',
    borderRadius: 1,
  },
  plusVertical: {
    position: 'absolute',
    borderRadius: 1,
  },
  crossBar: {
    position: 'absolute',
    borderRadius: 1,
  },
  backChevron: {
    transform: [{ rotate: '-45deg' }],
  },
  chevronDownVector: {
    transform: [{ rotate: '45deg' }],
  },
  sparkleDiamond: {
    position: 'absolute',
    borderRadius: 1.5,
  },
  clockCenterDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
  },
  clockMinuteHand: {
    width: 1.6,
    position: 'absolute',
    top: 2,
    borderRadius: 1,
  },
  clockHourHand: {
    height: 1.6,
    position: 'absolute',
    right: 2,
    borderRadius: 1,
  },
  trashContainer: {
    alignItems: 'center',
  },
  trashLid: {
    borderRadius: 1,
    marginBottom: 1,
  },
  trashBody: {},
  refreshCircle: {
    transform: [{ rotate: '45deg' }],
  },
  refreshArrowHead: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  clipboardOutline: {
    alignItems: 'center',
  },
  clipBar: {
    borderRadius: 1,
  },
  taskLine: {
    borderRadius: 1,
  },
  calendarBox: {
    overflow: 'hidden',
  },
  calendarTopBar: {
    width: '100%',
    height: 4,
  },
  calendarDotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 2,
  },
  calDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
  },
  cameraOutline: {},
  docOutline: {},
});
