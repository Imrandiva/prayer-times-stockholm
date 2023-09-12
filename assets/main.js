

// Fetch data from API, and use loading animation while data is being fetched.
document.addEventListener("DOMContentLoaded", () => {
    const url = "https://dailyprayer.abdulrcs.repl.co/api/stockholm";
    const loadingSpinner = document.getElementById("loadingSpinner");

    fetch(url)
        .then(response => response.json())
        .then(json => {
            // Hide the loading spinner when data is loaded
            loadingSpinner.style.display = "none";

            displayPrayerTimes(json);
        })
        .catch(error => {
            loadingSpinner.style.display = "none";
            createAndStyleElement(h1, "Datan kan inte hämtas just nu.")
            console.error(error.message);
        });
});


// Get the data from the API
function fetchPrayerData(url) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
            displayPrayerTimes(json);
        })
        .catch(error => {
            loadingSpinner.style.display = "none";
            createAndStyleElement(h1, "Datan kan inte hämtas just nu.")
            console.error(error.message);
        });
}

// Append the prayer times for today that have yet to be passed
function displayPrayerTimes(json) {
    const dict = {};
    const prayerTimesDiv = document.getElementById("prayerTimes");
    const prayerName = document.getElementById("prayers");
    const todaysDate = document.getElementById("todaysDate");

    const dateHeading = createAndStyleElement("p", `Dagens datum: ${json.date}`);
    todaysDate.appendChild(dateHeading);

    for (const prayer in json.today) {
        dict[prayer] = json.today[prayer];
    }
    dict["fajr_tmr"] = json.tomorrow["Fajr"];

    const prayerNameList = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha'a", "fajr_tmr"];
    const pray_id = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "fajr_tmr"];
    const image_source = ["sunrise.png", "sun.png", "midday.png", "midday.png", "sunset.png", "prayer.png", "sunrise.png"];

    let i = 0;
    let active = false;
    for (const prayer of prayerNameList) {
        const prayer_time = dict[prayer];
        const timeString = prayer_time;
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const parsedTime = new Date(`${year}-${month}-${day}T${timeString}`);
        
        if (i !== 6 && parsedTime < today) {
            i += 1;
            continue;
        }

        const prayer_id = document.getElementById(pray_id[i]);
        const mydiv = document.createElement("div");

        if (!active) {
            prayer_id.style.backgroundColor = "#A7C7E7";
            prayer_id.style.color = "#212124";
            prayer_id.style.fontWeight = "lighter";
        }

        const img = document.createElement("img");
        img.src = `./assets/img/${image_source[i]}`;



 
        // img.style.width = "50%";    
        img.setAttribute('id', 'icons');
        
        
        mydiv.style.width = "20%";
        mydiv.style.marginLeft = "1%";
        mydiv.style.paddingTop = "2%";
        mydiv.style.marginRight = "5%";
        mydiv.appendChild(img);
        prayer_id.appendChild(mydiv);

        const temp = createAndStyleElement("p", prayer === "fajr_tmr" ? "Fajr" : prayer);
        

        temp.setAttribute('id', 'prayerNames');
        
        const mydiv2 = document.createElement("div");
        mydiv2.style.width = "50%";
        mydiv2.appendChild(temp);
        prayer_id.appendChild(mydiv2);

        const temp2 = createAndStyleElement("p", prayer_time);
        const time_until = document.createElement("h5");

        if (!active && i < 6) {
            const time_until_time = Math.round((parsedTime.getTime() - today.getTime()) / 1000 / 60);
            const hours = Math.floor(time_until_time / 60);
            const minutes = time_until_time % 60;
            temp2.textContent = prayer_time;
            
            time_until.textContent = `Börjar om ${hours === 1 ? `${hours} timme och` : hours === 0 ? '' : `${hours} timmar och`} ${minutes} min`;
            active = true;
        }
        
        const mydiv3 = document.createElement("div");
        temp2.setAttribute('id', 'prayerNames');
        mydiv3.appendChild(temp2);
        mydiv3.appendChild(time_until);
        prayer_id.appendChild(mydiv3);

        i += 1;
    }
}

// Crete new element 
function createAndStyleElement(elementType, textContent) {
    const element = document.createElement(elementType);
    element.textContent = textContent;
    element.style.color = "#FFFFFF";
    element.style.textAlign = "center";
    return element;
}
