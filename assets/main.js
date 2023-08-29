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
            
    


            for (const prayer in json.today) {
                // const prayerItem = document.createElement("li");
                // prayerItem.textContent = `${prayer}: ${json.today[prayer]}`;
                // prayerList.appendChild(prayerItem);
                dict[prayer] = json.today[prayer]
            }
            dict["fajr_tmr"] = json.tomorrow["Fajr"]
            prayerNameList = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha'a", "fajr_tmr"]
            pray_id = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "fajr_tmr"]
            
            let image_source = ["sunrise.png","sun.png","midday.png","midday.png", "sunset.png","prayer.png","sunrise.png"]

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

                // if (i != 6 && parsedTime < today) {
                //     i+=1
                //     continue
                // }


                 

                var prayer_id = document.getElementById(pray_id[i]);

                
                
                var mydiv = document.createElement("div");
                
                if (active == false) {
                    // prayer_id.style.borderStyle  =  "Solid"
                    prayer_id.style.backgroundColor  =  "#A7C7E7"
                    prayer_id.style.color  =  "#212124"
                    prayer_id.style.fontWeight  =  "bold"

                }

                var img = document.createElement("img");

      
                img.src = "./assets/img/" +  image_source[i]
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
                if (prayer == "fajr_tmr") {
                    prayer = "Fajr imorgon"
                }
                temp.textContent = prayer
                temp.style.fontSize = "2rem"
                mydiv.appendChild(temp)

                prayer_id.appendChild(mydiv);


                const temp2 = document.createElement("p");
                const time_until = document.createElement("h5");

            
                
                if (active == false && i < 6) {

                    let time_until_time = Math.round((parsedTime.getTime()  - today.getTime()) / 1000 / 60)
                    var hours = Math.floor(time_until_time / 60);          
                    var minutes = time_until_time % 60;
                    temp2.textContent = prayer_time 
                    if (hours == 1) {
                        time_until.textContent = "Börjar om " + hours + " timme och " + minutes + " min" 
                    }
                    else if (hours == 0){
                        time_until.textContent = "Börjar om " + minutes + " min"
                    }
                    else {
                        time_until.textContent = "Börjar om " + hours + " timmar och " + minutes + " min"
                    }
                    active = true
                    

                }
                else {
                    temp2.textContent = prayer_time
                }
                

                mydiv = document.createElement("div");
                // mydiv.style.display = "flex"
                
                temp2.style.fontSize = "2rem"
                mydiv.appendChild(temp2)
                mydiv.appendChild(time_until)

                prayer_id.appendChild(mydiv);






                
                i += 1
            }
            

            
        })
        .catch(error => {
            console.error(error.message);
        });
});