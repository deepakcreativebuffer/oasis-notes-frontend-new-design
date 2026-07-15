# OasisNotes Component Documentation (Storybook)

## Overview
As the OasisNotes application scales, maintaining consistency across our React UI components is critical. We use Storybook to develop, document, and test UI components in isolation.

*Note: If Storybook is not currently initialized in your local environment, run `npx storybook@latest init` at the root directory.*

## Writing a Story

Stories are located alongside the component they document. The naming convention is `<ComponentName>.stories.jsx`.

### Basic Example

```javascript
// src/components/Button/Button.stories.jsx

import React from 'react';
import { Button } from './Button';

export default {
  title: 'Core/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    onClick: { action: 'clicked' }
  },
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Save Patient Data',
};

export const Danger = Template.bind({});
Danger.args = {
  variant: 'danger',
  children: 'Delete Record',
};
```

## Running Storybook

To start the Storybook development server:
```bash
npm run storybook
```
This will open a local browser window (typically `http://localhost:6006`) where you can interactively test the components.

## Documentation Guidelines

When documenting a component:
1. **Title Structure**: Group components logically (e.g., `Core/Inputs`, `Layout/Cards`, `Healthcare/PatientForms`).
2. **Props Table**: Ensure your component has PropType definitions or JSDoc comments so Storybook can automatically generate the ArgsTable.
3. **Variants**: Include stories for all possible states (loading, disabled, empty, error) to prevent regressions.
4. **Context**: If a component relies heavily on Redux or React Router, utilize Storybook decorators to mock the required providers.

## Building Storybook for Production

To generate a static build of the documentation (often deployed to a static hosting service for non-developers to review):
```bash
npm run build-storybook
```
This outputs the static files into the `storybook-static` directory.
