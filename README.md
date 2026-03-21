# cuztomisable

A customizable React Native/Expo framework for mobile apps.

## Features
- Plug-and-play authentication, onboarding, settings, and tab navigation
- Theming and context providers out of the box
- Easy config override with `mergeConfig`
- Designed for rapid app development and extension

## Installation
```sh
npm install cuztomisable
```

## Usage
```tsx
import { CuztomisableProvider } from 'cuztomisable/components';
import { CuztomisableRouter } from 'cuztomisable/app/router';

export default function App() {
  return (
    <CuztomisableProvider>
      <CuztomisableRouter />
    </CuztomisableProvider>
  );
}
```

## Customizing Config
```ts
import { mergeConfig, AppConfig } from 'cuztomisable/config';

const myConfig = mergeConfig({
  appName: 'My Custom App',
  colors: { light: { primary: '#123456' } },
});
```

## License
MIT
