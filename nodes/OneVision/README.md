# OneVision Node

`OneVision.node.ts` is the custom n8n node implementation for OneVision.

| Field | Value |
| --- | --- |
| Display name | `OneVision` |
| Internal name | `oneVision` |
| Saved workflow type | `n8n-nodes-onevision.oneVision` |
| Declared versions | `[1, 2, 3, 10]` |
| Credential type | `oneVisionApi` |
| Runtime entry | `dist/nodes/OneVision/OneVision.node.js` |

## File Role

The node source contains:

- n8n node metadata;
- resource and operation dropdowns;
- operation-specific UI fields;
- request construction and execution logic;
- error handling;
- compatibility metadata for saved workflows.

## Compatibility Warning

This file is a compatibility boundary for saved n8n workflows. Do not remove or rename the internal node name, credential type, declared support for `typeVersion: 10`, resource values, operation values, or parameter names without a migration plan.

Read these before editing:

- `../../README.md`
- `../../docs/BUILD_AND_RELEASE.md`
- `../../docs/WORKFLOW_COMPATIBILITY.md`

## Build

After editing this node, run:

```bash
npm run build
```

Commit matching `dist/` changes with runtime source changes.
