import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Bookstore.module.css';
import AddBook from './AddBook';
import { useAuth } from '../Contexts/AuthContext';
import { getDatabase, ref, set, onValue, off, push } from "firebase/database";

import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, DialogTitle, FormControlLabel, FormGroup, Switch, Dialog, DialogActions, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';


function Bookstore() {
  const [books, setBooks] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, signout, deleteCurrentUser } = useAuth();
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  

  const columnDefs = [
    { field: 'author', sortable: true, filter: true },
    { field: 'isbn', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    { field: 'title', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton>
    }
  ]

  // Get all books from the database
  useEffect(() => {
    fetchBooks();
  }, []);

  // Get-method
  const fetchBooks = () => {
    if (!currentUser) {
        console.error('Unauthorized user');
        return;
    }
    const db = getDatabase();
    const booksRef = ref(db, 'books');
    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      const booksArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      setBooks(booksArray);
    })

    return () => {
      const db = getDatabase();
      const booksRef = ref(db, 'books');
      off(booksRef);
    }
  }


  // Post-method
  const addBook = (newBook) => {
    if (!currentUser) {
      alert('Please log in to add books!')
      return;
    }
    setLoading(true);
    const db = getDatabase();
    const booksRef = ref(db, 'books');
    const newBookRef = push(booksRef);
    set(newBookRef, newBook)
      .then(() => {
        setLoading(false)
        fetchBooks();
      })
      .catch(err => {
        console.error('Error adding book:', err);
        setLoading(false);
      });
  };

  // Delete-method
  const deleteBook = (id) => {
    if (!currentUser) {
      alert('Please log in to delete books!')
      return;
    }
    setLoading(true);
    const db = getDatabase();
    const bookRef = ref(db, `books/${id}`);
    set(bookRef, null)
      .then(() => setLoading(false))
      .catch(err => {
        console.error('Error deleting book:', err);
        setLoading(false);
      });
  };




  // Add keys to the book objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => {
        if (typeof item === 'object') {
            Object.defineProperty(item, 'id', { value: keys[index] });
        }
        return item;
    });
    setBooks(valueKeys);
  }


  const handleChange = async () => {
    setIsChecked(false);
      try {
        setError('');
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        await signout();
        navigate('/');
      } catch (err){
        console.error(err);
        setError('Failed to log out');
      } finally {
        setLoading(false);
      }
  }

  const handleOpen = () => {
    setDeleteUserOpen(true);
  }
  const handleClose = () => {
    setDeleteUserOpen(false);
  }

  const handleDeleteUser = async () => {
    if (!currentUser) {
      return;
    }
    try {
      setError('');
      setLoading(true);
      await deleteCurrentUser();
      navigate('/signup');
    } catch (e){
      console.log(e.message);
      setError('Failed to delete an user');
    } finally {
      setLoading(false);
      setDeleteUserOpen(false);
    }
  }

  return (
    <div className={styles.bookstore}>
      <AppBar className={styles.header} position='absolute'>
        <Toolbar className={styles.headerContent}>
          <Typography variant="h5" className={styles.headerTitle}>
            Bookstore database
          </Typography>
          <FormGroup style={{backgroundColor: '#fff', padding: '.5rem 1rem'}}>
              <FormControlLabel style={{color: '#000'}}
              control={
                <Switch
                  aria-label="logout switch"
                  onChange={handleChange}
                  checked={isChecked}
                />
              }
              label={'Logout'}
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
      <div className={styles.main}>
        {loading &&
          <Box sx={{position: 'fixed', zIndex: 200, left: '50%', top: '40%'}}>
            <CircularProgress />
          </Box>}
        {deleteUserOpen && 
          <Dialog open={deleteUserOpen}>
            <DialogTitle style={{marginBottom: '50px'}}>Delete user account?</DialogTitle>
            <DialogActions>
              <Button color="primary" onClick={handleClose}>Cancel</Button>
              <Button color="error" onClick={handleDeleteUser}>Delete</Button>
            </DialogActions>
          </Dialog>}
          <div className={styles.addBookContainer}>
            <AddBook addBook={addBook} />
          </div>
          <div className='ag-theme-material' style={{width: '80%', height: '800px'}}>
            <AgGridReact
              rowData={books}
              columnDefs={columnDefs}
            />
          </div>
      </div>
      <div className={styles.footer}>
          <p>Logged in: <span id={styles.userHighlight}>{currentUser.email}</span></p>
          <p><a onClick={handleOpen}>Delete user?</a></p>
      </div>
    </div>
  );
}

export default Bookstore;