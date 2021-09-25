"# fast-it-delivery" 
Pour outrepasser le CORS POLICY de chrome lancer la commande pour MAc :
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security

--Step 1
ionic build
-- Step 2
ionic cap add ios
ionic cap add android
-- www
ionic cap copy
-- 
ionic cap sync

#Android Deployment
Capacitor Android apps are configured and managed through Android Studio.
Before running this app on an Android device, there's a couple of steps to complete.

First, run the Capacitor open command, which opens the native Android project in Android Studio:

ionic cap open android


-- Deploy to android
ionic capacitor add android
-- Build to android apk
ionic capacitor build android
-- Deploy to browser remote device
ionic capacitor run android --external -l
-- inspect device remote
chrome://inspect/#devices