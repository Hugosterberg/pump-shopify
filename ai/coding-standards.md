# Coding Standards

## Liquid

- Keep Liquid readable.
- Preserve existing objects and conditions.
- Do not hardcode product prices or variant IDs.
- Use Shopify routes and objects where possible.
- Keep schema JSON valid.
- Support blocks when a section is meant to be flexible.

## CSS

- Mobile-first.
- Use clear component class names.
- Avoid overly generic class names.
- Keep animations lightweight.
- Avoid huge global overrides when section-scoped CSS would be safer.

## JavaScript

- Use minimal vanilla JS only when needed.
- Do not create custom ecommerce state unless required.
- Do not replace Shopify cart logic casually.
- Avoid heavy dependencies.

## Accessibility

- Use semantic HTML.
- Buttons should be buttons, links should be links.
- Keep visible focus states.
- Maintain label relationships.
- Do not remove aria attributes without understanding them.

## Performance

- Lazy-load below-the-fold images.
- Avoid layout shift.
- Keep JS small.
- Prefer CSS over JS.
