# MonoMuse — Data-Driven Museum Ticketing Redesign

A two-phase project where I used SQL analysis on 12,700+ interaction events to diagnose why a museum's ticket-purchase funnel was underperforming, then built a redesigned, responsive front end to fix the specific problems the data surfaced.

---

## The problem

MonoMuse's simulated visitor funnel was nearly **2x longer** than the industry benchmark (10.09 steps vs. a 5.1-step standard), and only **29.5%** of sessions ever reached a ticket page.

## Phase A — Diagnosing the funnel with SQL

Designed a relational schema (`USER`, `SESSION`, `PAGE`, `PAGEVISIT`, `TRANSACTION`) and wrote multi-table analytical queries over **1,259 sessions** and **12,707 page-visit events** to answer three questions:

| Question | Method | Finding |
|---|---|---|
| Is the funnel actually too long? | Segmented avg. step count across all / ticket-page / converted sessions | 10.09 avg steps vs. 5.1 benchmark — and converted users took *just as many* steps as everyone else, ruling out "users just leave" |
| Do checkout errors or user type explain the drop-off? | Joined `USER` + `SESSION` + `PAGEVISIT`, segmented by error flag and `user_type` | Guest (9.44%) and registered (9.49%) users converted almost identically — authentication wasn't the lever. All form errors were isolated to one page (`tickets_checkout`) |
| Which entry point converts best? | Identified each session's first page visit via `MIN(timestamp)`, joined to conversion outcome | **2.3x spread** between best (`exhibition_list`, 14.2%) and worst (`search_results`, 6.3%) entry pages — conversion was driven by *where users start*, not how long they browse |

**Conclusion:** the bottleneck was the absence of clear conversion paths on high-intent pages. That insight became the spec for Phase B.

## Phase B — Rebuilding the front end around the data

Translated each finding into a concrete design decision:

- **Consistent global navigation + active-state indicators** across every page, so low-intent browsers always have a visible path to purchase (directly targets the "stable browsing depth, unstable conversion" finding)
- **Exhibitions and Visit pages rebuilt as conversion destinations** — embedded a YouTube IFrame API video on Exhibitions and an interactive Leaflet/OpenStreetMap on Visit, since those pages corresponded to the highest-converting entry patterns in the data
- **Linear ticket → checkout flow** (pricing → checkout with field-level validation → confirmation) replacing a fragmented ticket experience, addressing the checkout-error concentration found in Phase A
- **Responsive nav with mobile toggle**, semantic landmarks, descriptive alt text, and keyboard accessibility throughout
- Layout system: **CSS Grid** for page structure, **Flexbox** for component-level alignment, for a consistent design language across pages
- Documented design system (logo, color palette, type scale) plus external dependency citations (jQuery, Leaflet, YouTube API, Google Fonts)

## Why this project matters

This was data analysis used to scope a build instead of simply building a website. Every UI decision in Phase B traces back to a specific number from Phase A's queries. That loop (instrument → query → diagnose → ship → re-justify) is the same one I use in production work.

## Stack

SQL (MySQL/phpMyAdmin) for analysis · HTML/CSS/JS for the front end · Leaflet + OpenStreetMap · YouTube IFrame API

## Structure

```
/sql-analysis/       funnel diagnosis queries + findings
/design-guide/        logo, palette, typography
/site/                 homepage, explore, exhibitions, tickets, checkout, support, visit
```

---

*Built for 67-250 (The Information Systems Milieux) at Carnegie Mellon University.*
