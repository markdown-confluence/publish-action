# markdown-confluence/publish GitHub Action

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
        uses: actions/checkout@v2
      
      - name: Publish Markdown to Confluence
        uses: markdown-confluence/publish@v1
        with:
          confluenceBaseUrl: https://your-confluence-instance-url
          confluenceParentId: 123456
          atlassianUserName: ${{ secrets.ATLASSIAN_USERNAME }}
          atlassianApiToken: ${{ secrets.ATLASSIAN_API_TOKEN }}
```

### Example using a config file

Create a `.markdown-confluence.json` file in your repository with the following content:

```json
{
  "confluenceBaseUrl": "https://your-confluence-instance-url",
  "confluenceParentId": "123456",
  "atlassianUserName": "your-email@example.com",
  "folderToPublish": "docs",
  "contentRoot": "/docs"
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
        uses: actions/checkout@v2
      
      - name: Publish Markdown to Confluence
        uses: markdown-confluence/publish@v1
        with:
          configFile: .markdown-confluence.json
          atlassianApiToken: ${{ secrets.ATLASSIAN_API_TOKEN }}
```


## Input Options

This section provides an overview of all the input options available for the `markdown-confluence/publish` GitHub Action and examples of how to use them in your workflows.

### confluenceBaseUrl

The base URL of your Confluence instance, used for API calls and publishing content. This value should include the protocol (e.g., `https://`) but not a trailing slash.

Example:

```yaml
with:
  confluenceBaseUrl: https://your-confluence-instance-url
```

### confluenceParentId

The ID of the parent page in Confluence where the Markdown files will be published as child pages.

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

The folder you want to apply a default of "connie-publish: true" to. All Markdown files within this folder will be considered for publishing.

Example:

```yaml
with:
  folderToPublish: docs
```

### contentRoot

The root path for published content on Confluence. This is used to tell the action where to look for Markdown files and content.

Example:

```yaml
with:
  contentRoot: /docs
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
        uses: actions/checkout@v2
      
      - name: Publish Markdown to Confluence
        uses: markdown-confluence/publish@v1
        with:
          confluenceBaseUrl: https://your-confluence-instance-url
          confluenceParentId: 123456
          atlassianUserName: ${{ secrets.ATLASSIAN_USERNAME }}
          atlassianApiToken: ${{ secrets.ATLASSIAN_API_TOKEN }}
          folderToPublish: docs
          contentRoot: /docs
          configFile: .markdown-confluence.json
```

Remember to create and configure the `.markdown-confluence.json` file in your repository as needed.

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