# دليل تثبيت مُرشِدي

## 📲 على جهاز Android حقيقي (للتجربة)

### الطريقة 1: نقل مباشر (الأسرع)

1. **انسخ ملف APK** على هاتفك:
   - عبر USB من الكمبيوتر إلى مجلّد `Download` على الهاتف
   - أو أرسله لنفسك عبر Telegram/WhatsApp/Email
   - أو ارفعه على Google Drive وحمّله من الهاتف

2. **افتح الإعدادات** → الأمان → السماح بتثبيت تطبيقات من مصادر غير معروفة
   - في Android 8+: اذهب إلى Settings → Apps → Special access → Install unknown apps → اختر متصفّح الملفات أو Chrome → فعّل "Allow from this source"

3. **افتح ملف APK** من تطبيق "الملفّات" أو "Downloads" واضغط "تثبيت"

4. **افتح "مُرشِدي"** من قائمة التطبيقات

---

### الطريقة 2: عبر ADB (للمطوّرين)

```bash
# 1. فعّل Developer Options + USB Debugging على الهاتف
# 2. وصّل الهاتف بالكمبيوتر عبر USB

adb install Murshidi-v1.0.0-release.apk

# للتثبيت فوق إصدار قديم
adb install -r Murshidi-v1.0.0-release.apk
```

---

## 🖥️ على محاكي Android Emulator

```bash
# شغّل محاكٍ من Android Studio أولاً
adb -s emulator-5554 install Murshidi-v1.0.0-release.apk
```

---

## ✅ التحقّق من التثبيت

بعد التثبيت بنجاح:
- ستظهر أيقونة **مُرشِدي** على الشاشة الرئيسيّة (شعار الكفّتين على خلفيّة كحليّة)
- اضغط الأيقونة → ستظهر شاشة Splash لمدّة ثانيتين → ثمّ شاشات التعريف الأربعة
- يمكن الضغط على "تخطّي" للوصول مباشرة إلى الصفحة الرئيسيّة

---

## ⚠️ في حال ظهور تحذيرات

### "Play Protect blocked this install"
- اضغط **"Install anyway"** — التطبيق آمن وموقّع رقمياً
- السبب: التطبيق غير منشور على Google Play بعد، فجوجل تحذّر من المصادر غير المعروفة

### "Unknown sources is disabled"
- اذهب إلى Settings → Security → فعّل "Install unknown apps" للتطبيق الذي تستخدمه (Chrome مثلاً)

### "App not installed"
- جرّب حذف نسخة قديمة من نفس التطبيق
- تأكّد من أنّ مساحة التخزين كافية (التطبيق يحتاج ~10MB بعد التثبيت)

---

## 🚀 الإلغاء

لإلغاء تثبيت التطبيق:
- اضغط مطوّلاً على أيقونة "مُرشِدي" → Uninstall
- أو من Settings → Apps → مُرشِدي → Uninstall

---

## 📊 متطلّبات التشغيل

| المكوّن | الحدّ الأدنى | المُوصى به |
|---|---|---|
| نظام التشغيل | Android 6.0 (Marshmallow) | Android 10+ |
| الذاكرة العشوائيّة | 1 GB RAM | 2 GB+ |
| التخزين | 15 MB | 50 MB |
| الإنترنت | غير مطلوب | اختياري (للتحديثات) |
| الشاشة | 320×480 | 360×640+ |

---

## 🛠️ تطبيقات اختُبِر عليها التطبيق

✅ Samsung Galaxy A52 (Android 12)
✅ Xiaomi Redmi Note 10 (Android 11)
✅ Honor 8X (Android 9)
✅ Pixel 5 (Android 14)
✅ Android Studio Emulator (API 30, 33, 34)

---

*للحصول على الدعم، راجع `README.md` في مجلّد التسليم.*
