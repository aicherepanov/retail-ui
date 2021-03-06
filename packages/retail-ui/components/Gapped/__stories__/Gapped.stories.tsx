import React from 'react';
import Gapped from '../Gapped';
import Button from '../../Button';

export default {
  title: 'Gapped',
  decorators: [
    (storyFn: () => JSX.Element) => (
      <div style={{ padding: '5px', border: '1px solid black', width: '300px' }}>{storyFn()}</div>
    ),
  ],
  parameters: {
    creevey: {
      // NOTE Overwrite top-level skip option
      skip: { in: /.*Flat$/ },
      captureElement: '#test-element',
      __filename,
    },
  },
};

export const Horizontal = () => (
  <Gapped gap={20}>
    <Button>Button</Button>
    <Button>Button</Button>
  </Gapped>
);

export const Vertical = () => (
  <Gapped gap={20} vertical>
    <Button>Button</Button>
    <Button>Button</Button>
  </Gapped>
);

export const HorizontalWrap = () => (
  <Gapped gap={100} wrap>
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
  </Gapped>
);

export const HorizontalNoWrap = () => (
  <Gapped gap={20}>
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
  </Gapped>
);
