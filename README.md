# n8n-nodes-onevision

Community node package for integrating n8n with the OneVision Workspace Server REST API.

This repository ships one custom n8n node, one credential type, compiled runtime files under `dist/`, and documentation for the live workflow compatibility contract.

[Install](#install) | [Credentials](#credentials) | [Repository Structure](#repository-structure) | [Build Semantics](#build-semantics) | [Runtime Semantics](#runtime-semantics) | [Compatibility Contract](#compatibility-contract) | [Operations](#operations) | [Validation](#validation)

## Install

### n8n Community Nodes

In n8n:

1. Go to **Settings > Community Nodes**.
2. Select **Install a community node**.
3. Enter `n8n-nodes-onevision`.
4. Install and restart n8n.

### Manual Install

```bash
npm install n8n-nodes-onevision
```

For repository development:

```bash
npm install
npm run build
```

## Credentials

Credential type: `oneVisionApi`

Defined in `credentials/OneVisionApi.credentials.ts`.

| Field | Purpose |
| --- | --- |
| API Key | OneVision Workspace Server API key sent as X-API-Key |
| Base URL | OneVision Workspace Server base URL |

## Repository Structure

Important tracked files and runtime outputs:

- `README.md`
- `LICENSE`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `credentials/OneVisionApi.credentials.ts`
- `credentials/OneVision.svg`
- `nodes/OneVision/OneVision.node.ts`
- `nodes/OneVision/OneVision.svg`
- `nodes/OneVision.svg`
- `dist/credentials/OneVisionApi.credentials.js`
- `dist/credentials/OneVisionApi.credentials.d.ts`
- `dist/credentials/OneVision.svg`
- `dist/nodes/OneVision/OneVision.node.js`
- `dist/nodes/OneVision/OneVision.node.d.ts`
- `dist/nodes/OneVision/OneVision.svg`
- `dist/nodes/OneVision.node.js`
- `dist/nodes/OneVision.node.d.ts`
- `dist/nodes/OneVision.svg`
- `docs/BUILD_AND_RELEASE.md`
- `docs/WORKFLOW_COMPATIBILITY.md`
- `nodes/OneVision/README.md`

## Build Semantics

Build command:

```bash
npm run build
```

Current build script:

```bash
node ./node_modules/typescript/bin/tsc
```

Development watch script:

```bash
node ./node_modules/typescript/bin/tsc --watch
```

The scripts call package entrypoints directly instead of relying on `node_modules/.bin` shims where possible. This keeps builds reliable on mounted shares where npm bin symlinks can be materialized as plain files.

Package manifest semantics:

| Field | Current value |
| --- | --- |
| Package | `n8n-nodes-onevision` |
| Runtime node entry | `dist/nodes/OneVision/OneVision.node.js` |
| Runtime credential entry | `dist/credentials/OneVisionApi.credentials.js` |
| Source node | `nodes/OneVision/OneVision.node.ts` |
| Source credential | `credentials/OneVisionApi.credentials.ts` |
| Icon | `file:OneVision.svg` |

More detail: [Build and Release](docs/BUILD_AND_RELEASE.md).

## Runtime Semantics

The node executes one n8n input item at a time.

1. Reads API Key and Base URL from oneVisionApi credentials.
2. Normalizes Base URL by trimming a trailing slash.
3. Sends REST requests to /ws/rest/* endpoints with Accept and X-API-Key headers.
4. Uses this.helpers.httpRequest(requestOptions).
5. Returns response data to n8n or throws NodeOperationError on failure.

## Compatibility Contract

This node is used by saved workflows in the live n8n instance. Backward compatibility includes node identity, declared versions, resource values, operation values, parameter names, icon loading, and editor hydration.

| Field | Value |
| --- | --- |
| Display name | `OneVision` |
| Internal node name | `oneVision` |
| Runtime workflow type | `n8n-nodes-onevision.oneVision` |
| Declared versions | `[1, 2, 3, 10]` |
| Credential type | `oneVisionApi` |
| Saved workflow usage | 10 saved OneVision nodes currently use typeVersion 10 in the live n8n database. |

Do not change these values without a saved-workflow migration and browser/editor validation.

More detail: [Workflow Compatibility](docs/WORKFLOW_COMPATIBILITY.md).

## Operations

The node currently exposes 11 resources and 50 operation values. The authenticated OneVision OpenAPI export captured on 2026-05-22 has 43 REST operations; each one has a typed operation below, with legacy convenience operations preserved for existing workflows.

| Resource Display | Resource Value | Operations |
| --- | --- | --- |
| Assembly Line | `assemblyLine` | activate, activateGet, deactivate, deactivateGet, getAll, getXml |
| Authentication | `authentication` | alive, login, logout |
| JMF | `jmf` | sendToAssemblyLine, sendToAssemblyLinePut, sendToMachine, sendToMachinePut |
| Job | `job` | delete, getAll, getFiles, getLog, getOverview, resumeActions, update |
| Job Start | `jobStart` | startHttp, startPace, startTicket |
| Module | `module` | getAll, getInfo, resumeContinueOnRest |
| Statistics | `statistics` | getCurrentAssemblyLines, getCurrentJobs, getCurrentMachines, getCurrentModules, getHistoryAssemblyLines, getHistoryMachines, getHistoryMetadata, getHistoryModules, getHistoryRunningJobs, getHistoryStartedFinished |
| Storage | `storage` | createFolder, deleteFile, getFile, getFolder, getMetadata, uploadFile |
| Substrate | `substrate` | getAll, getLastChanged |
| System | `system` | getBuildNumber, getJobStartEnabled, getSystemProblems, getVersion, setJobStartEnabled |
| API Request | `apiRequest` | make |

## Service Notes

- Job start, storage upload/delete, module resume, and system setting operations are mutating operations.
- Base URL should point at the OneVision server root; the node appends /ws/rest paths.
- API Request is an authenticated escape hatch under `/ws/rest`; it also accepts copied Swagger paths that start with `/rest/` and normalizes them under `/ws/rest`.
- `assemblyLine.activate` and `assemblyLine.deactivate` use the current API's `name` query parameter. The `activateGet` and `deactivateGet` variants exist because the OpenAPI exposes both GET and PUT methods.
- `system.setJobStartEnabled` sends `enable=TRUE|FALSE` as a query parameter, matching the current API.
- The runtime manifest points at dist/nodes/OneVision/OneVision.node.js, not the older flat dist node file.

## Validation

Minimum local validation:

```bash
npm run build
```

Minimum live validation after deployment:

1. Confirm n8n health is green.
2. Confirm n8n is loading the intended package commit.
3. Confirm the public icon route returns SVG.
4. Query saved workflows for `n8n-nodes-onevision.oneVision` nodes.
5. Validate saved `typeVersion` values against declared versions.
6. Validate saved `resource` and `operation` values against current option lists.
7. Open representative workflows in the n8n editor and verify icon, subtitle, resource, operation, and required fields.

Do not skip browser/editor validation after large node builds.

## Related Docs

- [Build and Release](docs/BUILD_AND_RELEASE.md)
- [Workflow Compatibility](docs/WORKFLOW_COMPATIBILITY.md)
- [Node-local notes](nodes/OneVision/README.md)
- [GitHub repository](https://github.com/GraphXCPI/n8n-nodes-onevision)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

See the repository license file.
