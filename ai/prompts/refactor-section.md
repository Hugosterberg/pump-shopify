# Prompt — Refactor Existing Section Safely

Refactor the following Shopify section without breaking commerce logic.

## File

`<file-path>`

## Goal

`<describe visual/UX improvement>`

## Preserve

- all Shopify Liquid objects
- all forms
- all cart/product logic
- all section schema settings unless explicitly obsolete
- app block support
- accessibility attributes
- translation keys

## Rules

- Do not rewrite the entire file unless necessary.
- Improve layout and styling around protected logic.
- Keep schema valid.
- Do not hardcode product data.

## Output

Explain:

- changed files
- protected logic preserved
- visual improvements made
- what to test in Shopify preview
