# Multi-Language Support (i18n)

This project implements internationalization (i18n) using **react-i18next** and **i18next**, supporting four languages:
- **English (en)**
- **Hindi (hi)** - हिंदी
- **Marathi (mr)** - मराठी
- **Gujarati (gu)** - ગુજરાતી

## Architecture

### File Structure
```
src/
├── i18n/
│   ├── config.ts              # i18n configuration and initialization
│   ├── i18next.d.ts           # TypeScript type definitions
│   ├── locales/
│   │   ├── en.json            # English translations
│   │   ├── hi.json            # Hindi translations
│   │   ├── mr.json            # Marathi translations
│   │   └── gu.json            # Gujarati translations
│   └── README.md              # This file
├── contexts/
│   └── LanguageContext.tsx    # Language state management
└── components/
    └── common/
        └── LanguageSelector.tsx  # Language switcher component
```

## Usage

### 1. Using Translations in Components

Import the `useTranslation` hook from `react-i18next`:

```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.verify')}</Text>
  );
};
```

### 2. Using the Language Selector

The `LanguageSelector` component provides a UI for users to switch languages:

```tsx
import { LanguageSelector } from '../../components/common/LanguageSelector';

// Icon variant (compact)
<LanguageSelector variant="icon" />

// Button variant (full text)
<LanguageSelector variant="button" />
```

### 3. Programmatically Changing Language

Use the `useLanguage` hook from the LanguageContext:

```tsx
import { useLanguage } from '../../contexts/LanguageContext';

export const MyComponent = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const switchToHindi = async () => {
    await changeLanguage('hi');
  };
  
  return (
    <Button onPress={switchToHindi} title="Switch to Hindi" />
  );
};
```

## Adding New Translations

### 1. Add to Translation Files

Add your new key-value pairs to all language files:

**en.json:**
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}
```

**hi.json:**
```json
{
  "myFeature": {
    "title": "मेरी सुविधा",
    "description": "यह मेरी सुविधा है"
  }
}
```

### 2. Use in Components

```tsx
const { t } = useTranslation();
<Text>{t('myFeature.title')}</Text>
```

## Features

### ✅ Persistent Language Selection
- User's language preference is saved to AsyncStorage
- Automatically loads on app restart

### ✅ Type Safety
- TypeScript definitions provide autocomplete for translation keys
- Compile-time checking for missing translations

### ✅ Fallback Support
- Falls back to English if a translation is missing
- Graceful degradation

### ✅ Dynamic Content
- Supports interpolation for dynamic values
- Example: `t('greeting', { name: 'John' })`

### ✅ RTL Support Ready
- Architecture supports RTL languages if needed in the future

## Best Practices

1. **Organize by Feature**: Group related translations together
2. **Use Descriptive Keys**: `dashboard.features.cropAdvisory` instead of `feature1`
3. **Keep Translations Consistent**: Maintain the same structure across all language files
4. **Test All Languages**: Verify UI layout works with all language text lengths
5. **Avoid Hardcoded Strings**: Always use translation keys

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en   | English  | English     |
| hi   | Hindi    | हिंदी       |
| mr   | Marathi  | मराठी       |
| gu   | Gujarati | ગુજરાતી     |

## Dependencies

- `i18next`: ^23.x - Core i18n framework
- `react-i18next`: ^14.x - React bindings for i18next
- `@react-native-async-storage/async-storage`: ^1.x - For persisting language preference

