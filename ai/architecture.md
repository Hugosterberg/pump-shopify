# Shopify Theme Architecture

## Project Type

This is a Shopify Online Store 2.0 theme.

## Important Folders

- `layout/` — base theme layout
- `templates/` — JSON templates that compose pages from sections
- `sections/` — reusable Shopify sections
- `snippets/` — reusable Liquid fragments
- `assets/` — CSS, JS and static assets
- `config/` — theme settings
- `locales/` — translations

## Development Principle

Use Shopify sections as the primary unit of development.

A good section should:

- be editable in the Shopify theme editor
- have a valid schema
- avoid hardcoded content where settings make sense
- use semantic HTML
- preserve app block support when relevant
- avoid unnecessary JavaScript

## Suggested Custom Sections

- `premium-hero.liquid`
- `use-case-grid.liquid`
- `benefit-cards.liquid`
- `product-showcase.liquid`
- `how-it-works.liquid`
- `comparison-section.liquid`
- `review-cards.liquid`
- `faq-section.liquid`
- `sticky-mobile-atc.liquid`
- `trust-strip.liquid`

## Protected Commerce Areas

Be extra careful with:

- product form
- variant selection
- cart updates
- checkout links
- product media
- app blocks
- dynamic checkout buttons

If modifying these areas, first explain what will be preserved.
