import React from 'react'
import Divider from '@material-ui/core/Divider'
import Chip from '@material-ui/core/Chip'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import FindInPage from '@material-ui/icons/FindInPage'
import PlayArrowOutlined from '@material-ui/icons/PlayArrowOutlined'
import DoneAllOutlined from '@material-ui/icons/DoneAllOutlined'
import Firebase from 'firebase'
import Layout from '../components/layout'
import SEO from '../components/seo'

const firebaseConfig = {
  apiKey: 'AIzaSyCQeeb45fA-WDU3f3BCnpzDRv4_3sjWdLk',
  authDomain: 'catch-26e8b.firebaseapp.com',
  databaseURL: 'https://catch-26e8b.firebaseio.com',
  projectId: 'catch-26e8b',
  storageBucket: 'catch-26e8b.appspot.com',
  messagingSenderId: '929097755558',
  appId: '1:929097755558:web:2e8898963d9afb5064bd67',
  measurementId: 'G-XHZ6HDNH6M',
}
// Initialize Firebase
if (!Firebase.apps.length) {
  Firebase.initializeApp(firebaseConfig)
}

function SecondPage({ id }) {
  const [words, setWords] = React.useState([])
  const [current, setCurrent] = React.useState('')
  const [vocabulary, setVocabulary] = React.useState('')
  const [play, setPlay] = React.useState(false)
  const [time, setTime] = React.useState(0)
  const [point, setPoint] = React.useState(0)

  React.useEffect(() => {
    Firebase.database()
      .ref('games/' + id)
      .on('value', function(snapshot) {
        const messageObject = snapshot.val()
        console.log(messageObject)
        if (messageObject.words) {
          const wordsString = messageObject.words
          setWords(wordsString.split('/'))
          setPlay(messageObject.play)
          setVocabulary(messageObject.vocabulary)
        }
      })
  }, [])

  React.useEffect(() => {
    if (time === 0) {
      // setPlay(false)
      // setCurrent('')
      Firebase.database()
        .ref('games/' + id)
        .update({ play: false, vocabulary: current })
        .then(() => {
          setPlay(false)
          setCurrent('')
          setVocabulary(current)
        })
    }
    if (!time) return
    let timer = setInterval(() => {
      setTime(time - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [time])

  function handleStart() {
    const term = words[Math.floor(Math.random() * words.length)]
    setCurrent(term)
    const newWords = words.filter(word => word !== term)
    Firebase.database()
      .ref('games/' + id)
      .set({ play: true, words: newWords.join('/'), vocabulary: '' })
      .then(() => {
        setWords(words.filter(word => word !== term))
        setPlay(true)
        setTime(60)
      })
    // setWords(words.filter(word => word !== term))
    // setPlay(true)
    // setTime(60)
  }

  function handleFinish() {
    setPoint(point + 1)
    Firebase.database()
      .ref('games/' + id)
      .update({ play: false, vocabulary: current })
      .then(() => {
        setPlay(false)
        setTime()
        setCurrent('')
      })
  }

  return (
    <Layout>
      <SEO title="Page two" />
      <h1>Point: {point}</h1>
      {words.map(word => (
        <Chip
          icon={<TagFacesIcon />}
          size="medium"
          variant="outlined"
          key={word}
          label="secret"
        />
      ))}
      <Divider />
      {words.length !== 0 && !play && (
        <Fab color="primary" aria-label="add" onClick={handleStart}>
          <PlayArrowOutlined />
        </Fab>
      )}

      {play === true && (
        <div>
          <p>Time left: {time}</p>{' '}
          <a
            href={`https://www.ldoceonline.com/dictionary/${current}`}
            target="_blank"
          >
            <h1>{current}</h1>
            <Button
              variant="contained"
              color="primary"
              endIcon={<FindInPage />}
            >
              Look up
            </Button>
          </a>
        </div>
      )}
      <Divider />
      {vocabulary !== '' && (
        <>
          <Typography variant="h6" component="h6">
            Vocabulary is: {vocabulary}
          </Typography>
          <Divider />
        </>
      )}

      {play && (
        <Fab color="primary" aria-label="finish" onClick={handleFinish}>
          <DoneAllOutlined />
        </Fab>
      )}
    </Layout>
  )
}

export default SecondPage
