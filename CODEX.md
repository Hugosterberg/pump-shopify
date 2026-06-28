# Codex Instructions — Pump Portable Theme

You are working in a Shopify theme repository.

## Objective

Build a custom premium storefront for Pump Portable using Shopify theme architecture.

## Constraints

This is not a React app.

Use:
- Liquid
- JSON templates
- sections
- snippets
- assets
- config
- locales

## Protected Areas

Be careful with:

- layout/theme.liquid
- templates/product*.json
- sections/main-product.liquid
- sections/main-cart*.liquid
- snippets/product-form*
- snippets/price*
- snippets/product-media*
- snippets/cart*
- config/settings_schema.json
- locales/*.json

Do not remove unknown Shopify logic just because it looks unused.

## Workflow

For each task:

1. Inspect relevant files.
2. Identify commerce-critical logic.
3. Make the smallest safe change.
4. Preserve schema and block compatibility.
5. Explain what changed.
6. Suggest what to test.

## Testing Checklist

After changes, verify:

- product page loads
- variant selection works
- add to cart works
- cart updates
- checkout link works
- mobile layout works
- app blocks still render
- theme editor settings still work
- no Liquid syntax errors
