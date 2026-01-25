document.addEventListener("DOMContentLoaded", async () => {
  // Cross-browser compatibility shim
  const browserAPI = typeof browser !== "undefined" ? browser : chrome;

  const urlParams = new URLSearchParams(window.location.search);
  const unsafeUrl = decodeURIComponent(urlParams.get("url") || "unknown site");
  const reasonFromUrl = urlParams.get("reason");
  document.getElementById("unsafeUrl").textContent = unsafeUrl;
  console.log(`Warning page loaded for URL: ${unsafeUrl}`);

  // Display reason for unsafe site - prefer URL parameter, fallback to storage
  let reason = reasonFromUrl ? decodeURIComponent(reasonFromUrl) : null;

  // Helper function to convert URLs to clickable links
  function formatReasonWithLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
  }

  if (reason) {
    console.log("Reason provided via URL parameter");
    document.getElementById("reasonText").innerHTML = formatReasonWithLinks(reason);
    document.getElementById("reasonContainer").style.display = "block";
  } else {
    // Fallback: try to fetch from storage
    try {
      const { unsafeReasons } = await browserAPI.storage.local.get("unsafeReasons");
      console.log("Loaded unsafeReasons:", unsafeReasons ? Object.keys(unsafeReasons).length + " entries" : "null");

      if (unsafeReasons && Object.keys(unsafeReasons).length > 0) {
        // Extract domain from the unsafe URL
        let domain;
        try {
          const urlObj = new URL(unsafeUrl);
          domain = urlObj.hostname.replace(/^www\./, "").toLowerCase();
        } catch (e) {
          // If URL parsing fails, try to extract domain directly
          domain = unsafeUrl
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .split("/")[0]
            .toLowerCase();
        }

        console.log("Looking up reason for domain:", domain);

        // Check for reason - try multiple variations
        reason = unsafeReasons[domain] ||
          unsafeReasons["www." + domain] ||
          unsafeReasons[domain.replace(/\/$/, "")]; // Without trailing slash

        console.log("Found reason:", reason ? "yes" : "no");

        if (reason) {
          document.getElementById("reasonText").innerHTML = formatReasonWithLinks(reason);
          document.getElementById("reasonContainer").style.display = "block";
        }
      } else {
        console.log("No unsafeReasons in storage - filter lists may need to be refreshed");
      }
    } catch (error) {
      console.error("Error fetching reason:", error);
    }
  }

  // "Go Back" button functionality to return to the previous page
  document.getElementById("goBack").addEventListener("click", () => {
    console.log("User clicked Go Back.");
    // Go back twice to skip over the warning page
    window.history.go(-2);
  });

  // "Proceed" button functionality to continue to the unsafe URL
  document.getElementById("proceed").addEventListener("click", async () => {
    if (confirm("Are you sure you want to proceed? This site may be unsafe.")) {
      const [currentTab] = await browserAPI.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (currentTab && currentTab.id) {
        console.log(
          `Sending approveSite message for tab ${currentTab.id} and URL ${unsafeUrl}`
        );

        // Send approval message to the background script
        await browserAPI.runtime.sendMessage({
          action: "approveSite",
          tabId: currentTab.id,
          url: unsafeUrl,
        });

        console.log("Approval stored, navigating to the unsafe URL...");
        // Redirect to the approved unsafe URL
        await browserAPI.tabs.update(currentTab.id, { url: unsafeUrl });
      }
    }
  });
});
