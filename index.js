async function getData(){
    try{
        let response = await fetch('./banor.json');
        response = await response.json();
        let data = response;
        return data;
    }catch(error){
        console.log(error.message);
    }
}

function playerInput(){
    try{

    }catch(error){
        console.log(error.message);
    }
}

function PlayerAmountHandler(){
    try{
        let amount = document.getElementById('PlayerAmount').value;
        let errorMSG = document.getElementById('errorMSG');

        if(!amount){
            errorMSG.innerText = "Måste fylla i antal spelare!";
            return;
        }
        if(amount <1){
            errorMSG.innerText = "Måste minst vara 1 spelare!";
            return;
        }
        if(amount > 5){
            
            errorMSG.innerText = "För många spelare!";
            return;
        }

        renderPlayerNames(amount);

    }catch(error){
        console.log(error.message);
    }
}

function renderPlayerNames(amountOfPlayers){
    try{
        let playerSelectionDiv = document.getElementById('player-names');
        let player_menu = document.getElementById('player-selection');

        let AmountInput = document.getElementById('PlayerAmount');
        AmountInput.hidden = true;
        let confirm_btn = document.getElementById('confirm-player-btn');
        confirm_btn.hidden = true;
        let errorMSG = document.getElementById('errorMSG');
        errorMSG.innerText = "";

        for(let i = 1; i<=amountOfPlayers; i++){
            let html = `
                <div class="player-name">
                    <h4>Spelare ${i}</h4>
                    <input id="spelare${i}" type="text" placeholder="Namn"></input>
                </div>
            `;
            playerSelectionDiv.innerHTML += html;
        }

        let btn_html = `<button class="confirm-player-btn" onClick="confirm_players(${amountOfPlayers})">Spara</button>`;

        playerSelectionDiv.innerHTML += btn_html;

    }catch(error){
        console.log(error.message);
    }
}

function generateRandomId(){
    return Math.floor(Math.random() * 100000);
}

function confirm_players(amountOfPlayers){
    try{

        let playerArr = [];

        for(let i = 1; i <=amountOfPlayers; i++){

            let playerName = document.getElementById(`spelare${i}`).value;


            let PlayerObj = {
                name: checkPlayerName(playerName),
                bana1: "",
                bana2: "",
                bana3: "",
                bana4: "",
                id: generateRandomId()
            };
            playerArr.push(PlayerObj);
        }


        localStorage.setItem('players', JSON.stringify(playerArr));

        document.getElementById('player-selection').innerHTML = "";

        renderStart();

    }catch(error){
        console.log(error.message);
    }
}

function checkPlayerName(playerName){
    try{
        let name = playerName.trim();
        return name;
    }catch(error){
        console.log(error.message);
    }
}

function renderStart(){
    try{

        let main = document.getElementById('main-container');

        let html = `<div><p id="errorMSG-scorecard" class="errorMSG-scorecard"></p><input class="start-course-input" id="start-course-input" type="number" placeholder="Välj start bana"></input><br><button class="start-btn" onClick="startGame()">Start</button></div>`;
        main.innerHTML = html;
    }catch(error){
        console.log(error.message);
    }
}

async function startGame(){
    try{
        let startCourse = document.getElementById('start-course-input').value;
        let errorMSG = document.getElementById('errorMSG-scorecard');

        let allCourses = await getData();

        allCourses.forEach(item=>{
            item["completed"] = false;
        });;

        if(startCourse > (allCourses.length)){
            errorMSG.innerText = "Banan finns EJ!";
            return;
        }

        if(startCourse < 1){
            errorMSG.innerText = "Banan finns EJ!";
            return;
        }

        renderScorecard(allCourses[startCourse-1]);

        localStorage.setItem('courses', JSON.stringify(allCourses));

    }catch(error){
        console.log(error.message);
    }
}

function renderScorecard(startCourse){
    try{
        let players = JSON.parse(localStorage.getItem('players'));
        let main = document.getElementById('main-container');
        main.innerHTML = "";
        // ${renderAmountInput()}

        let spelad = false;

        if(startCourse.completed){
            spelad = true;
        }

        let scorecard_html = `
            <div class="scorecard" id="scorecard">
                <p id="errorMSG-scorecard" class="errorMSG-scorecard"></p>
                <h4>Hål ${startCourse.id}</h4>
                <p class="course-info-par">Par ${startCourse.par}</p>
                <p class="course-info">${startCourse.info}</p>
                ${(spelad) ? "<p class='course-played'>Redan spelad</p>" : ""}
                <div id="scorecard-inputs"></div>
                <button class="next-course-btn" onclick="last_course('${startCourse.id}')">Föregående hål</button><br></br>
                <button class="show_current_stats_btn" onclick="renderScoreboard('${startCourse.id}')">Se nuvarande ställning</button><br></br>
                <button class="next-course-btn" onclick="nextCourse('${startCourse.id}')">Nästa hål</button>
            </div>

            `;

          

        main.innerHTML = scorecard_html;
        renderAmountInput(startCourse);
    }catch(error){
        console.log(error.message);
    }
}

function renderAmountInput(course){
    try{

        let amount = JSON.parse(localStorage.getItem('players'));
        let Div = document.createElement('div');
        let divInputs = document.getElementById('scorecard-inputs');
        
        if(course.completed){
            for(let i = 1; i<= amount.length; i++){
                let player = amount[i-1];
                let html = `<div class="scorecard-individual"><p class="scorecard-playerName">${amount[i-1].name}<input type="number" class="scorecard-input" id="score${i}" value="${player[`bana${course.id}`]}"></input></p></div><br>`
                Div.innerHTML += html;
            };
            divInputs.appendChild(Div);
            return;
        }

        for(let i = 1; i<= amount.length; i++){
            let html = `<div class="scorecard-individual"><p class="scorecard-playerName">${amount[i-1].name}<input type="number" class="scorecard-input" id="score${i}" placeholder="Slag"></input></p></div><br>`
            Div.innerHTML += html;
        };
        

        divInputs.appendChild(Div);
        //  return(Div);

    }catch(error){
        console.log(error.message);
    }
}

function nextCourse(course){
    try{   
        let errorMSG = document.getElementById('errorMSG-scorecard');
        if(!checkScorecardInputs(course)){
            errorMSG.innerText = "Alla fält MÅSTE fyllas i!";
            return;
        }



        let scorecard = document.getElementById('scorecard');
        scorecard.innerHTML = "";

        // renderScorecard(course+1);
        let allCourses = JSON.parse(localStorage.getItem('courses'));

        let coursesLEFT = [];

        if(checkAvailableCourses(allCourses)){
            renderScoreboard();
            return alert("Alla banor spelade!");
        }

        if(!allCourses[course]){
            allCourses.forEach(course =>{
                if(!course.completed){
                    coursesLEFT.push(course);
                }
            });
            renderScorecard(coursesLEFT[0]);
            return;
        }



        renderScorecard(allCourses[course]);

    }catch(error){
        console.log(error.message)
    }
}

function checkAvailableCourses(courses){
    
    let coursesLeft = [];

    courses.forEach(course =>{
        if(!course.completed){
            coursesLeft.push(course);
        }
    });

    if(!coursesLeft){
        return true;
    }

    if(coursesLeft == ""){
        return true;
    }

    return false;

}

function checkScorecardInputs(course){
    try{

        let players = JSON.parse(localStorage.getItem('players'));
        
        let status = true;

        for(let i = 1; i<=players.length; i++){
            let score = document.getElementById(`score${i}`).value;            

            if(score < 1){
                status = false;
            }
            if(score == ""){
                status = false;
            }

            let player = players[i-1];
            player[`bana${course}`] = score;

        }

        if(!status){
            return false;
        }

        let courses = JSON.parse(localStorage.getItem('courses'));

        let courseCHANGE = courses[course-1];
        courseCHANGE.completed = true;

        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('courses', JSON.stringify(courses));

        return true;

    }catch(error){
        console.log(error.message)
    }
}

function calculateScores(){
    try{

        let players = JSON.parse(localStorage.getItem('players'));
        let allCourses = JSON.parse(localStorage.getItem('courses'));

        players.forEach(player=>{
            let sum = 0;
            for(let i = 1; i<=allCourses.length; i++){
                if(!player[`bana${i}`]){
                    player[`bana${i}`] = 0;
                }
                let slag = parseInt(player[`bana${i}`]);
                sum = sum + slag;
            }
            player['sum'] = sum;
        });
        localStorage.setItem('players', JSON.stringify(players));
        return players;

    }catch(error){
        console.log(error.message);
    }
}

function renderScoreboard(course){
    try{

        let PlayerScores = calculateScores();

        let startMenu = document.getElementById('start-menu');
        startMenu.innerHTML = "";

        let main = document.getElementById('main-container');
        main.innerHTML = "";
        let html;

        if(course){
             html = `
            <div class="scoreboard" id="scoreboard">
                <div id="winner-name"></div>
                <div id="player-scores"></div>
                <button class="show-details-btn" onclick="go_back('${course}')">Fortsätt spela</button>
                <button class="show-details-btn" onClick="showDetailedScoreboard('${(course) ? course : ""}')">Visa detaljerad lista</button>
            </div>
        `;
        } 
        
        if(!course){
             html = `
            <div class="scoreboard" id="scoreboard">
                <div id="winner-name"></div>
                <div id="player-scores"></div>
                <button class="show-details-btn" onClick="showDetailedScoreboard('${(course) ? course : ""}')">Visa detaljerad lista</button>
            </div>`;
        }

        main.innerHTML = html;
        
        renderPlayerScores(PlayerScores);

        if(!course){
            checkWinner();
        }
    }catch(error){
        console.log(error.message);
    }
}

function renderPlayerScores(players){
    try{
        let scoreboard_div = document.getElementById('player-scores');

        let div = document.createElement('div');
        div.setAttribute('id', "individual-player-score");

        players.forEach(player=>{
            let html = `
                <div class="scoreboard-player">
                    <h4>${player.name}</h4>
                    <p>Antal slag: ${player.sum}</p>
                </div>
                `;
            div.innerHTML += html;
        });

        scoreboard_div.appendChild(div);


    }catch(error){
        console.log(error.message);
    }
}

function showDetailedScoreboard(course){
    try{



        let scoreboard_div = document.getElementById('scoreboard');
        scoreboard_div.innerHTML = "";

        if(!course){
            let html = `
            <div id="detailed-SB">
            
            </div>
            <button class="show_SB_btn" onclick="renderScoreboard()">Visa förenklad lista</button>
            `;
            scoreboard_div.innerHTML = html;
            renderDetailedScoreboard_DEV();
            return;
        }
        
        let html = `
            <div id="detailed-SB">
            
            </div>
            <button class="show_SB_btn" onclick="go_back('${(course) ? course : ""}')">Fortsätt spela</button>
            <button class="show_SB_btn" onclick="renderScoreboard('${(course) ? course : ""}')">Visa förenklad lista</button>
            `;


        
        scoreboard_div.innerHTML = html;
        renderDetailedScoreboard_DEV();
    }catch(error){
        console.log(error.message);
    }
}

// renderDetailedScoreboard används EJ!! 
// Den har bytts ut mot renderDetailedScoreboard_DEV istället!!!
function renderDetailedScoreboard(){
    try{
        
        let allCourses = JSON.parse(localStorage.getItem('courses'));
        let players = JSON.parse(localStorage.getItem('players'));

        let detailed_SB = document.getElementById('detailed-SB');

        let div = document.createElement('div');
        div.setAttribute('id', 'player-SB');
        div.setAttribute('class', 'player-SB');

        let innerDIV = document.createElement('div');
        innerDIV.setAttribute('id', 'player-stats');
        innerDIV.setAttribute('class', 'player-stats');

        let inner = document.createElement('div');
        inner.setAttribute('id', 'player-score');


        players.forEach(player=>{
            let topHTML = `<h4 class="SB-name">${player.name}</h4>`
            div.innerHTML += topHTML;
            innerDIV.innerHTML = "";
            for(let i = 0; i < allCourses.length; i++){
                let html = `
                <div class="course-stats">
                    <p class="SB-course">Hål ${i+1}</p>
                    <p class="SB-slag">${player[`bana${i+1}`]} slag</p>
                </div>
                `;
                innerDIV.innerHTML += html;
            }

            // for(let i = 1; i<=allCourses.length; i++){
            //     let html = `
            //         <div>
            //             <h4>Hål ${i}</h4>
            //         </div>
            //     `;
            //     innerDIV.innerHTML += html;
            // }

            // players.forEach(player=>{
            //     let top = `<p>${player.name}</p>`
            //     inner.innerHTML += top;
            //     for(let i = 1; i<=allCourses.length; i++){
            //         let html = `
            //             <p>${player[`bana${i}`]}</p>             
            //         `;
            //         inner.innerHTML += html;
            //     }
            // })

            let total = `<p>Totalt antal slag: ${player.sum}</p>`;
            innerDIV.innerHTML += total;
            div.appendChild(inner);
            div.appendChild(innerDIV);
            detailed_SB.appendChild(div);
            
        });

        // detailed_SB.appendChild(div);

    }catch(error){
        console.log(error.message);
    }
}

function renderDetailedScoreboard_DEV(){
    try{
        
        let allCourses = JSON.parse(localStorage.getItem('courses'));
        let players = JSON.parse(localStorage.getItem('players'));

        let detailed_SB = document.getElementById('detailed-SB');

        let div = document.createElement('div');
        div.setAttribute('id', 'player-SB');
        div.setAttribute('class', 'player-SB');

        let innerDIV = document.createElement('div');
        innerDIV.setAttribute('id', 'player-stats');
        innerDIV.setAttribute('class', 'player-stats');

        let inner = document.createElement('div');
        inner.setAttribute('id', 'player-score');
        inner.setAttribute('class', 'player-score');

            // for(let i = 1; i<=allCourses.length; i++){
            //     let html = `
            //         <div>
            //             <h4>Hål ${i}</h4>
            //         </div>
            //     `;
            //     innerDIV.innerHTML += html;
            // }

            players.forEach(player=>{

                let player_div = document.createElement('div');
                player_div.setAttribute('id', 'player-SB-div');
                player_div.setAttribute('class', 'player-SB-div');

                let top = `<p class="SB-name">${player.name}</p>`
                player_div.innerHTML += top;
                for(let i = 1; i<=allCourses.length; i++){

                    if(!player[`bana${i}`]){
                        player[`bana${i}`] = 0;
                    }

                    if(player[`bana${i}`] == 0){
                        let html = `<div class="SB-div"> <p class="SB-course">Hål ${i}</p><p class="SB-par">Par ${allCourses[i-1].par}</p><p id="SB-slag" class="SB-slag">${player[`bana${i}`]}</p></div>`;
                        player_div.innerHTML += html;
                    }else if(player[`bana${i}`] < allCourses[i-1].par){
                        let html = `<div class="SB-div"> <p class="SB-course">Hål ${i}</p><p class="SB-par">Par ${allCourses[i-1].par}</p><p id="SB-slag" class="SB-slag green-highlight">${player[`bana${i}`]}</p></div>`;
                        player_div.innerHTML += html;
                    }else if(player[`bana${i}`] > allCourses[i-1].par){
                        let html = `
                        <div class="SB-div"> <p class="SB-course">Hål ${i}</p><p class="SB-par">Par ${allCourses[i-1].par}</p><p id="SB-slag" class="SB-slag red-highlight">${player[`bana${i}`]}</p></div>            
                       `;
                       player_div.innerHTML += html;
                    }else if(player[`bana${i}`] == allCourses[i-1].par){
                        let html = `
                        <div class="SB-div"> <p class="SB-course">Hål ${i}</p><p class="SB-par">Par ${allCourses[i-1].par}</p><p id="SB-slag" class="SB-slag orange-highlight">${player[`bana${i}`]}</p></div>            
                       `;
                       player_div.innerHTML += html;
                    }

                    // console.log("Bana " + i + " " + player[`bana${i}`]);

                    // let html = `
                    //  <div class="SB-div"> <p class="SB-course">Hål ${i}</p><p class="SB-par">Par ${allCourses[i-1].par}</p><p id="SB-slag" class="SB-slag">${player[`bana${i}`]}</p></div>            
                    // `;
                    // player_div.innerHTML += html;



                }
                let total = `<p>Totalt antal slag ${player.sum}</p>`;
                player_div.innerHTML += total;
                inner.appendChild(player_div);
            });

            // let total = `<p>Totalt antal slag: ${player.sum}</p>`;
            // innerDIV.innerHTML += total;
            
            
            // div.appendChild(innerDIV);
            div.appendChild(inner);
            
            detailed_SB.appendChild(div);
            
        // });

        // detailed_SB.appendChild(div);

    }catch(error){
        console.log(error.message);
    }
}

function go_back(course){
    try{
        
        if(!course){
            return console.log("No course to play!");
        }

        let allCourses = JSON.parse(localStorage.getItem('courses'));

        renderScorecard(allCourses[course-1]);

    }catch(error){
        console.log(error.message);
    }
}

function last_course(course){
    try{

        let allCourses = JSON.parse(localStorage.getItem('courses'));

        if(course == 1){
            let lastCourse = allCourses[allCourses.length-1];
            renderScorecard(lastCourse);
            return;
        }

        let lastCourse = allCourses[course-2];
        renderScorecard(lastCourse);

    }catch(error){
        console.log(error.message);
    }
}

function checkWinner(){
    try{
        let players = JSON.parse(localStorage.getItem('players'));

        let array = [];
        let winner;

        players.forEach(player=>{
            array.push(player.sum);
        });

        let tie = false;

        array.sort((a,b)=>{
            return a-b;
        });

        if(array[0] == array[1]){
            tie = true;
        }

        players.forEach(player=>{
            if(player.sum == array[0]){
                winner = player;
                return;
            }
        });

        if(!tie){
            let html = `
            <h4 class="winner-div">Vinnaren är <span class="winner-name-span">${winner.name}</span>!</h4>
            `;

            let winner_div = document.getElementById('winner-name');
            winner_div.innerHTML = html;
            return;
        }
        
        if(tie){
            let html = `
            <h4 class="winner-div">Oavgjort!</h4>
            `;

            let winner_div = document.getElementById('winner-name');
            winner_div.innerHTML = html;
        }

    }catch(error){
        console.log(error.message);
    }
}