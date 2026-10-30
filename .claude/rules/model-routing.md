## Model Routing

Sessions start on Sonnet. Delegate each subtask to the cheapest agent that can do it:

| Agent | Model / effort | Use for |
|---|---|---|
| `scout` | Haiku / low | Read-only search: finding files, definitions, usages; summarizing code |
| `builder` | Sonnet / medium | Routine implementation: well-specified edits, tests, small refactors, boilerplate, running builds |
| `reviewer` | Opus / high | Architecture and design decisions, code review, hard debugging |

- Start cheap and escalate only when the cheaper agent can't do it or got it wrong. Never pick `reviewer` "to be safe".
- Do a single read or one-line edit directly; spawning an agent for it costs more than it saves.
- Brief each agent fully: it sees only its prompt, not this conversation.
- Built-in agents (`general-purpose`, `Explore`, `Plan`) run on the main session's model. Prefer the three above.

### Escalating to a stronger model
A session cannot change its own model. Only the owner can, from the app's model menu or with `/model`.
- One hard piece (a design decision, a review, a bug whose cause is still unclear after a reasonable look): hand it to `reviewer`. No need to ask.
- The main session itself needs Opus for a sustained stretch (planning a multi-file feature or an architecture change, or several failed attempts at the same problem): before starting that stretch, say so in one line - "Suggest switching this session to Opus: <reason>" - and wait for the owner. If they say carry on, carry on with the current model.
- On Opus for routine work (edits, tests, small fixes), or the hard stretch is done: suggest switching back to Sonnet.
- Fable is for only the hardest long-running tasks. Suggest it the same way.
- Suggest a switch once per stretch of work, not repeatedly.
