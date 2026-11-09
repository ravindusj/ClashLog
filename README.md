# 🔨 Clash Log

**Clash of Clans upgrade timers as iPhone widgets.** Builders, heroes, Laboratory, Pet House, Builder Base and Star Lab, right on your Home Screen and Lock Screen. 📱

Built with [Scriptable](https://scriptable.app). No login, no account access, just the game's own village export. ✨

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
![Platform](https://img.shields.io/badge/platform-iOS-blue)
![Made with Scriptable](https://img.shields.io/badge/made%20with-Scriptable-orange)
[![Support me on Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20me-29abe0?logo=kofi&logoColor=white)](https://ko-fi.com/ravindulach)


<!-- 📸 Add your screenshots to an /images folder and keep these file names (or change the paths) -->
<p align="center">
  <img src="images/widgets.png" alt="Home Screen widgets" width="32%">
  <img src="images/dashboard.png" alt="Dashboard" width="32%">
  <img src="images/lockscreen.png" alt="Lock Screen widgets" width="32%">
</p>

---

## ✨ Features

- 🏠 **Home Screen widgets** in Small, Medium and Large
  - **Small** shows the next 3 upgrades to finish
  - **Medium** shows the soonest upgrades, with every section you pick included
  - **Large** shows everything, section by section
- 🔒 **Lock Screen widgets** (rectangle, circle and inline) with a progress ring and each section's soonest time
- 🏰 **Real game icons and names** for buildings, heroes, troops, spells and pets
- 🎨 **Progress bars that match each icon's colour**, plus a "Ready" badge with the Builder's Hut icon
- 👥 **Multiple accounts**, detected automatically from your player tag
- 🧩 **Choose what to show:** Builders, Heroes, Lab, Pet House, Builder Base and Star Lab
- 📊 **Clash-style dashboard** with live ticking timers, account tabs and confetti when something finishes 🎉
- 🔔 **Smart notifications**
  - 🌙 Quiet hours, with everything that finishes overnight bundled into one morning alert
  - 🧺 Grouped alerts when several upgrades finish close together
  - 📋 A reminder to copy a fresh export after an upgrade finishes
  - Long-press an alert for a rich view with icons, plus buttons to open Clash or snooze 15 min
- 🌗 **Two styles:** Modern dark or Clash wood

---

## 📲 Install

1. Install **[Scriptable](https://apps.apple.com/app/scriptable/id1405459188)** from the App Store (free).
2. Download **`Clash Log.js`** from this repo.
3. Save it to **Files → iCloud Drive → Scriptable**.
   *Or:* open Scriptable, tap **+**, name the script **Clash Log** and paste in the code.

## 🚀 First run

1. In Clash of Clans, go to **Settings → More Settings → Data Export → Copy**.
2. Open **Clash Log** in Scriptable. It imports your village automatically. ✅
3. Allow notifications when asked.

## 🧱 Add a widget

1. Long-press your Home Screen → **+** → search **Scriptable** → pick a size.
2. Long-press the widget → **Edit Widget** → set **Script** to **Clash Log**.
3. *(Optional)* set **When Interacting → Run Script** so tapping the widget opens the dashboard.

> 🔁 **Started a new upgrade?** Copy your export again and open Clash Log. The game only shares data when you tap **Copy**.

---

## ⚙️ Widget parameters

Long-press a widget → **Edit Widget** → **Parameter** to change what that widget shows. Leave it empty to use your menu settings.

| Parameter | What it shows |
|---|---|
| *(empty)* | Your default account and sections |
| `lab, pets` | Only the sections you list |
| `builders, heroes` | Builders and heroes only |
| `Mini` | A specific account (by name or tag) |
| `Mini: starlab` | A specific account and section |
| `accounts` | 👥 Overview of all your villages |
| `next` | 🔒 Lock Screen rectangle shows your next upgrades |

**Sections you can use:** `builders` · `heroes` · `lab` · `pets` · `bb` · `starlab` · `all`

---

## ❓ FAQ

**Where is the data export?**
In Clash of Clans: **Settings → More Settings → Data Export → Copy**.

**Why doesn't the widget update instantly?**
iOS decides when widgets refresh, usually every few minutes and sometimes up to about 15. Notifications are always on time, and the dashboard shows live timers. ⏱️

**Why doesn't it sync on its own?**
The game only shares your timers when you tap **Copy**. Clash Log never logs in to your account.

**Can I get banned for using this?**
Clash Log only reads the export that Supercell built into the game. It doesn't touch the game, log in, or automate anything.

**Is my data private?**
Yes. 🔐 Everything stays on your iPhone. The only internet use is downloading game icons, once, from a public CDN.

**Can I track more than one account?**
Yes. Copy the export from each account and open Clash Log, and each one is saved separately. Pick which one the widgets show from the dashboard or the **👥 Accounts** menu.

**Where's the Extra Large widget?**
Apple only offers Extra Large widgets on iPad.

**A building shows as "Unknown #1000xxx"?**
That's new game content that isn't in the data table yet. Timers still work.

**My builder count is wrong.**
Open Clash Log → **👥 Accounts** → choose the account → **🔨 Builder count** and set it manually.

---

## 🙏 Credits

- 📦 Game data and icons from **[clash-of-clans-data](https://github.com/chiefpansancolt/clash-of-clans-data)** by Christopher Pezza (MIT License)
- 🛠️ Built with **[Scriptable](https://scriptable.app)** by Simon B. Støvring

> ⚠️ This material is unofficial and is not endorsed by Supercell. For more information see Supercell's [Fan Content Policy](https://supercell.com/fan-content-policy).
> Clash of Clans and its game art are trademarks and copyright of Supercell.

---

## 📄 License

**Clash Log** © ravindusj, licensed under **[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)**.

✅ You can use, share and modify it, with credit to **ravindusj**.
🚫 You can't use it commercially (no selling or paywalls).

Included game data from clash-of-clans-data remains under its own MIT License.

---

## ☕ Support

Clash Log is completely free. If it saves you some builder time, you can buy me a coffee:

[![Support me on Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20me-29abe0?logo=kofi&logoColor=white)](https://ko-fi.com/ravindulach)

Made with ❤️ by **[ravindusj](https://github.com/ravindusj)**
