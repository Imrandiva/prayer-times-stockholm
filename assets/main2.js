document.addEventListener("DOMContentLoaded", () => {
    const url = "https://prayer-times-api-gamma.vercel.app/api/stockholm";
    const loadingSpinner = document.getElementById("loadingSpinner");

    retrieveData().then((cachedData) => {
        if (cachedData) {
            const jsonData = cachedData;
            const todayFormatted = getFormattedDate(new Date());
            if (jsonData[todayFormatted] === undefined) {
                fetchPrayerData(url, loadingSpinner);
            } else {
                loadingSpinner.style.display = "none";
                displayPrayerTimes(jsonData);
            }
        } else {
            fetchPrayerData(url, loadingSpinner);
        }
    }).catch((error) => {
        console.error(error);
        fetchPrayerData(url, loadingSpinner);
    });
});

function fetchPrayerData(url, loadingSpinner) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
            loadingSpinner.style.display = "none";
            displayPrayerTimes(json);
            storeData(json);
        })
        .catch(error => {
            loadingSpinner.style.display = "none";
            createAndStyleElement("h1", "Datan kan inte hämtas just nu.");
            console.error(error);
        });
}

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('myDatabase', 1);

        request.onerror = (event) => {
            reject('IndexedDB error: ' + event.target.errorCode);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const store = db.createObjectStore('cachedData', { keyPath: 'id' });
            store.createIndex('data', 'data', { unique: false });
        };
    });
};

const storeData = (data) => {
    openDB().then((db) => {
        const transaction = db.transaction(['cachedData'], 'readwrite');
        const objectStore = transaction.objectStore('cachedData');
        objectStore.clear(); // Clear existing data
        objectStore.add({ id: 1, data: data });
        transaction.oncomplete = () => {
            console.log('Data stored in IndexedDB');
        };
        transaction.onerror = (event) => {
            console.error('IndexedDB error: ' + event.target.errorCode);
        };
    }).catch((error) => {
        console.error(error);
    });
};

const retrieveData = () => {
    return new Promise((resolve, reject) => {
        openDB().then((db) => {
            const transaction = db.transaction(['cachedData'], 'readonly');
            const objectStore = transaction.objectStore('cachedData');
            const request = objectStore.get(1);
            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.data : null);
            };
            request.onerror = (event) => {
                reject('Error retrieving data from IndexedDB');
            };
        }).catch((error) => {
            console.error(error);
            reject('Error opening IndexedDB');
        });
    });
};

// Append the prayer times for today that have yet to be passed
function displayPrayerTimes(json) {
    const dict = {};
    const prayerTimesDiv = document.getElementById("prayerTimes");
    const prayerName = document.getElementById("prayers");
    const todaysDate = document.getElementById("todaysDate");
    

    let today = new Date();
    let day = today.getDate();
    let month = today.toLocaleString('default', { month: 'short' });
    month = month.charAt(0).toUpperCase() + month.slice(1);
    let weekday = today.toLocaleDateString('en-US', { weekday: 'short' });
    let display_weekday = today.toLocaleDateString('sv', { weekday: 'long'});
    // Format the date as "Weekday Day Month"
    let display_todayFormatted = `${display_weekday} ${day} ${month}`.replace('.', '');
    let todayFormatted = `${weekday} ${day} ${month}`.replace('.', '');

    const dateHeading = createAndStyleElement("p", `Dagens datum: ${display_todayFormatted}`);
    todaysDate.appendChild(dateHeading);


    
      // Extract data for today's date
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    day = tomorrow.getDate();
    month = tomorrow.toLocaleString('default', { month: 'short' });
    month = month.charAt(0).toUpperCase() + month.slice(1);
    weekday = tomorrow.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Format the date as "Weekday Day Month"
    let tomorrowFormatted = `${weekday} ${day} ${month}`.replace('.', '');
    

    // let todayData = { [todayFormatted]: json[todayFormatted] };
    // json = todayData

    
    // for (const prayer in json) {
    //     dict[prayer] = json[prayer];
    // }

    json[todayFormatted]["Fajr_tmr"] = json[tomorrowFormatted]["Fajr"] 

    
    const prayerNameList = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha'a", "Fajr_tmr"];
    const pray_id = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "fajr_tmr"];
    const image_source = ["sunrise.png", "sun.png", "midday.png", "midday.png", "sunset.png", "prayer.png", "sunrise.png"];

    let i = 0;
    let active = false;
    prev_prayer = null
    for (const prayer of prayerNameList) {
        if (prayer == "Fajr_tmr" && json[todayFormatted][prayer] === undefined){
            json[todayFormatted][Fajr_tmr] = "Inte tillgänglig";
        }
        const prayer_time = json[todayFormatted][prayer];
        const timeString = prayer_time;
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const parsedTime = new Date(`${year}-${month}-${day}T${timeString}`);
        
 
        if (i !== 6 && parsedTime < today) {
            i += 1;
            prev_prayer = prayer;

            continue;
        }

        const prayer_id = document.getElementById(pray_id[i]);

        if (!active) {
            if (i != 0) {
                let prev_prayer_id = document.getElementById(pray_id[i-1]);
                console.log(prev_prayer_id);
                livePrayerCard(i-1, prev_prayer_id,image_source, prev_prayer, json[todayFormatted][prev_prayer], today, parsedTime);
            }
            activePrayerCard(i, prayer_id,image_source, prayer, prayer_time, today, parsedTime);
            active = true;
        }
        else {
            normalPrayerCard(i, prayer_id,image_source, prayer, prayer_time, today, parsedTime);
        }
        prev_prayer = prayer;

        i += 1;
    }
}

function normalPrayerCard(i, prayer_id, image_source, prayer, prayer_time, today, parsedTime) {
    const mydiv = document.createElement("div");

  

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

  
    const temp = createAndStyleElement("p", prayer === "Fajr_tmr" ? "Fajr" : prayer);
    

    temp.setAttribute('id', 'prayerNames');
    
    const mydiv2 = document.createElement("div");
    mydiv2.style.width = "50%";
    mydiv2.appendChild(temp);
    prayer_id.appendChild(mydiv2);

    const temp2 = createAndStyleElement("p", prayer_time);
    const time_until = document.createElement("h5");
    let time_until_time = null
    if (prayer === "Fajr_tmr") {
        time_until_time = Math.round(( today.getTime() -parsedTime.getTime()) / 1000 / 60);
    }
    else{
        time_until_time = Math.round(( parsedTime.getTime() -today.getTime()) / 1000 / 60);
    }
    
    const mydiv3 = document.createElement("div");
    temp2.setAttribute('id', 'prayerNames');
    mydiv3.appendChild(temp2);
    mydiv3.appendChild(time_until);
    prayer_id.appendChild(mydiv3);

}
function livePrayerCard(i, prayer_id, image_source, prayer, prayer_time, today, parsedTime) {
    const mydiv = document.createElement("div");
    prayer_id.style.fontWeight = "bold";


  

    const img = document.createElement("img");
    img.src = `./assets/img/${image_source[i]}`;
    // change img color to red






    // img.style.width = "50%";    
    img.setAttribute('id', 'icons');
    
    
    mydiv.style.cssText = `
    width: 20%;
    margin-left: 1%;
    padding-top: 2%;
    margin-right: 5%;
  `;
  
    mydiv.appendChild(img);
    
    prayer_id.appendChild(mydiv);
    
    const icon = document.createElement("img");
    icon.src = "./assets/img/live.gif";
    icon.style.cssText = `
        filter: invert(1);
        position: absolute;
        top: 0;
        right: 0;
        width: 2rem;
        height: 2rem;
    `;
    
    mydiv.appendChild(icon);


    const temp = createAndStyleElement("p", prayer === "Fajr_tmr" ? "Fajr" : prayer);
    

    temp.setAttribute('id', 'prayerNames');
    
    const mydiv2 = document.createElement("div");
    mydiv2.style.width = "50%";
    mydiv2.appendChild(temp);
    prayer_id.appendChild(mydiv2);

    const temp2 = createAndStyleElement("p", prayer_time)
  



    // img.style.width = "50%";    
    img.setAttribute('id', 'icons');

    
    const mydiv3 = document.createElement("div");
    temp2.setAttribute('id', 'prayerNames');
    mydiv3.appendChild(temp2);
    prayer_id.appendChild(mydiv3);

}

function activePrayerCard(i, prayer_id, image_source, prayer, prayer_time, today, parsedTime) {

    const mydiv = document.createElement("div");


    prayer_id.style.backgroundColor = "#A7C7E7";
    prayer_id.style.color = "#212124";





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

   
    const temp = createAndStyleElement("p", prayer === "Fajr_tmr" ? "Fajr" : prayer);
    

    temp.setAttribute('id', 'prayerNames');
    
    const mydiv2 = document.createElement("div");
    mydiv2.style.width = "50%";
    mydiv2.appendChild(temp);
    prayer_id.appendChild(mydiv2);

    const temp2 = createAndStyleElement("p", prayer_time);
    let time_until_time = null
    if (prayer === "Fajr_tmr") {
        // Get current date and time
        const now = new Date();

        // Calculate the time difference in minutes
        time_until_time = Math.round((parsedTime - now) / (60 * 1000)); 
        

        // If the target time is earlier than the current time, add 24 hours
        if (time_until_time < 0) {
            time_until_time += 24 * 60; // 24 hours in minutes
        }
        
    }
    else {
        time_until_time = Math.round(( parsedTime.getTime() -today.getTime()) / 1000 / 60);
    }

    
    const hours = Math.floor(time_until_time / 60);
    const minutes = time_until_time % 60;
    temp2.textContent = prayer_time;
    

    active = true;


    const icon = document.createElement("p");
    const timeString = hours === 1 ? `${hours} timme och` : hours > 1 ? `${hours} timmar och` : '';
    icon.textContent = `Om ${timeString} ${minutes} min`;
    icon.style.cssText = `
        font-size: 0.5rem;
        font-family: sans-serif;
        position: absolute;
        top: 0;
        right: 0;
        margin-right: 1%;
        margin-top: 1%;
        padding: 2px 6px;
        background-color: #007BFF;
        color: #FFFFFF;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;

mydiv.appendChild(icon);
    
    const mydiv3 = document.createElement("div");
    temp2.setAttribute('id', 'prayerNames');
    mydiv3.appendChild(temp2);
    // mydiv3.appendChild(time_until);
    prayer_id.appendChild(mydiv3);

}


// Crete new element 
function createAndStyleElement(elementType, textContent) {
    const element = document.createElement(elementType);
    element.textContent = textContent;
    element.style.color = "#FFFFFF";
    element.style.textAlign = "center";
    return element;
}



function getFormattedDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).charAt(0).toUpperCase() + date.toLocaleString('default', { month: 'short' }).slice(1);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${weekday} ${day} ${month}`.replace('.', '');
}

