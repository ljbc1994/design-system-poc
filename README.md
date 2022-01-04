# Design System POC

This shows how we can have a single source of truth for design tokens which can trigger PRs to update packages for our UI library and native app library.

Another benefit to this is that we can intercept payloads from figma and generate custom content for the PRs (i.e. showing the change in colour and who requested the change). 

To test this, you can use the [Figma Demonstration](https://optimistic-banach-c11f31.netlify.app/) and change a value. This will trigger a PR with the change made.

