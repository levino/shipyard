# Gemini CLI Integration Setup Guide

This guide explains how to configure the Gemini CLI integration for your GitHub repository.

## Overview

The Gemini CLI integration provides three main capabilities:
1. **Code Review** (`@gemini-cli /review`) - Automated PR reviews
2. **Issue Triage** (`@gemini-cli /triage`) - Automatic issue labeling
3. **General Assistant** (`@gemini-cli`) - Implementation assistance (requires approval)

## Required GitHub Secrets

Configure these secrets in your repository settings (Settings → Secrets and variables → Actions):

### Essential Secrets

1. **`GEMINI_API_KEY`** or **`GOOGLE_API_KEY`** (at least one required)
   - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Or use Google Cloud's Vertex AI (see GCP setup below)

2. **`APP_PRIVATE_KEY`** (recommended but optional)
   - Private key for a GitHub App with permissions:
     - Contents: Read
     - Issues: Write
     - Pull Requests: Write
   - Allows Gemini to post comments as the app instead of using the default GITHUB_TOKEN

## Required GitHub Variables

Configure these variables in your repository settings (Settings → Secrets and variables → Actions → Variables):

### Essential Variables

1. **`GEMINI_MODEL`** (required)
   - Example: `"gemini-2.0-flash-exp"` or `"gemini-1.5-pro"`
   - See [available models](https://ai.google.dev/models)

2. **`GEMINI_CLI_VERSION`** (required)
   - Example: `"0.16.0"`
   - Check [latest version](https://www.npmjs.com/package/@google/gemini-cli)

### Optional Variables

3. **`APP_ID`** (optional, required if using `APP_PRIVATE_KEY`)
   - Your GitHub App ID

4. **`DEBUG`** or **`ACTIONS_STEP_DEBUG`** (optional)
   - Set to `true` to enable debug logging
   - Default: `false`

### GCP/Vertex AI Variables (optional)

If using Google Cloud's Vertex AI instead of the direct API:

5. **`GOOGLE_GENAI_USE_VERTEXAI`** - Set to `true`
6. **`GOOGLE_CLOUD_LOCATION`** - GCP region (e.g., `"us-central1"`)
7. **`GOOGLE_CLOUD_PROJECT`** - Your GCP project ID
8. **`SERVICE_ACCOUNT_EMAIL`** - Service account email
9. **`GCP_WIF_PROVIDER`** - Workload Identity Federation provider
10. **`GOOGLE_GENAI_USE_GCA`** - Set to `true` to use Gemini Code Assist

## Quick Setup (Minimal Configuration)

For a basic setup, you only need:

1. **Secrets:**
   - `GEMINI_API_KEY` (from Google AI Studio)

2. **Variables:**
   - `GEMINI_MODEL`: `gemini-2.0-flash-exp`
   - `GEMINI_CLI_VERSION`: `0.16.0`

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

Check:
1. Required secrets are configured (especially `GEMINI_API_KEY`)
2. Required variables are configured (`GEMINI_MODEL`, `GEMINI_CLI_VERSION`)
3. Your API key is valid and has quota remaining
4. Check the [Actions tab](../../actions) for workflow logs

### "Workflow failed with authentication error"

This means:
- `GEMINI_API_KEY` or `GOOGLE_API_KEY` is missing or invalid
- If using Vertex AI, check your GCP credentials

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

- [Gemini CLI Documentation](https://github.com/google-github-actions/run-gemini-cli)
- [Google AI Studio](https://aistudio.google.com/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Creating a GitHub App](https://docs.github.com/en/apps/creating-github-apps)

## Support

If you encounter issues:
1. Check the [workflow logs](../../actions) for detailed error messages
2. Verify all required secrets and variables are configured
3. Test your API key independently
4. Check Google AI Studio for quota limits
