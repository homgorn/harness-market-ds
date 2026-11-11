# Figma Plugin Developer Docs - Raw Fetch
URL: https://developers.figma.com/docs/plugins
Date: 2026-11-11

## Plugin API Access
- Read and write access to Figma editors
- Access via `figma` global object
- Access layers, properties (color, position, hierarchy, text)
- Dynamic file loading (pages loaded as needed)
- Limitations: styles/components only from current file; fonts only loaded via `loadFontAsync()`; no file metadata access

## Document Structure
- Tree of nodes, root = DocumentNode
- PageNodes for each page
- Node types: frames, components, vectors, rectangles, etc.
- Global properties + type-specific properties

## Asynchronous API
- Critical operations async (loading pages, fonts, images)
- Encouraged to use async methods

## Browser-Based
- Runs in `<iframe>`
- Access to browser APIs (network, local files, canvas, WebGL, WASM)

## User Actions
- One plugin + one action at a time
- No background plugins
- Can run immediately or with parameters
- Plugin UI: modal `<iframe>` with HTML/CSS/JS
- Parameters: input via quick actions menu (Ctrl+/ or Ctrl+P)
- Relaunch buttons: `setRelaunchData()` in manifest

## Plugin Management
- Support: developer responsibility (email/website)
- Versioning: immediate updates after approval; version history; security disclosure form updates
- Analytics: Figma doesn't provide; recommend own analytics; weekly engagement notifications from Community

## Manifest.json
- `relaunchButtons` array with command/name/multipleSelection
- Editor type specification (design_and_whiteboard, etc.)