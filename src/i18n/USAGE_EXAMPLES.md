# i18n Usage Examples

## Quick Start Examples

### Example 1: Basic Text Translation

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export const WelcomeScreen = () => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.verify')}</Text>
      {/* Output: "Verify" (en), "सत्यापित करें" (hi), "सत्यापित करा" (mr), "ચકાસો" (gu) */}
    </View>
  );
};
```

### Example 2: Using Language Selector

```tsx
import React from 'react';
import { View } from 'react-native';
import { LanguageSelector } from '../../components/common/LanguageSelector';

export const SettingsScreen = () => {
  return (
    <View>
      {/* Icon variant - shows language code (EN, HI, MR, GU) */}
      <LanguageSelector variant="icon" />
      
      {/* Button variant - shows full native name */}
      <LanguageSelector variant="button" />
    </View>
  );
};
```

### Example 3: Dynamic Greeting Based on Time

```tsx
import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export const GreetingComponent = () => {
  const { t } = useTranslation();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 17) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };
  
  return <Text>{getGreeting()}</Text>;
  // Morning: "Good Morning" (en), "सुप्रभात" (hi), "सुप्रभात" (mr), "સુપ્રભાત" (gu)
};
```

### Example 4: Programmatic Language Change

```tsx
import React from 'react';
import { View, Button, Text } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSettings = () => {
  const { currentLanguage, changeLanguage, isLoading } = useLanguage();
  
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  
  return (
    <View>
      <Text>Current Language: {currentLanguage}</Text>
      
      <Button 
        title="English" 
        onPress={() => changeLanguage('en')} 
      />
      <Button 
        title="हिंदी" 
        onPress={() => changeLanguage('hi')} 
      />
      <Button 
        title="मराठी" 
        onPress={() => changeLanguage('mr')} 
      />
      <Button 
        title="ગુજરાતી" 
        onPress={() => changeLanguage('gu')} 
      />
    </View>
  );
};
```

### Example 5: Translation with Interpolation (Future Use)

```tsx
import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export const UserGreeting = ({ userName }: { userName: string }) => {
  const { t } = useTranslation();
  
  // First, add to translation files:
  // "greeting": "Hello, {{name}}!"
  
  return (
    <Text>{t('greeting', { name: userName })}</Text>
  );
  // Output: "Hello, John!" (en), "नमस्ते, John!" (hi), etc.
};
```

### Example 6: Conditional Rendering Based on Language

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSpecificContent = () => {
  const { currentLanguage } = useLanguage();
  
  return (
    <View>
      {currentLanguage === 'hi' && (
        <Text>यह केवल हिंदी में दिखाई देता है</Text>
      )}
      
      {['mr', 'gu'].includes(currentLanguage) && (
        <Text>Regional content for Marathi and Gujarati</Text>
      )}
    </View>
  );
};
```

### Example 7: Using Multiple Translation Namespaces (Advanced)

```tsx
// If you organize translations into multiple files in the future
import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export const MultiNamespaceExample = () => {
  const { t } = useTranslation(['common', 'dashboard']);
  
  return (
    <>
      <Text>{t('common:verify')}</Text>
      <Text>{t('dashboard:appName')}</Text>
    </>
  );
};
```

### Example 8: Custom Language Selector with Icons

```tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { LANGUAGES } from '../../i18n/config';

export const CustomLanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  return (
    <View style={{ flexDirection: 'row' }}>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => changeLanguage(lang.code)}
          style={{
            padding: 10,
            backgroundColor: currentLanguage === lang.code ? '#4CAF50' : '#E0E0E0',
            margin: 5,
            borderRadius: 8,
          }}
        >
          <Text style={{ 
            color: currentLanguage === lang.code ? '#FFF' : '#000',
            fontWeight: currentLanguage === lang.code ? 'bold' : 'normal',
          }}>
            {lang.nativeLabel}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

## Translation Key Reference

### Common Translations
- `common.verify` - Verify button
- `common.update` - Update button
- `common.change` - Change button
- `common.delete` - Delete button
- `common.home` - Home label

### Register Screen
- `register.title` - "Register"
- `register.subtitle` - "Your Account!"
- `register.personalInfo` - "Personal Information"
- `register.namePlaceholder` - Name input placeholder
- `register.mobilePlaceholder` - Mobile number input placeholder

### User Information Screen
- `userInfo.title` - "User"
- `userInfo.subtitle` - "Information"
- `userInfo.namePlaceholder` - Name field
- `userInfo.districtPlaceholder` - District field
- `userInfo.talukaPlaceholder` - Taluka field
- `userInfo.villagePlaceholder` - Village field
- `userInfo.updateProfile` - Update profile button
- `userInfo.changePassword` - Change password link

### Dashboard Screen
- `dashboard.appName` - App name
- `dashboard.goodMorning` - Morning greeting
- `dashboard.goodAfternoon` - Afternoon greeting
- `dashboard.goodEvening` - Evening greeting
- `dashboard.selectedCrop` - Selected crop name
- `dashboard.features.*` - All feature names
- `dashboard.bottomNav.*` - Bottom navigation labels

## Tips & Best Practices

1. **Always use translation keys** - Never hardcode user-facing strings
2. **Test with all languages** - Ensure UI handles different text lengths
3. **Use descriptive keys** - Makes code more maintainable
4. **Keep translations organized** - Group by feature/screen
5. **Handle missing translations** - Always provide fallback to English

