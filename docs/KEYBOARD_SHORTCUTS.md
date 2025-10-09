# Keyboard Shortcuts Guide

Complete reference for all keyboard shortcuts in the Mastra Visual Builder.

## 🎯 Quick Reference

| Shortcut               | Action                  | Context       |
| ---------------------- | ----------------------- | ------------- |
| `Delete` / `Backspace` | Delete selected node    | Node selected |
| `Ctrl/Cmd + Z`         | Undo last action        | Always        |
| `Ctrl/Cmd + Y`         | Redo last undone action | Always        |
| `Ctrl/Cmd + C`         | Copy selected node      | Node selected |
| `Ctrl/Cmd + V`         | Paste copied node       | After copy    |
| `Ctrl/Cmd + D`         | Duplicate selected node | Node selected |
| `Escape`               | Deselect all nodes      | Always        |
| `Ctrl/Cmd + S`         | Save project            | Always        |
| `?`                    | Show shortcuts help     | Always        |

## 📋 Detailed Shortcuts

### Node Operations

#### Delete Node

- **Windows/Linux:** `Delete` or `Backspace`
- **macOS:** `Delete` or `Backspace`
- **Action:** Removes the currently selected node and its connections
- **Undo:** `Ctrl/Cmd + Z` to restore

#### Copy Node

- **Windows/Linux:** `Ctrl + C`
- **macOS:** `Cmd + C`
- **Action:** Copies the selected node's configuration to clipboard
- **Note:** Does not copy connections

#### Paste Node

- **Windows/Linux:** `Ctrl + V`
- **macOS:** `Cmd + V`
- **Action:** Creates a new node with copied configuration
- **Position:** Offset from original node
- **New ID:** Automatically generates new unique ID

#### Duplicate Node

- **Windows/Linux:** `Ctrl + D`
- **macOS:** `Cmd + D`
- **Action:** Creates a copy with new ID in one step
- **Position:** Offset from original
- **Alternative:** Copy + Paste

### History Operations

#### Undo

- **Windows/Linux:** `Ctrl + Z`
- **macOS:** `Cmd + Z`
- **Action:** Reverts last change
- **Scope:** Node add/edit/delete, edge add/delete, config changes
- **Limit:** Last 50 actions

#### Redo

- **Windows/Linux:** `Ctrl + Y`
- **macOS:** `Cmd + Y`
- **Action:** Reapplies last undone action
- **Note:** Redo stack clears when new action is performed

### Selection & Navigation

#### Deselect All

- **Shortcut:** `Escape`
- **Action:** Clears all node selections
- **Use Case:** When you want to pan the canvas or click empty space

### Project Operations

#### Save Project

- **Windows/Linux:** `Ctrl + S`
- **macOS:** `Cmd + S`
- **Action:** Opens save dialog
- **Options:** Save to browser storage or download file
- **Auto-save:** Also saves automatically every 30 seconds

#### Help

- **Shortcut:** `?`
- **Action:** Opens keyboard shortcuts reference dialog
- **Close:** `Escape` or click outside

## 🎨 Canvas Navigation

### Mouse & Trackpad

| Action            | Method                                  |
| ----------------- | --------------------------------------- |
| **Pan Canvas**    | Click and drag on empty space           |
| **Zoom In**       | Mouse wheel up / Pinch out              |
| **Zoom Out**      | Mouse wheel down / Pinch in             |
| **Select Node**   | Click on node                           |
| **Multi-select**  | Click while holding `Shift`             |
| **Connect Nodes** | Drag from output handle to input handle |

### Zoom Controls

| Control             | Action                       |
| ------------------- | ---------------------------- |
| **Mouse Wheel**     | Scroll up/down to zoom       |
| **Zoom In Button**  | Click `+` in zoom controls   |
| **Zoom Out Button** | Click `-` in zoom controls   |
| **Fit View**        | Click fit button             |
| **Reset Zoom**      | Double-click on empty canvas |

## 📝 Text Editing

### In Code Editors

| Shortcut       | Action           |
| -------------- | ---------------- |
| `Ctrl/Cmd + A` | Select all text  |
| `Ctrl/Cmd + F` | Find in code     |
| `Ctrl/Cmd + H` | Find and replace |
| `Tab`          | Indent           |
| `Shift + Tab`  | Outdent          |
| `Ctrl/Cmd + /` | Toggle comment   |
| `Ctrl/Cmd + ]` | Indent line      |
| `Ctrl/Cmd + [` | Outdent line     |

### In Text Fields

| Shortcut        | Action                              |
| --------------- | ----------------------------------- |
| `Tab`           | Move to next field                  |
| `Shift + Tab`   | Move to previous field              |
| `Enter`         | Confirm/submit (single-line inputs) |
| `Shift + Enter` | New line (multiline inputs)         |
| `Ctrl/Cmd + A`  | Select all                          |

## 🔧 Configuration Panel

### Schema Builder

| Action              | Shortcut         |
| ------------------- | ---------------- |
| **Add Field**       | Click `+` button |
| **Remove Field**    | Click `×` button |
| **Move Up**         | Click `↑` button |
| **Move Down**       | Click `↓` button |
| **Toggle Required** | Click checkbox   |

## 🎭 Context-Specific Shortcuts

### When Node is Selected

- `Delete` / `Backspace` → Delete node
- `Ctrl/Cmd + C` → Copy node
- `Ctrl/Cmd + D` → Duplicate node
- `Enter` → Open configuration panel
- `Escape` → Deselect node

### When Configuration Panel is Open

- `Escape` → Close panel and deselect node
- `Tab` → Navigate between fields
- `Ctrl/Cmd + S` → Save and keep panel open

### When Template Library is Open

- `Escape` → Close library
- `Enter` → Apply selected template
- `Arrow Keys` → Navigate templates
- Type to search templates

### When Validation Panel is Open

- `Escape` → Close panel
- `Enter` → Navigate to selected error
- `Arrow Keys` → Navigate errors

## 💡 Pro Tips

### Efficient Workflow

1. **Quick Duplicate:** Select node → `Ctrl/Cmd + D` → Position → Configure
2. **Multi-node Delete:** Select multiple nodes (Shift + Click) → `Delete`
3. **Rapid Undo:** Made mistake? Spam `Ctrl/Cmd + Z` until desired state
4. **Quick Save:** Hit `Ctrl/Cmd + S` frequently while building

### Power User Shortcuts

```
Create Agent:
1. Drag Agent from palette
2. Double-click to configure
3. Tab through fields
4. Ctrl/Cmd + Enter to save
5. Ctrl/Cmd + D to duplicate
6. Modify duplicate

Build Workflow:
1. Drag first Step
2. Configure with Tab navigation
3. Ctrl/Cmd + D to duplicate
4. Position and connect
5. Repeat until workflow complete
```

### Keyboard-Only Workflow

It's possible to build entirely with keyboard:

1. **Navigate palette** with arrow keys
2. **Add node** with Enter
3. **Select node** with Tab
4. **Configure** with Tab/Enter
5. **Copy/paste** with Ctrl/Cmd + C/V
6. **Connect** by selecting both nodes
7. **Save** with Ctrl/Cmd + S

## 🚫 Disabled Keys

These keys are intentionally disabled to prevent conflicts:

- `Ctrl/Cmd + R` - (Refresh) Would lose work
- `Ctrl/Cmd + W` - (Close tab) Would lose work
- `Ctrl/Cmd + Q` - (Quit) Would lose work
- `F5` - (Refresh) Would lose work

**Note:** Auto-save prevents data loss, but these are disabled for extra safety.

## 🔄 Future Shortcuts (Planned)

| Shortcut               | Planned Action  |
| ---------------------- | --------------- |
| `Ctrl/Cmd + F`         | Search nodes    |
| `Ctrl/Cmd + G`         | Group selection |
| `Ctrl/Cmd + Shift + G` | Ungroup         |
| `Ctrl/Cmd + L`         | Align nodes     |
| `Ctrl/Cmd + E`         | Export code     |
| `Ctrl/Cmd + I`         | Import project  |
| `Ctrl/Cmd + K`         | Command palette |

## 📱 Mobile/Touch Support

The Visual Builder is optimized for desktop. On mobile/tablet:

- **Touch** to select
- **Long press** for context menu
- **Two-finger drag** to pan
- **Pinch** to zoom
- **Double tap** to open config

---

**Quick Help:** Press `?` anytime to see this reference in-app!
