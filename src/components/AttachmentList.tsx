import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import { Attachment } from '../types/task';
import { borderRadius } from '../theme';
import { Icon } from './Icon';

interface AttachmentListProps {
  attachments: Attachment[];
  onAddAttachment: (attachment: Attachment) => void;
  onRemoveAttachment: (id: string) => void;
}

type ModalViewMode = 'sheet' | 'preview';

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const [activeModal, setActiveModal] = useState<ModalViewMode | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  // Request Android Camera Permission
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'TaskFlow needs camera access so you can take and attach photos to your tasks.',
          buttonPositive: 'Allow',
          buttonNegative: 'Cancel',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission request error:', err);
      return false;
    }
  };

  // Launch REAL Native Device Camera
  const handleLaunchRealCamera = async () => {
    setActiveModal(null);
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
        return;
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });

      if (result.didCancel) return;

      if (result.errorCode) {
        console.warn('Camera error:', result.errorMessage);
        Alert.alert('Camera Error', result.errorMessage || 'Unable to open camera.');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri) {
          const newAtt: Attachment = {
            id: `att_${Date.now()}`,
            name: asset.fileName || `camera_${Date.now()}.jpg`,
            type: 'image',
            uri: asset.uri,
            size: asset.fileSize ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB` : undefined,
          };
          onAddAttachment(newAtt);
        }
      }
    } catch (err: any) {
      console.warn('launchCamera error:', err);
      Alert.alert('Camera Error', err?.message || 'Could not launch camera.');
    }
  };

  // Launch REAL Native Device Photo Library / Gallery
  const handleLaunchRealGallery = async () => {
    setActiveModal(null);
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      if (result.errorCode) {
        console.warn('Gallery error:', result.errorMessage);
        Alert.alert('Gallery Error', result.errorMessage || 'Unable to open gallery.');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri) {
          const newAtt: Attachment = {
            id: `att_${Date.now()}`,
            name: asset.fileName || `photo_${Date.now()}.jpg`,
            type: 'image',
            uri: asset.uri,
            size: asset.fileSize ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB` : undefined,
          };
          onAddAttachment(newAtt);
        }
      }
    } catch (err: any) {
      console.warn('launchImageLibrary error:', err);
      Alert.alert('Gallery Error', err?.message || 'Could not launch gallery.');
    }
  };

  // Launch REAL Native Device Document & PDF Picker
  const handleLaunchRealDocumentPicker = async () => {
    setActiveModal(null);
    try {
      const res = await DocumentPicker.pick({
        type: [types.pdf, types.doc, types.docx, types.plainText, types.allFiles],
        copyTo: 'cachesDirectory',
      });

      if (res && res.length > 0) {
        const doc = res[0];
        const fileName = doc.name || 'document.pdf';
        const isPdf =
          doc.type === 'application/pdf' ||
          fileName.toLowerCase().endsWith('.pdf');

        const newAtt: Attachment = {
          id: `att_${Date.now()}`,
          name: fileName,
          type: isPdf ? 'pdf' : 'doc',
          uri: doc.fileCopyUri || doc.uri,
          size: doc.size ? `${(doc.size / (1024 * 1024)).toFixed(1)} MB` : undefined,
        };
        onAddAttachment(newAtt);
      }
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled without picking
        return;
      }
      console.warn('Document picker error:', err);
      Alert.alert('Document Error', 'Unable to open document picker.');
    }
  };

  // Open Document in device's default reader app (Google PDF Viewer, Acrobat, Drive)
  const handleOpenDocument = async (att: Attachment) => {
    if (!att.uri) {
      Alert.alert('Unavailable', 'This file has no local URI to open.');
      return;
    }

    try {
      await Linking.openURL(att.uri);
    } catch (err: any) {
      console.warn('Failed to open document URL:', err);
      Alert.alert(
        'Unable to Open',
        'Could not find an app on this device to open this document format.'
      );
    }
  };

  // Handle clicking an existing attachment
  const handlePressAttachment = (att: Attachment) => {
    setPreviewAttachment(att);
    setActiveModal('preview');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Attachments</Text>

      <View style={styles.attachmentsRow}>
        {attachments.map(att => {
          const isImg = att.type === 'image' && att.uri;
          return (
            <View key={att.id} style={styles.attachmentCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePressAttachment(att)}
                style={styles.iconBox}
                accessibilityLabel={`View attachment ${att.name}`}
              >
                {isImg ? (
                  <Image source={{ uri: att.uri }} style={styles.imageThumbnail} />
                ) : (
                  <View style={styles.docBoxInner}>
                    <Icon
                      name={att.type === 'pdf' ? 'pdf' : 'doc'}
                      size={24}
                      color={att.type === 'pdf' ? '#DC2626' : '#2563EB'}
                    />
                  </View>
                )}
              </TouchableOpacity>
              <Text numberOfLines={1} style={styles.attachmentName}>
                {att.name}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onRemoveAttachment(att.id)}
                style={styles.deleteBadge}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel={`Remove attachment ${att.name}`}
              >
                <Icon name="close" size={10} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Plus Button to open choices */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveModal('sheet')}
          style={styles.addAttachmentBtn}
          accessibilityLabel="Add attachment"
        >
          <Icon name="plus" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Modal Orchestrator */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType={activeModal === 'sheet' ? 'fade' : 'slide'}
        onRequestClose={() => setActiveModal(null)}
      >
        {/* VIEW 1: Main Action Sheet */}
        {activeModal === 'sheet' && (
          <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.sheetContent}>
                  <Text style={styles.sheetTitle}>Add Attachment</Text>

                  {/* Option: Real Native Device Camera */}
                  <TouchableOpacity
                    style={styles.sheetOption}
                    onPress={handleLaunchRealCamera}
                  >
                    <View style={[styles.optionIconPill, { backgroundColor: '#EFF6FF' }]}>
                      <Icon name="camera" size={22} color="#2563EB" />
                    </View>
                    <View style={styles.sheetOptionTextContainer}>
                      <Text style={styles.sheetOptionTitle}>Take Photo (Camera)</Text>
                      <Text style={styles.sheetOptionSub}>Open device camera to capture</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Option: Real Native Device Gallery */}
                  <TouchableOpacity
                    style={styles.sheetOption}
                    onPress={handleLaunchRealGallery}
                  >
                    <View style={[styles.optionIconPill, { backgroundColor: '#ECFDF5' }]}>
                      <Icon name="image" size={22} color="#059669" />
                    </View>
                    <View style={styles.sheetOptionTextContainer}>
                      <Text style={styles.sheetOptionTitle}>Choose from Gallery</Text>
                      <Text style={styles.sheetOptionSub}>Browse device photo library</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Option: REAL Native Device Document / PDF Picker */}
                  <TouchableOpacity
                    style={styles.sheetOption}
                    onPress={handleLaunchRealDocumentPicker}
                  >
                    <View style={[styles.optionIconPill, { backgroundColor: '#FEF2F2' }]}>
                      <Icon name="pdf" size={22} color="#DC2626" />
                    </View>
                    <View style={styles.sheetOptionTextContainer}>
                      <Text style={styles.sheetOptionTitle}>Attach Document (PDF)</Text>
                      <Text style={styles.sheetOptionSub}>Browse device files and PDF docs</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelSheetBtn}
                    onPress={() => setActiveModal(null)}
                  >
                    <Text style={styles.cancelSheetText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}

        {/* VIEW 2: Attachment Preview & Open Document Modal */}
        {activeModal === 'preview' && previewAttachment && (
          <View style={styles.fullPreviewBackdrop}>
            <TouchableOpacity
              style={styles.closePreviewBtn}
              onPress={() => {
                setActiveModal(null);
                setPreviewAttachment(null);
              }}
            >
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {previewAttachment.type === 'image' && previewAttachment.uri ? (
              <View style={styles.previewImageContainer}>
                <Image
                  source={{ uri: previewAttachment.uri }}
                  style={styles.fullPreviewImage}
                  resizeMode="contain"
                />
                <View style={styles.previewFooterBar}>
                  <Text style={styles.previewFooterName}>{previewAttachment.name}</Text>
                  {previewAttachment.size && (
                    <Text style={styles.previewFooterMeta}>{previewAttachment.size}</Text>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.docPreviewCard}>
                <View
                  style={[
                    styles.docLargeIconBox,
                    {
                      backgroundColor:
                        previewAttachment.type === 'pdf' ? '#FEE2E2' : '#EFF6FF',
                    },
                  ]}
                >
                  <Icon
                    name={previewAttachment.type === 'pdf' ? 'pdf' : 'doc'}
                    size={48}
                    color={previewAttachment.type === 'pdf' ? '#DC2626' : '#2563EB'}
                  />
                </View>
                <Text numberOfLines={2} style={styles.docPreviewTitle}>
                  {previewAttachment.name}
                </Text>
                <Text style={styles.docPreviewSub}>
                  {previewAttachment.type.toUpperCase()} File
                  {previewAttachment.size ? ` • ${previewAttachment.size}` : ''}
                </Text>

                {/* Open Document in Native PDF Viewer */}
                <TouchableOpacity
                  style={styles.openDocumentBtn}
                  onPress={() => handleOpenDocument(previewAttachment)}
                >
                  <Icon name="pdf" size={16} color="#FFFFFF" />
                  <Text style={styles.openDocumentBtnText}>Open Document</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.docActionBtn}
                  onPress={() => {
                    setActiveModal(null);
                    setPreviewAttachment(null);
                  }}
                >
                  <Text style={styles.docActionBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  attachmentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  attachmentCard: {
    width: 68,
    alignItems: 'center',
    position: 'relative',
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  imageThumbnail: {
    width: 54,
    height: 54,
  },
  docBoxInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentName: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
  },
  deleteBadge: {
    position: 'absolute',
    top: -4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAttachmentBtn: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheetContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  optionIconPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sheetOptionTextContainer: {
    flex: 1,
  },
  sheetOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  sheetOptionSub: {
    fontSize: 12,
    color: '#64748B',
  },
  cancelSheetBtn: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.pill,
  },
  cancelSheetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  fullPreviewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePreviewBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  previewImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullPreviewImage: {
    width: '90%',
    height: '75%',
  },
  previewFooterBar: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  previewFooterName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  previewFooterMeta: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  docPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '85%',
  },
  docLargeIconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  docPreviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  docPreviewSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 18,
  },
  openDocumentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
    marginBottom: 10,
    width: '100%',
    gap: 8,
  },
  openDocumentBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  docActionBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: borderRadius.pill,
    width: '100%',
    alignItems: 'center',
  },
  docActionBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});
