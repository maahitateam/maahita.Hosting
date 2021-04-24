## māhita - hosting
This solution contains the following static hosting site information.

1. home     - https://maahita.com
2. admin    - https://admin.maahita.com
3. privacy  - https://privacy.maahita.com

firebase.json and .firebaserc files have the configuration related to firebase hosting.

## Run the static app locally
<code>
    firebase serve --only hosting:home
    <--- home is the targetname, check firebase.json for more info--->
</code>

## Deploy the static app
<code>
    firebase deploy --only hosting:home
</code>