'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, IconButton } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const isMobile = useMediaQuery('(max-width:600px)');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const increaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const { quantity } = (await getDoc(docRef)).data();
    await setDoc(docRef, { quantity: quantity + 1 });
    await updateInventory();
  };

  const decreaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const { quantity } = (await getDoc(docRef)).data();
    if (quantity > 1) {
      await setDoc(docRef, { quantity: quantity - 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    setFilteredInventory(
      inventory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      p={3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f7f7f7"
      sx={{ padding: isMobile ? '10px' : '30px' }}
    >
      {/* Main Heading */}
      <Typography variant="h3" color="#8bc34a" textAlign="center" mb={4} fontSize={isMobile ? '2rem' : '3rem'}>
      Welcome to your Pantry Tracker App
      </Typography>

      {/* Subheading */}
      <Typography variant="h5" color="#8bc34a" textAlign="center" mb={4} fontSize={isMobile ? '1.2rem' : '1.5rem'}>
        Simplifying your inventory, one item at a time!
      </Typography>

      {/* Search Bar and Add Button */}
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="center"
        alignItems="center"
        width="100%"
        maxWidth="800px"
        mb={3}
      >
        <TextField
          label="Search Item"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: isMobile ? 2 : 0, marginRight: isMobile ? 0 : 2, flexGrow: 1, maxWidth: '300px', }}
        />
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: '#8bc34a',
            '&:hover': {
              backgroundColor: '#7cb342',
            },
          }}
        >
          Add New Item
        </Button>
      </Box>

      {/* Conditionally Render Headings Row */}
      {filteredInventory.length > 0 && (
        <Box
          width="100%"
          maxWidth="800px"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          paddingX={2}
          bgcolor="#8bc34a"
          borderRadius="5px"
          mb={2}
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingX={2}
            bgcolor="#8bc34a"
            borderRadius="5px"
            margin={2}
          >
            <Typography variant="h5" color="#555" sx={{ width: '40%' }}>
              Item
            </Typography>
            <Typography variant="h5" color="#555" textAlign="center" sx={{ width: '20%' }}>
              Quantity
            </Typography>
            <Typography variant="h5" color="#555" textAlign="center" sx={{ width: '40%' }}>
              Actions
            </Typography>
          </Box>
        </Box>
      )}

      {/* Inventory Items */}
      <Stack
        width="100%"
        maxWidth="800px"
        spacing={2}
        overflow="auto"
        alignItems="center"
        justifyContent="center"
        bgcolor="#ffffff"
        borderRadius="10px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        padding="20px"
      >
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="80px"
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f0f0f0"
            paddingX={5}
            borderRadius="5px"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
            sx={{
              backgroundColor: quantity > 3 ? '#d4edda' : '#f8d7da',
            }}
          >
            <Typography variant="h5" color="#333" sx={{ width: isMobile ? '100%' : '40%' }}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography
              variant="h5"
              color="#333"
              textAlign="center"
              sx={{ width: isMobile ? '100%' : '20%' }}
            >
              {quantity}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: isMobile ? '100%' : '40%',
                gap: 1,
                mt: isMobile ? 1 : 0,
              }}
            >
              <IconButton
                onClick={() => increaseQuantity(name)}
              >
                <Add />
              </IconButton>
              <IconButton
                onClick={() => decreaseQuantity(name)}
                disabled={quantity <= 1}
              >
                <Remove />
              </IconButton>
              <IconButton
                onClick={() => removeItem(name)}
                sx={{ color: '#dc3545' }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Modal for Adding New Item */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TextField
            label="Item Name"
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}
            sx={{
              backgroundColor: '#8bc34a',
              '&:hover': {
                backgroundColor: '#7cb342',
              },
            }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

