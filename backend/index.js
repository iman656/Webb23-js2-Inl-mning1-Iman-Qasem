console.log("hello siss from index.js");
const _ = require("underscore");
const express = require("express");
const fs = require('fs');


const app = express();
app.use(express.json());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/highscore', (req, res) => {
    try {
        const highScore = fs.readFileSync("./data/highScore.json")

        const userNameScore = JSON.parse(highScore);

        res.send(userNameScore);
    } catch (error) {
        console.error('Error reading highscore file:', error);
        res.status(500).send('Internal Server Error');
    }
});


const highScoreFilePath = "./data/highScore.json";

app.post('/highscore', async (req, res) => {

    try {
        const highScoreData = JSON.parse(fs.readFileSync(highScoreFilePath));

        const { name, score } = req.body;

        let updated = false;

        for (let i = 0; i < highScoreData.length; i++) {
            if (score > highScoreData[i].score) {
                highScoreData.splice(i, 0, { name, score });
                updated = true;
                break;
            }
        }

        if (updated) {
            const top5Scores = _.sortBy(highScoreData, "score").reverse().slice(0, 5);

            await fs.promises.writeFile(highScoreFilePath, JSON.stringify(top5Scores));
            res.send(top5Scores);
        } else {
            res.send(highScoreData.slice(0, 5));
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});











// const _ = require("underscore");
// const express = require("express");
// const fs = require("node:fs");

// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());




// var crosOp ={
//   origin: '*',
//   methods: "GET,PATCH,POST",
//   optionsSuccessStatus: 200
// }



// app.get('/highscore',cors(crosOp), (request, response)=>{
//     try{
//         const highScore = fs.readFileSync("./data/highScore.json", "utf-8");
//         const userNameScore = JSON.parse(highScore);
//         console.log(userNameScore);
//        // response.send('is this good!!'+ userNameScore);
//         response.send( userNameScore);
//       }catch (error) {
//         console.error('Error reading highscore file:', error);
//         res.status(500).send('Internal Server Error');
//     }   
// });




// app.post('/highscore',cors(crosOp),(req,res)=>{
//     console.log(req.body);
//     const newPlayer =req.body;
//     const rawData = fs.readFileSync('./data/highScore.json','utf-8');
//     let userNameScore = JSON.parse(rawData);
  
//     userNameScore.push(newPlayer);
//     let sortedHighscores = _.sortBy(userNameScore, 'score').reverse();
//     sortedHighscores = sortedHighscores.slice(0, 5);

//     res.setHeader('Content-Type', 'application/json');
//     fs.writeFileSync('./data/highscore.json', JSON.stringify(sortedHighscores));
//     console.log('is this post');
//     res.send( );

// });




// app.patch('/highscore',cors(crosOp), (req, res) => {
//     const { name, score } = req.body;
//     const rawData = fs.readFileSync('./data/highscore.json', 'utf-8');
//     let highscoreList = JSON.parse(rawData);
//     let playerFound = false;
  
//     for (const highscore of highscoreList) {
//       if (highscore.name === name) {
//         if (score > highscore.score) {
//           highscore.score = score;
//           playerFound = true;
//           break;
//         }
//       }
//     }

//     highscoreList = _.sortBy(highscoreList, 'score').reverse();
//     let sortedHighscores = highscoreList.slice(0, 5);
  
//     let updatedHighscoreInfo = JSON.stringify(sortedHighscores);
//     fs.writeFileSync('./data/highscore.json', updatedHighscoreInfo);
//     res.send('New Highscore updated! again');
//   })
  

  
//   app.listen(3000, () => {
//     console.log("Listening on port 3000 ...");
// })


// function createNewPost(){
//     let request = new XMLHttpRequest();
//     request.open("POST","http://localhost:3000/highscore");
//     request.responseType = "JSON";
//     request.setRequestHeader("Accept","application/json");
//     request.setRequestHeader("Content-type","application/json");

//     let bodyPrams = `{ 
//             "name":"suzanne",
//         "score":3
//     }`;
    
//     request.send(bodyPrams);

//     request.onload = function(){
//         let response =request.response;
//         console.log(response);
//     }
// }
// createNewPost()