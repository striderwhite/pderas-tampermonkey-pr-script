# PDERAS Tamper Monkey PR Script

When we approve a PR, we must track time in Harvest against the underlying issue the PR refers to, not the PR itself. I did what most sane developers would do and automate this as much as possible because 3-4x extra clicks for every PR is going to add up in a busy day, and who enjoys spending time on tedious repetition?

What this does is hijack the harvest button for tracking time against a PRs underlying issue instead of the PR itself. Now when you click the "track time" button, the payload sent to the Harvest servers is modified to track time against the linked issue in the PR - neat.

## Install/Requirements

1) FireFox (Doesn't support Chrome due to limitations I don't understand)
2) [Tampermonkey Fire Fox plugin](https://addons.mozilla.org/en-CA/firefox/addon/tampermonkey/);
3) You must add a CSP exclusion rule to Firefox.

Do this by:

- Settings > Privacy & Security > Manage Exceptions
- Then add https://github.com there
4) Now add the `PDERAS PR ISSUE TRACKER.user.js` script to Tampermonkey.

Do this by:


- Either downloading the file and adding the file Tampermonkey in the settings
- Or simply create your own script then copy-paste into the script
5) Activate the script
6) Now navigate to a PR

## Limitations
- The PR *MUST* refer to an issue by github linkage - for example by #1234 - the link must be "clickable"
- This uses the title of the PR to fill in the description of what you track against, so title your PRs accordingly. If you want a different message you'll have to modify it on the Harvest popup window.
- Relies on specific query selectors - it is fragile
- Doesn't support Chrome
- Doesn't automate reviewing the code for you ;)

## Usage
Any PR page that follows the rule: `https://github.com/*/*/pull/*` for example `https://github.com/PDERAS/edmonton-granite-inventory-web/pull/17` will trigger the script to run. You will know it runs because the "track time" button is overwritten with different text. You will know it fails because I write messages into the DOM on github. This doesn't mess with the track time on the issues page(s).

## Special thanks
- Brock Roadhouse for some ideas!
