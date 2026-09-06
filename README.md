# markdown-confluence/publish-action GitHub Action

This GitHub Action wraps up an NPM CLI that allows you to publish your Markdown files to Confluence quickly and easily. By using this action in your workflows, you can automate the process of publishing documentation to Confluence, making it faster, more streamlined, and more efficient.

## Usage

To use this GitHub Action in your repository, you'll need to create a workflow file (e.g., `.github/workflows/publish.yml`) and configure the action as described below.

### Basic example

```yaml
name: Publish to Confluence
on: push

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
      
      - name: Publish Markdown to Confluence
        uses: markdown-confluence/publish-action@v6
        with:
          confluenceBaseUrl: https://your-domain.atlassian.net
          confluenceParentId: 123456
          atlassianUserName: ${{ secrets.ATLASSIAN_USERNAME }}
          atlassianApiToken: ${{ secrets.ATLASSIAN_API_TOKEN }}
          folderToPublish: docs
          contentRoot: .
```

### Example using a config file

Create a `.markdown-confluence.json` file in your repository with the following content:

```json
{
  "confluenceBaseUrl": "https://your-domain.atlassian.net",
  "confluenceParentId": "123456",
  "atlassianUserName": "your-email@example.com",
  "folderToPublish": "docs",
  "contentRoot": "."
}
```

Then configure the GitHub Action in your workflow file:

```yaml
name: Publish to Confluence
on: push

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
      
      - name: Publish Markdown to Confluence
        uses: markdown-confluence/publish-action@v6
        with:
          configFile: .markdown-confluence.json
          atlassianApiToken: ${{ secrets.ATLASSIAN_API_TOKEN }}
```


## Input Options

This section provides an overview of all the input options available for the `markdown-confluence/publish` GitHub Action and examples of how to use them in your workflows.

### confluenceBaseUrl

The base URL of your Confluence instance, used for API calls and publishing content. For Confluence Cloud, use the Atlassian site URL without `/wiki` and without a trailing slash.

Example:

```yaml
with:
  confluenceBaseUrl: https://your-domain.atlassian.net
```

### confluenceParentId

The ID of an existing Confluence page where the Markdown files will be published as child pages. The action uses this page to determine the target Confluence space; there is no separate `spaceKey` input.

Example:

```yaml
with:
  confluenceParentId: 123456
```

### atlassianUserName

Your Atlassian account's username, required for authentication when interacting with Confluence.

Example:

```yaml
with:
  atlassianUserName: ${{ secrets.ATLASSIAN_USERNAME }}
```

### atlassianApiToken

An API token generated for your Atlassian account, used for authentication when making API calls to Confluence. This value should be stored as a repository secret.

Example:

```yaml
with:
  atlassianApiToken: ${{ secrets.ATLASSIAN_API_TOKEN }}
```

### folderToPublish

The folder you want to apply a default of `connie-publish: true` to. It is evaluated relative to `contentRoot`. All Markdown files under this folder will be considered for publishing unless their frontmatter sets `connie-publish: false`.

Example:

```yaml
with:
  folderToPublish: docs
```

### contentRoot

The root path the action searches for Markdown files and referenced content. In GitHub Actions this is usually `.` for the checked-out repository, or a subdirectory such as `docs` when all publishable files live there.

Example:

```yaml
with:
  contentRoot: .
```

### configFile

A configuration file containing additional settings and customizations for the publishing process. You can use this option to keep your workflow file clean and maintain all configuration settings in a separate file.

Example:

```yaml
with:
  configFile: .markdown-confluence.json
```

## Advanced Example

Here's an example of using all input options in a single workflow:

```yaml
name: Publish to Confluence
on: push

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
      
      - name: Publish Markdown to Confluence
        uses: markdown-confluence/publish-action@v6
        with:
          confluenceBaseUrl: https://your-domain.atlassian.net
          confluenceParentId: 123456
          atlassianUserName: ${{ secrets.ATLASSIAN_USERNAME }}
          atlassianApiToken: ${{ secrets.ATLASSIAN_API_TOKEN }}
          folderToPublish: docs
          contentRoot: .
          configFile: .markdown-confluence.json
```

Remember to create and configure the `.markdown-confluence.json` file in your repository as needed.

## Troubleshooting

### Error: Missing Space Key

The action does not require a `spaceKey` setting. It reads the space key from the Confluence parent page identified by `confluenceParentId`.

If you see `Error: Missing Space Key`, check that:

- `confluenceParentId` is the numeric ID of an existing page, not the page title or URL.
- `confluenceBaseUrl` is the Atlassian site URL, for example `https://your-domain.atlassian.net`, without `/wiki`.
- `atlassianUserName` and `atlassianApiToken` belong to a user that can view the parent page and create child pages in that space.
- The parent page is in the Confluence site configured by `confluenceBaseUrl`.

### `folderToPublish` vs `contentRoot`

Use `contentRoot` to choose the directory the action scans. Use `folderToPublish` to choose which Markdown files under that root are published by default.

For example, this scans the whole repository but publishes files under `docs`:

```yaml
with:
  contentRoot: .
  folderToPublish: docs
```

This scans only the `docs` directory and publishes every Markdown file found there:

```yaml
with:
  contentRoot: docs
  folderToPublish: .
```

### Storing API token as a repository secret

To store your Atlassian API token as a repository secret, follow these steps:

1. Go to your GitHub repository and click on the "Settings" tab.
2. In the left sidebar, click on "Secrets".
3. Click on the "New repository secret" button.
4. Enter `ATLASSIAN_API_TOKEN` as the name and paste your API token as the value.
5. Click on the "Add secret" button.

Now you can reference the `ATLASSIAN_API_TOKEN` secret in your GitHub Actions workflows using the syntax `${{ secrets.ATLASSIAN_API_TOKEN }}`.


## Support

If you need help with using this action or encounter any issues, please open an issue in the [GitHub repository](https://github.com/markdown-confluence/markdown-confluence/issues).

## License

This GitHub Action is released under the Apache 2.0 License.

## Version 6

This action uses the immutable `ghcr.io/markdown-confluence/publish:6.0.0` container, with Node.js 24.15.0 and Debian Chromium. The action runs as root to write page IDs and URLs to GitHub's mounted checkout.

Use `confluenceAuthType: oauth2`, `atlassianClientId` and `atlassianClientSecret` for service-account authentication. Set `confluenceBaseUrl` to the Atlassian API gateway and `confluenceSiteUrl` to the browsable site. Basic API tokens remain the default.

`tagsToPublish` selects additional YAML-tagged notes. `mermaidProtocolTimeout` raises the rendering timeout for large diagrams. PlantUML is opt-in through `plantumlEnabled` and `plantumlServerUrl`; source text is sent to that server. Other settings, including page headers, footers and ignored languages, can be supplied in the configuration file.

Read the [version 6 migration guide](https://github.com/markdown-confluence/markdown-confluence/blob/main/documentation/MIGRATING_TO_6.md) before updating an existing publishing tree.
