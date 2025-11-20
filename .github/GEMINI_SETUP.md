# Gemini CLI Integration Setup Guide

This guide explains how to configure the Gemini CLI integration for your GitHub repository.

> **Official Documentation**: https://github.com/google-github-actions/run-gemini-cli

## Overview

The Gemini CLI integration provides three main capabilities:
1. **Code Review** (`@gemini-cli /review`) - Automated PR reviews
2. **Issue Triage** (`@gemini-cli /triage`) - Automatic issue labeling
3. **General Assistant** (`@gemini-cli`) - Implementation assistance (requires approval)

**Important**: The workflows are based on [official Google examples](https://github.com/google-github-actions/run-gemini-cli/tree/main/examples/workflows).

## GitHub Configuration

### Required Secrets

Configure in: **Settings → Secrets and variables → Actions → Secrets**

1. **`GEMINI_API_KEY`** (REQUIRED)
   - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Free tier available for testing
   - Alternative: Use `GOOGLE_API_KEY` for Vertex AI mode

2. **`APP_PRIVATE_KEY`** (Optional but recommended)
   - Private key for a GitHub App
   - Allows Gemini to post as an app bot instead of using GITHUB_TOKEN
   - Required permissions: Contents (read), Issues (write), PRs (write)
   - [How to create a GitHub App](https://docs.github.com/en/apps/creating-github-apps)

### Optional Variables

Configure in: **Settings → Secrets and variables → Actions → Variables**

**Note**: These are OPTIONAL. The action has sensible defaults.

1. **`GEMINI_MODEL`** (optional, has defaults)
   - Example: `gemini-2.0-flash-exp` or `gemini-1.5-pro`
   - Default: Uses the action's default model
   - [Available models](https://ai.google.dev/models)

2. **`GEMINI_CLI_VERSION`** (optional)
   - Example: `0.16.0`
   - Default: `latest`
   - [Latest versions](https://www.npmjs.com/package/@google/gemini-cli)

3. **`APP_ID`** (optional, required if using `APP_PRIVATE_KEY`)
   - Your GitHub App ID
   - Found in GitHub App settings

4. **`DEBUG`** or **`ACTIONS_STEP_DEBUG`** (optional)
   - Set to `true` to enable debug logging
   - Default: `false`

### Advanced: GCP/Vertex AI Variables (optional)

If using Google Cloud's Vertex AI instead of the direct Gemini API:

5. **`GOOGLE_GENAI_USE_VERTEXAI`** - Set to `true`
6. **`GOOGLE_CLOUD_LOCATION`** - GCP region (e.g., `us-central1`)
7. **`GOOGLE_CLOUD_PROJECT`** - Your GCP project ID
8. **`SERVICE_ACCOUNT_EMAIL`** - Service account email
9. **`GCP_WIF_PROVIDER`** - Workload Identity Federation provider
10. **`GOOGLE_GENAI_USE_GCA`** - Set to `true` to use Gemini Code Assist

## Quick Setup (Minimal Configuration)

**Minimum required for basic setup:**

1. **ONE Secret (required):**
   - `GEMINI_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

2. **Variables (optional, recommended):**
   - All variables are optional and have defaults
   - Optionally set `GEMINI_MODEL` if you want a specific model

**That's it!** The action will use sensible defaults for everything else.

## How to Use

### Automated Actions

These trigger automatically:
- **New PR opened** → Automatic code review
- **New issue opened** → Automatic triage and labeling

### Manual Actions

Comment on issues/PRs with:
- `@gemini-cli` - Request implementation help (will post a plan for approval)
- `@gemini-cli /review` - Request code review on a PR
- `@gemini-cli /triage` - Request issue triage/labeling

### Approval Workflow

When using `@gemini-cli` for implementations:
1. Gemini posts a plan of action
2. A maintainer reviews the plan
3. Comment `/approve` to proceed or `/deny` to cancel
4. Gemini executes the approved plan and creates a PR

## Troubleshooting

### "I mentioned Gemini but nothing happened"

Check:
1. You have OWNER, MEMBER, or COLLABORATOR permissions
2. You mentioned `@gemini-cli` (not just "gemini")
3. The workflow isn't disabled in Settings → Actions

### "Gemini acknowledged but never reported back"

**Now with improved error reporting!** Gemini will post the actual error message to your issue/PR when it fails.

If you don't see an error comment:
1. Check the [Actions tab](../../actions) for workflow logs
2. Verify `GEMINI_API_KEY` is configured
3. Ensure your API key is valid and has quota
4. Check if the workflow timed out

### "Workflow failed with authentication error"

Look for the error comment on your issue/PR - it will contain the actual error from Gemini.

Common causes:
- `GEMINI_API_KEY` is missing, invalid, or revoked
- API quota exceeded (check Google AI Studio)
- If using Vertex AI, GCP credentials are incorrect

### "Workflow timed out"

Timeouts:
- Review workflow: 7 minutes
- Triage workflow: 7 minutes
- Invoke workflow: 15 minutes

If consistently timing out, check:
- API response times
- Network connectivity
- Consider using a faster model

## Security Notes

1. **API Key Protection**: Never commit API keys to your repository
2. **Permission Checks**: Only OWNER/MEMBER/COLLABORATOR can trigger workflows
3. **Fork Protection**: Auto-reviews don't run on PRs from forks (security)
4. **Approval Required**: Implementation requests require explicit `/approve`

## Additional Resources

### Official Documentation
- **Main Repo**: https://github.com/google-github-actions/run-gemini-cli
- **Example Workflows**: https://github.com/google-github-actions/run-gemini-cli/tree/main/examples/workflows
- **Configuration Guide**: https://github.com/google-github-actions/run-gemini-cli/blob/main/examples/workflows/CONFIGURATION.md
- **Gemini CLI Docs**: https://github.com/google-gemini/gemini-cli

### Google Services
- **Google AI Studio** (get API key): https://aistudio.google.com/app/apikey
- **Available Models**: https://ai.google.dev/models
- **Gemini CLI NPM**: https://www.npmjs.com/package/@google/gemini-cli

### GitHub Docs
- **GitHub Actions Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Creating a GitHub App**: https://docs.github.com/en/apps/creating-github-apps

## Support

If you encounter issues:
1. **Check error comments** - Gemini now posts actual errors to issues/PRs
2. **Review [workflow logs](../../actions)** for detailed error messages
3. Verify your `GEMINI_API_KEY` is configured and valid
4. Check Google AI Studio for quota limits or API key status
5. See official [troubleshooting](https://github.com/google-github-actions/run-gemini-cli#troubleshooting)
