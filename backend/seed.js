import mongoose from 'mongoose';
import dotenv   from 'dotenv';
import Level    from './models/Level.js';
import Mission  from './models/Mission.js';
import Command  from './models/Command.js';

dotenv.config();

// ── Level data ────────────────────────────────────────────────
const levels = [
    { levelNumber: 1, title: 'Recruit Training',  subtitle: 'Master the basics before field clearance is granted.', difficulty: 'beginner',     order: 1, xpReward: 100, coinReward: 50  },
    { levelNumber: 2, title: 'Deep Infiltration', subtitle: 'Coordinate threads. Correct mistakes under fire.',      difficulty: 'intermediate', order: 2, xpReward: 200, coinReward: 100 },
    { levelNumber: 3, title: 'Ghost Protocol',    subtitle: 'Surgical Git precision. One wrong command ends everything.', difficulty: 'advanced', order: 3, xpReward: 300, coinReward: 150 },
];

// ── Mission + Command data ────────────────────────────────────
// Format: { mission: {...}, command: {...} }
const missionData = [

    // ── LEVEL 1 ────────────────────────────────────────────────
    {
        mission: { missionNumber: 1, title: 'Mission 01 · Clone the Intelligence Repository', story: 'Agent, headquarters has located the Shadow Breach intelligence database. The repository contains clues about the hackers\' next target. Download it so you can begin your investigation.', scenario: 'HQ sends you a repository URL containing classified intelligence. What command should you use to download the repository?', order: 1, xpReward: 10, coinReward: 5 },
        command: { command: 'git clone <url>', validPattern: '^git\\s+clone\\s+\\S+', caseSensitive: true, hint: 'Creates a local copy of a remote repository, including all history. Try: git clone <url>', hintUnlocksAfterAttempts: 1, explainer: 'git clone creates a complete copy of a remote repository, including all files and commit history.' },
    },
    {
        mission: { missionNumber: 2, title: 'Mission 02 · Pull the Latest Intelligence', story: 'Urgent message from headquarters: Shadow Breach has altered its attack strategy. Your local files are now outdated. Synchronize before proceeding.', scenario: 'Another agent uploaded new intelligence identifying the hackers\' next target. What command updates your local repository?', order: 2, xpReward: 10, coinReward: 5 },
        command: { command: 'git pull', validPattern: '^git\\s+pull(\\s+.*)?$', caseSensitive: true, hint: 'Fetches and merges the latest changes from the remote into your local branch.', hintUnlocksAfterAttempts: 1, explainer: 'git pull downloads the latest changes from the remote repository and updates your local copy.' },
    },
    {
        mission: { missionNumber: 3, title: 'Mission 03 · Scout the Status', story: 'Before filing your next report, you need to know exactly which files have been modified and which are ready to submit.', scenario: 'You\'ve been editing several files. What command shows which are staged, modified, or new?', order: 3, xpReward: 10, coinReward: 5 },
        command: { command: 'git status', validPattern: '^git\\s+status(\\s+.*)?$', caseSensitive: true, hint: 'Shows the state of your working directory and staging area.', hintUnlocksAfterAttempts: 1, explainer: 'git status shows which files have been modified, staged, or are untracked.' },
    },
    {
        mission: { missionNumber: 4, title: 'Mission 04 · Stage the Evidence', story: 'You\'ve uncovered critical evidence linking Shadow Breach to an upcoming cyberattack. Prepare it for submission to headquarters.', scenario: 'You updated a report file. Which command stages a file (or all files) for the next commit?', order: 4, xpReward: 10, coinReward: 5 },
        command: { command: 'git add <file>', validPattern: '^git\\s+add\\s+\\S+', caseSensitive: true, hint: 'Use git add followed by a filename or . to stage everything at once.', hintUnlocksAfterAttempts: 1, explainer: 'git add stages files, preparing them for inclusion in the next commit.' },
    },
    {
        mission: { missionNumber: 5, title: 'Mission 05 · Submit Your Findings', story: 'The agency needs a permanent record of your findings. Submit your intelligence report documenting the newly discovered command server.', scenario: 'You\'ve staged your evidence. What command saves it permanently to the investigation history?', order: 5, xpReward: 10, coinReward: 5 },
        command: { command: 'git commit -m "<message>"', validPattern: '^git\\s+commit\\s+.*-m\\s+["\'].+["\']', caseSensitive: true, hint: 'Use git commit with the -m flag followed by a message in quotes.', hintUnlocksAfterAttempts: 1, explainer: 'git commit creates a permanent snapshot of your staged changes and records them in the repository history.' },
    },
    {
        mission: { missionNumber: 6, title: 'Mission 06 · Review the Case History', story: 'A new analyst suspects a mole tampered with the repository weeks ago. Review the full commit history to identify suspicious activity.', scenario: 'You need to see every change ever committed, who made it, and when. What command do you run?', order: 6, xpReward: 10, coinReward: 5 },
        command: { command: 'git log', validPattern: '^git\\s+log(\\s+.*)?$', caseSensitive: true, hint: 'Displays the commit history in reverse chronological order.', hintUnlocksAfterAttempts: 1, explainer: 'git log displays the full history of commits, who made them, when, and with what message.' },
    },
    {
        mission: { missionNumber: 7, title: 'Mission 07 · Compare the Evidence', story: 'Two versions of the same intelligence file exist. You need to see exactly what changed line by line before committing.', scenario: 'You\'ve edited a file but haven\'t staged it yet. What command shows exactly what lines were added or removed?', order: 7, xpReward: 10, coinReward: 5 },
        command: { command: 'git diff', validPattern: '^git\\s+diff(\\s+.*)?$', caseSensitive: true, hint: 'Shows differences between your working directory and the last commit.', hintUnlocksAfterAttempts: 1, explainer: 'git diff shows the differences between your working directory and the last commit, highlighting additions and deletions.' },
    },
    {
        mission: { missionNumber: 8, title: 'Mission 08 · Discard a Compromised File', story: 'An analyst accidentally overwrote a key file with corrupted data. Restore it before the error becomes permanent.', scenario: 'A file has been modified incorrectly and is not yet staged. What command reverts it to the last commit?', order: 8, xpReward: 10, coinReward: 5 },
        command: { command: 'git restore <file>', validPattern: '^git\\s+restore\\s+\\S+', caseSensitive: true, hint: 'Use git restore followed by the filename to discard working directory changes.', hintUnlocksAfterAttempts: 1, explainer: 'git restore discards changes in the working directory and reverts the file back to its last committed state.' },
    },
    {
        mission: { missionNumber: 9, title: 'Mission 09 · Create a Covert Branch', story: 'HQ wants you to test a decoy operation but you can\'t risk corrupting the main investigation.', scenario: 'You need to create a new branch called decoy-operation. What command do you use?', order: 9, xpReward: 10, coinReward: 5 },
        command: { command: 'git branch <branch-name>', validPattern: '^git\\s+branch\\s+\\S+', caseSensitive: true, hint: 'Use git branch followed by the name you want to give the new branch.', hintUnlocksAfterAttempts: 1, explainer: 'git branch creates a new branch, an independent line of development.' },
    },
    {
        mission: { missionNumber: 10, title: 'Mission 10 · Switch to the Covert Branch', story: 'The decoy branch is ready. Move your active workspace into it so your work doesn\'t interfere with the main investigation.', scenario: 'You\'ve already created the decoy-operation branch. What command switches your working environment to it?', order: 10, xpReward: 10, coinReward: 5 },
        command: { command: 'git checkout <branch-name>', validPattern: '^git\\s+(checkout|switch)\\s+\\S+', caseSensitive: true, hint: 'Use git checkout or git switch followed by the branch name.', hintUnlocksAfterAttempts: 1, explainer: 'git checkout moves your working environment to the specified branch.' },
    },

    // ── LEVEL 2 ────────────────────────────────────────────────
    {
        mission: { missionNumber: 1, title: 'Mission 01 · Stash the Unfinished Work', story: 'An urgent new assignment just came in, but your current work isn\'t ready to commit. You need a clean workspace immediately.', scenario: 'You have unstaged changes in progress and need a clean directory right now. What command temporarily saves your work without committing?', order: 1, xpReward: 20, coinReward: 10 },
        command: { command: 'git stash', validPattern: '^git\\s+stash(\\s+.*)?$', caseSensitive: true, hint: 'Shelves all uncommitted changes so you can switch focus safely.', hintUnlocksAfterAttempts: 1, explainer: 'git stash temporarily shelves all your uncommitted changes so you can switch focus.' },
    },
    {
        mission: { missionNumber: 2, title: 'Mission 02 · Recover the Stashed Work', story: 'The emergency has been handled. Retrieve your previously saved work so you can finish the investigation you had to pause.', scenario: 'You previously stashed your in-progress changes. What command restores them to your working directory?', order: 2, xpReward: 20, coinReward: 10 },
        command: { command: 'git stash pop', validPattern: '^git\\s+stash\\s+pop(\\s+.*)?$', caseSensitive: true, hint: 'Restores the most recently stashed changes and removes them from the stash.', hintUnlocksAfterAttempts: 1, explainer: 'git stash pop restores the most recently stashed changes back into your working directory.' },
    },
    {
        mission: { missionNumber: 3, title: 'Mission 03 · Correct Missing Evidence', story: 'Minutes after submitting your report, an analyst notices an important forensic log was accidentally omitted.', scenario: 'You staged the missing log and want to add it to your last commit while keeping the existing message. What command do you use?', order: 3, xpReward: 20, coinReward: 10 },
        command: { command: 'git commit --amend --no-edit', validPattern: '^git\\s+commit\\s+(--amend\\s+--no-edit|--no-edit\\s+--amend)', caseSensitive: true, hint: 'The --amend flag modifies the last commit. Add --no-edit to keep the message unchanged.', hintUnlocksAfterAttempts: 1, explainer: 'git commit --amend --no-edit updates the most recent commit without changing its commit message.' },
    },
    {
        mission: { missionNumber: 4, title: 'Mission 04 · Push the Intelligence to HQ', story: 'Your local findings are solid and ready to be shared. Transmit your commits to the remote repository.', scenario: 'You\'ve committed your changes locally. What command sends them to the remote repository?', order: 4, xpReward: 20, coinReward: 10 },
        command: { command: 'git push', validPattern: '^git\\s+push(\\s+.*)?$', caseSensitive: true, hint: 'Uploads your local commits to the remote repository.', hintUnlocksAfterAttempts: 1, explainer: 'git push uploads your local commits to the remote repository so other agents can access your work.' },
    },
    {
        mission: { missionNumber: 5, title: 'Mission 05 · Merge the Covert Branch', story: 'The decoy operation was a success. Bring those findings back into the main investigation record.', scenario: 'You are on the main branch and want to bring in the completed work from decoy-operation. What command do you run?', order: 5, xpReward: 20, coinReward: 10 },
        command: { command: 'git merge <branch-name>', validPattern: '^git\\s+merge\\s+\\S+', caseSensitive: true, hint: 'Use git merge followed by the branch name you want to integrate.', hintUnlocksAfterAttempts: 1, explainer: 'git merge integrates changes from one branch into your current branch.' },
    },
    {
        mission: { missionNumber: 6, title: 'Mission 06 · Tag a Critical Milestone', story: 'Your team has reached a major checkpoint. Mark this moment permanently in repository history.', scenario: 'You want to mark the current commit as version 1.0 of the investigation. What command creates that label?', order: 6, xpReward: 20, coinReward: 10 },
        command: { command: 'git tag <tag-name>', validPattern: '^git\\s+tag\\s+\\S+', caseSensitive: true, hint: 'Use git tag followed by a version name like v1.0.', hintUnlocksAfterAttempts: 1, explainer: 'git tag marks a specific commit with a memorable label.' },
    },
    {
        mission: { missionNumber: 7, title: 'Mission 07 · List All Branches', story: 'The investigation has grown and multiple agents are working on parallel branches. You need a full picture of every branch.', scenario: 'You want to see every branch in both your local repository and the remote. What command shows them all?', order: 7, xpReward: 20, coinReward: 10 },
        command: { command: 'git branch -a', validPattern: '^git\\s+branch\\s+-a(\\s+.*)?$', caseSensitive: true, hint: 'Use git branch with the -a flag to list all local and remote branches.', hintUnlocksAfterAttempts: 1, explainer: 'git branch -a lists all branches, including those on the remote server.' },
    },
    {
        mission: { missionNumber: 8, title: 'Mission 08 · Undo the Last Commit Safely', story: 'A commit was just pushed that accidentally exposed a classified source. Undo it while keeping history intact.', scenario: 'You need to reverse the most recent commit without deleting it from history. What command do you use?', order: 8, xpReward: 20, coinReward: 10 },
        command: { command: 'git revert HEAD', validPattern: '^git\\s+revert\\s+\\S+', caseSensitive: true, hint: 'Creates a new commit that undoes the previous one, preserving all history.', hintUnlocksAfterAttempts: 1, explainer: 'git revert HEAD creates a new commit that undoes the changes from the most recent commit without erasing history.' },
    },
    {
        mission: { missionNumber: 9, title: 'Mission 09 · Reset to a Previous State', story: 'A commit was made locally that was a complete mistake. Since it hasn\'t been pushed yet, you can erase it entirely.', scenario: 'You need to completely remove the most recent local commit and discard all its changes. What command does this?', order: 9, xpReward: 20, coinReward: 10 },
        command: { command: 'git reset --hard HEAD~1', validPattern: '^git\\s+reset\\s+--hard\\s+\\S+', caseSensitive: true, hint: 'Use git reset --hard followed by HEAD~1 to erase the last commit entirely.', hintUnlocksAfterAttempts: 1, explainer: 'git reset --hard HEAD~1 moves your branch back one commit and discards all changes completely.' },
    },
    {
        mission: { missionNumber: 10, title: 'Mission 10 · Delete a Closed Branch', story: 'The decoy operation has been merged and closed. Clean up the repository by removing the branch.', scenario: 'The decoy-operation branch has already been merged into main. What command safely deletes it?', order: 10, xpReward: 20, coinReward: 10 },
        command: { command: 'git branch -d <branch-name>', validPattern: '^git\\s+branch\\s+-[dD]\\s+\\S+', caseSensitive: true, hint: 'Use git branch -d followed by the branch name to safely delete a merged branch.', hintUnlocksAfterAttempts: 1, explainer: 'git branch -d safely deletes a branch that has already been merged.' },
    },

    // ── LEVEL 3 ────────────────────────────────────────────────
    {
        mission: { missionNumber: 1, title: 'Mission 01 · Cherry-Pick a Single Commit', story: 'A fellow agent on a different branch made one specific commit containing a critical decryption fix. You need only that one commit.', scenario: 'You know the commit hash of the fix you need. What command applies just that one commit to your current branch?', order: 1, xpReward: 30, coinReward: 15 },
        command: { command: 'git cherry-pick <commit-hash>', validPattern: '^git\\s+cherry-pick\\s+\\S+', caseSensitive: true, hint: 'Use git cherry-pick followed by the commit hash to apply a single commit.', hintUnlocksAfterAttempts: 1, explainer: 'git cherry-pick applies a single specific commit from anywhere in the history onto your current branch.' },
    },
    {
        mission: { missionNumber: 2, title: 'Mission 02 · Rebase Your Branch', story: 'Your branch was created two weeks ago and main has moved far ahead. You want a clean linear history.', scenario: 'You want to move your branch\'s commits to sit on top of the latest main branch. What command does this cleanly?', order: 2, xpReward: 30, coinReward: 15 },
        command: { command: 'git rebase main', validPattern: '^git\\s+rebase\\s+\\S+', caseSensitive: true, hint: 'Use git rebase followed by the target branch name to replay your commits on top of it.', hintUnlocksAfterAttempts: 1, explainer: 'git rebase replays your branch\'s commits on top of the latest main, creating a clean linear history.' },
    },
    {
        mission: { missionNumber: 3, title: 'Mission 03 · Apply a Stash to a Different Branch', story: 'You stashed work while on the wrong branch and switching back would cause conflicts.', scenario: 'You want to apply a stash onto a brand new branch called recovery-branch to avoid merge conflicts. What command does this?', order: 3, xpReward: 30, coinReward: 15 },
        command: { command: 'git stash branch <branch-name>', validPattern: '^git\\s+stash\\s+branch\\s+\\S+', caseSensitive: true, hint: 'Use git stash branch followed by a new branch name to create and apply the stash there.', hintUnlocksAfterAttempts: 1, explainer: 'git stash branch creates a new branch from the commit where the stash was made and applies the stash to it.' },
    },
    {
        mission: { missionNumber: 4, title: 'Mission 04 · Squash Commits Before Merging', story: 'A feature branch has many small, messy commits. Collapse them into a single clean commit before merging.', scenario: 'You want to bring in all changes from feature-branch as a single commit. What command stages all those changes at once?', order: 4, xpReward: 30, coinReward: 15 },
        command: { command: 'git merge --squash <branch-name>', validPattern: '^git\\s+merge\\s+--squash\\s+\\S+', caseSensitive: true, hint: 'Use git merge --squash followed by the branch name to collapse all commits into one staged change.', hintUnlocksAfterAttempts: 1, explainer: 'git merge --squash brings all the changes from a branch into your working directory as a single staged change.' },
    },
    {
        mission: { missionNumber: 5, title: 'Mission 05 · Find the Commit That Broke Everything', story: 'Somewhere in the last 50 commits, a critical bug was introduced. Use a binary search to track down the culprit.', scenario: 'You need to begin a binary search through commit history to find the bug. What command starts the process?', order: 5, xpReward: 30, coinReward: 15 },
        command: { command: 'git bisect start', validPattern: '^git\\s+bisect\\s+start(\\s+.*)?$', caseSensitive: true, hint: 'Use git bisect start to begin the binary search session.', hintUnlocksAfterAttempts: 1, explainer: 'git bisect performs a binary search through commit history, letting you mark commits as good or bad.' },
    },
    {
        mission: { missionNumber: 6, title: 'Mission 06 · Mark a Good Commit During Bisect', story: 'During the bisect process, you\'ve tested a commit and confirmed everything was working. Report your finding.', scenario: 'You\'ve confirmed a specific commit is working correctly during a bisect session. What command marks it as good?', order: 6, xpReward: 30, coinReward: 15 },
        command: { command: 'git bisect good <commit-hash>', validPattern: '^git\\s+bisect\\s+good(\\s+\\S+)?$', caseSensitive: true, hint: 'Use git bisect good followed by the commit hash to clear that commit from suspicion.', hintUnlocksAfterAttempts: 1, explainer: 'git bisect good marks the current or specified commit as working, guiding the binary search.' },
    },
    {
        mission: { missionNumber: 7, title: 'Mission 07 · Recover a Deleted Branch with Reflog', story: 'A junior agent accidentally deleted the branch containing three days of critical intelligence before it was merged.', scenario: 'A branch was deleted and commits appear lost. What command reveals the full history of HEAD movements?', order: 7, xpReward: 30, coinReward: 15 },
        command: { command: 'git reflog', validPattern: '^git\\s+reflog(\\s+.*)?$', caseSensitive: true, hint: 'Git secretly logs every HEAD movement. Use git reflog to pull up that surveillance record.', hintUnlocksAfterAttempts: 1, explainer: 'git reflog shows a full history of where HEAD has pointed, allowing you to recover seemingly lost commits.' },
    },
    {
        mission: { missionNumber: 8, title: 'Mission 08 · Rewrite the Last Three Commit Messages', story: 'Three recent commits were saved with vague messages that don\'t meet agency standards. Clean them up before pushing.', scenario: 'You want to interactively edit the last three commits. What command opens the interactive rebase editor?', order: 8, xpReward: 30, coinReward: 15 },
        command: { command: 'git rebase -i HEAD~3', validPattern: '^git\\s+rebase\\s+-i\\s+\\S+', caseSensitive: true, hint: 'Use git rebase -i followed by HEAD~3 to open the interactive editor for the last 3 commits.', hintUnlocksAfterAttempts: 1, explainer: 'git rebase -i opens an interactive editor letting you reword, squash, reorder, or drop commits.' },
    },
    {
        mission: { missionNumber: 9, title: 'Mission 09 · Sign a Commit for Verification', story: 'The agency now requires all final intelligence submissions to be cryptographically signed to prove authenticity.', scenario: 'You need to create a signed commit with a message confirming your findings. What command creates a GPG-signed commit?', order: 9, xpReward: 30, coinReward: 15 },
        command: { command: 'git commit -S -m "<message>"', validPattern: '^git\\s+commit\\s+(-S\\s+-m|-m\\s+["\'].+["\']\\s+-S)', caseSensitive: true, hint: 'Use git commit -S -m followed by your message in quotes to create a signed commit.', hintUnlocksAfterAttempts: 1, explainer: 'git commit -S creates a GPG-signed commit, allowing anyone to verify its authenticity.' },
    },
    {
        mission: { missionNumber: 10, title: 'Mission 10 · Archive the Completed Operation', story: 'Operation Shadow Breach is over. The agency needs a clean snapshot of the repository for the classified evidence vault.', scenario: 'You need to export the current state of the repository as a zip file for archiving. What command creates that package?', order: 10, xpReward: 30, coinReward: 15 },
        command: { command: 'git archive --format=zip HEAD -o <filename>.zip', validPattern: '^git\\s+archive\\s+.*(--format=zip|\\.zip)', caseSensitive: true, hint: 'Use git archive --format=zip HEAD -o followed by a filename to export a clean snapshot.', hintUnlocksAfterAttempts: 1, explainer: 'git archive exports the contents of a commit as a zip file without any Git metadata.' },
    },
];

// ── Seed function ─────────────────────────────────────────────

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✔ Connected to MongoDB');

    // Clear existing data
    await Level.deleteMany({});
    await Mission.deleteMany({});
    await Command.deleteMany({});
    console.log('✔ Cleared existing levels, missions, commands');

    // Insert levels
    const insertedLevels = await Level.insertMany(levels);
    console.log(`✔ Inserted ${insertedLevels.length} levels`);

    // Map levelNumber → _id
    const levelMap = {};
    insertedLevels.forEach(l => { levelMap[l.levelNumber] = l._id; });

    // Insert missions and commands
    let missionCount = 0;
    let commandCount = 0;

    // Level number per mission index
    const levelForMission = (i) => i < 10 ? 1 : i < 20 ? 2 : 3;

    for (let i = 0; i < missionData.length; i++) {
        const { mission, command } = missionData[i];
        const levelNumber = levelForMission(i);
        const levelId = levelMap[levelNumber];

        const insertedMission = await Mission.create({ ...mission, levelId });
        missionCount++;

        await Command.create({ ...command, missionId: insertedMission._id });
        commandCount++;
    }

    console.log(`✔ Inserted ${missionCount} missions`);
    console.log(`✔ Inserted ${commandCount} commands`);
    console.log('✔ Database seeded successfully');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('✘ Seed error:', err);
    process.exit(1);
});