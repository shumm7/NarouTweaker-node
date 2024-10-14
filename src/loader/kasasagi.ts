(async() => {
    const src = chrome.runtime.getURL("/cogs/kasasagi/main.js");
    await import(src);
})()