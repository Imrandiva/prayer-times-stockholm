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
            active = false
            for (prayer of prayerNameList) {
            
            prayer_time = dict[prayer]
                                            // Replace this with the time string you have
            const timeString = prayer_time // Example time string in HH:MM:SS format

            const today = new Date();

            
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');


            // Step 1: Parse the time string into a Date object

            const parsedTime = new Date(`${year}-${month}-${day}T${timeString}`);

            // Step 3: Compare the two Date objects
            if (parsedTime < today) {
                continue
            }

                var prayer_id = document.getElementById(pray_id[i]);
                
                
                var mydiv = document.createElement("div");
                
                if (active == false) {
                    prayer_id.style.paddingTop =  "1rem"
                    prayer_id.style.paddingBottom  =  "1rem"
                    prayer_id.style.borderStyle  =  "Solid"
                    prayer_id.style.borderColor  =  "#03DAC6"
                    active = true
                }

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
                temp2.textContent = prayer_time
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