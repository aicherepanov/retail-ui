# Migration

- [1.x - 2.0](#1x---20)
  - [Отказ от поддержки пакета `retail-ui`](#отказ-от-поддержки-пакета-retail-ui)
  - [Именованные экспорты, ES6 модули и tree-shaking](#именованные-экспорты-es6-модули-и-tree-shaking)
  - [Изменена сигнатура `onChange`](#изменена-сигнатура-onchange)
  - [Отдельный пакет для Контур-специфичных компонентов](#отдельный-пакет-для-контур-специфичных-компонентов)
  - [Использование нативного ReactContext для `Theme(Locale-)Provider`](#использование-нативного-reactcontext-для-themelocale-provider)
  - [Встроены иконки из `@skbkontur/react-icons`](#встроены-иконки-из-skbkonturreact-icons)
  - [Удален устаревший код](#удален-устаревший-код)
    - [Flow типизация](#flow-типизация)
    - [Устаревшие компоненты и свойства](#устаревшие-компоненты-и-свойства)
    - [`Lookup.js` и адаптеры для компонентов](#lookupjs-и-адаптеры-для-компонентов)
- [0.x - 1.0](#0x---10)
  - [Переход с кастомизации с помощью `less`](#переход-с-кастомизации-с-помощью-less)

## 1.x - 2.0

### Отказ от поддержки пакета `retail-ui`

Ранее компоненты библиотеки поставлялись в виде двух различных npm пакетов (`retail-ui` и `@skbkontur/react-ui`). Пакет `retail-ui` позволял кастомизировать внешний вид интерфейса путем задания переменных в less. В 1.0 произошла миграция механизма кастомизации из less в css-in-js. Но при этом сохранялась поддержка старого механизма кастомизации через less. В 2.0 произошел окончательный перевод всех стилей библиотеки из less в css-in-js, вместе с ним старый механизм кастомизации больше не поддерживается, в следствии чего теряется необходимость дальнейшей поддержки пакета `retail-ui`. В рамках поддержки LTS версий пакет `retail-ui` будет выпускаться, но будет содержать исправления критичных багов.

### Именованные экспорты, ES6 модули и tree-shaking

Начиная с 2.0 исходный код библиотеки распространяются в виде ES6 модулей. Это необходимо для обеспечения правильной работы tree-shaking.

Кроме этого все публичные компоненты библиотеки доступны в виде именованных импортов из корня:

```js
import { Button, Input } from '@skbkontur/react-ui;
```

Если вы каким-либо образом загружаете компоненты библиотеки в nodejs, например в unit тестах. Вам необходимо добавить в пути для трансформации путь до `@skbkontur/react-ui`, чтобы избежать ошибки `Error [ERR_REQUIRE_ESM]: Must use import to load ES Module` или `SyntaxError: Cannot use import statement outside a module`. При этом для сборки бандла в webpack конфиге ничего дополнительно настраивать не нужно.

Публичными компонентами называются те для которых есть страница с документацией на [витрине компонентов](https://tech.skbkontur.ru/react-ui/) Компоненты, которые отсутствуют на витрине считаются внутренними и не рекомендуются к использованию, так как для них не гарантируется сохранение обратной совместимости в рамках одной мажорной версии. Но если по каким-то причинам вам всё же необходимо использовать внутренний компонент, импортировать его можно из `@skbkontur/react-ui/internal/<ComponentName>`.

Для облегчения перевода проекта можно воспользоваться [codemod `transformImportsAndExports`](https://github.com/skbkontur/retail-ui/pull/1900#transformImportsAndExports)

### Изменена сигнатура `onChange`

В 2.0 добавлено новое свойство `onValueChange`. Которое пришло на замену или в дополнение к существующему свойству `onChange`.

В компонентах в которых есть возможность получить нативное событие `change` (`Autocomplete/Checkbox/Radio/Textarea/Toggle/Input/CurrencyInput/FxInput/PasswordInput`) свойство `onChange` полностью повторяет сигнатуру нативных HTML элементов.

Для компонентов в которых отсутствует нативное событие `change` свойство `onChange` было удалено.

Сделано это было для уменьшения неоднозначности `onChange` у разных компонентов, а так же для облегчения использования компонентов с `Hooks API`

```jsx
const [name, setName] = useState('');

<Input value={name} onValueChange={setName} />;
```

Мы подготовили [codemod `transformOnChange`](https://github.com/skbkontur/retail-ui/pull/1900#transformOnChange) для перехода на новое API компонентов, но в виду множества вариантов использования свойств компонентов codemod покрывает только несколько достаточно очевидных сценариев, в тех местах где нельзя автоматически преобразовать `onChange` в `onValueChange` будет выводится сообщение о неудачной попытке трансформации и необходимости внести изменения вручную.

**WARN** Codemod должен применятся исключительно после применения `transformImportsAndExports`, в ином случае корректный результат не гарантируется.

### Отдельный пакет для Контур-специфичных компонентов

Библиотека позиционируется как open-source, в том числе с возможностью использовать компоненты вне Контура. Поэтому все компоненты использующие фирменный стиль или api сервисов Контура с выпуском 2.0 переезжают в отдельный приватный [репозиторий](https://git.skbkontur.ru/ui/ui-parking) и npm пакет [@skbkontur/react-ui-addons](https://nexus.kontur.host/#browse/browse:kontur-npm:%40skbkontur%2Freact-ui-addons) в приватном npm репозитории `nexus`

Чтобы начать использовать пакет `@skbkontur/react-ui-addons` из `nexus` необходимо выполнить на уровне проекта команду:

```shell
npm config set @skbkontur:registry https://nexus.kontur.host/repository/kontur-npm-group/
```

в результате будет создан файл `.npmrc` сообщающий npm, что все пакеты из `@skbkontur/*` теперь должны устанавливаться из соответствующего репозитория.

Далее необходимо применить [codemod `moveToAddons`](https://github.com/skbkontur/retail-ui/pull/1900#moveToAddons), который исправляет пути импортов Контур-специфичных компонентов на импорты из `@skbkontur/react-ui-addons`

При этом, если у вас нет возможности настроить nexus прямо сейчас, компоненты остаются в составе библиотеки до версии 3.0. В таком случае всё что вам нужно, это вернуть старое отображение компонентов `Loader` и `Spinner` с помощью [codemod `addCloudProp`](https://github.com/skbkontur/retail-ui/pull/1900#addCloudProp)

**WARN** Codemod должен применятся исключительно после применения `transformImportsAndExports`, в ином случае корректный результат не гарантируется.

### Использование нативного ReactContext для `Theme(Locale-)Provider`

Вместо использования отдельного `ThemeProvider/LocaleProvider` рекомендуется использовать `ThemeContext/LocaleContext` соответственно.

Было:

```jsx
import LocaleProvider, { LangCodes } from '@skbkontur/react-ui/components/LocaleProvider'
import ThemeProvider from '@skbkontur/react-ui/components/ThemeProvider'

/* ... */
const MyTheme = { /* ... */ }

<ThemeProvider value={MyTheme}>
  <LocaleProvider landCode={LangCodes.en_GB}>
    {/* ... */}
  </LocalProvider>
</ThemeProvider>
```

Стало:

```jsx
import { LocaleContext, LangCodes, ThemeContext, ThemeFactory } from '@skbkontur/react-ui'

/* ... */
const MyTheme = ThemeFactory.create({ /* ... */ })

<ThemeContext.Provider value={MyTheme}>
  <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
    {/* ... */}
  </LocaleContext.Provider>
</ThemeContext.Provider>
```

### Встроены иконки из `@skbkontur/react-icons`

Библиотека больше не имеет `peerDependency` от `@skbkontur/react-icons`, все иконки, которые используются не посредственно в компонентах, теперь встроены в саму библиотеку. Это не должно оказывать большого влияния на размер итогового бандла, но позволяет нам в будущем изменять источник откуда иконки будут использоваться. Мы планируем создать два пакета иконок, полностью opensource под лицензией MIT и проприетарный для использования внутри Контура. Это связано с позицией проектировщиков, которые не позволяют нам распространять и использовать вручную нарисованные иконки в свободном доступе.

### Удален устаревший код

#### Flow типизация

Из библиотеки окончательно удалены типы на Flow. Все типы были перемещены в репозиторий [`flow-typed`](https://github.com/flow-typed/flow-typed). Если вы ещё используйте flow типизацию, то вы можете установить типы из `flow-typed`. Мы не планируем поддерживать актуальность этих типов.

#### Устаревшие компоненты и свойства

В 2.0 удалены компоненты `ComboBoxOld`, `DatePickerOld`, `Kladr`. Вместо них необходимо использовать `ComboBox`, `DatePicker` и `Fias` соответственно. Кроме этого были удалены следующие свойства:

- `Token` — больше не поддерживает старые наименования цветов для свойства `colors`
- `Sticky` — корректно работает без указания свойства `allowChildWithMargins`
- `ComboBox` — Флаг `autocompelete` разделен на 2 отдельных флага `drawArrow` и `searchOnFocus`
- `Input/Button` — больше не используют свойство `mainInGroup` для задания резиновости при расположении внутри компонента `Group`, вместо этого рекомендуется указывать ширину таким элементам в процентах
- `Fias` — вместо свойства `locale` использует механизм локализации через `LocaleContext`
- `Paging` - вместо свойства `strings` необходимо использовать свойство `caption` или механизм локализации
- `TokenInput` — для большей гибкости отрисовки токенов вместо `renderTokenComponent` необходимо использовать свойство `renderToken`
- `CurrencyInput` — свойство `maxLength` не позволяло гибко настраивать вывод целой и десятичной части и было разделено на два отдельных свойства `integerDigits` и `fractionDigits`

#### `Lookup.js` и адаптеры для компонентов

Ранее библиотека включала в себя набор хелперов, призванных облегчить тестирование и предоставить некий публичный интерфейс для программного взаимодействия с компонентами на уровне тестов. Но в виду сложности поддержки, отсутствия типизации и малого кол-во использований этой функциональности. Было принято решения отказаться от неё. Если ваш проект каким-то образом использует механизм связанный с адаптерами для компонентов, вы можете скопировать к себе последнюю реализацию адаптеров компонентов из 1.x версии библиотеки.

## 0.x - 1.0

### Переход с кастомизации с помощью `less`

Для перехода с кастомизации посредством переопределения less-переменных, необходимо превратить less-переменные в объект темы.
Это можно сделать с помощью <a target="_blank" href="https://raw.githubusercontent.com/skbkontur/retail-ui/master/packages/react-ui-codemod/customization/variablesConverter.js">скрипта</a>

Скрипту необходимо передать два параметра: `variables` - путь до файла с перменными и `output` - путь до файла, в который нужно записать объект темы. Если по пути, переданному в `output`, файла не существует, файл будет создан. В противном случае, он будет перезаписан.

Перед запуском скрипт необходимо скачать и положить в папку с проектом. В процессе конвертации используется пакет [less.js](https://www.npmjs.com/package/less), который скрипт возьмет из зависимостей проекта.

Пример использования:

```shell
node variablesConverter.js variables=../../less/myVariables.less output=../theme/theme.js
```

Для следующего содержимого myVariables.less:

```less
@btn-danger-bg: #e14c30;
@warning-main: #f69c00;
@error-main: #d70c17;
@border-color-gray-dark: rgba(0, 0, 0, 0.28);
@border-color-gray-light: rgba(0, 0, 0, 0.15);
@tab-color-hover-error: lighten(@btn-danger-bg, 20%);
@toggle-bg-warning: @warning-main;
@toggle-bg-error: @error-main;
```

Сгенерируется файл theme.js:

```typescript
export default {
  btnDangerBg: '#e14c30',
  warningMain: '#f69c00',
  errorMain: '#d70c17',
  borderColorGrayDark: 'rgba(0, 0, 0, 0.28)',
  borderColorGrayLight: 'rgba(0, 0, 0, 0.15)',
  tabColorHoverError: '#ee9989',
  toggleBgWarning: '#f69c00',
  toggleBgError: '#d70c17',
};
```

Далее объект из `theme.js` нужно обернуть в `ThemeFactory.create` и можно передавать в ThemeContext.Provider:

```jsx static
import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeContext, ThemeFactory } from '@skbkontur/react-ui';

import App from './components/App';
import theme from './theme/theme';

ReactDOM.render(
  <ThemeContext.Provider value={ThemeFactory.create(theme)}>
    <App />
  </ThemeContext.Provider>,
  document.getElementById('app'),
);
```

В случае, если приложение не является полноценным React-приложением, и тему нужно переопределить единоразово, то можно воспользоваться методом `overrideDefaultTheme` в `ThemeFactory`:

```typescript static
// точка входа в приложение
...
import theme from './theme/theme';
import { ThemeFactory } from '@skbkontur/react-ui/lib/theming/ThemeFactory';

ThemeFactory.overrideDefaultTheme(theme);
...
```
