# Stack Guesser
A sample React Native app (in TypeScript) that uses the [StackOverflow API](https://api.stackexchange.com/docs).

The app displays a list of questions from StackOverflow and allows the user to view all the submitted answers and try to pick the correct/accepted answer.

The list of questions is searchable, but is limited to React Native (tagged) questions and only questions that have more than 1 submitted answer (can't guess if there is only 1 answer) and have an accepted answer (can't be right or wrong if there is no accepted answer).

The answers for a question are displayed in a random order every time the question is viewed.

The StackExchange API has rate limiting and will throttle usage by IP.

## Development
**Requirements:** Setup a [React Native development environment](https://reactnative.dev/docs/getting-startedc) and have an emulator running, or device connected.  
```
npx react-native run-android
```

## Build
Follow steps for [setting up and building a React Native Android application](https://reactnative.dev/docs/signed-apk-android).

Run build:
```
cd android
./gradlew bundleRelease
```

To extract an APK from the AAB, use [bundletool](https://developer.android.com/studio/command-line/bundletool)


```
// individual specific APKs
java -jar bundletool-all-0.13.3.jar build-apks --bundle="build\outputs\bundle\release\app-release.aab" --output=stackguesser.apks

// or unviersal APK
java -jar bundletool-all-0.13.3.jar build-apks --bundle="build\outputs\bundle\release\app-release.aab" --mode=universal --output=stackguesser.apks 
```

This creates an .apks file, which can be opened like a zip file to extract individual .apk files.
