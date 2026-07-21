import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';

const DB_URL = 'https://bookstore-d7def-default-rtdb.firebaseio.com/books';

export default function App() {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState({
    title: '',
    author: '',
    year: '',
    isbn: '',
    price: '',
  });

  const fetchBooks = () => {
    fetch(`${DB_URL}.json`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const keys = Object.keys(data);
          const bookList = keys.map((key) => ({ id: key, ...data[key] }));
          setBooks(bookList);
        } else {
          setBooks([]);
        }
      })
      .catch((error) => console.error('Error fetching books:', error));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setBook({ title: '', author: '', year: '', isbn: '', price: '' });
  };

  const inputChanged = (event) => {
    setBook({ ...book, [event.target.name]: event.target.value });
  };

  const addBook = () => {
    fetch(`${DB_URL}.json`, {
      method: 'POST',
      body: JSON.stringify(book),
    })
      .then(() => {
        fetchBooks();
        handleClose();
      })
      .catch((error) => console.error('Error adding book:', error));
  };

  const deleteBook = (id) => {
    fetch(`${DB_URL}/${id}.json`, {
      method: 'DELETE',
    })
      .then(() => fetchBooks())
      .catch((error) => console.error('Error deleting book:', error));
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'author', headerName: 'Author', flex: 1 },
    { field: 'year', headerName: 'Year', width: 100 },
    { field: 'isbn', headerName: 'Isbn', flex: 1 },
    { field: 'price', headerName: 'Price', width: 100 },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      filterable: false,
      width: 80,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => deleteBook(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Bookstore</Typography>
        </Toolbar>
      </AppBar>

      <div style={{ padding: 20, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleOpen}
          style={{ marginBottom: 20 }}
        >
          ADD BOOK
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>New book</DialogTitle>
          <DialogContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingTop: '10px',
            }}
          >
            <TextField
              label="Title"
              name="title"
              value={book.title}
              onChange={inputChanged}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Author"
              name="author"
              value={book.author}
              onChange={inputChanged}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Year"
              name="year"
              value={book.year}
              onChange={inputChanged}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Isbn"
              name="isbn"
              value={book.isbn}
              onChange={inputChanged}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Price"
              name="price"
              value={book.price}
              onChange={inputChanged}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addBook}>Save</Button>
          </DialogActions>
        </Dialog>

        <div
          style={{
            height: 400,
            width: '100%',
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          <DataGrid rows={books} columns={columns} getRowId={(row) => row.id} />
        </div>
      </div>
    </div>
  );
}