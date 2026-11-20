# sk-sidebar-menu



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                                                                       | Type                          | Default                   |
| --------------- | ----------------- | --------------------------------------------------------------------------------- | ----------------------------- | ------------------------- |
| `brandAccent`   | `brand-accent`    | Optional accent character after brandTitle (e.g. ".")                             | `string`                      | `'.'`                     |
| `brandSubtitle` | `brand-subtitle`  | Subtitle displayed under the brand title                                          | `string`                      | `undefined`               |
| `brandTitle`    | `brand-title`     | Brand title displayed in the header                                               | `string`                      | `'Workspace'`             |
| `closeOnSelect` | `close-on-select` | Automatically close the drawer when an item is selected                           | `boolean`                     | `true`                    |
| `items`         | --                | Navigation items array (optional if using default slot)                           | `SkSidebarMenuItem[]`         | `[]`                      |
| `open`          | `open`            | Controls drawer visibility (supports both controlled and internal trigger toggle) | `boolean`                     | `false`                   |
| `placement`     | `placement`       | Side of the screen the drawer slides from                                         | `"left" \| "right"`           | `'right'`                 |
| `sectionLabel`  | `section-label`   | Section caption above the navigation items                                        | `string`                      | `'Manage your workspace'` |
| `showTrigger`   | `show-trigger`    | Renders the built-in hamburger trigger button                                     | `boolean`                     | `true`                    |
| `swipeToClose`  | `swipe-to-close`  | Enable horizontal swipe-to-close gesture on touch devices                         | `boolean`                     | `true`                    |
| `theme`         | `theme`           | Color theme: 'dark', 'light', or 'auto' (follows system preference)               | `"auto" \| "dark" \| "light"` | `'auto'`                  |
| `variant`       | `variant`         | Visual style: 'compact' (icon + medium text) or 'editorial' (large display text)  | `"compact" \| "editorial"`    | `'compact'`               |


## Events

| Event          | Description                                 | Type                             |
| -------------- | ------------------------------------------- | -------------------------------- |
| `skItemSelect` | Emitted when a menu item is clicked         | `CustomEvent<SkSidebarMenuItem>` |
| `skOpenChange` | Emitted whenever the drawer opens or closes | `CustomEvent<boolean>`           |


## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"backdrop"`     |             |
| `"body"`         |             |
| `"close-button"` |             |
| `"footer"`       |             |
| `"header"`       |             |
| `"panel"`        |             |
| `"trigger"`      |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
