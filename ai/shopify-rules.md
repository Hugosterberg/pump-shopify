# Shopify Rules

## Do Not Remove

- `{{ content_for_header }}`
- `{{ content_for_layout }}`
- product forms
- cart forms
- app block rendering
- section schemas
- theme settings
- localization forms
- structured data
- dynamic checkout buttons
- accessibility attributes

## App Blocks

Shopify apps may inject functionality using app blocks or theme app extensions. Do not remove app block support from sections unless explicitly told.

## Product Data

Do not hardcode:

- price
- availability
- variant IDs
- product titles
- compare-at price
- inventory status

Use Shopify objects instead.

## Theme Editor

Sections should be editable in the theme editor where useful.

Use settings for:

- headings
- text
- button labels
- links
- images
- section spacing
- background style

Avoid making every tiny visual detail a setting. Keep editor simple.
