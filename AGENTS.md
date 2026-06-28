# AI Agent Instructions

This repository is a Shopify theme for Pump Portable.

## Important

This is not a normal React/TypeScript frontend.

Do not convert this project to React, Next.js, Vite, Astro, Remix, or Hydrogen unless explicitly requested.

The theme runs on Shopify and uses:
- Liquid
- JSON templates
- sections
- blocks
- snippets
- assets
- config/settings_schema.json
- locales

## Core Principle

Design can be rewritten.
Commerce logic must be protected.

## Never Break

Do not remove or rewrite without explicit instruction:

- `{% form 'product' %}`
- product variant logic
- cart routes
- Shopify app blocks
- `{{ content_for_header }}`
- `{{ content_for_layout }}`
- theme schema
- section schema
- localization forms
- dynamic checkout buttons
- product media
- structured data
- accessibility attributes
- required Shopify objects

## Development Approach

Make changes in small vertical slices.

Preferred workflow:

1. Understand the existing section/template.
2. Identify protected Shopify logic.
3. Improve layout and styling around it.
4. Preserve schemas and app block support.
5. Run theme check if available.
6. Test in Shopify preview.

## File Safety

Before editing a file, identify whether it contains:
- product form logic
- cart logic
- customer logic
- app block rendering
- localization
- schema

If it does, be conservative.

## Good Tasks

Good:
- “Create a new premium hero section”
- “Improve the product page layout without changing product form logic”
- “Add a comparison section with editable schema blocks”
- “Refactor CSS for the FAQ section”
- “Improve mobile spacing and typography”

Bad:
- “Rewrite the whole theme”
- “Make it like Apple”
- “Replace Shopify cart with custom JS”
- “Simplify all Liquid”
- “Remove unused-looking code”
