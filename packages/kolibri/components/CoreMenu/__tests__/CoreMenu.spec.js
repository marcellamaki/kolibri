import { nextTick } from 'vue';
import { render, screen } from '@testing-library/vue';
import CoreMenu from '../index.vue';

const TRIGGER_LABEL = 'Trigger';
const OTHER_LABEL = 'Other';
const OPTION_LABEL = 'Option';

async function renderMenu() {
  const trigger = document.createElement('button');
  trigger.textContent = TRIGGER_LABEL;
  const other = document.createElement('button');
  other.textContent = OTHER_LABEL;
  document.body.append(trigger, other);
  trigger.focus();

  const result = render(CoreMenu, {
    slots: {
      options: `<li><button class="core-menu-option">${OPTION_LABEL}</button></li>`,
    },
  });
  // CoreMenu focuses its first option once mounted
  await nextTick();
  return { ...result, trigger, other };
}

describe('CoreMenu', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('restores focus to the previously focused element when destroyed with focus inside', async () => {
    const { unmount, trigger } = await renderMenu();
    screen.getByRole('button', { name: OPTION_LABEL }).focus();

    unmount();
    jest.runAllTimers();

    expect(trigger).toHaveFocus();
  });

  it('leaves focus alone when destroyed while focus is outside the menu', async () => {
    const { unmount, other } = await renderMenu();
    other.focus();

    unmount();
    jest.runAllTimers();

    expect(other).toHaveFocus();
  });
});
