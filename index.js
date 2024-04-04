import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import {getDatabase, push, ref, onValue, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

/// FIREBASE SETUP
const databaseSettings = {
    databaseURL : 'https://project-a-2fb41-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(databaseSettings)
const database = getDatabase(app)
const textifyDB = ref(database, 'textifyDB')

/// PROJECT VARIABLES
const textifyPostsContainer = document.getElementById('textifyPostsContainer')
const publishBtn = document.getElementById('publishBtn')
const textifyInput =document.getElementById('textifyInput')



/// STARTING PAGE LOGIC

const usernameInput = document.getElementById('username')
const usernameBtn = document.getElementById('usernameBtn')

document.getElementById('welcomeMsg').innerHTML = `Welcome back ${localStorage.getItem('username')}!`

const welcomeMsg = document.getElementById('welcomeMsg')
if(localStorage.getItem('username')){
    document.getElementById('startingPage').style.display = 'none'
    document.getElementById('mainPage').style.visibility = 'visible'
}

let userEnteredUsername = false

usernameBtn.addEventListener('click', () =>{
        if(usernameInput.value != ''){
            userEnteredUsername = true
            localStorage.setItem('username',usernameInput.value)
            document.getElementById('startingPage').style.display = 'none'
            document.getElementById('mainPage').style.visibility = 'visible'
            
        }
})


publishBtn.addEventListener('click', () => {
    const textifyText = textifyInput.value

    const localDate = new Date()
    const TextifyHours = localDate.getHours()
    const TextifyMin = localDate.getMinutes()
   
    const TextifyTime = `${TextifyHours}:${TextifyMin}`
    
    const localstorageUsername = localStorage.getItem('username')
    const TextifyUser = `@${localstorageUsername}`

    const textifyTweet = {
        user: TextifyUser,
        text: textifyText,
        time: TextifyTime,
        likes: 0,
        isLiked: false
    }

    push(textifyDB, textifyTweet)
    textifyInput.value = ''
    

    

})

onValue(textifyDB, function(snapshot){
    textifyPostsContainer.innerHTML = ""
    const textifyTweetObject = Object.entries(snapshot.val())

    textifyTweetObject.forEach(item =>{
        
        let isLiked = item[1].isLiked
        
        
        createTextify(item)
        
        
    })
})


function createTextify(item){
    


    let textifyLikes = item[1].likes
        const textifyText = item[1].text
        const textifyTime = item[1].time
        const textifyUser = item[1].user
        const textifyID = item[0]
        let textifyIsLiked = item[1].isLiked



    const newDiv = document.createElement('div')

    // const newI = document.createElement('i')
    // newI.classList.add('icon-trash')
    
    const ielement = "<i class='icon-trash'></i>"
    

    const newTextify = `
    <div id="TextifyBox">
        <div id="TextifyNameTime">
            <div>${textifyUser}</div>
            <div id="bincontainer">
                <div>${textifyTime}</div>
               <div>${ielement}</div>
               
            </div>
        </div>
        <div id="TextifyText">
            ${textifyText}
        </div>
            <div id="textifyLikes">
            <div id='likescontainer'>
                <i class="icon-heart"></i>${textifyLikes}
            </div>
            </div>
    </div>
    `


    newDiv.innerHTML = newTextify

    textifyPostsContainer.append(newDiv)

    newDiv.addEventListener('dblclick', () =>{
        const exactPath = ref(database, `textifyDB/${textifyID}`)
        remove(exactPath)
    })
  
    
    // newDiv.addEventListener('dblclick',function(){
    //     if(textifyIsLiked){
    //         textifyLikes -= 1
    //     }
    //     else{
    //         textifyLikes += 1
    //     }
    //     textifyIsLiked = !textifyIsLiked
    //     console.log(textifyLikes)
    // })
  

  
}

