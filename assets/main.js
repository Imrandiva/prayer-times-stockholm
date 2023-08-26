document.addEventListener("DOMContentLoaded", () => {
    let url = "https://dailyprayer.abdulrcs.repl.co/api/stockholm";

    fetch(url)
        .then(response => response.json())
        .then(json => {

            var dict = {};
            console.log(json)
            const prayerTimesDiv = document.getElementById("prayerTimes");
            const prayerName = document.getElementById("prayers");
            const todaysDate = document.getElementById("todaysDate");




            const dateHeading = document.createElement("p");
            dateHeading.textContent = `Dagens datum: ${json.date}`;
            dateHeading.style.color = "#FFFFFF"
            dateHeading.style.textAlign = "center"
            todaysDate.appendChild(dateHeading);
            const prayerList = document.createElement("ul");
            const nameList = document.createElement("ul");

    


            for (const prayer in json.today) {
                // const prayerItem = document.createElement("li");
                // prayerItem.textContent = `${prayer}: ${json.today[prayer]}`;
                // prayerList.appendChild(prayerItem);
                dict[prayer] = json.today[prayer]
            }
            prayerNameList = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha'a"]
            pray_id = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]

            var i = 0;
            for (prayer of prayerNameList) {
                var prayer_id = document.getElementById(pray_id[i]);
                
                
                var mydiv = document.createElement("div");

                var img = document.createElement("img");
                img.src = "./assets/img/sunrise.svg"
                img.style.width = "100%"
                mydiv.style.width = "10%"
                mydiv.style.marginLeft = "1%"
                mydiv.style.paddingTop = "2%"
                mydiv.style.marginRight = "5%"
                mydiv.appendChild(img)
                prayer_id.appendChild(mydiv);


                

                
                mydiv = document.createElement("div");
                
                mydiv.style.width = "50%"
                const temp = document.createElement("p");
                temp.textContent = prayer
                temp.style.fontSize = "2rem"
                mydiv.appendChild(temp)

                prayer_id.appendChild(mydiv);


                const temp2 = document.createElement("p");
                mydiv = document.createElement("div");
                // mydiv.style.display = "flex"
                temp2.textContent = dict[prayer]
                temp2.style.fontSize = "2rem"
                mydiv.appendChild(temp2)

                prayer_id.appendChild(mydiv);






                
                i += 1
            }

            
        })
        .catch(error => {
            console.error(error.message);
        });
});