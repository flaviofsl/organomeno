---
name: Modern Fiscal Integrity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  numeric-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The brand personality of the design system is anchored in **Reliability, Transparency, and Precision**. It is designed for users who require high-level financial oversight while maintaining a sense of domestic harmony and family collaboration. The UI should evoke a feeling of calm control—transforming complex fiscal data into actionable clarity.

The chosen design style is **Corporate / Modern Minimalism**. It utilizes heavy whitespace to reduce cognitive load and emphasizes a structured information hierarchy. The aesthetic avoids unnecessary ornamentation, focusing instead on crisp alignment, subtle tonal shifts, and high-quality typography to establish authority and trust. This ensures that the family organizational chart and financial dashboards feel organized rather than cluttered.

## Colors

The palette is built on a foundation of **Trustworthy Blues** and **Professional Grays** to instill a sense of institutional security. 

- **Primary & Secondary:** A deep Navy (#0F172A) is used for high-level navigation and headers, while a vibrant Royal Blue (#2563EB) directs user action and highlights interactive elements.
- **Semantic Accents:** Success Green (#10B981) is reserved strictly for income, positive trends, and completed goals. Alert Red (#EF4444) is used for expenses, over-budget warnings, and critical debt indicators.
- **Neutrals:** A spectrum of cool grays provides soft contrast for borders and secondary text, ensuring the "Clean White" background remains the dominant surface for maximum readability.

## Typography

This design system uses a dual-font strategy to balance character with functionality. **Manrope** is used for headlines to provide a modern, geometric, and refined look that feels premium. **Inter** is utilized for body text and labels for its exceptional legibility at small sizes and its neutral, systematic feel.

For financial data, the `numeric-md` style must utilize **tabular figures** (tnum) to ensure that columns of numbers align perfectly in lists and tables, facilitating quick mental arithmetic and comparison. All labels use a slight letter spacing increase and uppercase transform when used in small metadata contexts.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop dashboards to ensure data visualization remains predictable and easy to scan, transitioning to a fluid model for tablet and mobile views. 

The layout relies on a **12-column grid** with a 24px gutter. A strict 8px spacing scale governs all internal component padding. Dashboards should utilize "Safe Zones"—large 32px external margins—to frame the content and reinforce the minimalist aesthetic. Family organizational charts should use an organic "Tree" layout but must snap to the underlying 8px grid to maintain visual rigor.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. This maintains the professional, clean look required for a financial tool.

- **Level 0 (Surface):** The main background uses a very light gray (#F8FAFC).
- **Level 1 (Cards):** Primary content containers are pure white with a 1px border (#E2E8F0).
- **Level 2 (Interaction):** Hover states and active dropdowns use a subtle, diffused ambient shadow (0px 4px 12px rgba(15, 23, 42, 0.05)) to suggest "lift" without creating visual noise.
- **Depth:** Use background dimming (30% opacity Navy) for modals to ensure the user's focus remains entirely on the transaction or data entry task at hand.

## Shapes

The shape language of this design system is **Soft**, utilizing a consistent 0.25rem (4px) base radius. This subtle rounding softens the "institutional" feel of the system, making it more approachable for family use while remaining sharp enough to feel professional.

- **Small Components:** Checkboxes and small tags use the 4px radius.
- **Large Components:** Main dashboard cards and the family organizational nodes use `rounded-lg` (8px) to create a clear container identity.
- **Interactive Elements:** Buttons and input fields mirror the 4px base radius for a cohesive, "snug" fit within the UI.

## Components

The components in the design system prioritize data density and clarity.

- **Minimalist Cards:** Cards should have no borders if they sit on a Level 0 surface, using only a subtle 1px border for definition. Header areas within cards should be separated by a light horizontal rule.
- **Buttons:** Primary buttons are solid Royal Blue with white text. Secondary buttons use a "Ghost" style (Blue text, no background) to maintain the minimalist feel.
- **Family Nodes:** For the organizational chart, use specialized "Node Cards" that include a small circular avatar, name, and role label, connected by 2px solid gray lines.
- **Data Inputs:** Fields should have a persistent label above the input area. On focus, the border transitions from Gray to Royal Blue.
- **Success/Alert Chips:** Small, high-contrast pills for "Income" and "Expense" indicators. These should use a 10% opacity background of the semantic color with 100% opacity text for maximum readability.
- **Data Visualization:** Line and bar charts should use a stroke width of 2px and avoid fills where possible to keep the interface "light."