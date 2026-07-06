<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working conventions

## Pull requests

- When work is complete, always update the pull request description so it accurately reflects the current implementation. Include all actual changes and remove any outdated information from previous iterations. Treat the PR description as a living document.

## Before requesting review or merging

- Ensure that all checks and validations pass successfully.
- Verify the following are updated when applicable: `CLAUDE.md`/`AGENTS.md`, `README`, and landing page content and related documentation.

## Code quality

- Research relevant best practices for the implemented changes (including external sources when beneficial) and look for opportunities to simplify the implementation. The primary objective is to keep the codebase clean, maintainable, scalable, and easy to understand.
- Where appropriate, evaluate whether the database schema can be simplified or improved to better align with best practices. Proactively suggest schema enhancements that would make the system clearer, more scalable, or easier to maintain.
- Ensure comprehensive test coverage for all newly introduced functionality, including both happy paths and relevant edge cases.
