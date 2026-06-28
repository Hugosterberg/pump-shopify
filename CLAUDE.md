# Pump Portable Shopify Theme — Claude Instructions

You are working on a Shopify Online Store 2.0 theme for Pump Portable.

## Mission

Create a premium, high-converting, modern ecommerce storefront for pumpportable.com.

The design should feel:
- premium
- clean
- trustworthy
- conversion-focused
- mobile-first
- product-led
- slightly futuristic, but not gimmicky

Think Apple, Tesla, premium DTC brands, high-end fitness/lifestyle tech.

## Tech Context

This is a Shopify theme, not a React app.

Use:
- Liquid
- JSON templates
- Shopify sections and blocks
- CSS
- minimal JavaScript only when needed
- Shopify theme schema

Do not assume React, Next.js, TypeScript, npm components, shadcn/ui, or client-side routing unless explicitly added later.

## Golden Rule

Build the design from scratch, but do not rebuild Shopify commerce logic from scratch.

Preserve Shopify functionality.

## Protected Shopify Functionality

Do not break, remove, rename, or casually rewrite:

- product forms
- add-to-cart behavior
- variant picker behavior
- cart behavior
- cart drawer/cart page logic
- quantity selectors
- selling plans
- dynamic checkout buttons
- Shopify app blocks
- Shopify section schemas
- translation keys
- Shopify Liquid objects
- structured data
- product media/gallery logic
- localization/markets/currency logic
- customer account links
- checkout links
- accessibility attributes
- Shopify required attributes

If unsure, preserve the existing logic and only improve surrounding layout, styling, and content structure.

## AI Working Style

Work in small, safe steps.

Prefer:
- one section at a time
- one template at a time
- clear diffs
- minimal changes to commerce logic
- preserving existing Liquid conditions
- improving CSS architecture gradually

Avoid:
- rewriting the whole theme at once
- removing unknown code
- replacing Shopify forms with custom forms
- hardcoding product data
- hardcoding prices
- hardcoding variant IDs
- breaking app block support
- introducing heavy JavaScript

## Design System

Use a premium dark/light ecommerce system.

Suggested palette:
- background: #0B0F14
- surface: #111827
- surface soft: #17202B
- text: #F8FAFC
- muted text: #94A3B8
- accent: #38BDF8 or #22C55E
- warning/offer: #F59E0B
- border: rgba(255,255,255,0.08)

Typography:
- large confident headings
- short paragraphs
- strong product benefit copy
- clear CTAs
- no clutter

UX principles:
- mobile-first
- fast loading
- clear product value
- obvious CTA
- trust signals near CTA
- FAQ near bottom
- reviews/social proof visible
- simple navigation

## Sections to Build

Prioritize these custom sections:

1. premium hero
2. featured product / buy box
3. product benefits
4. how it works
5. before/after or problem/solution
6. comparison section
7. reviews/social proof
8. FAQ
9. sticky mobile add-to-cart
10. trust badges
11. footer

## Code Rules

- Keep Liquid readable.
- Keep section schemas valid JSON.
- Use semantic HTML.
- Use CSS classes consistently.
- Prefer CSS over JavaScript.
- Do not add dependencies without asking.
- Do not change unrelated files.
- Do not leave dead code.
- Do not invent unavailable Shopify settings.

## Output Expectations

When making changes:
1. Explain what changed.
2. Mention files changed.
3. Mention any Shopify functionality that was intentionally preserved.
4. Mention what should be tested in Shopify preview.
