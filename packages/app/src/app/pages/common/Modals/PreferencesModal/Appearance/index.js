import React from 'react';
import { inject, observer } from 'mobx-react';

import PreferenceText from 'common/components/Preference/PreferenceText';
import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../elements';
import { BigTitle } from './elements';

function EditorSettings({ store, signals }) {
  const bindValue = (name, setUndefined) => ({
    value: setUndefined
      ? store.preferences.settings[name] || undefined
      : store.preferences.settings[name],
    setValue: value =>
      signals.preferences.settingChanged({
        name,
        value,
      }),
  });

  const fontOptions = ['Menlo', 'Dank Mono', 'Source Code Pro'];

  return (
    <div>
      <Title>Appearance</Title>

      <SubContainer>
        <PreferenceContainer>
          <PaddedPreference
            title="Font Size"
            type="number"
            {...bindValue('fontSize')}
          />
          <Rule />
          <PaddedPreference
            title="Font Family"
            type="dropdown"
            options={['Custom'].concat(fontOptions)}
            placeholder="Source Code Pro"
            {...bindValue('fontFamily')}
          />
          <SubDescription>
            We{"'"}re using{' '}
            <a
              href="https://dank.sh/affiliate?n=cjgw9wi2q7sf20a86q0k176oj"
              rel="noreferrer noopener"
              target="_blank"
            >
              Dank Mono
            </a>{' '}
            as default font, you can also use locally installed fonts
          </SubDescription>
          {fontOptions.indexOf(store.preferences.settings.fontFamily) ===
            -1 && (
            <PreferenceText
              style={{ marginTop: '1rem' }}
              placeholder="Enter your custom font"
              block
              {...bindValue('fontFamily')}
            />
          )}
          <Rule />
          <PaddedPreference
            title="Font Ligatures"
            type="boolean"
            {...bindValue('enableLigatures')}
          />
          <SubDescription>
            Whether we should enable{' '}
            <a
              href="https://en.wikipedia.org/wiki/Typographic_ligature"
              target="_blank"
              rel="noopener noreferrer"
            >
              font ligatures
            </a>.
          </SubDescription>
          <Rule />
          <PaddedPreference
            title="Line Height"
            type="number"
            placeholder="1.15"
            step="0.05"
            style={{ width: '4rem' }}
            {...bindValue('lineHeight')}
          />
          <Rule />

          <PaddedPreference
            title="Zen Mode"
            type="boolean"
            {...bindValue('zenMode')}
          />
          <SubDescription>
            Hide all distracting elements, perfect for lessons and
            presentations.
          </SubDescription>

          <div>
            <BigTitle>Editor Theme</BigTitle>
            <SubDescription style={{ marginBottom: '1.5rem' }}>
              You can select a custom theme to be used in the editor. We support
              all VSCode themes.
            </SubDescription>

            <PaddedPreference
              title="Pre-installed Theme"
              type="dropdown"
              options={[
                'CodeSandbox',
                'Night Owl',
                'Night Owl (No Italics)',
                'Atom Dark',
                'VSCode Light',
                'Atom Light',
              ]}
              {...bindValue('editorTheme')}
            />
            <SubDescription>
              Default themes on CodeSandbox, this will be overwritten if you
              have a custom theme.
            </SubDescription>
            <Rule />

            <SubDescription style={{ marginBottom: '1rem' }}>
              Custom VSCode Theme
            </SubDescription>

            <PreferenceText
              isTextArea
              style={{ fontFamily: 'Source Code Pro', fontSize: '.8rem' }}
              block
              rows={7}
              defaultValue={`You can use your own theme from VSCode directly:

1. Open VSCode
2. Press (CMD or CTRL) + SHIFT + P
3. Enter: '> Developer: Generate Color Scheme From Current Settings'
4. Copy the contents and paste them here!`}
              {...bindValue('customVSCodeTheme', true)}
            />
          </div>
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
}

export default inject('store', 'signals')(observer(EditorSettings));
