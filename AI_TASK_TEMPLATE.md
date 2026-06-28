# AI Task Template

Use this when asking Claude, Cursor, Codex or Copilot to modify the theme.

## Task

Describe exactly what should be changed.

Example:
Create a premium hero section for the homepage.

## File Scope

Only edit:
- sections/premium-hero.liquid
- assets/base.css

Do not edit unrelated files.

## Shopify Logic to Preserve

Preserve:
- Shopify section schema
- block support
- app block support if present
- existing theme settings
- product/cart logic if touched

## Design Direction

The result should feel:
- premium
- modern
- clean
- mobile-first
- conversion-focused

## Requirements

- Use semantic HTML
- Use editable section settings
- Avoid hardcoded copy where settings make sense
- Avoid unnecessary JavaScript
- Keep CSS maintainable
- Do not add dependencies
- Do not break Shopify preview/theme editor

## Output

When done, explain:
- files changed
- what was added
- what Shopify logic was preserved
- what I should test in Shopify preview
