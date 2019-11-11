import React from 'react'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'
import SaveIcon from '@material-ui/icons/Save'
import { navigate } from 'gatsby'
import Firebase from 'firebase'

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
  Firebase.analytics()
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

const IndexPage = () => {
  const classes = useStyles()
  const [words, setWords] = React.useState('')
  const [error, setError] = React.useState(false)

  function handleWords(e) {
    setWords(e.target.value)
  }

  function saveWords() {
    const id = Firebase.database()
      .ref('games')
      .push({
        words,
        play: false,
        vocabulary: '',
      }).key
    navigate('/game/' + id)
  }

  return (
    <Layout>
      <SEO title="Home" />
      <Grid container spacing={3} justify="center">
        <Grid item xs={2}>
          <div style={{ maxWidth: `100px`, marginBottom: `1.45rem` }}>
            <Image />
          </div>
        </Grid>
        <Grid item xs={8}>
          <h1>How to play this game!</h1>
          <h5>Enter vocabulary in a fom and click next to play this game.</h5>
        </Grid>
      </Grid>
      <Divider />
      <TextField
        id="outlined-multiline-static"
        label="Vocabulary"
        multiline
        rows="4"
        placeholder="Learn/Vocabulary/Very/Fun/..."
        margin="normal"
        variant="outlined"
        fullWidth
        value={words}
        onChange={handleWords}
      />
      <Fab
        color="primary"
        onClick={saveWords}
        aria-label="add"
        className={classes.fab}
      >
        <SaveIcon />
      </Fab>
    </Layout>
  )
}

export default IndexPage
