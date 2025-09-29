# 📚 ToncastDAO Documentation

This directory contains documentation assets for the ToncastDAO project.

## 📁 Structure

### 🖼️ Images (`images/`)
Contains PNG diagrams illustrating contract interaction flows:

- **`deposit-flow.png`** - Shows the complete process when users stake TONCAST tokens
- **`withdrawal-flow.png`** - Illustrates the withdrawal process with NFT verification
- **`epoch-system.png`** - Explains how the epoch reward system works

### 🔧 Source Files
Mermaid diagram source files for generating the PNG images:

- **`deposit-flow.mmd`** - Source for deposit flow diagram
- **`withdrawal-flow.mmd`** - Source for withdrawal flow diagram  
- **`epoch-system.mmd`** - Source for epoch system diagram

## 🔄 Updating Diagrams

To update the diagrams:

1. Edit the corresponding `.mmd` file
2. Generate new PNG using Mermaid CLI:
   ```bash
   mmdc -i docs/[diagram-name].mmd -o docs/images/[diagram-name].png -w 1200 -H 800 --theme default
   ```
3. Commit both the source `.mmd` file and generated `.png` file

## 🛠️ Requirements

To generate diagrams, you need Mermaid CLI:

```bash
npm install -g @mermaid-js/mermaid-cli
```

## 📖 Usage

The PNG images are referenced in the main README.md file and will display properly on GitHub, GitLab, and other platforms that support image rendering in markdown files.
