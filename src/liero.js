// parse a kill-feed-view node and return its data.
// the kill-feed-view DOM node contains information about who killed whom.
const parseKillFeedNode = (node) => {
    const texts = [...node.getElementsByTagName("span")].map((t) => t.innerText);

    let killer = null;
    let weapon = null;
    let victim = null;
    let type = null;

    // the number and order of spans tells us what kind of kill it is
    // class=team* == gravity kill
    if (texts.length === 1) {
        type = 'gravity';
        killer = texts[0];
        victim = texts[0];
    // class=weapon + class=team* == suicide kill
    } else if (texts.length === 2) {
        type = 'suicide';
        killer = texts[1];
        weapon = texts[0];
        victim = texts[1];
    // class=team* + class=weapon + class=team* == normal kill
    } else if (texts.length === 3) {
        type = 'kill';
        killer = texts[0];
        weapon = texts[1];
        victim = texts[2];
    } else {
        throw new Error(`Something went wrong parsing node: ${JSON.stringify(n)}`);
    }
    return {time: Date.now(), type, killer, weapon, victim};
};

const extractDataFromMutation = (mutation) => {
    const data = []
    if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
            data.push(parseKillFeedNode(node));
        });
    }
    return data;
};

const startCollection = () => {
    let targetNode;
    try {
        targetNode = document.getElementsByClassName("kill-feed-view")[0];
    } catch (e) {
        throw new Error(`Could not find kill-feed-view DOM node. ${e.message}`);
    }

    const data = [];
    const observer = new MutationObserver((mutationsList, observer) =>
        mutationsList.forEach((mutation) => {
            const kills = extractDataFromMutation(mutation);
            if (kills.length > 0) {
                kills.forEach((k) => data.push(k));
            }
        })
    );

    observer.observe(targetNode, { childList: true, subtree: true });

    return () => {
        observer.disconnect();
        return data;
    };
};
