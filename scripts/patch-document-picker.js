const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-document-picker',
  'android',
  'src',
  'main',
  'java',
  'com',
  'reactnativedocumentpicker',
  'RNDocumentPickerModule.java'
);

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  let modified = false;

  if (content.includes('import com.facebook.react.bridge.GuardedResultAsyncTask;') && !content.includes('// import com.facebook.react.bridge.GuardedResultAsyncTask;')) {
    content = content.replace(
      'import com.facebook.react.bridge.GuardedResultAsyncTask;',
      '// import com.facebook.react.bridge.GuardedResultAsyncTask;'
    );
    modified = true;
  }

  const oldTaskRegex = /private static class ProcessDataTask extends GuardedResultAsyncTask<ReadableArray> \{[\s\S]*?@Override\s+protected void onPostExecuteGuarded\(ReadableArray readableArray\) \{\s+promise\.resolve\(readableArray\);\s+\}/;

  const newTaskReplacement = `private static class ProcessDataTask {
    private final WeakReference<Context> weakContext;
    private final List<Uri> uris;
    private final String copyTo;
    private final Promise promise;

    protected ProcessDataTask(ReactContext reactContext, List<Uri> uris, String copyTo, Promise promise) {
      this.weakContext = new WeakReference<>(reactContext.getApplicationContext());
      this.uris = uris;
      this.copyTo = copyTo;
      this.promise = promise;
    }

    public void execute() {
      new Thread(new Runnable() {
        @Override
        public void run() {
          try {
            WritableArray results = Arguments.createArray();
            for (Uri uri : uris) {
              results.pushMap(getMetadata(uri));
            }
            promise.resolve(results);
          } catch (Exception e) {
            promise.reject(E_UNEXPECTED_EXCEPTION, e.getLocalizedMessage(), e);
          }
        }
      }).start();
    }`;

  if (oldTaskRegex.test(content)) {
    content = content.replace(oldTaskRegex, newTaskReplacement);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[TaskFlow] Successfully patched react-native-document-picker for React Native 0.78+ / 0.88+ compatibility.');
  } else {
    console.log('[TaskFlow] react-native-document-picker already patched.');
  }
}
