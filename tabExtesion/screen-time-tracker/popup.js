document.addEventListener("DOMContentLoaded", () => {
    let siteList = document.getElementById("siteList");
  
    chrome.storage.local.get(["siteTimeData"], (result) => {
      let siteTimeData = result.siteTimeData || {};
  
      Object.entries(siteTimeData).forEach(([site, time]) => {
        let li = document.createElement("li");
        li.textContent = `${site}: ${Math.floor(time / 60)} min ${Math.floor(time % 60)} sec`;
        siteList.appendChild(li);
      });
    });
  });

  document.getElementById("resetButton").addEventListener("click", () => {
    chrome.storage.local.set({ siteTimeData: {} }, () => {
      // Clear the displayed list
      document.getElementById("siteList").innerHTML = "";
    });
  });


  document.getElementById("syncButton").addEventListener("click", () => {
    chrome.storage.local.get(["siteTimeData"], (result) => {
        fetch("http://localhost:5000/sync", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result.siteTimeData),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Sync successful:", data);
        })
        .catch(error => console.error("Error syncing data:", error));
    });
});

  

  // //ascending order
  // Object.entries(siteTimeData)
  // .sort((a, b) => b[1] - a[1]) // Sort by time spent (descending)
  // .forEach(([site, time]) => {
  //   let li = document.createElement("li");
  //   li.textContent = `${site}: ${Math.floor(time / 60)} min ${Math.floor(time % 60)} sec`;
  //   siteList.appendChild(li);
  // });


//   //total time
// let totalTime = Object.values(siteTimeData).reduce((sum, time) => sum + time, 0);
// let totalTimeElement = document.createElement("li");
// totalTimeElement.textContent = `Total: ${Math.floor(totalTime / 60)} min ${Math.floor(totalTime % 60)} sec`;
// totalTimeElement.classList.add("font-bold"); // Add some styling
// siteList.appendChild(totalTimeElement);

