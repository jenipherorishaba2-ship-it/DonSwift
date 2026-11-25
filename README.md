# TalentLens: Skills over CVs, humans over algorithms
Donswift "Talent Paradox" hackathon MVP (Code Titans). Next.js + MySQL (XAMPP). No paid AI API: the intelligence is a transparent rule engine (skills taxonomy + transferable-skill map), so every score can be explained.

## Run it on Windows (about 5 minutes)
1. Install **Node.js 18 or newer** (https://nodejs.org, LTS) if you don't have it. Check: `node -v`
2. Open **XAMPP Control Panel** and click **Start** on **Apache** and **MySQL**.
3. Unzip the project. In PowerShell:
   ```
   cd $HOME\Downloads
   Expand-Archive talentlens.zip -DestinationPath .
   cd talentlens
   ```
   (Or right-click the zip > Extract All, then open a terminal in the `talentlens` folder.)
4. Import the database: open http://localhost/phpmyadmin > **Import** tab > choose `sql/schema.sql` > **Go**. Then Import again > choose `sql/seed.sql` > **Go**.
   (schema.sql creates the `talentlens` database itself; you don't need to create it first.)
5. Create the settings file:
   ```
   copy .env.example .env.local
   ```
   The defaults match XAMPP (user `root`, empty password). Change them only if your MySQL has a password.
6. Install and start:
   ```
   npm install
   npm run dev
   ```
7. Open http://localhost:3000

To reset the demo data at any time, import `sql/schema.sql` then `sql/seed.sql` again.

## Demo script (3 minutes)
1. **Dashboard**: vacancies sorted by deadline, red/amber/green. "Accounts Assistant is red: 4 days left, nobody shortlisted."
2. **Vacancies > Accounts Assistant**: Amina Nakato applied here. Weak match (no accounting degree). A normal system rejects her and stops.
3. **Match Matrix**: Amina is a strong 💎 fit for *Customer Service & Sales Lead*, a job she never applied for. Her keyword CV score is only 36%, but she scored 92% on the practical challenge.
4. Open **Customer Service & Sales Lead**: Amina ranks #1, above a graduate with a polished CV. Hover the ↗ chips: "Running a market stall → cash handling, negotiation, stock control".
5. Toggle **Blind mode** (bottom left): names, gender, age and school disappear.
6. Click **Shortlist** on Amina, write a reason. Human decides, reason logged. Try rejecting a Strong candidate: it is logged as an **OVERRIDE**.
7. **Candidate Assistant**: click "Has my application moved? TL-1001". Amina sees she was matched to a new role. "Why was I not selected?" gives real feedback.
8. **Vacancies > Vacancy Decoder**: click "use sample", decode, adjust weights, publish. New job is instantly matched against the whole pool.
9. **Inclusion**: Ruth Akello (TL-1009) is Deaf. She ranks #3 for Accounts Assistant with a 💎 (90% challenge, 22% keyword CV). Her ♿ badge shows "Adjustments needed" in blind mode and the full detail (sign language interpreter, text-only contact) when it's off. It never changes her score. Ask the assistant "I am deaf, can I still apply? TL-1009". Try the ♿ toolbar (bottom left): larger text, high contrast, readable font, read page aloud. The dashboard has a Fairness & inclusion monitor.
10. **Apply**: submit a "no CV" story (e.g. "I was a boda boda rider and treasurer of our SACCO"), see skills extracted.

## Inclusion & accessibility
- Apply 3 ways: type your story, **speak your story** (🎤 voice input), or paste a CV. Plus WhatsApp/USSD/sign-video channels.
- Optional **adjustments** on the application (sign language interpreter, step-free venue, screen reader/large print, extra time, text-only contact) + preferred contact method. Used only to plan the process, never in scoring; hidden in blind mode.
- ♿ toolbar: larger text, high contrast, dyslexia-friendly font, read aloud (select text first to read just that).
- Challenge: untimed, text-based, 🔊 on every question. Assistant: 🎤 ask by voice, 🔊 read answers aloud; no phone call ever required.
- Fairness monitor: women in pool vs shortlists, non-degree candidates in top-3, alternative-channel applicants, candidates with disabilities in top-3, Hidden Gems kept.
- Note: 🎤 voice input uses Chrome/Edge's built-in speech recognition, which needs internet. Read-aloud works offline.

## How the "intelligence" works (lib/engine.js)
- **Vacancy Decoder**: finds skills in the JD, weights them (must = 3, core = 2, nice-to-have = 1). Degrees/years are recorded as *signals*, never hard filters.
- **Skill extraction**: direct keywords plus a **transferable-skill map** (market stall, boda boda, VSLA treasurer, choir, farm…).
- **Match score** = 45% skill fit (transferable skills count 75%) + 55% practical challenge score.
- **Hidden Gem** = challenge ≥ 80% but keyword-CV score < 50%.
- **Every** candidate is scored against **every** vacancy.
- Humans make every decision with a written reason; going against the AI band is logged as an override.

Troubleshooting: "Could not load data" = MySQL not started in XAMPP, or the SQL wasn't imported, or `.env.local` is missing. Port 3000 busy: `npm run dev -- -p 3001`.
