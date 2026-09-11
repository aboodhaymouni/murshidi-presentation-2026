# التوثيق الفنّي — منصّة مُرشِدي

## 🏗️ البنية التحتيّة

### Stack تقني

| الطبقة | التقنيّة | الإصدار |
|---|---|---|
| **Frontend Framework** | React | 19.2.5 |
| **Build Tool** | Vite | 8.0.10 |
| **Language** | TypeScript | 6.0.2 |
| **Styling** | TailwindCSS | 3.4.19 |
| **Routing** | React Router DOM | 7.14.2 |
| **Icons** | Lucide React | 1.11.0 |
| **Charts** | Recharts | 3.8.1 |
| **Mobile Wrapper** | Capacitor | 8.3.1 |
| **Native Build** | Android Gradle Plugin | 8.x |
| **Min Android SDK** | API 23 (Android 6.0) |
| **Target Android SDK** | API 35 (Android 15) |

### حجم الـ Bundle

- HTML: 1.8 KB (gzip 0.8 KB)
- CSS: 20.2 KB (gzip 5.4 KB)
- JS: 780 KB (gzip 223 KB)
- إجمالي APK: 3.8 MB (release)

---

## 📁 هيكل المشروع

```
mizan/
├── android/                       # مشروع Android (Capacitor)
│   ├── app/
│   │   ├── build.gradle           # إعدادات البناء
│   │   └── src/main/res/          # الموارد الأصليّة
│   │       ├── mipmap-*/          # أيقونات التطبيق
│   │       ├── drawable/          # رسوميّات Splash
│   │       └── values/            # ألوان، أوتار، ستايلات
│   ├── murshidi-release.keystore     # مفتاح التوقيع الرقمي
│   └── gradlew                    # سكريبت البناء
├── public/
│   ├── favicon.svg                # شعار SVG
│   ├── icon-{192,512}.png         # أيقونات PWA
│   └── manifest.webmanifest       # PWA manifest
├── scripts/
│   ├── generate-icons.mjs         # توليد أيقونات Android
│   └── generate-splash.mjs        # توليد شاشة Splash
├── src/
│   ├── components/                # مكوّنات مشتركة
│   │   ├── BottomNav.tsx          # شريط التنقّل السفلي
│   │   ├── HashemiteEmblem.tsx    # شعار هاشمي SVG
│   │   ├── MurshidiLogo.tsx          # شعار مُرشِدي
│   │   ├── OfficialHeader.tsx     # ترويسة رسميّة
│   │   ├── PageHeader.tsx         # ترويسة الصفحات
│   │   └── SlideIllustration.tsx  # رسوم Splash
│   ├── data/
│   │   └── majors.ts              # بيانات التخصّصات والوظائف
│   ├── pages/                     # 13 شاشة كاملة
│   │   ├── Splash.tsx             # شاشة الترحيب
│   │   ├── Home.tsx               # الرئيسيّة
│   │   ├── ROICalculator.tsx      # حاسبة العائد
│   │   ├── Compare.tsx            # المقارنة
│   │   ├── Market.tsx             # سوق العمل
│   │   ├── Simulate.tsx           # المحاكاة
│   │   ├── Personality.tsx        # اختبار الميول
│   │   ├── Stories.tsx            # تجارب الخرّيجين
│   │   ├── Chat.tsx               # الاستشارة الذكيّة
│   │   ├── Future.tsx             # وظائف 2030
│   │   ├── Scholarships.tsx       # المنح
│   │   ├── Alternatives.tsx       # المسارات البديلة
│   │   └── Profile.tsx            # الملفّ الشخصي
│   ├── App.tsx                    # نقطة الدخول
│   ├── main.tsx                   # mount React
│   └── index.css                  # ستايلات حكوميّة
├── capacitor.config.ts            # إعدادات Capacitor
├── tailwind.config.js             # إعدادات Tailwind
├── tsconfig.json                  # إعدادات TypeScript
├── vite.config.ts                 # إعدادات Vite
├── package.json
├── icon.svg                       # الشعار الأصلي
└── index.html
```

---

## 🎨 منظومة التصميم

### الألوان الحكوميّة

| المُتغيّر | القيمة | الاستخدام |
|---|---|---|
| `gov-navy` | `#003F7D` | اللون الرئيسي |
| `gov-navy-dark` | `#002855` | hover للأزرار الرئيسيّة |
| `gov-navy-light` | `#1B5594` | تأكيدات ثانويّة |
| `gov-green` | `#007A4D` | النجاح، البيانات الإيجابيّة |
| `gov-red` | `#CE1126` | التحذيرات، الأخطاء |
| `gov-gold` | `#A88631` | الشعار الهاشمي، تأكيدات نادرة |
| `gov-ink` | `#1F2937` | النصّ الرئيسي |
| `gov-body` | `#374151` | نصّ الفقرات |
| `gov-muted` | `#6B7280` | تلميحات وlabels |
| `gov-line` | `#E5E7EB` | حدود البطاقات |
| `gov-bg` | `#F5F7FA` | خلفيّة عامّة |
| `gov-bg-soft` | `#F8FAFC` | بطاقات هادئة |
| `gov-ok` | `#16A34A` | success messages |
| `gov-warn` | `#D97706` | warning messages |
| `gov-danger` | `#DC2626` | danger/error |

### الخطوط

- **الخطّ الأساسي:** IBM Plex Sans Arabic (300, 400, 500, 600, 700)
- **الخطّ الاحتياطي:** Noto Naskh Arabic
- **الفونت System:** system-ui

### المسافات

- استخدم Tailwind spacing scale (4px multiples)
- البطاقات: 16-20px داخلي
- الأقسام: 16-24px فاصل

### الزوايا

- **بطاقات:** 8px (`rounded-gov`)
- **أزرار:** 6px
- **input:** 6px
- **شعار:** 6px

---

## 📊 مصادر البيانات

| المصدر | الاستخدام | التحديث |
|---|---|---|
| `src/data/majors.ts` | 12 تخصّص بأرقام كاملة | يدوياً |
| Web Scraping (مخطّط) | إعلانات الوظائف | يومي |
| DOS API (مخطّط) | نسب البطالة الرسميّة | شهري |
| MoHE API (مخطّط) | معدّلات القبول | سنوي |

---

## 🔧 سكريبتات npm

```bash
npm run dev               # تشغيل خادم التطوير على :5173
npm run build             # بناء إنتاجي
npm run preview           # معاينة البناء الإنتاجي
npm run icons             # إعادة توليد أيقونات Android
npm run android:sync      # بناء + مزامنة Capacitor
npm run android:open      # فتح Android Studio
```

---

## 🏗️ بناء APK محلّياً

### المتطلّبات

- Node.js 18+
- Java JDK 17+
- Android SDK (مع build-tools 34+)
- متغيّر البيئة `ANDROID_HOME` يشير إلى مجلّد SDK

### خطوات البناء

```bash
# 1. ثبّت الاعتماديّات
npm install

# 2. ابنِ الويب
npm run build

# 3. مزامنة الموارد إلى Android
npx cap sync android

# 4. ابنِ APK (debug)
cd android
./gradlew assembleDebug

# 5. ابنِ APK (release - يحتاج keystore)
./gradlew assembleRelease
```

ملف APK الناتج:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

### ⚠️ مشكلة شائعة: مسار يحتوي عربيّة

Gradle لا يدعم المسارات بالأحرف غير الـ ASCII. الحلّ:
انسخ المشروع إلى مسار إنجليزي قبل البناء (مثل `C:/mizan-build/`)

---

## 🔐 التوقيع الرقمي

### إنشاء keystore جديد

```bash
keytool -genkey -v \
  -keystore murshidi-release.keystore \
  -alias mizan \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Murshidi, OU=Education, O=Jordan MoHE, L=Amman, S=Amman, C=JO"
```

### إعدادات التوقيع في `android/app/build.gradle`

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../murshidi-release.keystore')
            storePassword 'YOUR_PASSWORD'
            keyAlias 'mizan'
            keyPassword 'YOUR_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 🚀 خطوات النشر على Google Play

1. **سجّل حساب مطوّر** على [play.google.com/console](https://play.google.com/console) (25 USD لمرّة واحدة)
2. **أنشئ تطبيقاً جديداً** باسم "مُرشِدي"
3. **ارفع APK** الـ release الموقّع
4. **املأ المعلومات المطلوبة:**
   - وصف بالعربيّة والإنجليزيّة
   - لقطات شاشة (8 على الأقلّ)
   - أيقونة 512×512 (`public/icon-512.png`)
   - Feature graphic 1024×500
5. **احصل على موافقة المراجعة** (1-7 أيّام)
6. **انشر التطبيق**

---

## 🧪 اختبارات الجودة

### قائمة الاختبارات اليدويّة

- [x] التطبيق يفتح خلال 3 ثوانٍ
- [x] جميع الـ 13 شاشة تعمل بدون أخطاء
- [x] حاسبة ROI تعطي نتائج صحيحة لمعدّلات مختلفة
- [x] المقارنة تستوعب 3 تخصّصات مختلفة
- [x] اختبار الميول يكمل 12 سؤالاً ويعطي نتيجة
- [x] الاستشارة الذكيّة تردّ على الأسئلة المختلفة
- [x] التطبيق RTL بالكامل
- [x] Touch targets ≥ 44px
- [x] خطوط القراءة واضحة
- [x] لا توجد errors في console
- [x] التطبيق يعمل بدون إنترنت بعد التثبيت

### اختبارات الأجهزة

| الجهاز | Android | الحالة |
|---|---|---|
| Samsung Galaxy A52 | 12 | ✅ |
| Xiaomi Redmi Note 10 | 11 | ✅ |
| Honor 8X | 9 | ✅ |
| Pixel 5 | 14 | ✅ |
| Android Studio Emulator API 30 | 11 | ✅ |
| Android Studio Emulator API 33 | 13 | ✅ |
| Android Studio Emulator API 34 | 14 | ✅ |

---

## 🛠️ التحسينات المستقبليّة (Roadmap)

### المرحلة 2 (3 أشهر)
- [ ] إضافة منصّة iOS (`npx cap add ios`)
- [ ] دعم اللغة الإنجليزيّة الكامل (i18n)
- [ ] رفع الصور والفيديوهات للقصص الحقيقيّة
- [ ] تكامل مع Google Sign-In

### المرحلة 3 (6 أشهر)
- [ ] خادم خلفي حقيقي (Node.js + PostgreSQL)
- [ ] Web Scraping يومي للوظائف
- [ ] لوحة إدارة للمحتوى (Admin Dashboard)
- [ ] إشعارات Push (منح جديدة، تنبيهات)

### المرحلة 4 (سنة)
- [ ] تكامل مع API وزارة التعليم العالي
- [ ] تكامل مع DOS Open Data Portal
- [ ] Mentor Matching حقيقي مع جلسات Video
- [ ] Career Simulation بـ Claude API حقيقي

---

## 📝 ترخيص الكود

MIT License — يحقّ لأيّ جهة تعليميّة أو حكوميّة أردنيّة استخدام الكود وتطويره.

---

## 👤 المؤلّف

**عبد الرحمن الحيموني**
- ايميل: abdalrahman.alhaymouni@gmail.com
- المشروع: مقدّم لجائزة وليّ العهد لأفضل تطبيق خدمات حكوميّة (الدورة الخامسة 2026)
