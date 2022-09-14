import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import { getFirestore , collection , addDoc , onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
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
const db = getFirestore(app)
const collectionPhrases = collection(db, 'movie-phrases')
const phrasesList = document.querySelector('[data-js="phrases-list"]')

const phrasesContainer = document.querySelector('[data-js="phrases-container"]')

const addPhrase =  async e =>{
    e.preventDefault()
    
    try {
        const addedDoc = await addDoc(collectionPhrases, {
            movieTitle: DOMPurify.sanitize(e.target.title.value), 
            phrase: DOMPurify.sanitize(e.target.phrase.value) 
        })
     
        e.target.reset()
        
        const modalAddPhrase = document.querySelector('[data-modal="add-phrase"]')
        M.Modal.getInstance(modalAddPhrase).close()
    } catch (error) {
        console.log(error)
    }
}

const handleAuthStateChanged = user => {
    const loginMessageExists = document.querySelector('[data-js="login-message"]')
    const lis = [...document.querySelector('[data-js="nav-ul"]').children]
    const formAddPhrase = document.querySelector('[data-js="add-phrase-form"]')
    const buttonGoogle = document.querySelector('[data-js="button-google-login"]')
    const buttonLogout = document.querySelector('[data-js="logout"]')
    
    lis.forEach(li => {
        const lisShouldBeVisible = li.dataset.js.includes(user ? 'logged-in' : 'logged-out')
        
        if(lisShouldBeVisible) {
            li.classList.remove('hide')
            return 
        }
        
        li.classList.add('hide')
    })

    if (loginMessageExists) {
        loginMessageExists.remove()
    }

    if (!user) {
        const loginMessage = document.createElement('h5')
        
        loginMessage.textContent = 'Faça login para ver as frases'
        loginMessage.classList.add('center-align', 'white-text')
        loginMessage.setAttribute('data-js', 'login-message')
        phrasesContainer.append(loginMessage)

        formAddPhrase.removeEventListener('submit', addPhrase)
        buttonLogout.removeEventListener('click',logout )
        buttonGoogle.addEventListener('click', login)

        phrasesList.innerHTML = ''

        return
    }
        formAddPhrase.addEventListener('submit', addPhrase)
        buttonLogout.addEventListener('click',logout )
        buttonGoogle.removeEventListener('click', login)

        onSnapshot(collectionPhrases, snapshot => {
            const documentFragment = document.createDocumentFragment()

            snapshot.docChanges().forEach(docChange => {
                const liPhrase = document.createElement('li')
                const movieTitleContainer = document.createElement('div')
                const phraseContainer = document.createElement('div')
                const { movieTitle, phrase} = docChange.doc.data()

                movieTitleContainer.textContent = DOMPurify.sanitize(movieTitle)
                phraseContainer.textContent = DOMPurify.sanitize(phrase)
                movieTitleContainer.setAttribute('class', 'collapsible-header blue-grey-text text-lighten-5 blue-grey darken-4')
                phraseContainer.setAttribute('class', 'collapsible-body blue-grey-text text-lighten-5 blue-grey darken-3'
                )

                liPhrase.append(movieTitleContainer, phraseContainer)
                documentFragment.append(liPhrase)
            })
            
            phrasesList.append(documentFragment)

        })

        initCollapsibles()    
}

const initCollapsibles = () => M.Collapsible.init(phrasesList)

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

onAuthStateChanged(auth, handleAuthStateChanged)

initModals()