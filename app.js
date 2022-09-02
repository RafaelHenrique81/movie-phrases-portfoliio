import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import {  } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
import { GoogleAuthProvider , signInWithPopup , getAuth ,  signOut , onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'

const firebaseConfig = {
    apiKey: 'AIzaSyCtDHXeW5ekAyeOMlk6tR6cxpRC_o2iTUo',
    authDomain: 'movie-phrases.firebaseapp.com',
    projectId: 'movie-phrases',
    storageBucket: 'movie-phrases.appspot.com',
    messagingSenderId: '1019309186876',
    appId: '1:1019309186876:web:33161d6823644d96800839',
    measurementId: 'G-ZJLD1MNT6P'
  }

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


const phrasesContainer = document.querySelector('[data-js="phrases-container"]')
const buttonGoogle = document.querySelector('[data-js="button-google-login"]')
const buttonLogout = document.querySelector('[data-js="logout"]')

const showAppropriatedNavLinks = user => {
    console.log(user)
    const lis = [...document.querySelector('[data-js="nav-ul"]').children]
    
    lis.forEach(li => {
        const lisShouldBeVisible = li.dataset.js.includes(user ? 'logged-in' : 'logged-out')
        
        if(lisShouldBeVisible) {
            li.classList.remove('hide')
            return 
        }
        
        li.classList.add('hide')
    })
    
    if (!user) {
        const loginMessage = document.createElement('h5')
        
        loginMessage.textContent = 'Faça login para ver as frases'
        loginMessage.classList.add('center-align', 'white-text')
        phrasesContainer.append(loginMessage)
    }
    
}

const initModals = () => {
    const modals = document.querySelectorAll('[data-js="modal"]')
    M.Modal.init(modals)
}

const login = async () => {
    try {
        await signInWithPopup(auth, provider)
             
        const modalLogin = document.querySelector('[data-modal="login"]')
        M.Modal.getInstance(modalLogin).close()
    }catch (error){
        console.log(error)
    }
}

const logout = async () => {
    try {
        await signOut(auth)
        console.log('usuario foi deslogado')
    } catch (error) {
        
    }    
}

onAuthStateChanged(auth, showAppropriatedNavLinks)

buttonGoogle.addEventListener('click', login)

buttonLogout.addEventListener('click',logout )

initModals()