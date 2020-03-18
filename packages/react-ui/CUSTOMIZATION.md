## Резюме

Для кастомизации компонентов используется ThemeContext:

- чтобы задать тему `ThemeContext.Provider`;
- использовать тему в своих компонентах `ThemeContext.Consumer`.

Механизм работы: динамические стили генерируются в зависимости от темы в процессе render'а с помощью <a href="https://www.npmjs.com/package/emotion" target="_blank">emotion</a>, полученные классы добавляются в `className` соответствующих элементов.

## Цели

- предоставить возможность кастомизировать контролы в _@skbkontur/react-ui_;
- предоставить возможность менять тему в рантайме и/или для части сервиса;
- упростить использование переменных из темы в своих компонентах;
- предоставить разработчикам виджетов (виджет продуктов, чат, мастер импорта и т.п.) возможность использовать тему сервиса-потребителя;

## Использование

Перед тем как использовать собственные значение, нужно c помощью `ThemeFactory.create` создать объект `Theme`, и получившуюся тему передать в `ThemeContext.Provider`. `ThemeFactory` расширяет переданный объект задавая в качестве прототипа объект темы по умолчанию.

   ```jsx harmony static
   import { Button, ButtonProps, Gapped, ThemeContext, ThemeFactory } from '@skbkontur/react-ui';

   const myTheme = ThemeFactory.create({ btnBorderRadius: '10px' });

   export const MyComponent = (props: { ok: ButtonProps, cancel: ButtonProps }) => {
     return (
       <ThemeContext.Provider value={myTheme}>
         <Gapped>
           <Button {...props.ok}>My round OK button</Button>
           <Button {...props.cancel}>My round Cancel button</Button>
         </Gapped>
       </ThemeContext.Provider>
     );
   };
   ```

### Подключение плоской темы

Плоскую тему можно было "включить" вызвав метод `Uprgades.enableFlatDesign()`.
На данный момент существует два механизма "включения" плоской темы:

1. Путь джедая:
   В начале времен, где-то в _App.(j|t)sx_

   ```jsx harmony static
   import { ThemeContext } from '@skbkontur/react-ui';
   import { FLAT_THEME } from '@skbkontur/react-ui/lib/theming/themes/FlatTheme';

   const App = (
     <ThemeContext.Provider value={FLAT_THEME}>
       <div />
     </ThemeContext.Provider>
   );
   ```

2. Для ленивых:

   - выделить и скопировать "ThemeFactory.overrideDefaultTheme(FlatTheme)"
   - ctrl+shift+f -> "Uprgades.enableFlatDesign()" -> enter;
   - вставить "ThemeFactory.overrideDefaultTheme(FlatTheme)";
   - alt+enter 2 раза (add import statement).

   Должно получиться:

   ```typescript
   import { ThemeFactory } from '@skbkontur/react-ui/lib/theming/ThemeFactory';
   import { FLAT_THEME } from '@skbkontur/react-ui/lib/theming/themes/FlatTheme';

   // вместо:
   // Uprgades.enableFlatDesign();
   ThemeFactory.overrideDefaultTheme(FLAT_THEME);
   ```

### Кастомизация в legacy-приложениях

В случае, если контролы рендерятся через какую-то общую обертку, достаточно добавить в нее `ThemeContext.Provider` с вашей темой. В противном случае, вам подойдет метод `ThemeFactory.overrideDefaultTheme()`.

## Дополнительно

### ColorFunctions.ts / DimensionFunctions.ts

Несколько функций по работе с цветом вынесены из less в js, их можно использовать в своих темах (_ColorFunctions.ts_):

```typescript
lighten(colorString: string, amount: number | string, method?: 'absolute' | 'relative'): string
darken(colorString: string, amount: number | string, method?: 'absolute' | 'relative'): string
contrast(colorString: string, darkString?: string, lightString?: string, threshold: number = 0.43): string
red(colorString: string): string
green(colorString: string): string
blue(colorString: string): string
alpha(colorString: string): string
isValid(colorString: string): boolean // проверяет, можно ли распарсить строку в цвет
```

Документацию по их работе можно найти на сайте [less](http://lesscss.org/functions/#color-operations).
В качестве colorString можно передать цвет в одном из форматов: `keyword`, `hex`, `rgb(r, g, b)`, `rgba(r, g, b, a)`, `hsl(h, s, l)`, `hsla(h, s, l, a)`.
В качестве `amount` можно передать строку вида 'N%' или число от 0 до 1.
Все значения больше или меньше возможных обрезаются. Например, для `rgba(300, -100, 123, 20)` `r=255, g=0, b=123, a=1`.
Если распарсить `colorString` не получилось - выбрасывается исключение.
Если это возможно, результат возвращается в том же виде, что и входная строка:

```typescript
lighten('hsl(90, 0.8, 0.2)', '20%') === 'hsl(90, 0.8, 0.4)';
lighten('rgba(50, 50, 50, 0.2)', '20%') === 'rgba(102, 102, 102, 0.2)';
lighten('#80e619', 0.2) === '#b3f075';
lighten('crimson', '20%') === '#f16581';
```

Для работы с размерами предусмотрена одна функция (_DimensionFunctions.ts_):

```typescript
shift(value: string, shift: string): string

// пример
DimensionFunctions.shift('100%', '-20') === '80%'
DimensionFunctions.shift('2em', '+2') === '4em'
DimensionFunctions.shift('12', '+1') === '13px'  //если единица измерения не указана - используется px
DimensionFunctions.shift('10.2', '12.333451') === '22.5335px' //дробная часть округляется до 4 знаков
```

### Витрина переменных

Внутренний компонент `ThemeShowcase` (_components/internal/ThemeShowcase/ThemeShowcase.tsx_) используется для отображения того, какие переменные в каких компонентах задействованы.
Информация собирается в рантейме с помощью `Proxy`, поэтому в IE таблица не отображается.

### Playground

Внутренний компонент `Playground` (_components/internal/ThemePlayground/Playground.tsx_) можно использовать для построения своей темы.
Для удобства в редакторе добавлено действие "вывести тему в консоль".
