import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bookstore.css';
import AddBook from './AddBook';
import { useAuth } from '../Contexts/AuthContext';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {Box, DialogTitle, FormControlLabel, FormGroup, Switch, Dialog, DialogActions, Button} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

const URL = 'https://bookstore-bd890-default-rtdb.europe-west1.firebasedatabase.app/books/.json';


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

  useEffect(() => {
    fetchBooks();
  }, [])

  const fetchBooks = () => {
      fetch(URL)
        .then(response => response.json())
        .then(data => addKeys(data))
        .catch(err => console.error(err));
  }

  // Add keys to the book objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }
   
  const addBook = (newBook) => {
    if (!currentUser) {
      alert('Please log in to delete books!')
      return;
    }
    setLoading(true);
    fetch(URL,
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(fetchBooks(books))
    .then(setLoading(false))
    .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    if (!currentUser) {
      alert('Please log in to delete books!')
      return;
    }
    setLoading(true);
    fetch(`https://bookstore-bd890-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE'
    })  
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to delete a book!')
      }
      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
      setLoading(false);
    })
    .catch(err => console.error(err))
  }

  const handleChange = async () => {
    setIsChecked(false);
      try {
        setError('');
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        await signout();
        setLoading(false);
        navigate('/login');
      } catch (e){
        console.log(e.message);
        setError('Failed to log out');
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
    <div className='bookstore'>
      <AppBar className='header' position='absolute'>
        <Toolbar className='header-content'>
          <Typography variant="h5" className='header-title'>
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
      <div className='main'>
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
        <div className="ag-theme-material">
          <AddBook addBook={addBook} />
          <AgGridReact style={{minWidth: '300px', width: '100%', height: '100%'}}
            rowData={books}
            columnDefs={columnDefs}
          />
        </div>
      </div>
      <div className='footer'>
          <p>Logged in: <span id="user-highlight">{currentUser.email}</span></p>
          <p><a onClick={handleOpen}>Delete user?</a></p>
      </div>
    </div>
  );
}

export default Bookstore;