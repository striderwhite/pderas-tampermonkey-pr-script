// ==UserScript==
// @name         PDERAS PR ISSUE TRACKER
// @namespace    http://pderas.com/
// @version      0.1
// @description  Hacks the existing harvest button for tracking time against a PR's underlying issue instead of the PR itself.
// @author       Strider White <strider@striderwhite.com>
// @match        https://github.com/*/*/pull/*
// @icon         none
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    let relatedIssue = await getMeAsync("issue-link", 'related issue', true);
    let harvestButton = await getMeAsync("#partial-discussion-header > div.gh-header-show > div > div > button.harvest-timer.btn.btn-sm.mr-1", 'harvest button');
    let issueTitle = await getMeAsync("js-issue-title", 'issue title', true);

    if (!relatedIssue) {
        displayErrorMessage("Unable to find the related issue - did you link it correctly?");
    }

    if (!harvestButton) {
        displayErrorMessage("Unable to find the harvest button - is the plugin working?");
    }

    if (!issueTitle) {
        displayErrorMessage("Unable to find the issue title - maybe the css selector changed?");
    }

    if (harvestButton && relatedIssue && issueTitle) {
        // There can be multiple issues on the page with this class, usually the first one is the correct one
        relatedIssue = relatedIssue[0];
        // It appears there should only be one issue title, but maybe not - grab the first one
        issueTitle = issueTitle[0];

        // Grab data wew need from the related issue
        let relatedIssueData = {
            url: relatedIssue.href,
            text: issueTitle.innerText,
            number: relatedIssue.href.split('/')[relatedIssue.href.split('/').length-1] // splits the URL to get the item #
        };

        // Modify the JSON payload sent to harvest
        let harvestDataItem = JSON.parse(harvestButton.dataset.item);
        harvestDataItem.id = relatedIssueData.number;
        harvestDataItem.name = `#${relatedIssueData. number}: ${relatedIssueData.text}`;
        harvestDataItem.permalink = relatedIssueData.url;

        // Changes what gets written into the Iframe window
        harvestButton.dataset.item = JSON.stringify(harvestDataItem);

        // Changes what URL the issue tracks against in harvest
        harvestButton.dataset.permalink = relatedIssueData.url;

        // Modify the harvest button so we know it worked
        harvestButton.innerText = "[PDERAS] TRACK AGAINST ISSUE #" + relatedIssueData.number;
    }


})();

async function getMeAsync(selector, lookingFor, byClassName = false) {
    const MAX_ATTEMPTS = 10;
    let ATTEMPTS = 1;

    let found = byClassName ? document.getElementsByClassName(selector) : document.querySelector(selector);

    while (!found) {
        if (ATTEMPTS++ > MAX_ATTEMPTS) { break; }
        // "sleep" for 1 second
        await new Promise(r => setTimeout(r, 1000));
        console.log('Looking again...');
        found = byClassName ? document.getElementsByClassName(selector) : document.querySelector(selector);
    }

    if (!found) {
        console.error("WARNING UNABLE TO FIND: " + lookingFor);
    }

    return found;
}

function displayErrorMessage(message) {

    let actionElm = null;

    try {
        actionElm = document.getElementsByClassName("gh-header-actions")[0];
    } catch (e) {
        console.error(message);
    }

    if (actionElm) {
        const warningDiv = document.createElement("div");
        const warningText = document.createTextNode("Warning: Unable to find the related issue. Did you link it properly?");

        warningDiv.appendChild(warningText);
        actionElm.appendChild(warningDiv);
    }


}
