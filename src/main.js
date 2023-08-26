document.addEventListener("DOMContentLoaded", () => {
    let url = "https://dailyprayer.abdulrcs.repl.co/api/stockholm";

    fetch(url)
        .then(response => response.json())
        .then(json => {
            const prayerTimesDiv = document.getElementById("prayerTimes");

            const cityHeading = document.createElement("h2");
            cityHeading.textContent = `City: ${json.city}`;
            prayerTimesDiv.appendChild(cityHeading);

            const dateHeading = document.createElement("h3");
            dateHeading.textContent = `Date: ${json.date}`;
            prayerTimesDiv.appendChild(dateHeading);

            const prayerList = document.createElement("ul");
            for (const prayer in json.today) {
                const prayerItem = document.createElement("li");
                prayerItem.textContent = `${prayer}: ${json.today[prayer]}`;
                prayerList.appendChild(prayerItem);
            }
            prayerTimesDiv.appendChild(prayerList);
        })
        .catch(error => {
            console.error(error.message);
        });
});