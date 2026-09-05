---
name: ui-ux-pro-max
description: >-
  Design intelligence for building professional UI/UX, landing pages, dashboards, design systems, color palettes, typography pairings, and stack-specific best practices. Use when designing, reviewing, or implementing UI/UX components and landing pages.
---

# UI UX Pro Max

An AI skill that provides design intelligence for building professional UI/UX across multiple platforms and frameworks.

## Prerequisites

The bundled search script requires Python 3 (standard library only — no third-party packages, no network calls).

```bash
python --version
```

Path to search script:
`python .agents/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py`

---

## Core Capabilities & Workflow

### 1. Generate Design System (`--design-system`)
When starting a new project, landing page, or major UI feature, generate a complete design system tailored to the product category, audience, and industry:

```bash
python .agents/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "<product_keywords>" --design-system -p "<ProjectName>" -f markdown
```

Outputs:
- **Pattern**: Recommended landing page structure & conversion hierarchy
- **Style**: Visual style (e.g. Modern Minimalist, Bento Grid, Soft UI, Glassmorphism, etc.)
- **Colors**: Semantic palette (Primary, Secondary, Accent/CTA, Background, Surface, Border, etc.)
- **Typography**: Google Font pairings with CSS imports
- **Key Effects**: Micro-interactions, transitions, shadow elevations
- **Anti-patterns**: Industry-specific design mistakes to avoid
- **Pre-delivery Checklist**: Accessibility, touch targets, responsive breakpoints

### 2. Persist to Hierarchical Design System (`--persist`)
Save the design system as the global source of truth across sessions:

```bash
python .agents/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "<ProjectName>" --output-dir "."
```

Creates:
- `design-system/<project-slug>/MASTER.md` — Global source of truth
- `design-system/<project-slug>/pages/<page>.md` — Page-specific overrides

### 3. Targeted Domain Searches (`--domain`)
Search specific design aspects as needed:
- `--domain style`: Search 79 UI styles (Bento Grid, Glassmorphism, Brutalism, Minimalist, etc.)
- `--domain typography`: Search 74 curated Google Font pairings
- `--domain color`: Search 192 industry-specific color palettes
- `--domain landing`: Search 34 landing page conversion patterns
- `--domain chart`: Search 25 chart & data visualization recommendations
- `--domain ux`: Search 119 UX, accessibility (WCAG 2.2), touch target, and interaction rules
- `--domain icons`: Search icon design and accessibility guidelines

### 4. Stack-Specific Guidelines (`--stack`)
Get framework-specific best practices:
- `--stack nextjs` / `--stack react` / `--stack shadcn`
- `--stack html-tailwind`
- `--stack flutter`

---

## Quick Reference Rules & Priority

1. **Accessibility (CRITICAL)**:
   - Text contrast minimum 4.5:1 for normal text (3:1 for large text).
   - Visible focus indicators (2–4px) for all interactive elements.
   - Meaningful alt text & aria-labels for icon-only buttons.
   - Support `prefers-reduced-motion`.
2. **Touch & Interaction (CRITICAL)**:
   - Minimum touch target 44×44px (8px spacing).
   - `cursor-pointer` on all clickable web elements.
   - Smooth hover/active transitions (150–300ms).
   - Loading states with spinners on async buttons.
3. **Typography & Hierarchy**:
   - Clear visual hierarchy (H1 → H2 → H3).
   - Appropriate line-height (1.4–1.6 for body).
   - High readability fonts.
4. **Layout & Responsiveness**:
   - Mobile-first responsive design (375px, 768px, 1024px, 1440px).
   - Avoid horizontal page overflow.
