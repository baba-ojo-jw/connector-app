# Connector — Security Prioritization Course

**A 6-week course for the NYC Academy of Software Engineering**

---

## What This Course Is About

You've just joined a small startup called Connector — a social platform for teens. The CEO, Maya, hands you a codebase and a problem: the company has a list of 12 known security vulnerabilities, limited engineering time, and an investor meeting coming up. She needs your team to recommend the **top 5** things to fix, in order, and defend that list.

That's the whole course.

You'll learn to:

- Read unfamiliar code and spot what's dangerous
- Understand how architecture decisions make some bugs scarier than others
- Translate technical risk into language a non-technical leader can act on
- Defend your reasoning under pressure
- Work as a team when you don't all agree

You will **not** learn to:

- Memorize a list of vulnerability types
- Write exploits
- Patch every bug in the codebase

The goal is judgment, not coverage.

---

## How Each Week Works

- **One live session per week** (~2 hours)
- **Homework between sessions** — individual early in the course, team-based later
- **One final presentation** in Week 6 to "Maya" (instructor or guest) with live Q&A

All code, docs, and reference materials live in this repository.

---

## The Materials You'll Use

| Document | What It Is | When You'll Use It |
|---|---|---|
| `README.md` | Overview of Connector and its architecture | Week 1 |
| `docs/architecture.md` | How the pieces talk to each other | Weeks 1–3 |
| `docs/architecture.png` | Visual of the system | Every week |
| `docs/cve-list.md` | The official list of 12 known vulnerabilities | Week 2 onward |
| `docs/ceo-memo.md` | Maya's note explaining the business context | Weeks 3–6 |
| `src/` | The actual Connector codebase | Every week |

---

## Week 1 — Discover

**Theme:** *Before you can prioritize, you have to see.*

### Learning Objectives

By the end of this week, students will be able to:

1. Navigate an unfamiliar production codebase and describe what each part does.
2. Identify security-relevant code by reading it, independent of any checklist.
3. Use AI tools as a research assistant without outsourcing their own judgment.
4. Articulate why "finding the problem" is a separate skill from "fixing the problem."

### Live Session (≈2 hours)

| Time | Activity |
|---|---|
| 0:00–0:15 | Welcome. Meet Connector. Meet Maya. The scenario: you're a new hire, not a security consultant. |
| 0:15–0:35 | Walk through the `README.md` and `architecture.md` together. Ask: what would you attack first, if you were on the other side? |
| 0:35–1:00 | Live code tour of two files the instructor picks (suggested: `src/auth/login.js` and `src/frontend/profile.js`). The goal is to model the **reading** — what questions to ask as your eyes pass over the code. |
| 1:00–1:15 | Break |
| 1:15–1:40 | Short lecture: "What makes a security bug a security bug?" Cover: *trust boundaries* (who is allowed to do what), *inputs you don't control*, *secrets that aren't secret*, and *failing loudly vs. silently*. Keep this grounded in code, not definitions. |
| 1:40–1:55 | How to use AI for this homework. Live demo: paste a file into an AI chat, ask what's wrong, then **verify** against the code. Show an example where the AI is right and one where it's wrong or vague. |
| 1:55–2:00 | Assign homework. Answer questions. |

### Homework — Before Week 2

1. **Explore the repo and find security issues.** Browse the code. Read it yourself or use AI to help analyze it. Write down anything that looks wrong: what file it's in, what the problem seems to be, and why it matters. **No CVE list yet.**
2. **Read the full CVE list and compare.** Now open `docs/cve-list.md`. Which ones did you catch? Which ones did you miss? For each of the 12 CVEs, write a one-sentence plain-language summary of what it does.
3. **Map each CVE to the architecture.** Which component does it affect? Is that component internet-facing or internal?
4. **Pick your top 3 CVEs that worry you most** and write one sentence each explaining why. This is **individual** work. Every student should arrive at Week 2 with their own picks so the team has multiple perspectives to debate from.

### Instructor Notes

- Resist the urge to hint at specific CVEs during the code tour. The Week 1 homework depends on students feeling the difficulty of "I don't know what I don't know."
- Some students will lean hard on AI. That's fine — but in Week 2 you'll ask them to point to the line of code their AI flagged. Set that expectation now.
- A good sign: a student finds a vulnerability that isn't on the official 12-CVE list. Celebrate that. It means the exercise worked.

---

## Week 2 — Understand

**Theme:** *Not every bug is equally scary. Architecture is what makes the difference.*

### Learning Objectives

1. Read an architecture diagram and identify which components are exposed to the internet versus internal-only.
2. Explain why the same vulnerability in two different components can carry very different risk.
3. Use traffic volume, data sensitivity, and exposure as factors in prioritization.
4. Form and defend an individual opinion about what matters most.

### Live Session (≈2 hours)

| Time | Activity |
|---|---|
| 0:00–0:20 | Open floor: students share one CVE they found on their own that surprised them, and one they missed. No judgment — the point is normalizing the experience. |
| 0:20–0:50 | Architecture deep-dive. Walk through each component in the diagram with its traffic volume (from `README.md`). Ask: "If this component were compromised, what could an attacker do next?" Draw attack paths on a whiteboard. |
| 0:50–1:10 | Group exercise: for three sample CVEs (picked by instructor), the class collectively scores them on: **exposure** (internet vs. internal), **blast radius** (how many users), **exploit difficulty** (is this one curl command, or weeks of work?). Keep it informal — no rubric. |
| 1:10–1:20 | Break |
| 1:20–1:50 | Students share their top 3 with a partner and argue their picks. Each pair must come up with one thing they agree on and one thing they disagree on. |
| 1:50–2:00 | Assign teams for Week 3. Each team of 3–4 students will own a different subset of CVEs. Assign homework. |

### Homework — Before Week 3

1. **Deep dive on your assigned CVE.** Write a short brief (3–5 sentences) covering:
   - What the vulnerability does
   - Where it sits in the architecture
   - How many users it affects
   - What happens to the business if it gets exploited

   Use evidence from **all** the documents — not just the CVE list.
2. **Read the CEO Memo again with your top 5 in mind.** Can you explain each pick in a way that would make Maya confident she can defend it to investors?
3. **Team check:** make sure your shared workspace has the draft top 5 and all supporting notes accessible to everyone.

### Instructor Notes

- The partner debate in the live session is where most learning happens. Watch for students whose top 3 is entirely driven by "this sounds scary" vs. students who say "this one affects 200,000 requests a day, so…" Name both styles out loud. Both are valid inputs; neither is enough on its own.
- Teams should be assigned by you, not self-selected. Mix students who gravitate toward technical depth with students who gravitate toward business framing.
- Each CVE should have exactly one "owner" on each team. That person is the expert for Week 3.

---

## Week 3 — Investigate

**Theme:** *Become the expert on your piece. Then convince your team.*

### Learning Objectives

1. Produce a written technical brief that a non-engineer could understand.
2. Cite specific evidence from code, architecture, and business documents to support a claim.
3. Move from individual opinion to team consensus without flattening disagreement.
4. Recognize when a strongly-held individual opinion should survive a team vote, and when it shouldn't.

### Live Session (≈2 hours)

| Time | Activity |
|---|---|
| 0:00–0:10 | Quick check: every team opens their shared workspace. Instructor scans for gaps — missing briefs, no consolidated top 5 draft, etc. |
| 0:10–0:40 | CVE owners present their brief to their own team in 3 minutes each. Teammates ask one question each. This is rehearsal for Week 6. |
| 0:40–1:00 | Team working session: collapse all briefs into a **draft top 5**. Some CVEs will obviously make the cut. Others will fight for a slot. |
| 1:00–1:10 | Break |
| 1:10–1:40 | Cross-team swap. Each team sends one delegate to another team for 10 minutes to ask: "Why are you ranking X over Y?" Delegates return and share what they learned. Teams can revise. |
| 1:40–1:55 | Short lecture: "The CEO memo is not a checklist." Walk through `docs/ceo-memo.md` together. Point out the places where Maya is really telling you what she's worried about between the lines (investor trust, user safety, the payments launch, etc.). |
| 1:55–2:00 | Assign homework. |

### Homework — Before Week 4

1. **Write your argument:** for each of your team's top 5 CVEs, write **2–3 sentences** that you could say out loud in a presentation. Cover: what it is, why it matters, and what happens if you ignore it. **No jargon.**
2. **Write the "cut" argument:** pick the strongest CVE that didn't make your top 5 and write 2 sentences on why you left it out and what risk you're accepting.
3. **Start thinking about slides:** what's the structure of a 10-minute presentation that walks someone through 5 priorities? What goes on each slide?

### Instructor Notes

- The cross-team swap is new and will feel awkward. That's the point — in real work, your priorities get challenged by people with different context. Coach delegates to ask "why," not to defend.
- The "cut" CVE homework in Week 4 is one of the most valuable pieces in the whole course. **Risk acceptance** is a professional skill. Highlight it now so students don't treat it as a throwaway.
- Watch for teams where one loud student is dominating the top 5. Privately check in with quieter members about whether the list reflects their view.

---

## Week 4 — Argue

**Theme:** *A decision you can't explain isn't a decision.*

### Learning Objectives

1. Translate a technical finding into a 2–3 sentence spoken argument with no jargon.
2. Explain a deliberate exclusion as confidently as an inclusion.
3. Structure a short presentation so a non-expert stays with you from start to end.
4. Distinguish evidence (numbers, code, doc references) from assertion.

### Live Session (≈2 hours)

| Time | Activity |
|---|---|
| 0:00–0:20 | Warm-up drill: "Explain a CVE in one breath." Each student picks any CVE and delivers a 15-second verbal pitch to a peer. Peer gives one word of feedback: *clear*, *jargon*, or *so-what?*. Repeat 3 times with different peers and different CVEs. |
| 0:20–0:45 | Teams share their written arguments with another team. The other team plays "Maya" and asks: "What does that word mean?" every time jargon appears. Revise on the spot. |
| 0:45–1:00 | Short lecture: "The shape of a 10-minute pitch." Instructor walks through a sample deck skeleton: *the ask* → *the context* → *the five* → *what we cut and why* → *what we need from you*. |
| 1:00–1:10 | Break |
| 1:10–1:50 | Teams build their slide outlines. Not finished slides — just titles and one sentence per slide. Instructor walks between teams coaching. |
| 1:50–2:00 | Assign homework. Preview Week 5: it's a rehearsal, not a lecture. Come ready to stand up and talk. |

### Homework — Before Week 5

1. **Build a full first-draft deck.** 10 minutes' worth of slides. It does not need to be pretty. It needs to be complete. Use whatever tool the team prefers (Slides, Keynote, Figma, even whiteboard photos).
2. **Assign speaking roles.** Decide who says what. Every team member must speak at least once. Nobody speaks for more than 3 minutes straight.
3. **Write out the three hardest questions Maya might ask** your team, and a one-paragraph answer to each.

### Instructor Notes

- The jargon drill in the warm-up is funny and humbling. Students will over-explain the first few tries. By round 3 they'll cut half the words and the pitches will get sharper.
- Resist the urge to critique slide *design* this week. Content before polish.
- Teams that have one student who loves presenting will try to give that student the whole deck. Push back. Every team member speaks.

---

## Week 5 — Rehearse

**Theme:** *Get torn apart by friends, so a stranger can't tear you apart.*

### Learning Objectives

1. Deliver a dry-run presentation and accept structured feedback without defending.
2. Anticipate hard questions and prepare crisp answers.
3. Revise a pitch based on real reactions, not imagined ones.
4. Run a tight presentation: time-aware, hand-offs clean, visuals matching the words.

### Live Session (≈2 hours)

| Time | Activity |
|---|---|
| 0:00–0:05 | Ground rules for dry-runs: *no defending*, *take notes*, *thank the critics*, *rewrite tonight*. |
| 0:05–1:15 | Dry-runs. Each team presents for 10 minutes, then gets 8 minutes of Q&A from peers + instructor, then 2 minutes to note what to change. Three teams fit in this window. If there are more teams, run in parallel with a second instructor or TA. |
| 1:15–1:25 | Break |
| 1:25–1:50 | "What we learned" debrief. Each team shares one thing they're changing before Week 6. Instructor names patterns across teams. |
| 1:50–2:00 | Logistics for Week 6: time, dress, who "Maya" will be (instructor or guest), how Q&A will work, what success looks like. |

### Homework — Before Week 6

1. **Revise the deck based on Week 5 feedback.** Not a rewrite — surgical edits.
2. **Do one full run-through as a team, with a timer**, before Week 6. Where did you go over? What did you skip? Fix it.
3. **Refresh your three-hardest-questions list.** The Week 5 Q&A surfaced new ones. Add them.
4. **Come rested.** This is the presentation. Don't stay up rebuilding the deck the night before.

### Instructor Notes

- Enforce the "no defending" rule strictly. Teams will want to explain *why* the critique is wrong. Cut them off gently. They can argue with themselves after the session; during dry-runs, the job is to listen.
- If a team is noticeably weaker than the others, don't pull punches in front of the class, but find time afterward for a private check-in. Week 6 is the high-stakes one; Week 5 is the safety net.
- Consider inviting a guest critic for Week 5 — a working engineer or PM — who can ask questions from a real-world point of view.

---

## Week 6 — Pitch

**Theme:** *Do the thing. Then figure out what you actually learned.*

### Learning Objectives

1. Deliver a polished 10-minute presentation to a non-technical decision-maker.
2. Defend a recommendation under live questioning without getting flustered or retreating into jargon.
3. Reflect on the judgment calls the team made — and what they'd do differently.
4. Compare across teams: where did consensus form, where did thoughtful teams disagree, and why?

### Live Session (≈2 hours, may need to extend)

| Time | Activity |
|---|---|
| 0:00–0:10 | Maya sets the stage: she's got 10 minutes per team, 10 minutes of questions, and a decision to make. She introduces herself and the context. |
| 0:10–1:30 | Presentations. 10 min pitch + 10 min Q&A per team. (Adjust the block length for your class size.) |
| 1:30–1:40 | Break. Maya and instructors confer. |
| 1:40–1:55 | Cross-team debrief: which CVEs did every team pick? Which ones did only one team pick, and what did they see that others didn't? What was the most common "cut"? |
| 1:55–2:00 | Close: what each student now knows that they didn't six weeks ago. Go around the room. |

### Homework — After the Course

Optional but strongly encouraged:

1. **Write a one-page reflection.** What would you do differently if you started over? What did your team get right? What CVE do you now wish you'd ranked higher or lower, and why?
2. **Look at one real CVE in the news this month.** Apply the same prioritization lens. Would your team have caught it? Would you have prioritized it?

### Instructor Notes

- Maya should be a real person playing a role — ideally someone the students don't know well, to raise the stakes appropriately. An instructor from another part of the academy, an industry guest, or a senior staff member all work.
- Maya's questions should **not** be gotchas. They should be the questions a real non-technical CEO would actually ask: *"How much will this cost?"*, *"Why this one and not that one?"*, *"How do I explain this to my investors?"*, *"What happens if we do nothing?"*. The students' job is to have answers, not to have memorized a script.
- The cross-team debrief at the end is where the course lands. Name patterns you saw: which teams leaned on evidence, which teams leaned on instinct, which teams handled the "cut" argument best. This is the takeaway.
- Close the course with this: **"Prioritization is not a puzzle with one right answer. It's a defensible position you can explain to someone who has to trust you."**

---

## Grading (Suggested)

If grades are required, here's a distribution that matches the course's values:

| Component | Weight | What You're Evaluating |
|---|---|---|
| Weekly homework completion | 30% | Did the student show up prepared each week? |
| Individual CVE brief (Week 3) | 15% | Depth of research, clarity of writing, use of evidence. |
| Team top-5 document (Week 4) | 15% | Coherence, reasoning, quality of the "cut" argument. |
| Final presentation (Week 6) | 25% | Clarity, structure, audience awareness, use of time. |
| Q&A defense (Week 6) | 15% | Composure, use of evidence, ability to say "I don't know" when honest. |

Grade teams on the deliverables, grade individuals on participation and their own written briefs.

---

## A Note on Using AI

This course is designed with the assumption that students will use AI tools. That's fine — AI is a legitimate tool for reading code and explaining concepts, and learning to use it well is part of a modern engineer's job. What matters is that **you can defend every claim you make.** If Maya asks "why does this matter?" and you answer with something an AI told you, she will ask a follow-up, and the follow-up is where bluffing breaks down.

The rule for this course: **use AI to read faster, never to think less.** Always verify what the AI tells you against the actual code or the actual document. If you can't point to the line that supports the claim, don't make the claim.
