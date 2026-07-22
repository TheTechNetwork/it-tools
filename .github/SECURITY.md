# Security Policy

## Supported versions

IT-Tools is a continuously deployed web application. Security fixes are applied
to the `main` branch and shipped with the next release and Docker image. Only
the latest release and the `latest` / `nightly` Docker tags are supported.

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities.

Instead, report them privately through GitHub's
[private vulnerability reporting](https://github.com/thetechnetwork/it-tools/security/advisories/new).
This creates a private advisory visible only to you and the maintainers.

When reporting, please include as much of the following as you can:

- A description of the vulnerability and its impact
- Steps to reproduce or a proof of concept
- The affected tool(s), URL(s), or component(s)
- Any suggested remediation

## Scope

All tools run entirely client-side in the browser; there is no backend that
processes user data. The most relevant classes of issue are therefore:

- Cross-site scripting (XSS) or HTML/markdown injection in a tool's output
- Dependency vulnerabilities that reach the shipped bundle
- Supply-chain or build/release pipeline weaknesses

## Disclosure

We aim to acknowledge reports within a reasonable time frame, keep you updated
on remediation progress, and credit reporters who wish to be acknowledged once
a fix is released.
