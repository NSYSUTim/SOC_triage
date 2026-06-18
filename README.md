# SOC Triage Demo

DeepCASE-style SOC event aggregation and incident-triage frontend demo.

This repository contains the React + TypeScript interface used to present the
capstone/research results for SOC alert aggregation. It is intentionally a
frontend demo with mock data: the heavy DeepCASE reproduction, research variants,
and formal AIT-ADS runs live in the companion research workspace.

## Project Scope

The demo visualizes the workflow described in the report:

- DeepCASE-style context modeling and DBSCAN-based interpretation.
- Cross-host and hierarchical-context variants as supporting ablations.
- Class-rebalanced incident triage as the main proposed method.
- Analyst-facing views for priority ranking, cluster interpretation, rejection
  behavior, entity evidence, timeline review, and LLM-assisted response notes.

The current public-facing data is aligned with the formal report snapshot dated
2026-06-18.

## Formal Result Snapshot

| Method | Clusters | Workload Reduction | Cluster Purity | Auto-Decided Rate | Reject Rate | Binary F1 | Weighted F1 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | 35 | 0.9373 | 0.9874 | 0.9468 | 0.0532 | 0.7617 | 0.0055 |
| Cross-Host | 40 | 0.9410 | 0.9799 | 0.9019 | 0.0981 | 0.7638 | 0.0006 |
| Hierarchical Context | 87 | 0.9383 | 0.9792 | 0.9423 | 0.0577 | 0.7796 | 0.0066 |
| Rebalanced | 36 | 0.9365 | 0.9875 | 0.9307 | 0.0693 | 0.8088 | N/A |

The strongest defensible claim is the baseline-versus-rebalanced comparison:
both use the same processed-file-order sequential split, and rebalanced improves
binary incident F1 from 0.7617 to 0.8088 while preserving cluster quality.
Cross-host and hierarchical-context are shown as supporting ablations because
their sequence builders use timestamp sorting before splitting.

## Demo Pages

| Page | Purpose |
| --- | --- |
| Dashboard | Method results, triage metrics, and top priority incidents |
| Incidents | Sortable/filterable incident queue with Top-K review |
| Incident Detail | Cluster evidence, timeline, entity context, and AI response notes |

## Quick Start

```powershell
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.
Hosted demo: [soc-triage.vercel.app](https://soc-triage.vercel.app/).

For a production build:

```powershell
npm run build
```

## Repository Structure

```text
src/
  components/    Reusable UI components for badges, cards, reports, timeline
  mocks/         Report-aligned mock incidents and formal method metrics
  pages/         Dashboard, incident queue, and incident detail views
  types/         TypeScript models used by the demo

figures/         SVG figures referenced by the report snapshot
```

## Notes For Reviewers

- This repository does not train or evaluate DeepCASE models directly.
- Mock incidents are illustrative samples derived from the report's SOC triage
  workflow, not a replacement for the formal experiment outputs.
- The formal text snapshot is kept in
  `report_sections_vi_ix_formal_latest.md` for easy review on GitHub.
- The public claim should remain conservative: the rebalanced variant is the
  strongest split-controlled improvement; context variants are useful ablations
  that still need stricter split-unified validation.

## Tech Stack

- React 18
- TypeScript 5
- Vite 6
- React Router
- Lucide React

## License

MIT
