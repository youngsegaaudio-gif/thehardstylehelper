#!/bin/bash
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
APP_NAME="Hardstyle Helper"
HTML=""

for c in \
  "$HERE/HELPER.html" \
  "$HERE/../HELPER.html" \
  "$HOME/Downloads/HARDSTYLE-HELPER 2/HELPER.html" \
  "$HOME/Downloads/HARDSTYLE-HELPER/HELPER.html" \
  "$HERE/../artifacts/HELPER.html"
do
  if [ -f "$c" ]; then HTML="$c"; break; fi
done

if [ -z "$HTML" ]; then
  osascript -e 'display dialog "HELPER.html not found. Put INSTALL.command in the same folder as HELPER.html and run it again." buttons {"OK"} default button 1 with title "Hardstyle Helper"' >/dev/null 2>&1 || true
  echo "HELPER.html not found."
  exit 1
fi

build_app() {
  local DEST="$1"
  rm -rf "$DEST"
  mkdir -p "$DEST/Contents/MacOS" "$DEST/Contents/Resources"
  cp "$HTML" "$DEST/Contents/Resources/HELPER.html"
  cat > "$DEST/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>CFBundleName</key><string>Hardstyle Helper</string>
  <key>CFBundleDisplayName</key><string>Hardstyle Helper</string>
  <key>CFBundleIdentifier</key><string>audio.hardstyle.helper</string>
  <key>CFBundleVersion</key><string>2</string>
  <key>CFBundleShortVersionString</key><string>2.0</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleExecutable</key><string>HardstyleHelper</string>
  <key>LSMinimumSystemVersion</key><string>12.0</string>
  <key>NSHighResolutionCapable</key><true/>
  <key>LSApplicationCategoryType</key><string>public.app-category.music</string>
</dict></plist>
PLIST
  cat > "$DEST/Contents/MacOS/HardstyleHelper" <<'RUN'
#!/bin/bash
DIR="$(cd "$(dirname "$0")/../Resources" && pwd)"
HTML="$DIR/HELPER.html"
URL="$(python3 -c 'import pathlib,sys; print(pathlib.Path(sys.argv[1]).resolve().as_uri())' "$HTML")"
for B in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
do
  if [ -x "$B" ]; then
    exec "$B" --app="$URL" --user-data-dir="$HOME/Library/Application Support/HardstyleHelper"
  fi
done
open -a Safari "$HTML"
RUN
  chmod +x "$DEST/Contents/MacOS/HardstyleHelper"
  xattr -cr "$DEST" 2>/dev/null || true
}

mkdir -p "$HOME/Applications" "$HOME/Desktop"

USER_APP="$HOME/Applications/$APP_NAME.app"
DESK_APP="$HOME/Desktop/$APP_NAME.app"
SYS_APP="/Applications/$APP_NAME.app"

build_app "$USER_APP"
rm -rf "$DESK_APP"
cp -R "$USER_APP" "$DESK_APP"

if [ -w /Applications ] || mkdir -p /Applications 2>/dev/null; then
  rm -rf "$SYS_APP"
  if cp -R "$USER_APP" "$SYS_APP" 2>/dev/null; then
    xattr -cr "$SYS_APP" 2>/dev/null || true
  fi
fi

open "$DESK_APP" || open "$USER_APP" || true

osascript >/dev/null 2>&1 <<'OSA' || true
display dialog "Hardstyle Helper is installed.

Desktop + Applications

First time: right-click the app → Open
Drag it to the Dock if you want." buttons {"OK"} default button 1 with title "Hardstyle Helper"
OSA

echo "Installed:"
echo "  $DESK_APP"
echo "  $USER_APP"
[ -d "$SYS_APP" ] && echo "  $SYS_APP"
