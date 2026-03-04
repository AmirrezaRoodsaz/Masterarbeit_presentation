# Sync Protocol

## Trigger
When the user says **"sync"**, execute the following steps automatically:

## Steps

1. **Check status:** Run `git status` to see all changes
2. **Stage changes:** Run `git add -A` to stage everything (`.gitignore` handles exclusions)
3. **Generate commit message:** Analyze the staged diff and write a concise, descriptive commit message summarizing the session's work
4. **Commit:** Create the commit with the generated message + co-author tag
5. **Push:** Run `git push origin main`
6. **Confirm:** Report back what was pushed (files changed, insertions, deletions)

## Commit Message Format
```
<type>: <short summary>

<optional body with details>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

**Types:** `feat` (new feature/slide), `fix` (correction), `style` (design change), `docs` (documentation), `refactor` (restructure), `chore` (maintenance)

## Remote
- **Origin:** https://github.com/AmirrezaRoodsaz/Masterarbeit_presentation.git
- **Branch:** main
