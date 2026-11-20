# sk-bottom-dock



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                     | Type                          | Default             |
| ------------------- | -------------------- | ------------------------------------------------------------------------------- | ----------------------------- | ------------------- |
| `activeId`          | `active-id`          | ID of the currently active tab                                                  | `string`                      | `undefined`         |
| `floating`          | `floating`           | Fixes the dock to the bottom of the viewport with safe-area padding             | `boolean`                     | `true`              |
| `items`             | --                   | Navigation items to render in the dock                                          | `SkDockItem[]`                | `[]`                |
| `navLabel`          | `nav-label`          | Accessible label for the <nav> landmark                                         | `string`                      | `'Main navigation'` |
| `preventNavigation` | `prevent-navigation` | Prevents default <a> navigation so SPA routers (Angular/Next.js) handle routing | `boolean`                     | `true`              |
| `theme`             | `theme`              | Color theme: 'dark', 'light', or 'auto' (follows system preference)             | `"auto" \| "dark" \| "light"` | `'auto'`            |


## Events

| Event         | Description                    | Type                      |
| ------------- | ------------------------------ | ------------------------- |
| `skTabSelect` | Emitted when a tab is selected | `CustomEvent<SkDockItem>` |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"badge"` |             |
| `"dock"`  |             |
| `"icon"`  |             |
| `"label"` |             |
| `"nav"`   |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
